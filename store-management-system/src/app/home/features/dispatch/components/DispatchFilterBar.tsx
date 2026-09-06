import React from "react";
import { Search, X, AlertCircle } from "lucide-react";

interface DispatchFilterBarProps {
  isDark: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  activeOrdersCount: number;
  pendingCount: number;
}

export default function DispatchFilterBar({
  isDark,
  searchQuery,
  onSearchChange,
  onSearchClear,
  activeOrdersCount,
  pendingCount,
}: DispatchFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium mb-1 text-slate-500">
          Home &rsaquo; Dispatch Management
        </p>
        <h1
          className={`text-2xl font-extrabold tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Order Dispatch &amp; Fulfillment Board
        </h1>
        <p
          className={`text-xs mt-0.5 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Live delivery stream ({activeOrdersCount} active orders). Drag or
          click to advance fulfillment stages.
        </p>
      </div>

      {/* Filter bar and pending badge */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search box with clear border */}
        <div
          className={`flex items-center px-3 py-2 rounded-xl border-2 transition-all gap-2 ${
            isDark
              ? "bg-slate-900 border-slate-700 text-white focus-within:border-cyan-400"
              : "bg-white border-slate-300 text-slate-900 shadow-xs focus-within:border-cyan-500"
          }`}
        >
          <Search
            size={16}
            className={isDark ? "text-slate-400" : "text-slate-500"}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dispatch orders..."
            className="bg-transparent text-xs font-semibold outline-none w-44 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={onSearchClear}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {pendingCount > 0 && (
          <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-pulse">
            <AlertCircle size={14} />
            {pendingCount} Pending Override{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
