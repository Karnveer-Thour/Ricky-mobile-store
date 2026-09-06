import Papa from "papaparse";

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

    const variants = p.variants || [];
    const colors = p.colors || p.productColors || [];
    let colorsString = "";
    if (variants.length > 0) {
      colorsString = variants
        .map(
          (v: any) =>
            `${v.ram ? v.ram + " " : ""}${v.storage ? v.storage + " " : ""}${v.color || "Standard"}: ${v.quantity}`,
        )
        .join("; ");
    } else if (colors.length > 0) {
      colorsString = colors
        .map((c: any) => `${c.name || c.colorName}:${c.quantity}`)
        .join("; ");
    } else {
      colorsString = `Default:${p.quantity || p.stockCount || 0}`;
    }

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

    const variants = p.variants || [];
    const colors = p.colors || p.productColors || [];
    let colorsString = "";
    if (variants.length > 0) {
      colorsString = variants
        .map(
          (v: any) =>
            `${v.ram ? v.ram + " " : ""}${v.storage ? v.storage + " " : ""}${v.color || "Standard"}: ${v.quantity}`,
        )
        .join("; ");
    } else if (colors.length > 0) {
      colorsString = colors
        .map((c: any) => `${c.name || c.colorName}: ${c.quantity}`)
        .join("; ");
    } else {
      colorsString = `Standard: ${stock}`;
    }

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
      Description: "", // Left blank intentionally to auto-generate via AI on import
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
    {
      "Product Name": "Google Pixel 8 Pro",
      Category: "Smartphones",
      Price: 89999,
      Discount: 3000,
      "Total Quantity": 20,
      "Color Variants": "Bay Blue:10; Obsidian Black:10",
      "Image URL":
        "https://res.cloudinary.com/dszgssbnh/image/upload/v1786969670/products/file.png",
      Warranty: "1 Year Google Warranty",
      Description: "", // Left blank intentionally to auto-generate via AI on import
    },
  ];

  downloadCsvFile(sampleRows, "sample_products_import_template.csv");
};

import { parseAndImportExcelOrCsv } from "./excelFunctions";

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
  return parseAndImportExcelOrCsv(file, onProgress);
};
