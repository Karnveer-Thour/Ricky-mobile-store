import ExcelJS from "exceljs";
import { productService, categoryService } from "@/services";
import { aiProviderService } from "@/services/aiProvider.service";
import Papa from "papaparse";

export const parseAndImportExcelOrCsv = async (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}> => {
  const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

  let existingCategories: any[] = [];
  try {
    existingCategories = (await categoryService.fetchCategories(1, 100)) || [];
  } catch (e) {
    console.warn("Could not load categories for import resolution", e);
  }

  const rawRows: any[] = [];

  if (isExcel) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    let targetSheet = workbook.getWorksheet("Products Import");
    if (!targetSheet) {
      targetSheet =
        workbook.worksheets.find((ws) => ws.state !== "hidden") ||
        workbook.worksheets[0];
    }

    if (!targetSheet) {
      return {
        totalRows: 0,
        successCount: 0,
        errorCount: 1,
        errors: ["No valid worksheet found in the uploaded Excel workbook."],
      };
    }

    // 🔍 Dynamically scan for the Header Row (searching rows 1 through 10)
    let headerRowNumber = 1;
    const headerMap: Record<number, string> = {};

    for (let r = 1; r <= 10; r++) {
      const candidateRow = targetSheet.getRow(r);
      let foundHeader = false;
      candidateRow.eachCell((cell) => {
        const text = String(cell.value || "").toLowerCase();
        if (
          text.includes("product name") ||
          text.includes("name *") ||
          text.includes("price")
        ) {
          foundHeader = true;
        }
      });

      if (foundHeader) {
        headerRowNumber = r;
        candidateRow.eachCell((cell, colNumber) => {
          headerMap[colNumber] = String(cell.value || "").trim();
        });
        break;
      }
    }

    // Iterate data rows after header
    targetSheet.eachRow((row, rowNumber) => {
      if (rowNumber <= headerRowNumber) return;

      const rowObj: Record<string, any> = {};
      let hasData = false;

      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const headerName = headerMap[colNumber] || `Col_${colNumber}`;
        let val = cell.value;
        if (typeof val === "object" && val !== null && "result" in val) {
          val = (val as any).result;
        }
        if (typeof val === "object" && val !== null && "text" in val) {
          val = (val as any).text;
        }
        rowObj[headerName] = val;
        if (
          val !== undefined &&
          val !== null &&
          String(val).trim().length > 0
        ) {
          hasData = true;
        }
      });

      const firstColVal = String(rowObj[headerMap[1]] || "").toLowerCase();
      if (firstColVal.includes("total") || firstColVal.includes("summary")) {
        return;
      }

      if (hasData) {
        rawRows.push({ data: rowObj, rowNum: rowNumber });
      }
    });
  } else {
    // Parse CSV
    const csvResult: any = await new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => resolve(res.data),
        error: () => resolve([]),
      });
    });

    (csvResult || []).forEach((row: any, idx: number) => {
      rawRows.push({ data: row, rowNum: idx + 2 });
    });
  }

  if (rawRows.length === 0) {
    return {
      totalRows: 0,
      successCount: 0,
      errorCount: 0,
      errors: ["The uploaded spreadsheet contains no valid product records."],
    };
  }

  const getRowValue = (rowObj: Record<string, any>, ...keys: string[]) => {
    const rowEntries = Object.entries(rowObj);
    for (const key of keys) {
      const target = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      for (const [k, v] of rowEntries) {
        const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanK === target || cleanK.includes(target)) {
          if (v !== undefined && v !== null && String(v).trim() !== "") {
            return v;
          }
        }
      }
    }
    return "";
  };

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const { data: row, rowNum } = rawRows[i];

    const name = String(
      getRowValue(row, "Product Name", "ProductName", "Name", "Product") || "",
    ).trim();

    const rawPrice = getRowValue(
      row,
      "Price (INR)",
      "MRP Price",
      "Price",
      "MRP",
      "Unit Price",
    );

    const rawCategory = String(
      getRowValue(
        row,
        "Category (Select Dropdown)",
        "Category Name",
        "Category",
      ) || "",
    ).trim();

    const rawDiscount =
      getRowValue(row, "Discount (INR)", "Discount (₹)", "Discount") || "0";

    const rawTotalQty =
      getRowValue(
        row,
        "Total Stock",
        "Stock Count",
        "Stock Level",
        "Quantity",
        "Total Quantity",
      ) || "10";

    const rawColors = String(
      getRowValue(
        row,
        "Color Variants & Stock",
        "Color Variants Breakdown",
        "Color Variants",
        "Variants Breakdown",
        "Colors",
      ) || "",
    ).trim();

    const imageUrl = String(
      getRowValue(
        row,
        "Image URL",
        "Product Photo",
        "Image Link",
        "ImageUrl",
        "Image",
      ) || "",
    ).trim();

    const warranty = String(
      getRowValue(row, "Warranty", "Warranty Period") ||
        "1 Year Official Warranty",
    ).trim();
    const description = String(
      getRowValue(row, "Description", "Product Description") ||
        `${name} details`,
    ).trim();

    if (!name) {
      errorCount++;
      errors.push(`Row ${rowNum}: Product Name is missing.`);
      continue;
    }

    const price =
      typeof rawPrice === "number"
        ? rawPrice
        : parseFloat(String(rawPrice).replace(/[^0-9.]/g, ""));
    if (isNaN(price) || price <= 0) {
      errorCount++;
      errors.push(`Row ${rowNum} (${name}): Invalid Price "${rawPrice}".`);
      continue;
    }

    // Match or Auto-Create Category
    let categoryId = "";
    if (rawCategory) {
      let matched = existingCategories.find(
        (c) =>
          c.name?.toLowerCase().trim() === rawCategory.toLowerCase().trim() ||
          c.id === rawCategory ||
          c._id === rawCategory,
      );
      if (!matched) {
        try {
          const createCatRes = await categoryService.createCategory({
            name: rawCategory,
            description: `${rawCategory} category for store products`,
            hasColors: true,
            hasVariants: false,
          });
          if (createCatRes.ok) {
            const reloaded = await categoryService.fetchCategories(1, 100);
            if (reloaded && reloaded.length > 0) {
              existingCategories = reloaded;
              matched = existingCategories.find(
                (c) =>
                  c.name?.toLowerCase().trim() ===
                  rawCategory.toLowerCase().trim(),
              );
            }
          }
        } catch (catErr) {
          console.warn("Could not auto-create category", rawCategory, catErr);
        }
      }
      if (matched) {
        categoryId = matched.id || matched._id;
      }
    }

    if (!categoryId && existingCategories.length > 0) {
      categoryId = existingCategories[0].id || existingCategories[0]._id;
    }

    // Parse Color & Specification Variants (RAM + Storage + Color + Quantity)
    const parsedColors: Array<{ name: string; quantity: number }> = [];
    const parsedVariants: Array<{
      ram: string | null;
      storage: string | null;
      color: string | null;
      quantity: number;
    }> = [];

    if (rawColors) {
      const tokens = rawColors
        .split(/[;,|\n]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      for (const token of tokens) {
        const parenMatch = token.match(/^(.+?)\s*\(\s*(\d+)\s*\)$/);
        const colonMatch = token.match(/^(.+?)\s*[:=]\s*(\d+)$/);
        let rawDescriptor = token;
        let qty = 10;

        if (parenMatch) {
          rawDescriptor = parenMatch[1].trim();
          qty = parseInt(parenMatch[2], 10) || 0;
        } else if (colonMatch) {
          rawDescriptor = colonMatch[1].trim();
          qty = parseInt(colonMatch[2], 10) || 0;
        }

        const memoryMatches =
          rawDescriptor.match(/\b\d+\s*(?:GB|TB)\b/gi) || [];
        let ram: string | null = null;
        let storage: string | null = null;
        let colorName = rawDescriptor;

        if (memoryMatches.length >= 2 && memoryMatches[0] && memoryMatches[1]) {
          ram = memoryMatches[0].trim();
          storage = memoryMatches[1].trim();
          colorName =
            rawDescriptor
              .replace(memoryMatches[0], "")
              .replace(memoryMatches[1], "")
              .replace(/[\/+,]/g, " ")
              .trim() || "Standard";
        } else if (memoryMatches.length === 1 && memoryMatches[0]) {
          storage = memoryMatches[0].trim();
          colorName =
            rawDescriptor
              .replace(memoryMatches[0], "")
              .replace(/[\/+,]/g, " ")
              .trim() || "Standard";
        }

        if (ram || storage) {
          parsedVariants.push({
            ram,
            storage,
            color: colorName,
            quantity: qty,
          });
        }

        parsedColors.push({
          name: colorName,
          quantity: qty,
        });
      }
    }

    let finalImageUrl =
      imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")
        ? imageUrl.trim()
        : undefined;
    let finalDescription = description;
    let finalWarranty = warranty;
    let finalColors = parsedColors;

    const isDescriptionMissing =
      !finalDescription ||
      finalDescription.trim() === "" ||
      finalDescription.trim().toLowerCase() ===
        `${name.toLowerCase()} details` ||
      finalDescription.trim().toLowerCase() === "details";

    // ✨ AI Auto-Enrichment if fields are missing or default
    if (
      !finalImageUrl ||
      isDescriptionMissing ||
      !finalWarranty ||
      finalWarranty === "1 Year Official Warranty"
    ) {
      try {
        const aiDetails = await aiProviderService.generateProductDetails(
          name,
          rawCategory,
          price,
        );
        if (!finalImageUrl && aiDetails.imageUrl) {
          finalImageUrl = aiDetails.imageUrl;
        }
        if (isDescriptionMissing && aiDetails.description) {
          finalDescription = aiDetails.description;
        }
        if (
          (!finalWarranty || finalWarranty === "1 Year Official Warranty") &&
          aiDetails.warranty
        ) {
          finalWarranty = aiDetails.warranty;
        }
        if (
          finalColors.length <= 1 &&
          aiDetails.colors &&
          aiDetails.colors.length > 0
        ) {
          finalColors = aiDetails.colors;
        }
      } catch (e) {
        console.warn("AI enrichment during import error", e);
        if (isDescriptionMissing) {
          finalDescription = `Experience high-performance technology with the ${name}. Features a sleek, modern finish, immersive display, and reliable all-day battery life.`;
        }
      }
    }

    const totalQuantity =
      finalColors.length > 0
        ? finalColors.reduce((acc, curr) => acc + curr.quantity, 0)
        : parseInt(String(rawTotalQty).replace(/[^0-9]/g, "")) || 10;

    if (finalColors.length === 0) {
      finalColors = [{ name: "Standard", quantity: totalQuantity }];
    }

    const payload = {
      name,
      price: String(price),
      categoryId: categoryId || undefined,
      discount: String(
        parseFloat(String(rawDiscount).replace(/[^0-9.]/g, "")) || 0,
      ),
      quantity: totalQuantity,
      quantiy: totalQuantity,
      description: finalDescription,
      warranty: finalWarranty,
      imageUrl: finalImageUrl,
      productColors: finalColors,
      variants: parsedVariants.length > 0 ? parsedVariants : undefined,
    };

    try {
      const res = await productService.createProduct(payload);
      if (res.ok) {
        successCount++;
      } else {
        errorCount++;
        errors.push(
          `Row ${rowNum} (${name}): ${res.message || "Failed to create product."}`,
        );
      }
    } catch (err: any) {
      errorCount++;
      errors.push(
        `Row ${rowNum} (${name}): ${err?.message || "Server error."}`,
      );
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / rawRows.length) * 100));
    }
  }

  return {
    totalRows: rawRows.length,
    successCount,
    errorCount,
    errors,
  };
};
