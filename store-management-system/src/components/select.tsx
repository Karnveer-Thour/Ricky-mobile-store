"use client";
import React from "react";
import { SelectHTMLAttributes, ReactNode, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children?: ReactNode;
  isDark?: boolean;
  className?: string;
  customMargin?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { isDark = false, children, className = "", customMargin, ...props },
    ref,
  ) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 
            rounded-2xl
            ${customMargin ?? "mt-0"}
            text-sm text-white
            bg-slate-900 border border-white/10
            focus:outline-none focus:border-[#00cfff]/60 focus:ring-1 focus:ring-[#00cfff]/30
            transition-all duration-200 cursor-pointer appearance-none
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {/* Custom Chevron Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
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
