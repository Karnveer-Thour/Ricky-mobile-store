"use client";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { motion } from "framer-motion";
import type { Row as TableRow } from "@tanstack/react-table";

type RowProps<TData> = {
  row: TableRow<TData>;
};

function Row<TData>({ row }: RowProps<TData>) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(0, 207, 255, 0.08)" }}
      transition={{ duration: 0.2 }}
      className="border-t transition-colors border-gray-700/30"
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="py-3.5 px-6 w-auto truncate">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </motion.tr>
  );
}

export default Row;
