"use client";
import React from "react";

import { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children?: ReactNode;
  isDark?: boolean;
  className?:string;
}

function Select({ isDark = false, children,className, ...props }: SelectProps) {
  return (
    <select
      className={
        `w-40 p-2 border rounded-md shadow-sm font-bold text-sm ${className}` +
        (isDark
          ? " bg-gray-500 text-white border-white"
          : "border-gray-300 bg-white")
      }
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
