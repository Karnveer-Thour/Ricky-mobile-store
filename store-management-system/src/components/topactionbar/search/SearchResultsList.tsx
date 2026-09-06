import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { SearchResultItem } from "./useGlobalSearch";

interface SearchResultsListProps {
  results: SearchResultItem[];
  selectedIndex: number;
  onHoverIndex: (idx: number) => void;
  onSelect: (item: SearchResultItem) => void;
  isDark: boolean;
}

export default function SearchResultsList({
  results,
  selectedIndex,
  onHoverIndex,
  onSelect,
  isDark,
}: SearchResultsListProps) {
  if (results.length === 0) {
    return (
      <div
        className={`p-2 divide-y space-y-1 ${isDark ? "divide-white/5" : "divide-slate-100"}`}
      >
        <div className="py-12 text-center text-slate-400">
          <Search size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm font-semibold">No results found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for product model, customer name, or feature
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-h-96 overflow-y-auto p-2 divide-y space-y-1 ${
        isDark ? "divide-white/5" : "divide-slate-100"
      }`}
    >
      {results.map((item, idx) => {
        const isSelected = idx === selectedIndex;
        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            onMouseEnter={() => onHoverIndex(idx)}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 ${
              isSelected
                ? isDark
                  ? "bg-cyan-500/15 border-cyan-500/40 text-white"
                  : "bg-cyan-50/80 border-cyan-300 text-cyan-950 shadow-xs"
                : isDark
                  ? "hover:bg-white/5 border-transparent text-slate-300"
                  : "hover:bg-slate-100/70 border-transparent text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-400"
                    : isDark
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {item.title}
                  </p>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-500 dark:text-cyan-300 border border-cyan-400/30">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  isDark
                    ? "bg-slate-800/80 text-slate-400 border-slate-700"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {item.category}
              </span>
              <ArrowRight
                size={14}
                className={`transition-transform ${isSelected ? (isDark ? "text-cyan-400 translate-x-0.5" : "text-cyan-600 translate-x-0.5") : "text-transparent"}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
