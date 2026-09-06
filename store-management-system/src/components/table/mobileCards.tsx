"use client";
import React from "react";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import cn from "classnames";

interface MobileCardsProps {
  table?: TableType<any>;
  data?: any[];
  isDark?: boolean;
}

function MobileCards({ table, isDark = false }: MobileCardsProps) {
  if (!table) return null;

  const rows = table.getRowModel().rows;
  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "md:hidden text-center py-10 text-xs",
          isDark ? "text-slate-500" : "text-slate-400",
        )}
      >
        No records to display
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-3 p-3 w-full">
      {rows.map((row) => {
        const visibleCells = row.getVisibleCells();
        const actionCell = visibleCells.find(
          (c) => c.column.id?.toLowerCase() === "actions",
        );
        const otherCells = visibleCells.filter(
          (c) => c.column.id?.toLowerCase() !== "actions",
        );

        return (
          <div
            key={row.id}
            className={cn(
              "p-4 rounded-xl border transition-all",
              isDark
                ? "bg-slate-900/90 border-white/8 text-slate-200"
                : "bg-white border-slate-200 text-slate-800 shadow-sm",
            )}
          >
            <div className="space-y-2.5">
              {otherCells.map((cell) => (
                <div
                  key={cell.id}
                  className="flex items-start justify-between gap-3 text-xs"
                >
                  <span
                    className={cn(
                      "font-medium shrink-0 pt-0.5",
                      isDark ? "text-slate-400" : "text-slate-500",
                    )}
                  >
                    {String(cell.column.columnDef.header || cell.column.id)}:
                  </span>
                  <div className="text-right flex-1 break-words">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}

              {actionCell && (
                <div
                  className={cn(
                    "pt-2.5 mt-2 border-t flex justify-end items-center",
                    isDark ? "border-white/5" : "border-slate-100",
                  )}
                >
                  {flexRender(
                    actionCell.column.columnDef.cell,
                    actionCell.getContext(),
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MobileCards;
