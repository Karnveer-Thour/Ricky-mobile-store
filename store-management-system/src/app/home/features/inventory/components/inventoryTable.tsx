"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/table/table";
import { productService } from "@/services/product.service";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Check,
  Eye,
} from "lucide-react";
import ProductViewModal from "../../product/components/productViewModal";
import Link from "next/link";
import cn from "classnames";

interface InventoryItem {
  id: string | number;
  device_model: string;
  sku: string;
  price: number;
  stock_count: number;
  image: string;
  originalProduct?: any;
}

interface InventoryTableProps {
  isDark?: boolean;
  onSyncRegister?: () => void;
  syncTrigger?: number;
}

export default function InventoryTable({
  isDark = false,
  syncTrigger = 0,
}: InventoryTableProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [flashSuccessId, setFlashSuccessId] = useState<string | number | null>(
    null,
  );
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    Product: true,
    SKU: true,
    Price: true,
    "Stock Count": true,
    Status: true,
    Actions: true,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const rawProducts = await productService.fetchProducts(1, 100);
      if (Array.isArray(rawProducts)) {
        const mapped: InventoryItem[] = rawProducts.map(
          (p: any, idx: number) => {
            const modelName = p.name || p.productName || "Unnamed Product";
            const skuCode =
              p.sku ||
              `RMS-${modelName
                .replace(/[^A-Za-z0-9]/g, "")
                .slice(0, 5)
                .toUpperCase()}-${String(p.id || idx + 1).slice(-4)}`;
            return {
              id: p.id || p._id || idx + 1,
              device_model: modelName,
              sku: skuCode,
              price: Number(p.price || 0),
              stock_count: Number(p.quantity ?? p.quantiy ?? p.stockCount ?? 0),
              image:
                p.image ||
                p.imageUrl ||
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop&auto=format",
              originalProduct: p,
            };
          },
        );
        setInventory(mapped);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [syncTrigger]);

  const handleDoubleClick = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.stock_count.toString());
  };

  const handleStockUpdateSubmit = async (item: InventoryItem) => {
    const val = parseInt(editValue);
    if (isNaN(val) || val < 0) {
      alert("Please enter a valid stock count.");
      return;
    }

    // Optimistic Update
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stock_count: val } : i)),
    );
    setEditingId(null);

    // Call API to persist to backend SQLite
    try {
      await productService.updateProduct(item.id, {
        ...(item.originalProduct || {}),
        quantity: val,
        quantiy: val,
        stockCount: val,
      });

      // Flash success indicator
      setFlashSuccessId(item.id);
      setTimeout(() => {
        setFlashSuccessId(null);
      }, 1500);
    } catch (err) {
      console.warn("Failed to persist stock update to server:", err);
    }
  };

  const columns = [
    {
      header: "Product",
      id: "Product",
      accessorKey: "device_model",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3 py-1">
            <img
              src={item.image}
              alt={item.device_model}
              className="w-10 h-10 rounded-xl object-cover bg-slate-700/40 shrink-0 border border-white/5"
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "font-medium text-sm truncate",
                  isDark ? "text-slate-200" : "text-slate-800",
                )}
              >
                {item.device_model}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "SKU",
      id: "SKU",
      accessorKey: "sku",
      cell: ({ row }: { row: any }) => {
        return (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-lg border",
              isDark
                ? "bg-slate-800/80 border-slate-700/60 text-slate-400 font-mono"
                : "bg-slate-100 border-slate-200 text-slate-600 font-mono",
            )}
          >
            {row.original.sku}
          </span>
        );
      },
    },
    {
      header: "Price",
      id: "Price",
      accessorKey: "price",
      cell: ({ row }: { row: any }) => {
        return (
          <span className="font-semibold text-sm text-cyan-400">
            ₹{Number(row.original.price).toLocaleString("en-IN")}
          </span>
        );
      },
    },
    {
      header: "Stock Count",
      id: "Stock Count",
      accessorKey: "stock_count",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        const isEditing = editingId === item.id;
        const isFlashed = flashSuccessId === item.id;

        if (isEditing) {
          return (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStockUpdateSubmit(item);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className={cn(
                  "w-18 px-2 py-1 rounded-lg text-center border text-xs font-bold focus:outline-none focus:border-cyan-400",
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-900",
                )}
                autoFocus
              />
              <button
                onClick={() => handleStockUpdateSubmit(item)}
                className="p-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                title="Save stock count"
              >
                <Check size={14} />
              </button>
            </div>
          );
        }

        const colors =
          item.originalProduct?.colors ||
          item.originalProduct?.productColors ||
          [];

        return (
          <div className="space-y-1">
            <div
              onDoubleClick={() => handleDoubleClick(item)}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border",
                isFlashed
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 scale-105"
                  : isDark
                    ? "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400"
                    : "bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-400",
              )}
              title="Double-click to edit stock count"
            >
              <span>{item.stock_count} units</span>
            </div>
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
                          ? "bg-slate-800/80 text-slate-400 border-slate-700/50"
                          : "bg-slate-100 text-slate-600 border-slate-200",
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
      header: "Status",
      id: "Status",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        const isOutOfStock = item.stock_count === 0;
        const isLowStock = item.stock_count > 0 && item.stock_count <= 3;

        if (isOutOfStock) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <ShieldAlert size={12} /> Out of Stock
            </span>
          );
        }

        if (isLowStock) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
              <AlertTriangle size={12} /> Only {item.stock_count} left
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} /> In Stock
          </span>
        );
      },
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setViewingProduct(item.originalProduct || item)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
              title="Inspect Product & Stock Details"
            >
              <Eye size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw size={28} className="animate-spin text-cyan-400 mb-3" />
        <p className="text-sm text-slate-400">
          Loading live product inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewingProduct && (
        <ProductViewModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          isDark={isDark}
        />
      )}
      <Table
        columns={columns}
        data={inventory}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
      />
    </div>
  );
}
