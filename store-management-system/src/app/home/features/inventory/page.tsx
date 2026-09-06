"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import InventoryTable from "./components/inventoryTable";
import { productService } from "@/services";
import { exportInventoryToExcel } from "../product/utils/excelFunctions";
import { motion } from "framer-motion";
import cn from "classnames";

export default function InventoryPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSyncOffline = async () => {
    setSyncing(true);
    setSyncTrigger((prev) => prev + 1);
    setTimeout(() => setSyncing(false), 600);
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
    <div className="page-container">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <p
            className={cn(
              "text-xs font-medium mb-1",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            Home &rsaquo; Inventory
          </p>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight",
              isDark ? "text-white" : "text-slate-900",
            )}
          >
            Inventory Data Grid
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock management with sorting, inline updates &amp; CSV
            reports
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/home/features/product/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-cyan-500/30 hover:opacity-90 transition-all duration-200"
          >
            <Plus size={16} />
            Add Product
          </Link>
          <button
            onClick={handleExportInventory}
            disabled={exporting}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50",
              isDark
                ? "border-white/10 text-slate-300 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            <Download size={15} />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            onClick={handleSyncOffline}
            disabled={syncing}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50",
              isDark
                ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                : "border-cyan-400/40 text-cyan-600 hover:bg-cyan-50",
            )}
          >
            {syncing ? "Syncing..." : "Sync Offline Register"}
          </button>
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <InventoryTable isDark={isDark} syncTrigger={syncTrigger} />
      </motion.div>
    </div>
  );
}
