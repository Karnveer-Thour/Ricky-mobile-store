"use client";
import Table from "@/components/table/table";
import { useState, useEffect } from "react";

const CityTable = ({ isDark = false }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSales = async () => {
    setLoading(true);
    try {
      // Dynamic fetch or default empty list
      setSales([]);
    } catch (err) {
      console.warn("Failed to load sales:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const columns = [
    {
      header: "Buyer",
      id: "Buyer",
      accessorKey: "buyer",
    },
    {
      header: "Products",
      id: "Products",
      accessorKey: "products",
    },
    {
      header: "Status",
      id: "Status",
      cell: ({ row }: { row: any }) => {
        const status = (row.original?.status || "pending").toLowerCase();
        const colors =
          status === "accepted" || status === "completed"
            ? isDark
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
            : status === "rejected" || status === "cancelled"
              ? isDark
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-rose-50 text-rose-700 border-rose-200"
              : isDark
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-amber-50 text-amber-700 border-amber-200";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${colors}`}
          >
            {row.original?.status || "Pending"}
          </span>
        );
      },
    },
    {
      header: "Amount",
      id: "Amount",
      accessorKey: "amount",
      cell: ({ row }: { row: any }) => (
        <span
          className={`font-semibold ${isDark ? "text-cyan-400" : "text-cyan-700"}`}
        >
          {row.original?.amount || "—"}
        </span>
      ),
    },
  ];

  type ColumnKey = "Buyer" | "Products" | "Status" | "Amount";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Buyer: true,
    Products: true,
    Status: true,
    Amount: true,
  });

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={sales}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
        isLoading={loading}
      />
    </div>
  );
};

export default CityTable;
