"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon, Smartphone, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import Delete from "./Delete";
import ProductViewModal from "./productViewModal";
import { usePathname, useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import cn from "classnames";

const ProductTable = ({
  isDark = false,
  refreshKey = 0,
}: {
  isDark?: boolean;
  refreshKey?: number;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productDeleting, setProductDeleting] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  const pathName = usePathname();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    Name: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.fetchProducts(1, 100);
      const mapped = (res || []).map((p: any) => ({
        ...p,
        name: p.productName || p.name,
        category:
          p.category?.name ||
          p.categoryName ||
          (typeof p.category === "string" ? p.category : "—"),
        categoryId: p.categoryId || p.category?.id || p.category?._id,
        price: Number(p.price || 0),
        quantity: p.stockCount ?? p.quantity ?? p.quantiy ?? 0,
        imageUrl: p.imageUrl || p.image || "",
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
  }, [refreshKey]);

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
      header: "Image",
      id: "Image",
      accessorKey: "imageUrl",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        const img = item.imageUrl || item.image;
        return (
          <div className="flex items-center py-0.5">
            {img ? (
              <img
                src={img}
                alt={item.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/8 shadow-sm bg-slate-800 hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border",
                  isDark
                    ? "bg-slate-800/80 border-slate-700/60 text-slate-500"
                    : "bg-slate-100 border-slate-200 text-slate-400",
                )}
              >
                <Smartphone size={18} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Name",
      id: "Name",
      accessorKey: "name",
      cell: ({ row }: { row: any }) => (
        <span
          className={cn(
            "font-medium text-sm",
            isDark ? "text-slate-200" : "text-slate-800",
          )}
        >
          {row.original.name}
        </span>
      ),
    },
    {
      header: "Category",
      id: "Category",
      accessorKey: "category",
      cell: ({ row }: { row: any }) => {
        const cat = row.original.category;
        return (
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-lg border",
              isDark
                ? "bg-slate-800/60 border-slate-700/50 text-cyan-400"
                : "bg-slate-100 border-slate-200 text-slate-700",
            )}
          >
            {cat || "—"}
          </span>
        );
      },
    },
    {
      header: "Price",
      id: "Price",
      accessorKey: "price",
      cell: ({ row }: { row: any }) => (
        <span className="font-semibold text-sm text-cyan-400">
          ₹{Number(row.original.price || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Quantity",
      id: "Quantity",
      accessorKey: "quantity",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        const colors = item.colors || item.productColors || [];

        return (
          <div className="space-y-1 py-0.5">
            <span
              className={cn(
                "font-semibold text-xs",
                isDark ? "text-slate-200" : "text-slate-800",
              )}
            >
              {item.quantity} in stock
            </span>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-1 max-w-[200px]">
                {colors.map((c: any, i: number) => (
                  <span
                    key={i}
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded font-mono border",
                      Number(c.quantity) === 0
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20 line-through opacity-60"
                        : isDark
                          ? "bg-slate-800 text-slate-300 border-slate-700/60"
                          : "bg-slate-100 text-slate-700 border-slate-200",
                    )}
                  >
                    {c.name || c.colorName}: {c.quantity}
                  </span>
                ))}
              </div>
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
            onClick={() => setViewingProduct(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
            title="View Product Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleUpdate(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00cfff] hover:bg-[#00cfff]/10 transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete Product"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey =
    | "Image"
    | "Name"
    | "Category"
    | "Price"
    | "Quantity"
    | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    Image: true,
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
    columnVisibility.Image,
    columnVisibility.Name,
    columnVisibility.Category,
    columnVisibility.Price,
    columnVisibility.Quantity,
  ]);

  return (
    <div className="w-full">
      {viewingProduct && (
        <ProductViewModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onEdit={(prod) => {
            setViewingProduct(null);
            handleUpdate(prod);
          }}
          isDark={isDark}
        />
      )}
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
