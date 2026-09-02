"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { categoryService } from "@/services/category.service";
import { useDispatch } from "react-redux";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";

const CategoryTable = ({ isDark = false }: { isDark?: boolean }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.fetchCategories();
      setCategories(res || []);
    } catch (err) {
      console.warn("Failed to load categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = (data: any) => {
    const id = data._id || data.id;
    const name = data.name || "this Category";

    openGlobalConfirm(dispatch, {
      title: "Delete Product Category?",
      message: `Are you sure you want to delete category "${name}"? Existing products under this group may need reclassification.`,
      confirmText: "Yes, Delete Category",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await categoryService.deleteCategory(id);
          dispatch(SUCCESSALERT(`Category "${name}" deleted successfully`));
          loadCategories();
        } catch {
          dispatch(ERRORALERT("Failed to delete category"));
        }
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("categoryData", JSON.stringify(data));
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
      header: "Description",
      id: "Description",
      accessorKey: "description",
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleUpdate(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00cfff] hover:bg-[#00cfff]/10 transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete Category"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey = "Name" | "Description" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Name: true,
    Description: true,
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
  }, [columnVisibility.Name, columnVisibility.Description]);

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={categories}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
        isLoading={loading}
      />
    </div>
  );
};

export default CategoryTable;
