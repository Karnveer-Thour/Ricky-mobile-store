"use client";
import { flexRender } from "@tanstack/react-table";
import React from "react";

import type { Row as TableRow } from "@tanstack/react-table";

type RowProps<TData> = {
  row: TableRow<TData>;
  isDark?: boolean;
};

function Row<TData>({ row,isDark=false }: RowProps<TData>) {
  return (
    <tr className={"border-t"}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="py-3 px-6 w-auto truncate">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default Row;
