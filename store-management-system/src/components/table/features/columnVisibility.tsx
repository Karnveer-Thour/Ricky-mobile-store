"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import cn from "classnames";

type Column = {
  id: string;
  header: React.ReactNode;
};

type ColumnVisibilityProps = {
  handleColumnVisibility: (id: string) => void;
  columnVisibility: Record<string, boolean>;
  columns: Column[];
  isDark?: boolean;
};

function ColumnVisibility({
  handleColumnVisibility,
  columnVisibility,
  columns,
  isDark = false,
}: ColumnVisibilityProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  const toggleableColumns = columns.filter((col) => col.id !== "Actions");
  const visibleCount = toggleableColumns.filter(
    (col) => columnVisibility[col.id] !== false,
  ).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "h-9.5 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 cursor-pointer",
          isDark
            ? "bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:border-white/20"
            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 shadow-sm",
          open &&
            (isDark
              ? "border-[#00cfff]/50 text-white"
              : "border-[#00cfff] text-[#0077ff]"),
        )}
      >
        <SlidersHorizontal
          size={14}
          className={isDark ? "text-[#00cfff]" : "text-[#0077ff]"}
        />
        <span>Columns</span>
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
            isDark
              ? "bg-white/10 text-slate-300"
              : "bg-slate-200 text-slate-700",
          )}
        >
          {visibleCount}/{toggleableColumns.length}
        </span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-52 p-2 rounded-2xl border shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl",
            isDark
              ? "bg-slate-900/95 border-white/10 text-slate-200 shadow-black/60"
              : "bg-white border-slate-200 text-slate-800 shadow-slate-300/50",
          )}
        >
          <div
            className={cn(
              "px-2.5 py-1.5 text-[11px] font-bold tracking-wider uppercase border-b mb-1",
              isDark
                ? "text-slate-400 border-white/5"
                : "text-slate-500 border-slate-100",
            )}
          >
            Toggle Columns
          </div>
          <div className="space-y-0.5">
            {toggleableColumns.map((column) => {
              const isChecked = columnVisibility[column.id] !== false;
              return (
                <button
                  type="button"
                  key={column.id}
                  onClick={() => handleColumnVisibility(column.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                    isDark
                      ? "hover:bg-white/5 text-slate-300 hover:text-white"
                      : "hover:bg-slate-100 text-slate-700",
                  )}
                >
                  <span className="truncate mr-2">
                    {typeof column.header === "string"
                      ? column.header
                      : column.id}
                  </span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                      isChecked
                        ? "bg-[#00cfff] border-[#00cfff] text-[#07070f]"
                        : isDark
                          ? "border-white/20 bg-transparent"
                          : "border-slate-300 bg-transparent",
                    )}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColumnVisibility;
