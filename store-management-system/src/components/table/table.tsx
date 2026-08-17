"use client";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import GlobalFilter from "./features/globalFilter";
import ColumnVisibility from "./features/columnVisibility";
import Head from "./components/head";
import Row from "./components/row";
import Pagination from "./features/pagination";
import MobileCards from "./mobileCards";
import { Inbox } from "lucide-react";
import cn from "classnames";

interface TableProps {
  columns: any[];
  data: any[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isDark?: boolean;
}

function Table({
  columns,
  data,
  columnVisibility,
  setColumnVisibility,
  isDark = false,
}: TableProps) {
  const handleColumnVisibility = (columnId: string | number) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnVisibility,
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="h-full w-full">
      {/* ── Desktop Table ───────────────────────────── */}
      {data?.length === 0 ? (
        /* Empty state */
        <div
          className={cn(
            "hidden md:flex flex-col items-center justify-center py-20 rounded-2xl border mx-4",
            isDark
              ? "bg-slate-800/60 border-white/8 text-slate-500"
              : "bg-white border-slate-200 text-slate-400",
          )}
        >
          <Inbox size={44} strokeWidth={1.2} className="mb-3 opacity-40" />
          <p className="font-semibold text-sm">No records found</p>
          <p className="text-xs mt-1 opacity-60">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          {/* Filter + Column toolbar */}
          <div
            className={cn(
              "hidden md:flex justify-between items-center px-5 py-3 rounded-t-2xl border-b",
              isDark
                ? "bg-slate-800/80 border-white/8"
                : "bg-white border-slate-100",
            )}
          >
            <GlobalFilter setGlobalFilter={setGlobalFilter} isDark={isDark} />
            <div className="w-44 h-10">
              <ColumnVisibility
                columns={columns}
                handleColumnVisibility={handleColumnVisibility}
                columnVisibility={columnVisibility}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Table */}
          <div
            className={cn(
              "overflow-x-auto hidden md:flex w-full md:flex-col",
              isDark
                ? "bg-slate-800/80 border-white/8"
                : "bg-white",
              "rounded-b-2xl border-x border-b",
              isDark ? "border-white/8" : "border-slate-200",
            )}
          >
            <table className="w-full text-sm">
              {/* Header */}
              <thead
                className={cn(
                  "sticky top-0 z-10 border-b",
                  isDark
                    ? "bg-slate-900/90 text-slate-400 border-white/8"
                    : "bg-slate-50 text-slate-500 border-slate-200",
                )}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) =>
                      header.id !== "Actions" ? (
                        <Head
                          key={header.id}
                          header={header}
                          handleColumnVisibility={handleColumnVisibility}
                          setSorting={setSorting}
                          isDark={isDark}
                        />
                      ) : (
                        <th
                          key={header.id}
                          className="py-3 px-6 text-left"
                        />
                      ),
                    )}
                  </tr>
                ))}
              </thead>

              {/* Body */}
              <tbody>
                {table.getRowModel().rows.map((row: any) => (
                  <Row row={row} key={row.id} />
                ))}
              </tbody>
            </table>
            <Pagination table={table} isDark={isDark} />
          </div>
        </>
      )}

      {/* ── Mobile Cards ────────────────────────────── */}
      <MobileCards data={data} />
    </div>
  );
}

export default Table;
