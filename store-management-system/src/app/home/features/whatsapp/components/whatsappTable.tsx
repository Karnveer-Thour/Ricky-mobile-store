"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Delete from "./delete";
import ToggleButton from "@/components/togglebutton";

const WhatsappTable = ({ isDark = false }) => {
  const [whatsappGroups, setWhatsappGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customerDeleting, setCustomerDeleting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [customerData, setCustomerData] = useState({
    id: "",
    Name: "",
  });

  const loadGroups = async () => {
    setLoading(true);
    try {
      // Fetch dynamic groups or fall back to empty list from API
      setWhatsappGroups([]);
    } catch (err) {
      console.warn("Failed to load WhatsApp groups:", err);
      setWhatsappGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleDelete = (data: any) => {
    if (customerDeleting) {
      setCustomerDeleting(false);
    } else if (!customerDeleting) {
      setCustomerDeleting(true);
      setCustomerData({
        id: data._id,
        Name: data.name || data.groupName,
      });
    }
  };

  const handleUpdate = (data: any) => {
    if (pathName === "/customers") {
      const Data = {
        id: data._id,
        Name: data.name,
      };
      setCustomerData(Data);
      if (typeof window !== "undefined") {
        localStorage.setItem("customerData", JSON.stringify(Data));
      }
    } else if (pathName === "/customers/update") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("customerData");
      }
    }
  };

  const columns = [
    {
      header: "Group name",
      id: "GroupName",
      accessorKey: "groupName",
    },
    {
      header: "Status",
      id: "Status",
      cell: ({ row }: { row: any }) => (
        <div>
          <ToggleButton
            isDark={isDark}
            activeLabel="Active"
            inactiveLabel="Inactive"
            handler={() => {}}
          />
        </div>
      ),
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              handleUpdate(row.original);
              router.push(`${pathName}/update`);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00cfff] hover:bg-[#00cfff]/10 transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey = "GroupName" | "Status" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    GroupName: true,
    Status: true,
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
  }, [columnVisibility.GroupName, columnVisibility.Status]);

  return (
    <div className="w-[95%] mr-10 sm:ms-7">
      {customerDeleting && (
        <Delete
          handleDelete={() => {
            handleDelete(customerData);
            loadGroups();
          }}
          Id={customerData?.id}
          Name={customerData?.Name}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={whatsappGroups}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default WhatsappTable;
