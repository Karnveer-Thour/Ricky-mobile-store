"use client";
import React from "react";
import { SelectHTMLAttributes, ReactNode, forwardRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import cn from "classnames";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children?: ReactNode;
  isDark?: boolean;
  className?: string;
  customMargin?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { isDark: isDarkProp, children, className = "", customMargin, ...props },
    ref,
  ) => {
    const reduxDark = useSelector(
      (state: storeType) => state.DarkMode?.isDarkMode,
    );
    const isDark = isDarkProp !== undefined ? isDarkProp : (reduxDark ?? false);

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-[#00cfff]/30",
            customMargin ?? "mt-0",
            isDark
              ? "text-white bg-slate-900 border border-white/10 focus:border-[#00cfff]/60"
              : "text-slate-800 bg-white border border-slate-200 shadow-xs focus:border-[#00cfff]",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {/* Custom Chevron Arrow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5",
            isDark ? "text-slate-400" : "text-slate-500",
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
