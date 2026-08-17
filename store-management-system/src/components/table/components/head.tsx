"use client";
import Select from "@/components/select";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@tanstack/react-table";
import cn from "classnames";

type HeadProps = {
  header: Header<any, any>;
  handleColumnVisibility: (id: string) => void;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
  isDark?: boolean;
};

function Head({
  header,
  handleColumnVisibility,
  setSorting,
  isDark = false,
}: HeadProps) {
  return (
    <th
      className={cn(
        "py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap",
        isDark ? "text-slate-400" : "text-slate-500",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex-1">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
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
          isDark={isDark}
        >
          <option value="">⇅</option>
          <option value="Asc">↑ Asc</option>
          <option value="Desc">↓ Desc</option>
          <option value="Hide">Hide</option>
        </Select>
      </div>
    </th>
  );
}

export default Head;
