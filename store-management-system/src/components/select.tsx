"use client";
import React from "react";

import { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children?: ReactNode;
}

function Select({ children, ...props }: SelectProps) {
  return (
    <select
      className="w-30 p-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white"
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
