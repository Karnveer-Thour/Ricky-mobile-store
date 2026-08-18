"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { productService } from "@/services";
import {
  exportProductsToExcel,
  exportInventoryToExcel,
} from "../utils/excelFunctions";
import {
  exportProductsToCsv,
  exportInventoryToCsv,
} from "../utils/fileFunctions";
import {
  Download,
  FileSpreadsheet,
  Package,
  Layers,
  Check,
  Sparkles,
} from "lucide-react";

type CsvDownloadProps = {
  cancelDownload: () => void;
  isDark?: boolean;
};

function CsvDownload({ cancelDownload, isDark = false }: CsvDownloadProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadedType, setDownloadedType] = useState<string | null>(null);

  useEffect(() => {
    productService
      .fetchProducts(1, 1000)
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => {
        console.warn("Failed to load products for spreadsheet export", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleExportProductsExcel = async () => {
    await exportProductsToExcel(products);
    setDownloadedType("products-excel");
    setTimeout(() => {
      cancelDownload();
    }, 1200);
  };

  const handleExportInventoryExcel = async () => {
    await exportInventoryToExcel(products);
    setDownloadedType("inventory-excel");
    setTimeout(() => {
      cancelDownload();
    }, 1200);
  };

  const handleExportProductsCsv = () => {
    exportProductsToCsv(products);
    setDownloadedType("products-csv");
    setTimeout(() => {
      cancelDownload();
    }, 1200);
  };

  const handleExportInventoryCsv = () => {
    exportInventoryToCsv(products);
    setDownloadedType("inventory-csv");
    setTimeout(() => {
      cancelDownload();
    }, 1200);
  };

  return (
    <BlurredPopupLayout
      title="Export Database Spreadsheets"
      subtitle="Download formatted Excel (.xlsx) workbooks or plain CSVs from your live database"
      icon={<FileSpreadsheet size={20} />}
      isDark={isDark}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Database Scope
            </p>
            <p className="text-lg font-bold text-white mt-0.5">
              {loading
                ? "Counting records..."
                : `${products.length} Products Found`}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
            Live DB
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Products Catalog Excel Option */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Package size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">
                      Products Catalog
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Includes device specifications, pricing, color variants, and
                    image links
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
              <button
                type="button"
                onClick={handleExportProductsCsv}
                disabled={loading || products.length === 0}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                Download CSV (.csv)
              </button>
              <button
                type="button"
                onClick={handleExportProductsExcel}
                disabled={loading || products.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                <Download size={13} />
                <span>Download Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Inventory Stock Audit Option */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Inventory Stock Audit Sheet
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Includes SKU codes, stock counts, color breakdowns, and
                    formatted stock status badges
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
              <button
                type="button"
                onClick={handleExportInventoryCsv}
                disabled={loading || products.length === 0}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                Download CSV (.csv)
              </button>
              <button
                type="button"
                onClick={handleExportInventoryExcel}
                disabled={loading || products.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
              >
                <Download size={13} />
                <span>Download Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            name="Close"
            variant="ghost"
            handler={cancelDownload}
          />
        </div>
      </div>
    </BlurredPopupLayout>
  );
}

export default CsvDownload;
