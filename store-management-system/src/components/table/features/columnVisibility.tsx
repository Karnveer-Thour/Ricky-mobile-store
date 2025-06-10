"use client";
import Multiselect from "@/components/multiselect";
import React from "react";

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
  return (
    <Multiselect Heading="Select Columns" isDark={isDark}>
      {columns
        .filter((column) => column.id !== "Actions")
        .map((column) => (
          
          <div
            className="w-full flex items-center justify-start gap-2 border-b-2 p-2 "
            key={column.id}
          >
            <input
              className="h-full"
              type="checkbox"
              id={column.id}
              onClick={() => handleColumnVisibility(column.id)}
              defaultChecked={columnVisibility[column.id] ? true : false}
            />
            <label htmlFor={column.id}>{column.header}</label>
          </div>
        ))}
    </Multiselect>
  );
}

export default ColumnVisibility;
