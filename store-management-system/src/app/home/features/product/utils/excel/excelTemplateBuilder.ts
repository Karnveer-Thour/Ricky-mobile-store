import ExcelJS from "exceljs";
import { categoryService } from "@/services";
import { triggerExcelDownload, BORDER_THIN } from "./excelHelpers";

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
    state: "hidden",
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
    "💡 Instructions: Pick Category & Warranty from dropdowns. For Colors/Variants use 'Color: Qty; Color: Qty' (e.g. 'Natural Titanium: 20; Titanium Black: 20'). Description is optional — if left blank, AI generates it automatically!";
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };
  subCell.font = { name: "Segoe UI", size: 9.5, color: { argb: "FF94A3B8" } };
  subCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(2).height = 24;

  sheet.getRow(3).height = 10;

  // Table Headers (Row 4)
  const headerRow = sheet.getRow(4);
  headerRow.height = 30;

  const columns = [
    { header: "Product Name *", key: "name", width: 34 },
    { header: "Category (Select Dropdown) *", key: "category", width: 30 },
    { header: "Price (INR) *", key: "price", width: 16 },
    { header: "Discount (INR)", key: "discount", width: 16 },
    { header: "Total Stock", key: "quantity", width: 14 },
    { header: "Color Variants & Stock", key: "colors", width: 42 },
    { header: "Image URL", key: "imageUrl", width: 44 },
    { header: "Warranty", key: "warranty", width: 28 },
    { header: "Description (Optional)", key: "description", width: 44 },
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
        "A17 Pro chip, aerospace-grade titanium frame, 48MP main camera with 5x optical zoom",
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
      description: "",
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
    {
      name: "Google Pixel 8 Pro 128GB",
      category: categoryNames[0] || "Flagship Smartphones",
      price: 89999,
      discount: 3000,
      quantity: 20,
      colors: "Bay Blue: 10; Obsidian Black: 10",
      imageUrl:
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      warranty: "1 Year Official Warranty",
      description: "",
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

  const lastLookupCategoryRow = categoryNames.length + 1;
  const lastLookupWarrantyRow = warrantyOptions.length + 1;

  for (let r = 5; r <= 250; r++) {
    const row = sheet.getRow(r);
    row.height = 26;

    row.getCell(3).numFmt = "₹ #,##0";
    row.getCell(4).numFmt = "₹ #,##0";
    row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };

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

    const colorsCell = row.getCell(6);
    colorsCell.dataValidation = {
      type: "custom",
      allowBlank: true,
      formulae: ["TRUE"],
      promptTitle: "Color Variants & Stock Format",
      prompt:
        "Use 'Color: Quantity; Color: Quantity' (e.g., Natural Titanium: 20; Titanium Black: 20)",
      showInputMessage: true,
    };

    const warrantyCell = row.getCell(8);
    warrantyCell.dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`Lookups!$B$2:$B$${lastLookupWarrantyRow}`],
      showErrorMessage: true,
      errorTitle: "Invalid Warranty",
      error: "Please pick a valid warranty period from the dropdown list.",
    };

    const descCell = row.getCell(9);
    descCell.dataValidation = {
      type: "custom",
      allowBlank: true,
      formulae: ["TRUE"],
      promptTitle: "Description (Optional)",
      prompt:
        "Leave empty to automatically generate a rich product description using AI!",
      showInputMessage: true,
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
