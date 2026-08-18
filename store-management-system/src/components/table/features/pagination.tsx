"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import cn from "classnames";
import { Table } from "@tanstack/react-table";

interface PaginationProps {
  table: Table<any>;
  isDark?: boolean;
}

function Pagination({ table, isDark = false }: PaginationProps) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount() || 1;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t text-xs select-none",
        isDark
          ? "border-white/8 bg-slate-900/40 text-slate-400"
          : "border-slate-100 bg-slate-50/50 text-slate-600",
      )}
    >
      {/* Total Range Metrics */}
      <div className="flex items-center gap-1.5 font-medium">
        <span>Showing</span>
        <span
          className={cn(
            "font-semibold",
            isDark ? "text-white" : "text-slate-900",
          )}
        >
          {startRow}-{endRow}
        </span>
        <span>of</span>
        <span
          className={cn(
            "font-semibold",
            isDark ? "text-[#00cfff]" : "text-[#0077ff]",
          )}
        >
          {totalRows}
        </span>
        <span>records</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 whitespace-nowrap">
            Rows per page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className={cn(
              "h-8 px-2 rounded-lg border text-xs font-medium focus:outline-none transition-colors cursor-pointer",
              isDark
                ? "bg-slate-900 border-white/10 text-white focus:border-[#00cfff]"
                : "bg-white border-slate-200 text-slate-800 focus:border-[#00cfff]",
            )}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option
                key={size}
                value={size}
                className={isDark ? "bg-slate-900" : "bg-white"}
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Jump Buttons */}
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "mr-2 text-xs font-medium px-2 py-1 rounded-md",
              isDark
                ? "bg-white/5 text-slate-300"
                : "bg-slate-200/70 text-slate-700",
            )}
          >
            Page{" "}
            <strong className={isDark ? "text-white" : "text-slate-900"}>
              {pageIndex + 1}
            </strong>{" "}
            of <strong>{pageCount}</strong>
          </span>

          <button
            type="button"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
            className={cn(
              "p-1.5 rounded-lg border transition-all duration-150 flex items-center justify-center cursor-pointer",
              isDark
                ? "border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-400"
                : "border-slate-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-600",
            )}
          >
            <ChevronsLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className={cn(
              "p-1.5 rounded-lg border transition-all duration-150 flex items-center justify-center cursor-pointer",
              isDark
                ? "border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-400"
                : "border-slate-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-600",
            )}
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className={cn(
              "p-1.5 rounded-lg border transition-all duration-150 flex items-center justify-center cursor-pointer",
              isDark
                ? "border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-400"
                : "border-slate-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-600",
            )}
          >
            <ChevronRight size={15} />
          </button>

          <button
            type="button"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
            className={cn(
              "p-1.5 rounded-lg border transition-all duration-150 flex items-center justify-center cursor-pointer",
              isDark
                ? "border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-400"
                : "border-slate-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-600",
            )}
          >
            <ChevronsRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
