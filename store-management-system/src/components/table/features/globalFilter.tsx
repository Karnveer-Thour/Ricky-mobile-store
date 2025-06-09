"use client";
import Input from "@/components/Input";
import React from "react";

interface GlobalFilterProps {
  setGlobalFilter: (value: string) => void;
}

function GlobalFilter({ setGlobalFilter }: GlobalFilterProps) {
  return (
    <div className="w-[30%]">
      <Input
        className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ color: "black" }}
        placeholder={"Search here"}
        id={"filter"}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );
}

export default GlobalFilter;
