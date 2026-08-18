"use client";
import { flexRender, Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import cn from "classnames";

type HeadProps = {
  header: Header<any, any>;
  handleColumnVisibility?: (id: string) => void;
  setSorting?: (sorting: Array<{ id: string; desc: boolean }>) => void;
  isDark?: boolean;
};

function Head({ header, isDark = false }: HeadProps) {
  const canSort = header.column.getCanSort();
  const isSorted = header.column.getIsSorted();

  return (
    <th
      className={cn(
        "py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-wider select-none whitespace-nowrap transition-colors",
        canSort ? "cursor-pointer hover:bg-white/5" : "",
        isDark ? "text-slate-400" : "text-slate-500",
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      <div className="flex items-center gap-2">
        <span className="flex-1 font-medium">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {canSort && (
          <span className="shrink-0 transition-colors">
            {isSorted === "asc" ? (
              <ArrowUp size={14} className="text-[#00cfff]" />
            ) : isSorted === "desc" ? (
              <ArrowDown size={14} className="text-[#00cfff]" />
            ) : (
              <ArrowUpDown
                size={13}
                className={cn(
                  "opacity-30 hover:opacity-100 transition-opacity",
                  isDark ? "text-slate-400" : "text-slate-500",
                )}
              />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

export default Head;
