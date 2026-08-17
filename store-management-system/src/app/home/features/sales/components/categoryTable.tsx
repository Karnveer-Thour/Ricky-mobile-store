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
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-5">
          <Button name={"accepted"} className="bg-green-500" />
          <Button name={"pending"} className="bg-yellow-500" />
          <Button name={"rejected"} className="bg-red-500" />
        </div>
      ),
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
