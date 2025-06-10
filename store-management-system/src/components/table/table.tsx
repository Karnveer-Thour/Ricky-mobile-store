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
    <div className={`h-full w-full bg-transparent`}>
      {/* Desktop Table */}
      {data?.length === 0 ? (
        <div className="text-center hidden md:block py-12 text-gray-500">
          No customers found
        </div>
      ) : (
        <>
          <div className=" p-3 hidden md:flex justify-between items-center">
            <GlobalFilter setGlobalFilter={setGlobalFilter} isDark={isDark} />
            <div className="w-45 h-12">
              <ColumnVisibility
                columns={columns}
                handleColumnVisibility={handleColumnVisibility}
                columnVisibility={columnVisibility}
                isDark={isDark}
              />
            </div>
          </div>
          <div className="overflow-x-auto hidden md:block w-full p-2">
            <table className=" bg-white shadow-md rounded-b-xl w-full overflow-hidden">
              <thead
                className={` ${isDark ? "text-white bg-gray-700" : "text-gray-700 bg-gray-200"}`}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="">
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
                        ></th>
                      ),
                    )}
                  </tr>
                ))}
              </thead>

              <tbody
                className={
                  "text-center text-lg font-bold" +
                  (isDark ? " text-gray-800 bg-gray-300" : " text-gray-700")
                }
              >
                {table.getRowModel().rows.map((row: any) => (
                  <Row row={row} key={row.id} />
                ))}
              </tbody>
            </table>
            <Pagination table={table} isDark={isDark} />
          </div>
        </>
      )}

      {/* Mobile Cards */}
      <MobileCards data={data} />
    </div>
  );
}

export default Table;
