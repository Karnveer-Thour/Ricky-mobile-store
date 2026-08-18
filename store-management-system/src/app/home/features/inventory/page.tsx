"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { Plus, Download } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import InventoryTable from "./components/inventoryTable";
import { productService } from "@/services";
import { exportInventoryToExcel } from "../product/utils/excelFunctions";

export default function InventoryPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSyncOffline = async () => {
    setSyncing(true);
    setSyncTrigger((prev) => prev + 1);
    setTimeout(() => {
      setSyncing(false);
    }, 600);
  };

  const handleExportInventory = async () => {
    setExporting(true);
    try {
      const liveProducts = await productService.fetchProducts(1, 1000);
      await exportInventoryToExcel(liveProducts || []);
    } catch (e) {
      console.warn("Failed to export inventory Excel", e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-[95%] mx-auto mt-8 px-4 space-y-6 pb-12">
      {/* Header */}
      <div className="flex max-sm:flex-col items-center justify-between gap-4 border-b border-gray-700/60 pb-4">
        <div>
          <h1
            className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
          >
            Inventory Data Grid
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time stock management with quick inline updates, sorting, and
            CSV reports
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/home/features/product/add"
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all"
          >
            <Plus size={14} /> Add Product
          </Link>
          <button
            onClick={handleExportInventory}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00cfff]/10 hover:bg-[#00cfff]/20 text-[#00cfff] border border-[#00cfff]/30 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={14} />
            <span>{exporting ? "Exporting..." : "Export Inventory CSV"}</span>
          </button>
          <Button
            name={syncing ? "Syncing..." : "Sync Offline Register"}
            handler={handleSyncOffline}
            className="flex items-center gap-2"
          />
        </div>
      </div>

      {/* Reusable Data Table with Pagination, Search, Sorting, and Column Visibility */}
      <InventoryTable isDark={isDark} syncTrigger={syncTrigger} />
    </div>
  );
}
