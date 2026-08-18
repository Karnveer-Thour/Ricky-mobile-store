"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import cn from "classnames";

interface GlobalFilterProps {
  setGlobalFilter: (value: string) => void;
  isDark?: boolean;
}

function GlobalFilter({ setGlobalFilter, isDark = false }: GlobalFilterProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    setGlobalFilter(val);
  };

  const handleClear = () => {
    setValue("");
    setGlobalFilter("");
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm">
      <Search
        size={15}
        className={cn(
          "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
          isDark ? "text-slate-400" : "text-slate-400",
        )}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search records..."
        id="filter"
        className={cn(
          "w-full h-9.5 pl-9 pr-8 text-xs sm:text-sm font-medium rounded-xl border transition-all duration-150 focus:outline-none",
          isDark
            ? "bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus:border-[#00cfff]/50 focus:ring-2 focus:ring-[#00cfff]/15"
            : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#00cfff] focus:ring-2 focus:ring-[#00cfff]/15 focus:bg-white",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-white/10 transition-colors",
            isDark
              ? "text-slate-400 hover:text-white"
              : "text-slate-400 hover:text-slate-700",
          )}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

export default GlobalFilter;
