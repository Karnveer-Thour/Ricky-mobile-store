"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ToggleButton from "@/components/togglebutton";
import { cityService } from "@/services/city.service";
import { useDispatch } from "react-redux";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";

const CityTable = ({ isDark = false }: { isDark?: boolean }) => {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

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
    const id = data._id || data.id;
    const name = data.name || "this City";

    openGlobalConfirm(dispatch, {
      title: "Remove Serviceable City?",
      message: `Are you sure you want to remove "${name}" from accepted delivery zones? Orders to this pincode will be paused.`,
      confirmText: "Yes, Remove City",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await cityService.deleteCity(id);
          dispatch(SUCCESSALERT(`City "${name}" removed successfully`));
          loadCities();
        } catch {
          dispatch(ERRORALERT("Failed to remove city"));
        }
      },
    });
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

  const colName = columnVisibility.Name;
  const colDistrict = columnVisibility.District;
  const colState = columnVisibility.State;
  const colPincode = columnVisibility.Pincode;
  const colActive = columnVisibility.Active;

  useEffect(() => {
    const isAction =
      colName || colDistrict || colState || colPincode || colActive;
    setColumnVisibility((prev) => ({ ...prev, Actions: isAction }));
  }, [colName, colDistrict, colState, colPincode, colActive]);

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={cities}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
        isLoading={loading}
      />
    </div>
  );
};

export default CityTable;
