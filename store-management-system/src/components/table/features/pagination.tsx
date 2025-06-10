"use client";
import Button from "@/components/Button";
import Select from "@/components/select";
import React from "react";

interface PaginationProps {
  table: {
    firstPage: () => void;
    previousPage: () => void;
    nextPage: () => void;
    lastPage: () => void;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    getState: () => { pagination: { pageSize: number } };
    setPageSize: (size: number) => void;
  };
  isDark?: boolean;
}

function Pagination({ table, isDark = false }: PaginationProps) {
  return (
    <>
      {/* Pagination Controls */}
      <div className=" w-full flex items-center justify-evenly mt-5">
        <div className="w-40 h-full p-5">
          <Button
            name={"First Page"}
            handler={() => {
              table.firstPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className={" disabled:cursor-not-allowed disabled:bg-indigo-300"}
          />
        </div>
        <div className="w-30 h-full p-5">
          <Button
            name={"Previous"}
            handler={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className={" disabled:cursor-not-allowed disabled:bg-indigo-300"}
          />
        </div>
        <div className="flex items-center justify-between w-65 ">
          <label htmlFor="Pages">Rows as per page</label>
          <Select
            id="Pages"
            value={table.getState().pagination.pageSize}
            isDark={isDark}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-30 h-full p-5">
          <Button
            name={"Next"}
            handler={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className={" disabled:cursor-not-allowed disabled:bg-indigo-300"}
          />
        </div>
        <div className="w-40 h-full p-5">
          <Button
            name={"Last page"}
            handler={() => {
              table.lastPage();
            }}
            disabled={!table.getCanNextPage()}
            className={" disabled:cursor-not-allowed disabled:bg-indigo-300"}
          />
        </div>
      </div>
    </>
  );
}

export default Pagination;
