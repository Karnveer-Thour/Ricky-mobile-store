import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DispatchPaginationControlsProps {
  isDark: boolean;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  filteredCount: number;
  onAdvanceAllPages: (delta: number) => void;
  onResetPages: () => void;
}

export default function DispatchPaginationControls({
  isDark,
  pageSize,
  onPageSizeChange,
  filteredCount,
  onAdvanceAllPages,
  onResetPages,
}: DispatchPaginationControlsProps) {
  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        isDark
          ? "bg-slate-900/60 border-slate-800"
          : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span
          className={`font-semibold ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Cards per column:
        </span>
        <div className="flex items-center gap-1">
          {[3, 5, 8, 100].map((sz) => (
            <button
              key={sz}
              onClick={() => onPageSizeChange(sz)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                pageSize === sz
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : isDark
                    ? "bg-slate-800 text-slate-400 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sz === 100 ? "All" : sz}
            </button>
          ))}
        </div>

        <span
          className={`text-[11px] ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          · Showing {filteredCount} matching order
          {filteredCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAdvanceAllPages(-1)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              : "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-xs"
          }`}
        >
          <ChevronLeft size={14} /> Prev Pages
        </button>

        <button
          onClick={onResetPages}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isDark
              ? "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
          }`}
        >
          Reset to Page 1
        </button>

        <button
          onClick={() => onAdvanceAllPages(1)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              : "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-xs"
          }`}
        >
          Next Pages <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
