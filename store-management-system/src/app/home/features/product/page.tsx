"use client";
import React from "react";
import Button from "@/components/Button";
import ProductTable from "./components/productTable";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import CsvDownload from "./components/csvDownload";
import { handleSaveFile } from "./utils/fileFunctions";
import CsvUpload from "./components/csvUpload";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Download, Upload } from "lucide-react";
import cn from "classnames";

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [isDownloadingCsv, setIsDownloadingCsv] = React.useState(false);
  const [isUploadingCsv, setIsUploadingCsv] = React.useState(false);
  const pathName = usePathname();
  const router = useRouter();

  return (
    <>
      {isDownloadingCsv && (
        <CsvDownload
          cancelDownload={() => setIsDownloadingCsv(false)}
          downloadCsv={() => {
            handleSaveFile({ name: "John Doe", email: "john@example.com" });
          }}
          isDark={isDark}
        />
      )}
      {isUploadingCsv && (
        <CsvUpload
          cancelUpload={() => setIsUploadingCsv(false)}
          isDark={isDark}
        />
      )}

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
              Home &rsaquo; Products
            </p>
            <h1
              className={cn(
                "text-2xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900",
              )}
            >
              Products
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => router.push(`${pathName}/add`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-cyan-500/30 hover:opacity-90 transition-all duration-200"
            >
              <Plus size={16} />
              Add Product
            </button>
            <button
              onClick={() => setIsDownloadingCsv(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200",
                isDark
                  ? "border-white/10 text-slate-300 hover:bg-white/5"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50",
              )}
            >
              <Download size={15} />
              Export CSV
            </button>
            <button
              onClick={() => setIsUploadingCsv(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200",
                isDark
                  ? "border-white/10 text-slate-300 hover:bg-white/5"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50",
              )}
            >
              <Upload size={15} />
              Import CSV
            </button>
          </div>
        </motion.div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className={cn(
            "rounded-2xl overflow-hidden border transition-colors duration-300",
            isDark
              ? "border-white/8 shadow-xl shadow-black/20"
              : "border-slate-200 shadow-sm",
          )}
        >
          <ProductTable isDark={isDark} />
        </motion.div>
      </div>
    </>
  );
}

export default page;
