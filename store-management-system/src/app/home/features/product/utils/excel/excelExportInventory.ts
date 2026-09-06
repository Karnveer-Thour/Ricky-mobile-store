import ExcelJS from "exceljs";
import { triggerExcelDownload, BORDER_THIN } from "./excelHelpers";

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
  };
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

  sheet.getRow(3).height = 10;

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
    cell.border = { bottom: { style: "medium", color: { argb: "FFA855F7" } } };
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

    const variants = p.variants || [];
    const colors = p.colors || p.productColors || [];
    let colorsString = "";
    if (variants.length > 0) {
      colorsString = variants
        .map(
          (v: any) =>
            `${v.ram ? v.ram + " " : ""}${v.storage ? v.storage + " " : ""}${v.color || "Standard"}: ${v.quantity}`,
        )
        .join("  |  ");
    } else if (colors.length > 0) {
      colorsString = colors
        .map((c: any) => `${c.name || c.colorName}: ${c.quantity}`)
        .join("  |  ");
    } else {
      colorsString = `Standard: ${stock}`;
    }

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
