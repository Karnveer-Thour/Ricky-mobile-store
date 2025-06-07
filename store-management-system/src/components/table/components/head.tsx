"use client";
import Select from "@/components/select";
import { flexRender } from "@tanstack/react-table";

import { Header } from "@tanstack/react-table";

type HeadProps = {
  header: Header<any, any>;
  handleColumnVisibility: (id: string) => void;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
};

function Head({ header, handleColumnVisibility, setSorting }: HeadProps) {
  return (
    <th className="py-3 px-6 text-left">
      <div className="flex items-center justify-between w-full">
        {flexRender(header.column.columnDef.header, header.getContext())}
        <Select
          onChange={(e) => {
            const value = e.target.value;
            if (value === "Asc") {
              setSorting([{ id: header.column.id, desc: false }]);
            } else if (value === "Desc") {
              setSorting([{ id: header.column.id, desc: true }]);
            } else if (value === "Hide") {
              handleColumnVisibility(header.id);
            }
          }}
        >
          <option value="">Select</option>
          <option value="Asc">Ascending ⬆️</option>
          <option value="Desc">Descending ⬇️</option>
          <option value="Hide">Hide 👁️</option>
        </Select>
      </div>
    </th>
  );
}

export default Head;
