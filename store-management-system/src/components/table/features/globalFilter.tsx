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
        placeholder={"Search here"}
        id={"filter"}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );
}

export default GlobalFilter;
