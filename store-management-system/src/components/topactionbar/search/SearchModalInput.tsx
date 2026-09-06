import React, { RefObject } from "react";
import { Search, X, Command } from "lucide-react";

interface SearchModalInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isDark: boolean;
}

export default function SearchModalInput({
  inputRef,
  query,
  onQueryChange,
  onKeyDown,
  isDark,
}: SearchModalInputProps) {
  return (
    <div
      className={`p-4 border-b-2 ${
        isDark
          ? "border-slate-800 bg-slate-900/80"
          : "border-slate-200 bg-slate-50/90"
      }`}
    >
      <div
        className={`flex items-center w-full px-3.5 py-2.5 rounded-xl border-2 transition-all gap-3 ${
          isDark
            ? "bg-slate-950 border-slate-700/80 text-white focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
            : "bg-white border-slate-300 text-slate-900 shadow-xs focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20"
        }`}
      >
        <Search
          size={19}
          className={
            isDark ? "text-cyan-400 shrink-0" : "text-cyan-600 shrink-0"
          }
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search products, customers, orders, or pages (Type to filter)..."
          className={`w-full bg-transparent text-sm font-semibold outline-none ${
            isDark
              ? "text-white placeholder-slate-500"
              : "text-slate-900 placeholder-slate-400"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-400 hover:text-slate-800"
            }`}
          >
            <X size={16} />
          </button>
        )}
        <div
          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
            isDark
              ? "bg-slate-800 text-slate-400 border-slate-700"
              : "bg-slate-100 text-slate-700 border-slate-300 shadow-2xs"
          }`}
        >
          <Command size={11} /> K
        </div>
      </div>
    </div>
  );
}
