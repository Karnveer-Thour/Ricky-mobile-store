"use client";

import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";
import CustomerTable from "./components/customerTable";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import cn from "classnames";

function page() {
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
        <div>
          <p
            className={cn(
              "text-xs font-medium mb-1",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            Home &rsaquo; Customers
          </p>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight",
              isDark ? "text-white" : "text-slate-900",
            )}
          >
            Customers
          </h1>
        </div>
        <button
          onClick={() => router.push(`${pathName}/add`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-cyan-500/30 hover:opacity-90 transition-all duration-200"
        >
          <Plus size={16} />
          Add Customer
        </button>
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
        <CustomerTable isDark={isDark} />
      </motion.div>
    </div>
  );
}

export default page;
