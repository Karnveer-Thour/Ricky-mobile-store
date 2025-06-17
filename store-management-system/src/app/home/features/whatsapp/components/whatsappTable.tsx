"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Delete from "./delete";
import ToggleButton from "@/components/togglebutton";

const CityTable = ({ isDark = false }) => {
  const [customerDeleting, setCustomerDeleting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [customerData, setCustomerData] = useState({
    id: "",
    Name: "",
  });

  const handleDelete = (data: any) => {
    if (customerDeleting) {
      setCustomerDeleting(false);
    } else if (!customerDeleting) {
      setCustomerDeleting(true);
      setCustomerData({
        id: data._id,
        Name: data.name,
      });
    }
  };

  const handleUpdate = (data: any) => {
    if (location.pathname === "/customers") {
      const Data = {
        id: data._id,
        Name: data.name,
      };
      setCustomerData(Data);
      localStorage.setItem("customerData", JSON.stringify(Data));
    } else if (location.pathname === "/customers/update") {
      localStorage.removeItem("customerData");
    }
  };

  // Define table columns

  const columns = [
    {
      header: "Group name",
      id: "GroupName",
      accessorKey: "groupName",
    },
    {
      header: "Status",
      id: "Status",
      cell: () => (
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
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(router.push(`${pathName}/update`))}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            <Edit />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey =
    | "GroupName"
    | "Status"
    | "Actions";
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
  }, [
    columnVisibility.GroupName,
    columnVisibility.Status,
  ]);

  return (
    <div className="w-[95%] mr-10 sm:ms-7">
      {customerDeleting && (
        <Delete
          handleDelete={() => handleDelete(customerData)}
          Id={customerData?.id}
          Name={customerData?.Name}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={[
          {
            _id: 1,
            groupName:"Sales 2025"
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
