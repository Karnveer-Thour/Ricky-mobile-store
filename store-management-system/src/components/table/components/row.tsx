"use client";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { motion } from "framer-motion";
import type { Row as TableRow } from "@tanstack/react-table";
import cn from "classnames";

type RowProps<TData> = {
  row: TableRow<TData>;
  isDark?: boolean;
};

function Row<TData>({ row, isDark = false }: RowProps<TData>) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{
        backgroundColor: isDark
          ? "rgba(0, 207, 255, 0.04)"
          : "rgba(0, 207, 255, 0.03)",
      }}
      transition={{ duration: 0.15 }}
      className={cn(
        "border-t transition-colors text-sm",
        isDark
          ? "border-white/5 text-slate-200"
          : "border-slate-100 text-slate-700 hover:text-slate-900",
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="py-3.5 px-6 font-normal whitespace-nowrap">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </motion.tr>
  );
}

export default Row;
