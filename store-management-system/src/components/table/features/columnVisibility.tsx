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
};

function ColumnVisibility({
  handleColumnVisibility,
  columnVisibility,
  columns,
}: ColumnVisibilityProps) {
  return (
    <Multiselect Heading="Select Columns">
      {columns.map(
        (header) =>
          header.id !== "Actions" && (
            <div
              className="w-full flex items-center justify-start gap-2 border-b-2 p-2"
              key={header.id}
            >
              <input
                className="h-full"
                type="checkbox"
                id={header.id}
                onClick={(e) => handleColumnVisibility(header.id)}
                defaultChecked={columnVisibility[header.id] ? true : false}
              />
              <label htmlFor={header.id}>{header.header}</label>
            </div>
          ),
      )}
    </Multiselect>
  );
}

export default ColumnVisibility;
