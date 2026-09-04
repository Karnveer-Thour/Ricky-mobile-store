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
import { Inbox, SearchX } from "lucide-react";
import cn from "classnames";

interface TableProps {
  columns: any[];
  data: any[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isDark?: boolean;
  isLoading?: boolean;
}

function Table({
  columns,
  data,
  columnVisibility,
  setColumnVisibility,
  isDark = false,
  isLoading = false,
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

  const visibleColumnsCount = table.getVisibleLeafColumns().length;
  const filteredRowCount = table.getRowModel().rows.length;

  return (
    <div className="h-full w-full">
      {/* ── Desktop Table ───────────────────────────── */}
      {isLoading ? (
        /* Shimmer skeleton while loading */
        <div
          className={cn(
            "hidden md:flex flex-col rounded-2xl border overflow-hidden shadow-sm",
            isDark
              ? "bg-slate-900/80 border-white/8"
              : "bg-white border-slate-200",
          )}
        >
          {/* Toolbar skeleton */}
          <div
            className={cn(
              "flex justify-between items-center px-6 py-4 border-b",
              isDark ? "border-white/8" : "border-slate-100",
            )}
          >
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800/50" />
            <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-800/50" />
          </div>
          {/* Header skeleton */}
          <div
            className={cn(
              "flex gap-6 px-6 py-3.5 border-b",
              isDark
                ? "border-white/8 bg-slate-900/60"
                : "border-slate-100 bg-slate-50",
            )}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded bg-slate-700/40"
                style={{ width: `${[120, 160, 100, 60][i] ?? 80}px` }}
              />
            ))}
          </div>
          {/* Row skeletons */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-6 items-center px-6 py-4 border-b",
                isDark ? "border-white/5" : "border-slate-50",
              )}
              style={{ opacity: 1 - i * 0.1 }}
            >
              <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-700/40 shrink-0" />
              <div className="h-3 w-36 animate-pulse rounded bg-slate-700/30" />
              <div className="h-3 w-48 animate-pulse rounded bg-slate-700/30" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-700/30" />
              <div className="ml-auto flex gap-2">
                <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-700/30" />
                <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-700/30" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        /* Empty dataset state */
        <div
          className={cn(
            "hidden md:flex flex-col items-center justify-center py-20 rounded-2xl border",
            isDark
              ? "bg-slate-900/60 border-white/8 text-slate-400"
              : "bg-white border-slate-200 text-slate-500 shadow-sm",
          )}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
              isDark
                ? "bg-white/5 text-slate-400"
                : "bg-slate-100 text-slate-500",
            )}
          >
            <Inbox size={32} strokeWidth={1.5} />
          </div>
          <p
            className={cn(
              "font-semibold text-base",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            No records found
          </p>
          <p
            className={cn(
              "text-xs mt-1",
              isDark ? "text-slate-400" : "text-slate-500",
            )}
          >
            Get started by adding your first record above.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "hidden md:flex flex-col rounded-2xl border overflow-hidden shadow-sm transition-colors",
            isDark
              ? "bg-slate-900/80 border-white/8 backdrop-blur-sm"
              : "bg-white border-slate-200",
          )}
        >
          {/* Filter + Column toolbar */}
          <div
            className={cn(
              "flex justify-between items-center px-6 py-4 border-b",
              isDark
                ? "border-white/8 bg-slate-900/40"
                : "border-slate-100 bg-slate-50/40",
            )}
          >
            <GlobalFilter setGlobalFilter={setGlobalFilter} isDark={isDark} />
            <ColumnVisibility
              columns={columns}
              handleColumnVisibility={handleColumnVisibility}
              columnVisibility={columnVisibility}
              isDark={isDark}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm border-collapse">
              {/* Header */}
              <thead
                className={cn(
                  "sticky top-0 z-10 border-b",
                  isDark
                    ? "bg-slate-900/90 text-slate-400 border-white/8"
                    : "bg-slate-50 text-slate-600 border-slate-200",
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
                          className={cn(
                            "py-3.5 px-6 text-right text-xs font-semibold uppercase tracking-wider",
                            isDark ? "text-slate-400" : "text-slate-600",
                          )}
                        >
                          Actions
                        </th>
                      ),
                    )}
                  </tr>
                ))}
              </thead>

              {/* Body */}
              <tbody>
                {filteredRowCount > 0 ? (
                  table
                    .getRowModel()
                    .rows.map((row: any) => (
                      <Row row={row} key={row.id} isDark={isDark} />
                    ))
                ) : (
                  /* No search results match */
                  <tr>
                    <td
                      colSpan={visibleColumnsCount}
                      className="py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <SearchX
                          size={32}
                          className={cn(
                            "mb-2.5",
                            isDark ? "text-slate-500" : "text-slate-400",
                          )}
                        />
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isDark ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          No matching records found
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            isDark ? "text-slate-500" : "text-slate-400",
                          )}
                        >
                          Try adjusting your search query or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination table={table} isDark={isDark} />
        </div>
      )}

      {/* ── Mobile Cards ────────────────────────────── */}
      <MobileCards data={data} />
    </div>
  );
}

export default Table;
