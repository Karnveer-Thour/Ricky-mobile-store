"use client";
import { flexRender } from "@tanstack/react-table";
import React from "react";

import type { Row as TableRow } from "@tanstack/react-table";

type RowProps<TData> = {
  row: TableRow<TData>;
};

function Row<TData>({ row }: RowProps<TData>) {
  return (
    <tr className="border-t hover:bg-gray-100">
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="py-3 px-6 w-auto truncate">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default Row;
