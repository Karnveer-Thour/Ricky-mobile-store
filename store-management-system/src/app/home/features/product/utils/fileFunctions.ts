import Papa from "papaparse";
import { productService, categoryService } from "@/services";

/**
 * Triggers browser download of a CSV file given data rows and a desired filename.
 */
export const downloadCsvFile = (rows: any[], filename: string) => {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports the live products list to a well-formatted CSV.
 */
export const exportProductsToCsv = (products: any[]) => {
  const formattedRows = products.map((p) => {
    const categoryName =
      p.category?.name ||
      (typeof p.category === "string" ? p.category : "") ||
      "Uncategorized";

    const colors = p.colors || p.productColors || [];
    const colorsString =
      colors.length > 0
        ? colors
            .map((c: any) => `${c.name || c.colorName}:${c.quantity}`)
            .join("; ")
        : `Default:${p.quantity || p.stockCount || 0}`;

    return {
      "Product ID": p.id || p._id || "",
      "Product Name": p.name || p.productName || "",
      Category: categoryName,
      "Price (INR)": p.price || 0,
      "Discount (INR)": p.discount || 0,
      "Total Stock": p.quantity ?? p.stockCount ?? 0,
      "Color Variants & Stock": colorsString,
      "Image URL": p.imageUrl || p.image || "",
      Warranty: p.warranty || "1 Year Official Warranty",
      Description: p.description || "",
    };
  });

  const timestamp = new Date().toISOString().split("T")[0];
  downloadCsvFile(
    formattedRows,
    `Ricky_Mobile_Store_Products_${timestamp}.csv`,
  );
};

/**
 * Exports the live inventory audit report to a well-formatted CSV.
 */
export const exportInventoryToCsv = (products: any[]) => {
  const formattedRows = products.map((p, index) => {
    const categoryName =
      p.category?.name ||
      (typeof p.category === "string" ? p.category : "") ||
      "Uncategorized";

    const stock = Number(p.quantity ?? p.stockCount ?? 0);
    const status =
      stock === 0 ? "Out of Stock" : stock <= 3 ? "Low Stock" : "In Stock";
    const sku = `RMS-${(p.name || "PROD").slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`;

    const colors = p.colors || p.productColors || [];
    const colorsString =
      colors.length > 0
        ? colors
            .map((c: any) => `${c.name || c.colorName}: ${c.quantity}`)
            .join("; ")
        : `Standard: ${stock}`;

    return {
      SKU: sku,
      "Product Name": p.name || p.productName || "",
      Category: categoryName,
      "Unit Price (INR)": p.price || 0,
      "Stock Count": stock,
      "Stock Status": status,
      "Variants Breakdown": colorsString,
      "Last Synced": new Date().toLocaleDateString("en-IN"),
    };
  });

  const timestamp = new Date().toISOString().split("T")[0];
  downloadCsvFile(
    formattedRows,
    `Ricky_Mobile_Store_Inventory_${timestamp}.csv`,
  );
};

/**
 * Generates and downloads a sample product import CSV template.
 */
export const downloadSampleProductCsv = () => {
  const sampleRows = [
    {
      "Product Name": "iPhone 15 Pro Max 256GB",
      Category: "Smartphones",
      Price: 134900,
      Discount: 5000,
      "Total Quantity": 40,
      "Color Variants": "Natural Titanium:20; Titanium Black:20",
      "Image URL":
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      Warranty: "1 Year Apple Warranty",
      Description:
        "Forged in titanium with A17 Pro chip and 48MP camera system",
    },
    {
      "Product Name": "Samsung Galaxy S24 Ultra",
      Category: "Smartphones",
      Price: 129999,
      Discount: 4000,
      "Total Quantity": 30,
      "Color Variants": "Titanium Gray:15; Titanium Violet:15",
      "Image URL":
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      Warranty: "1 Year Samsung Warranty",
      Description: "Galaxy AI is here with titanium exterior and 200MP camera",
    },
    {
      "Product Name": "Sony WH-1000XM5 Wireless Headphones",
      Category: "Accessories",
      Price: 29990,
      Discount: 2000,
      "Total Quantity": 25,
      "Color Variants": "Silver:10; Black:15",
      "Image URL":
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      Warranty: "1 Year Sony Warranty",
      Description: "Industry-leading noise canceling with Auto NC Optimizer",
    },
  ];

  downloadCsvFile(sampleRows, "sample_products_import_template.csv");
};

/**
 * Parses and imports products from a CSV file into the database.
 */
export const parseAndImportProductCsv = async (
  file: File,
  onProgress?: (progressPercent: number) => void,
): Promise<{
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        if (!rows || rows.length === 0) {
          resolve({
            totalRows: 0,
            successCount: 0,
            errorCount: 0,
            errors: ["The uploaded CSV file is empty or could not be parsed."],
          });
          return;
        }

        // Fetch categories to resolve category names to IDs
        let existingCategories: any[] = [];
        try {
          existingCategories =
            (await categoryService.fetchCategories(1, 100)) || [];
        } catch (e) {
          console.warn("Could not fetch categories during CSV import", e);
        }

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowNum = i + 2; // +2 for 1-based index and header row

          const name = (
            row["Product Name"] ||
            row["name"] ||
            row["Name"] ||
            ""
          ).trim();
          const rawPrice =
            row["Price (INR)"] || row["Price"] || row["price"] || "";
          const rawCategory = (
            row["Category"] ||
            row["category"] ||
            row["Category Name"] ||
            ""
          ).trim();
          const rawDiscount =
            row["Discount (INR)"] || row["Discount"] || row["discount"] || "0";
          const rawTotalQty =
            row["Total Stock"] ||
            row["Total Quantity"] ||
            row["quantity"] ||
            "10";
          const rawColors =
            row["Color Variants & Stock"] ||
            row["Color Variants"] ||
            row["colors"] ||
            "";
          const imageUrl =
            row["Image URL"] || row["imageUrl"] || row["image"] || undefined;
          const warranty =
            row["Warranty"] || row["warranty"] || "1 Year Official Warranty";
          const description =
            row["Description"] || row["description"] || `${name} details`;

          if (!name) {
            errorCount++;
            errors.push(`Row ${rowNum}: Product Name is missing.`);
            continue;
          }

          const price = parseFloat(rawPrice);
          if (isNaN(price) || price <= 0) {
            errorCount++;
            errors.push(
              `Row ${rowNum} (${name}): Invalid Price value "${rawPrice}".`,
            );
            continue;
          }

          // Match category or use first available
          let categoryId = "";
          if (rawCategory) {
            const matched = existingCategories.find(
              (c) =>
                c.name?.toLowerCase() === rawCategory.toLowerCase() ||
                c.id === rawCategory ||
                c._id === rawCategory,
            );
            if (matched) {
              categoryId = matched.id || matched._id;
            }
          }

          if (!categoryId && existingCategories.length > 0) {
            categoryId = existingCategories[0].id || existingCategories[0]._id;
          }

          // Parse color variants e.g. "Natural Titanium:20; Titanium Black:20" or "Black:15, Silver:25"
          let parsedColors: Array<{ name: string; quantity: number }> = [];
          if (rawColors) {
            const colorTokens = rawColors.split(/[;,|]/);
            for (const token of colorTokens) {
              const parts = token.split(":");
              if (parts.length >= 2) {
                const cName = parts[0].trim();
                const cQty = parseInt(parts[1].trim()) || 0;
                if (cName) {
                  parsedColors.push({ name: cName, quantity: cQty });
                }
              } else if (parts[0]?.trim()) {
                parsedColors.push({ name: parts[0].trim(), quantity: 10 });
              }
            }
          }

          const totalQuantity =
            parsedColors.length > 0
              ? parsedColors.reduce((acc, curr) => acc + curr.quantity, 0)
              : parseInt(rawTotalQty) || 10;

          if (parsedColors.length === 0) {
            parsedColors = [{ name: "Standard", quantity: totalQuantity }];
          }

          const payload = {
            name,
            price: String(price),
            categoryId: categoryId || undefined,
            discount: String(rawDiscount || "0"),
            quantity: totalQuantity,
            quantiy: totalQuantity,
            description,
            warranty,
            imageUrl,
            productColors: parsedColors,
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
              `Row ${rowNum} (${name}): ${err?.message || "Server communication error."}`,
            );
          }

          if (onProgress) {
            onProgress(Math.round(((i + 1) / rows.length) * 100));
          }
        }

        resolve({
          totalRows: rows.length,
          successCount,
          errorCount,
          errors,
        });
      },
      error: (error) => {
        resolve({
          totalRows: 0,
          successCount: 0,
          errorCount: 1,
          errors: [`Failed to parse CSV file: ${error.message}`],
        });
      },
    });
  });
};
