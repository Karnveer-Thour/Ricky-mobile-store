"use client";
import Table from "@/components/table/table";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";

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
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : status === "rejected" || status === "cancelled"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20";

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
    <div className="w-[95%] mr-10 sm:ms-7">
      <Table
        columns={columns}
        data={sales}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default CityTable;
