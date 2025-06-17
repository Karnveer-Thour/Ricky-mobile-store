"use client";
import Table from "@/components/table/table";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";

const CityTable = ({ isDark = false }) => {
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
      cell: () => <div className="flex gap-5">
        <Button name={"accepted"} className="bg-green-500"/>
        <Button name={"prending"} className="bg-yellow-500"/>
        <Button name={"rejected"} className="bg-red-500"/>
      </div>,
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
        data={[
          {
            _id: 1,
            buyer: "Karan",
            products: "Redmi note 14",
            amount: 14000,
          },
        ]}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default CityTable;
