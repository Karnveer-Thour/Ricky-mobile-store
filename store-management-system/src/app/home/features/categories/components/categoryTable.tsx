"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon, Palette, Sliders } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { categoryService } from "@/services/category.service";
import { useDispatch } from "react-redux";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";
import cn from "classnames";

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
      header: "Capabilities",
      id: "Capabilities",
      cell: ({ row }: { row: any }) => {
        const hasColors = row.original?.hasColors !== false;
        const hasVariants = row.original?.hasVariants === true;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border",
                hasColors
                  ? isDark
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-cyan-50 text-cyan-700 border-cyan-200"
                  : isDark
                    ? "bg-slate-800/60 text-slate-400 border-slate-700"
                    : "bg-slate-100 text-slate-500 border-slate-200",
              )}
            >
              <Palette size={12} />
              {hasColors ? "Colors" : "No Colors"}
            </span>

            {hasVariants && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border",
                  isDark
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-blue-50 text-blue-700 border-blue-200",
                )}
              >
                <Sliders size={12} />
                Variants
              </span>
            )}
          </div>
        );
      },
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

  type ColumnKey = "Name" | "Description" | "Capabilities" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Name: true,
    Description: true,
    Capabilities: true,
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
