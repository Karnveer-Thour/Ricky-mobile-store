import ExcelJS from "exceljs";
import { productService, categoryService } from "@/services";
import { aiProviderService } from "@/services/aiProvider.service";
import Papa from "papaparse";

/**
 * Triggers browser download of an ArrayBuffer as an .xlsx file
 */
const triggerExcelDownload = (buffer: ExcelJS.Buffer, filename: string) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const BORDER_THIN: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFE2E8F0" } },
  bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
  left: { style: "thin", color: { argb: "FFE2E8F0" } },
  right: { style: "thin", color: { argb: "FFE2E8F0" } },
};

/**
 * Generates and downloads a custom executive-styled Excel template (.xlsx)
 * with in-cell native dropdown data validations for Category and Warranty.
 */
export const downloadStyledExcelTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ricky Mobile Store";
  workbook.lastModifiedBy = "Store Management System";
  workbook.created = new Date();

  // 1. Fetch live categories from database
  let categoryNames: string[] = [
    "Flagship Smartphones",
    "Mid-Range Smartphones",
    "Budget Smartphones",
    "Tablets & iPads",
    "Audio & Headphones",
    "Smartwatches & Wearables",
    "Cases & Screen Protectors",
    "Chargers & Power Banks",
  ];

  try {
    const liveCats = await categoryService.fetchCategories(1, 100);
    if (liveCats && liveCats.length > 0) {
      categoryNames = liveCats.map((c: any) => c.name).filter(Boolean);
    }
  } catch (e) {
    console.warn(
      "Could not fetch categories for Excel template dropdown, using defaults",
      e,
    );
  }

  const warrantyOptions = [
    "1 Year Official Warranty",
    "2 Years Extended Brand Warranty",
    "6 Months Brand Warranty",
    "1 Year AppleCare+ Protection",
    "No Warranty",
  ];

  // 2. Create "Lookups" Reference Sheet for Dropdowns
  const lookupSheet = workbook.addWorksheet("Lookups", {
    state: "hidden", // hidden sheet for dropdown lookups
  });

  lookupSheet.getCell("A1").value = "Categories";
  categoryNames.forEach((cat, idx) => {
    lookupSheet.getCell(`A${idx + 2}`).value = cat;
  });

  lookupSheet.getCell("B1").value = "Warranties";
  warrantyOptions.forEach((w, idx) => {
    lookupSheet.getCell(`B${idx + 2}`).value = w;
  });

  // 3. Create Main "Products Import" Worksheet
  const sheet = workbook.addWorksheet("Products Import", {
    views: [{ showGridLines: true }],
  });

  // Top Brand Header Banner (Row 1 & Row 2)
  sheet.mergeCells("A1:I1");
  const titleCell = sheet.getCell("A1");
  titleCell.value =
    "📱  RICKY MOBILE STORE  —  OFFICIAL PRODUCT IMPORT TEMPLATE";
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0B132B" },
  };
  titleCell.font = {
    name: "Segoe UI",
    size: 13,
    bold: true,
    color: { argb: "FF00CFFF" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 36;

  sheet.mergeCells("A2:I2");
  const subCell = sheet.getCell("A2");
  subCell.value =
    "💡 Instructions: Fill product rows below. Pick Category & Warranty from in-cell dropdown arrows. Save and upload directly.";
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };
  subCell.font = { name: "Segoe UI", size: 9.5, color: { argb: "FF94A3B8" } };
  subCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(2).height = 22;

  sheet.getRow(3).height = 10; // Spacing row

  // Table Headers (Row 4)
  const headerRow = sheet.getRow(4);
  headerRow.height = 30;

  const columns = [
    { header: "Product Name *", key: "name", width: 34 },
    { header: "Category (Select Dropdown) *", key: "category", width: 30 },
    { header: "Price (INR) *", key: "price", width: 16 },
    { header: "Discount (INR)", key: "discount", width: 16 },
    { header: "Total Stock", key: "quantity", width: 14 },
    { header: "Color Variants & Stock", key: "colors", width: 38 },
    { header: "Image URL", key: "imageUrl", width: 44 },
    { header: "Warranty", key: "warranty", width: 28 },
    { header: "Description", key: "description", width: 42 },
  ];

  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" },
    };
    cell.font = {
      name: "Segoe UI",
      size: 10.5,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: idx === 0 ? "left" : "center",
      indent: idx === 0 ? 1 : 0,
    };
    cell.border = { bottom: { style: "medium", color: { argb: "FF00CFFF" } } };
    sheet.getColumn(idx + 1).width = col.width;
  });

  // Sample Rows Data
  const sampleData = [
    {
      name: "iPhone 15 Pro Max 256GB",
      category: categoryNames[0] || "Flagship Smartphones",
      price: 134900,
      discount: 5000,
      quantity: 40,
      colors: "Natural Titanium: 20; Titanium Black: 20",
      imageUrl:
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      warranty: "1 Year Official Warranty",
      description:
        "A17 Pro chip, aerospace-grade titanium frame, 48MP main camera",
    },
    {
      name: "Samsung Galaxy S24 Ultra 512GB",
      category: categoryNames[0] || "Flagship Smartphones",
      price: 129999,
      discount: 4000,
      quantity: 30,
      colors: "Titanium Gray: 15; Titanium Violet: 15",
      imageUrl:
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      warranty: "1 Year Official Warranty",
      description: "Galaxy AI features, built-in S-Pen stylus, titanium finish",
    },
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      category: categoryNames[4] || "Audio & Headphones",
      price: 29990,
      discount: 2000,
      quantity: 25,
      colors: "Silver: 10; Black: 15",
      imageUrl:
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      warranty: "1 Year Official Warranty",
      description: "Industry-leading noise cancelation with Auto NC Optimizer",
    },
  ];

  sampleData.forEach((item, idx) => {
    const row = sheet.getRow(idx + 5);
    row.height = 26;
    row.getCell(1).value = item.name;
    row.getCell(2).value = item.category;
    row.getCell(3).value = item.price;
    row.getCell(4).value = item.discount;
    row.getCell(5).value = item.quantity;
    row.getCell(6).value = item.colors;
    row.getCell(7).value = item.imageUrl;
    row.getCell(8).value = item.warranty;
    row.getCell(9).value = item.description;

    row.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "left",
      indent: 1,
    };
    row.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
    row.getCell(3).numFmt = "₹ #,##0";
    row.getCell(3).alignment = { vertical: "middle", horizontal: "right" };
    row.getCell(4).numFmt = "₹ #,##0";
    row.getCell(4).alignment = { vertical: "middle", horizontal: "right" };
    row.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
    row.getCell(6).alignment = { vertical: "middle", horizontal: "left" };
    row.getCell(7).alignment = { vertical: "middle", horizontal: "left" };
    row.getCell(8).alignment = { vertical: "middle", horizontal: "left" };
    row.getCell(9).alignment = { vertical: "middle", horizontal: "left" };

    if (idx % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      });
    }

    row.eachCell((cell) => {
      cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF1E293B" } };
      cell.border = BORDER_THIN;
    });
  });

  // Apply Dropdown Data Validations (Rows 5 to 250)
  const lastLookupCategoryRow = categoryNames.length + 1;
  const lastLookupWarrantyRow = warrantyOptions.length + 1;

  for (let r = 5; r <= 250; r++) {
    const row = sheet.getRow(r);
    row.height = 26;

    // Currency Formats
    row.getCell(3).numFmt = "₹ #,##0";
    row.getCell(4).numFmt = "₹ #,##0";
    row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };

    // 🎯 IN-CELL DROPDOWN VALIDATION FOR CATEGORY (Column 2 / B)
    const categoryCell = row.getCell(2);
    categoryCell.dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`Lookups!$A$2:$A$${lastLookupCategoryRow}`],
      showErrorMessage: true,
      errorTitle: "Invalid Category Selected",
      error: "Please choose a valid category from the dropdown list.",
      promptTitle: "Select Category",
      prompt: "Click the dropdown arrow to pick a store category",
      showInputMessage: true,
    };

    // 🎯 IN-CELL DROPDOWN VALIDATION FOR WARRANTY (Column 8 / H)
    const warrantyCell = row.getCell(8);
    warrantyCell.dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`Lookups!$B$2:$B$${lastLookupWarrantyRow}`],
      showErrorMessage: true,
      errorTitle: "Invalid Warranty",
      error: "Please pick a valid warranty period from the dropdown list.",
    };

    if (r > sampleData.length + 4) {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF1E293B" } };
        cell.border = BORDER_THIN;
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  triggerExcelDownload(buffer, "ricky_store_product_import_template.xlsx");
};

/**
 * Exports active products to a luxury executive-styled Excel workbook (.xlsx).
 */
export const exportProductsToExcel = async (products: any[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ricky Mobile Store";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Products Catalog", {
    views: [{ showGridLines: true }],
  });

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // 1. Top Brand Banner (Row 1)
  sheet.mergeCells("A1:L1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "📱  RICKY MOBILE STORE  —  OFFICIAL PRODUCTS CATALOG";
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0B132B" },
  };
  titleCell.font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: "FF00CFFF" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 36;

  // 2. Metadata Bar (Row 2)
  sheet.mergeCells("A2:L2");
  const subCell = sheet.getCell("A2");
  subCell.value = `📅 Export Date: ${currentDate}   •   📦 Total Products: ${products.length} SKUs   •   💰 Currency: INR (₹)   •   🏢 Source: Live SQLite Database`;
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };
  subCell.font = { name: "Segoe UI", size: 9.5, color: { argb: "FF94A3B8" } };
  subCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(2).height = 22;

  sheet.getRow(3).height = 10; // Spacer row

  // 3. Table Column Headers (Row 4)
  const columns = [
    { header: "#", key: "no", width: 6 },
    { header: "SKU Code", key: "sku", width: 17 },
    { header: "Product Name", key: "name", width: 34 },
    { header: "Category", key: "category", width: 22 },
    { header: "MRP Price (₹)", key: "price", width: 16 },
    { header: "Discount (₹)", key: "discount", width: 15 },
    { header: "Selling Price (₹)", key: "sellingPrice", width: 17 },
    { header: "Total Stock", key: "quantity", width: 14 },
    { header: "Stock Status", key: "status", width: 16 },
    { header: "Color Variants Breakdown", key: "colors", width: 34 },
    { header: "Warranty", key: "warranty", width: 26 },
    { header: "Product Photo", key: "image", width: 18 },
  ];

  const headerRow = sheet.getRow(4);
  headerRow.height = 30;

  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" },
    };
    cell.font = {
      name: "Segoe UI",
      size: 10.5,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: idx === 2 ? "left" : "center",
      indent: idx === 2 ? 1 : 0,
    };
    cell.border = { bottom: { style: "medium", color: { argb: "FF00CFFF" } } };
    sheet.getColumn(idx + 1).width = col.width;
  });

  let totalValuation = 0;
  let totalStockUnits = 0;

  // 4. Data Rows (Row 5 to N)
  products.forEach((p, idx) => {
    const rowNum = idx + 5;
    const row = sheet.getRow(rowNum);
    row.height = 26;

    const categoryName =
      p.category?.name ||
      (typeof p.category === "string" ? p.category : "") ||
      "Uncategorized";

    const price = Number(p.price) || 0;
    const discount = Number(p.discount) || 0;
    const sellingPrice = Math.max(0, price - discount);
    const stock = Number(p.quantity ?? p.stockCount ?? 0);
    const sku = `RMS-${(p.name || "PROD").slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`;

    totalValuation += sellingPrice * stock;
    totalStockUnits += stock;

    const status =
      stock === 0 ? "Out of Stock" : stock <= 3 ? "Low Stock" : "In Stock";

    const colors = p.colors || p.productColors || [];
    const colorsString =
      colors.length > 0
        ? colors
            .map((c: any) => `${c.name || c.colorName}: ${c.quantity}`)
            .join("  |  ")
        : `Default: ${stock}`;

    // Col 1: #
    row.getCell(1).value = idx + 1;
    row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

    // Col 2: SKU
    row.getCell(2).value = sku;
    row.getCell(2).font = {
      name: "Consolas",
      size: 9.5,
      bold: true,
      color: { argb: "FF475569" },
    };
    row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

    // Col 3: Product Name
    row.getCell(3).value = p.name || p.productName || "";
    row.getCell(3).font = {
      name: "Segoe UI",
      size: 10,
      bold: true,
      color: { argb: "FF0F172A" },
    };
    row.getCell(3).alignment = {
      horizontal: "left",
      vertical: "middle",
      indent: 1,
    };

    // Col 4: Category
    row.getCell(4).value = categoryName;
    row.getCell(4).alignment = { horizontal: "center", vertical: "middle" };

    // Col 5: MRP
    row.getCell(5).value = price;
    row.getCell(5).numFmt = "₹ #,##0";
    row.getCell(5).alignment = { horizontal: "right", vertical: "middle" };

    // Col 6: Discount
    row.getCell(6).value = discount;
    row.getCell(6).numFmt = "₹ #,##0";
    row.getCell(6).font = { color: { argb: "FF16A34A" }, bold: true };
    row.getCell(6).alignment = { horizontal: "right", vertical: "middle" };

    // Col 7: Selling Price
    row.getCell(7).value = sellingPrice;
    row.getCell(7).numFmt = "₹ #,##0";
    row.getCell(7).font = { color: { argb: "FF0284C7" }, bold: true };
    row.getCell(7).alignment = { horizontal: "right", vertical: "middle" };

    // Col 8: Total Stock
    row.getCell(8).value = `${stock} units`;
    row.getCell(8).alignment = { horizontal: "center", vertical: "middle" };

    // Col 9: Stock Status Pill
    const statusCell = row.getCell(9);
    statusCell.value = status;
    statusCell.alignment = { horizontal: "center", vertical: "middle" };
    if (status === "In Stock") {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDCFCE7" },
      };
      statusCell.font = {
        name: "Segoe UI",
        bold: true,
        color: { argb: "FF15803D" },
        size: 9,
      };
    } else if (status === "Low Stock") {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEF3C7" },
      };
      statusCell.font = {
        name: "Segoe UI",
        bold: true,
        color: { argb: "FFB45309" },
        size: 9,
      };
    } else {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEE2E2" },
      };
      statusCell.font = {
        name: "Segoe UI",
        bold: true,
        color: { argb: "FFB91C1C" },
        size: 9,
      };
    }

    // Col 10: Colors
    row.getCell(10).value = colorsString;
    row.getCell(10).alignment = { horizontal: "left", vertical: "middle" };

    // Col 11: Warranty
    row.getCell(11).value = p.warranty || "1 Year Official Warranty";
    row.getCell(11).alignment = { horizontal: "left", vertical: "middle" };

    // Col 12: Product Photo (Formatted Clickable Hyperlink!)
    const imgUrl = p.imageUrl || p.image || "";
    const photoCell = row.getCell(12);
    photoCell.alignment = { horizontal: "center", vertical: "middle" };
    if (imgUrl) {
      photoCell.value = {
        text: "🔗 View Photo",
        hyperlink: imgUrl,
        tooltip: "Click to open full product photo",
      };
      photoCell.font = {
        name: "Segoe UI",
        size: 9.5,
        bold: true,
        color: { argb: "FF0284C7" },
        underline: true,
      };
    } else {
      photoCell.value = "—";
      photoCell.font = { color: { argb: "FF94A3B8" } };
    }

    // Zebra striping
    if (idx % 2 === 1) {
      row.eachCell((cell, colIndex) => {
        if (colIndex !== 9) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        }
      });
    }

    row.eachCell((cell) => {
      cell.border = BORDER_THIN;
    });
  });

  // 5. Summary / Totals Row
  const summaryRowNum = products.length + 5;
  const summaryRow = sheet.getRow(summaryRowNum);
  summaryRow.height = 28;

  sheet.mergeCells(`A${summaryRowNum}:D${summaryRowNum}`);
  const sumLabel = sheet.getCell(`A${summaryRowNum}`);
  sumLabel.value = `TOTAL PORTFOLIO SUMMARY (${products.length} SKUs)`;
  sumLabel.font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF0F172A" },
  };
  sumLabel.alignment = { horizontal: "right", vertical: "middle", indent: 1 };

  // Total Selling Price Valuation
  summaryRow.getCell(7).value = totalValuation;
  summaryRow.getCell(7).numFmt = "₹ #,##0";
  summaryRow.getCell(7).font = {
    name: "Segoe UI",
    size: 10.5,
    bold: true,
    color: { argb: "FF0284C7" },
  };
  summaryRow.getCell(7).alignment = { horizontal: "right", vertical: "middle" };

  // Total Stock Units
  summaryRow.getCell(8).value = `${totalStockUnits} units`;
  summaryRow.getCell(8).font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF0F172A" },
  };
  summaryRow.getCell(8).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  summaryRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    cell.border = {
      top: { style: "double", color: { argb: "FF475569" } },
      bottom: { style: "medium", color: { argb: "FF475569" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });

  const timestamp = new Date().toISOString().split("T")[0];
  const buffer = await workbook.xlsx.writeBuffer();
  triggerExcelDownload(buffer, `Ricky_Mobile_Store_Products_${timestamp}.xlsx`);
};

/**
 * Exports live store inventory to an executive-styled Excel audit report (.xlsx).
 */
export const exportInventoryToExcel = async (products: any[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ricky Mobile Store";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Inventory Stock Audit", {
    views: [{ showGridLines: true }],
  });

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Top Brand Header Banner (Row 1 & 2)
  sheet.mergeCells("A1:H1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "📦  RICKY MOBILE STORE  —  INVENTORY STOCK AUDIT REPORT";
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2E1065" },
  }; // Deep Purple
  titleCell.font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: "FFC084FC" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 36;

  sheet.mergeCells("A2:H2");
  const subCell = sheet.getCell("A2");
  subCell.value = `📅 Audit Date: ${currentDate}   •   Total Monitored SKUs: ${products.length}   •   Live Warehouse State`;
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3B0764" },
  };
  subCell.font = { name: "Segoe UI", size: 9.5, color: { argb: "FFE9D5FF" } };
  subCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(2).height = 22;

  sheet.getRow(3).height = 10; // Spacer row

  const columns = [
    { header: "#", key: "no", width: 6 },
    { header: "SKU Code", key: "sku", width: 18 },
    { header: "Product Name", key: "name", width: 34 },
    { header: "Category", key: "category", width: 22 },
    { header: "Unit Price (₹)", key: "price", width: 16 },
    { header: "Stock Level", key: "quantity", width: 15 },
    { header: "Stock Status", key: "status", width: 16 },
    { header: "Color Variants Breakdown", key: "colors", width: 38 },
  ];

  const headerRow = sheet.getRow(4);
  headerRow.height = 30;

  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" },
    };
    cell.font = {
      name: "Segoe UI",
      size: 10.5,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: idx === 2 ? "left" : "center",
      indent: idx === 2 ? 1 : 0,
    };
    cell.border = { bottom: { style: "medium", color: { argb: "FFA855F7" } } }; // Purple accent
    sheet.getColumn(idx + 1).width = col.width;
  });

  let totalStockCount = 0;
  let totalInventoryValuation = 0;

  products.forEach((p, idx) => {
    const rowNum = idx + 5;
    const row = sheet.getRow(rowNum);
    row.height = 26;

    const categoryName =
      p.category?.name ||
      (typeof p.category === "string" ? p.category : "") ||
      "Uncategorized";

    const price = Number(p.price) || 0;
    const stock = Number(p.quantity ?? p.stockCount ?? 0);
    const sku = `RMS-${(p.name || "PROD").slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`;

    totalStockCount += stock;
    totalInventoryValuation += price * stock;

    const status =
      stock === 0 ? "Out of Stock" : stock <= 3 ? "Low Stock" : "In Stock";

    const colors = p.colors || p.productColors || [];
    const colorsString =
      colors.length > 0
        ? colors
            .map((c: any) => `${c.name || c.colorName}: ${c.quantity}`)
            .join("  |  ")
        : `Standard: ${stock}`;

    row.getCell(1).value = idx + 1;
    row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

    row.getCell(2).value = sku;
    row.getCell(2).font = {
      name: "Consolas",
      size: 9.5,
      bold: true,
      color: { argb: "FF475569" },
    };
    row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

    row.getCell(3).value = p.name || p.productName || "";
    row.getCell(3).font = {
      name: "Segoe UI",
      size: 10,
      bold: true,
      color: { argb: "FF0F172A" },
    };
    row.getCell(3).alignment = {
      horizontal: "left",
      vertical: "middle",
      indent: 1,
    };

    row.getCell(4).value = categoryName;
    row.getCell(4).alignment = { horizontal: "center", vertical: "middle" };

    row.getCell(5).value = price;
    row.getCell(5).numFmt = "₹ #,##0";
    row.getCell(5).alignment = { horizontal: "right", vertical: "middle" };

    row.getCell(6).value = `${stock} units`;
    row.getCell(6).alignment = { horizontal: "center", vertical: "middle" };

    const statusCell = row.getCell(7);
    statusCell.value = status;
    statusCell.alignment = { horizontal: "center", vertical: "middle" };
    if (status === "In Stock") {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDCFCE7" },
      };
      statusCell.font = {
        name: "Segoe UI",
        bold: true,
        color: { argb: "FF15803D" },
        size: 9,
      };
    } else if (status === "Low Stock") {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEF3C7" },
      };
      statusCell.font = {
        name: "Segoe UI",
        bold: true,
        color: { argb: "FFB45309" },
        size: 9,
      };
    } else {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEE2E2" },
      };
      statusCell.font = {
        name: "Segoe UI",
        bold: true,
        color: { argb: "FFB91C1C" },
        size: 9,
      };
    }

    row.getCell(8).value = colorsString;
    row.getCell(8).alignment = { horizontal: "left", vertical: "middle" };

    if (idx % 2 === 1) {
      row.eachCell((cell, colIndex) => {
        if (colIndex !== 7) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        }
      });
    }

    row.eachCell((cell) => {
      cell.border = BORDER_THIN;
    });
  });

  // Summary Row
  const summaryRowNum = products.length + 5;
  const summaryRow = sheet.getRow(summaryRowNum);
  summaryRow.height = 28;

  sheet.mergeCells(`A${summaryRowNum}:D${summaryRowNum}`);
  const sumLabel = sheet.getCell(`A${summaryRowNum}`);
  sumLabel.value = `TOTAL INVENTORY AUDIT (${products.length} SKUs)`;
  sumLabel.font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF0F172A" },
  };
  sumLabel.alignment = { horizontal: "right", vertical: "middle", indent: 1 };

  summaryRow.getCell(5).value = totalInventoryValuation;
  summaryRow.getCell(5).numFmt = "₹ #,##0";
  summaryRow.getCell(5).font = {
    name: "Segoe UI",
    size: 10.5,
    bold: true,
    color: { argb: "FF7E22CE" },
  };
  summaryRow.getCell(5).alignment = { horizontal: "right", vertical: "middle" };

  summaryRow.getCell(6).value = `${totalStockCount} units`;
  summaryRow.getCell(6).font = {
    name: "Segoe UI",
    size: 10,
    bold: true,
    color: { argb: "FF0F172A" },
  };
  summaryRow.getCell(6).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  summaryRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    cell.border = {
      top: { style: "double", color: { argb: "FF475569" } },
      bottom: { style: "medium", color: { argb: "FF475569" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });

  const timestamp = new Date().toISOString().split("T")[0];
  const buffer = await workbook.xlsx.writeBuffer();
  triggerExcelDownload(
    buffer,
    `Ricky_Mobile_Store_Inventory_${timestamp}.xlsx`,
  );
};

/**
 * Universal Importer: Dynamically finds header row (whether Row 1 or Row 4),
 * parses Excel (.xlsx) or CSV (.csv) data, maps dropdown categories, and creates products.
 */
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
    let headerMap: Record<number, string> = {};

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
      if (rowNumber <= headerRowNumber) return; // skip headers & banners

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

      // Ignore summary/totals row
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

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const { data: row, rowNum } = rawRows[i];

    const name = String(
      row["Product Name *"] ||
        row["Product Name"] ||
        row["name"] ||
        row["Name"] ||
        row["Name *"] ||
        "",
    ).trim();

    const rawPrice =
      row["Price (INR) *"] ||
      row["Price (INR)"] ||
      row["Price *"] ||
      row["MRP Price (₹)"] ||
      row["Price"] ||
      row["price"] ||
      "";

    const rawCategory = String(
      row["Category (Select Dropdown) *"] ||
        row["Category *"] ||
        row["Category"] ||
        row["category"] ||
        "",
    ).trim();

    const rawDiscount =
      row["Discount (INR)"] ||
      row["Discount (₹)"] ||
      row["Discount"] ||
      row["discount"] ||
      "0";

    const rawTotalQty =
      row["Total Stock"] ||
      row["Stock Count"] ||
      row["quantity"] ||
      row["Quantity"] ||
      "10";

    const rawColors = String(
      row["Color Variants & Stock"] ||
        row["Color Variants Breakdown"] ||
        row["Color Variants"] ||
        row["colors"] ||
        "",
    ).trim();

    const imageUrl =
      row["Image URL"] ||
      row["Product Photo"] ||
      row["Image Link"] ||
      row["imageUrl"] ||
      row["image"] ||
      undefined;

    const warranty = String(
      row["Warranty"] || row["warranty"] || "1 Year Official Warranty",
    ).trim();
    const description = String(
      row["Description"] || row["description"] || `${name} details`,
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

    // Match Category
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

    // Parse Color Variants
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

    let finalImageUrl =
      imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")
        ? imageUrl.trim()
        : undefined;
    let finalDescription = description;
    let finalWarranty = warranty;
    let finalColors = parsedColors;

    // ✨ AI Auto-Enrichment if fields are missing or default
    if (
      !finalImageUrl ||
      !finalDescription ||
      finalDescription === `${name} details` ||
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
        if (
          (!finalDescription || finalDescription === `${name} details`) &&
          aiDetails.description
        ) {
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
