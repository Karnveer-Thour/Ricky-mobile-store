"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Delete from "./Delete";
import { categoryService } from "@/services/category.service";

const CategoryTable = ({ isDark = false }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryDeleting, setCategoryDeleting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    Name: "",
  });

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
    if (categoryDeleting) {
      setCategoryDeleting(false);
    } else {
      setCategoryDeleting(true);
      setSelectedCategory({
        id: data._id || data.id,
        Name: data.name,
      });
    }
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
      {categoryDeleting && (
        <Delete
          handleDelete={() => {
            setCategoryDeleting(false);
            loadCategories();
          }}
          Id={selectedCategory?.id}
          Name={selectedCategory?.Name}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={categories}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default CategoryTable;
