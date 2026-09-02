"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { customerService } from "@/services/customer.service";
import { useDispatch } from "react-redux";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";

const CustomerTable = ({ isDark = false }: { isDark?: boolean }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

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
    const id = data._id || data.id;
    const name = data.name || data.email || "this Customer";

    openGlobalConfirm(dispatch, {
      title: "Delete Customer Record?",
      message: `Are you sure you want to delete customer "${name}"? Order history and EMI records associated with this profile will be archived.`,
      confirmText: "Yes, Delete Customer",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await customerService.deleteCustomer(id);
          dispatch(SUCCESSALERT(`Customer "${name}" deleted successfully`));
          loadCustomers();
        } catch {
          dispatch(ERRORALERT("Failed to delete customer"));
        }
      },
    });
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
      accessorKey: "phone",
      cell: ({ row }: { row: any }) => (
        <span>{row.original.phone || row.original.mobile || "—"}</span>
      ),
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleUpdate(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00cfff] hover:bg-[#00cfff]/10 transition-colors cursor-pointer"
            title="Edit Customer"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete Customer"
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
      <Table
        columns={columns}
        data={customers}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
        isLoading={loading}
      />
    </div>
  );
};

export default CustomerTable;
