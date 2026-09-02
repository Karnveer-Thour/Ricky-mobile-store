"use client";

import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import WhatsappTable from "./components/whatsappTable";
import { MessageCircle, Plus, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import cn from "classnames";

export default function WhatsappPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const pathName = usePathname();
  const router = useRouter();

  return (
    <div className="page-container">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20">
            <MessageCircle size={20} />
          </div>
          <div>
            <p
              className={cn(
                "text-xs font-medium mb-0.5",
                isDark ? "text-slate-500" : "text-slate-400",
              )}
            >
              Home &rsaquo; WhatsApp
            </p>
            <h1
              className={cn(
                "text-2xl font-bold tracking-tight",
                isDark ? "text-white" : "text-slate-900",
              )}
            >
              WhatsApp Sales &amp; Channels
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.push(`${pathName}/add`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-cyan-500/30 hover:opacity-90 transition-all duration-200"
          >
            <Plus size={16} />
            Add Group
          </button>
          <button
            onClick={() => router.push(`${pathName}/uploadsale`)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer",
              isDark
                ? "border-white/10 text-slate-300 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            <UploadCloud size={15} />
            Upload Group Sale
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
        <WhatsappTable isDark={isDark} />
      </motion.div>
    </div>
  );
}
