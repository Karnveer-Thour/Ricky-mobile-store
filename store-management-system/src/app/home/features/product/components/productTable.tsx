"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Delete from "./Delete";
import { usePathname, useRouter } from "next/navigation";
import { productService } from "@/services/product.service";

const ProductTable = ({ isDark = false }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productDeleting, setProductDeleting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    Name: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.fetchProducts();
      const mapped = (res || []).map((p: any) => ({
        ...p,
        name: p.productName || p.name,
        quantity: p.stockCount ?? p.quantity ?? 0,
      }));
      setProducts(mapped);
    } catch (err) {
      console.warn("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (data: any) => {
    if (productDeleting) {
      setProductDeleting(false);
    } else {
      setProductDeleting(true);
      setSelectedProduct({
        id: data._id || data.id,
        Name: data.name || data.productName,
      });
    }
  };

  const handleUpdate = (data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("productData", JSON.stringify(data));
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
      header: "Category",
      id: "Category",
      accessorKey: "category",
    },
    {
      header: "Price",
      id: "Price",
      accessorKey: "price",
    },
    {
      header: "Quantity",
      id: "Quantity",
      accessorKey: "quantity",
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

  type ColumnKey = "Name" | "Category" | "Price" | "Quantity" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Name: true,
    Category: true,
    Price: true,
    Quantity: true,
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
    columnVisibility.Category,
    columnVisibility.Price,
    columnVisibility.Quantity,
  ]);

  return (
    <div className="w-full">
      {productDeleting && (
        <Delete
          handleDelete={() => {
            setProductDeleting(false);
            loadProducts();
          }}
          Id={selectedProduct?.id}
          Name={selectedProduct?.Name}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={products}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
};

export default ProductTable;
