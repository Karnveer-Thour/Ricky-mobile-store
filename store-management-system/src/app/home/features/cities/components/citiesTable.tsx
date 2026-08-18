"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Delete from "./Delete";
import ToggleButton from "@/components/togglebutton";
import { cityService } from "@/services/city.service";

const CityTable = ({ isDark = false }) => {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cityDeleting, setCityDeleting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState({
    id: "",
    Name: "",
  });

  const loadCities = async () => {
    setLoading(true);
    try {
      const res = await cityService.fetchCities();
      setCities(res || []);
    } catch (err) {
      console.warn("Failed to load cities:", err);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleDelete = (data: any) => {
    if (cityDeleting) {
      setCityDeleting(false);
    } else {
      setCityDeleting(true);
      setSelectedCity({
        id: data._id || data.id,
        Name: data.name,
      });
    }
  };

  const handleUpdate = (data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cityData", JSON.stringify(data));
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
      header: "District",
      id: "District",
      accessorKey: "district",
    },
    {
      header: "State",
      id: "State",
      accessorKey: "state",
    },
    {
      header: "Pincode",
      id: "Pincode",
      accessorKey: "pincode",
    },
    {
      header: "Active",
      id: "Active",
      cell: ({ row }: { row: any }) => (
        <div>
          <ToggleButton
            isDark={isDark}
            activeLabel="Accepting"
            inactiveLabel="Not Accepting"
            activeDefault={row.original.isAccepting ?? true}
            handler={(status: boolean) => {
              const cityId = row.original._id || row.original.id;
              cityService
                .toggleCityStatus(cityId, status)
                .then(() => loadCities());
            }}
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
            onClick={() => handleUpdate(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00cfff] hover:bg-[#00cfff]/10 transition-colors cursor-pointer"
            title="Edit City"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete City"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey =
    | "Name"
    | "District"
    | "State"
    | "Pincode"
    | "Active"
    | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Name: true,
    District: true,
    State: true,
    Pincode: true,
    Active: true,
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
    columnVisibility.District,
    columnVisibility.State,
    columnVisibility.Pincode,
    columnVisibility.Active,
  ]);

  return (
    <div className="w-full">
      {cityDeleting && (
        <Delete
          handleDelete={() => {
            setCityDeleting(false);
            loadCities();
          }}
          Id={selectedCity?.id}
          Name={selectedCity?.Name}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={cities}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default CityTable;
