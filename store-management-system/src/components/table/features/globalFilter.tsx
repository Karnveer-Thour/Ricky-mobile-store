"use client";
import Input from "@/components/Input";
import React from "react";

interface GlobalFilterProps {
  setGlobalFilter: (value: string) => void;
  isDark?: boolean;
}

function GlobalFilter({ setGlobalFilter, isDark = false }: GlobalFilterProps) {
  return (
    <div className="w-[30%]">
      <Input
        className={`w-full h-10 border font-bold ${isDark ? "bg-gray-500 border-white" : "bg-white border-gray-300"} rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        style={{ color: isDark ? "white" : "black" }}
        placeholder={"Search here"}
        id={"filter"}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );
}

export default GlobalFilter;
