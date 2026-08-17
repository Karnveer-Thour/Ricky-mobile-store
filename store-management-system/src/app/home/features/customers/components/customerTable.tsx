"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Delete from "./delete";
import { customerService } from "@/services/customer.service";

const CustomerTable = ({ isDark = false }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customerDeleting, setCustomerDeleting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: "",
    Name: "",
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.fetchCustomers();
      setCustomers(res || []);
    } catch (err) {
      console.warn("Failed to load customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = (data: any) => {
    if (customerDeleting) {
      setCustomerDeleting(false);
    } else {
      setCustomerDeleting(true);
      setSelectedCustomer({
        id: data._id || data.id,
        Name: data.name || "Customer",
      });
    }
  };

  const handleUpdate = (data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("customerData", JSON.stringify(data));
    }
    router.push(`${pathName}/update`);
  };

  const columns = [
    {
      header: "Name",
      id: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      id: "Email",
      accessorKey: "email",
    },
    {
      header: "Mobile Number",
      id: "Mobile Number",
      accessorKey: "mobile",
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(row.original)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 cursor-pointer"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey = "Name" | "Email" | "Mobile Number" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Name: true,
    Email: true,
    "Mobile Number": true,
    Actions: true,
  });

  useEffect(() => {
    let isAction = false;
    for (let key in columnVisibility) {
      if (key === "Actions") continue;
      if (columnVisibility[key as ColumnKey] === true) {
        isAction = true;
        break;
      }
    }
    setColumnVisibility((prev) => ({ ...prev, Actions: isAction }));
  }, [
    columnVisibility.Name,
    columnVisibility.Email,
    columnVisibility["Mobile Number"],
  ]);

  return (
    <div className="w-full">
      {customerDeleting && (
        <Delete
          handleDelete={() => {
            setCustomerDeleting(false);
            loadCustomers();
          }}
          Id={selectedCustomer?.id}
          Name={selectedCustomer?.Name}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={customers}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default CustomerTable;
