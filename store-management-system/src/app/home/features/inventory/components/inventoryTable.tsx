"use client";

import React, { useState } from "react";
import Table from "@/components/table/table";
import { Eye } from "lucide-react";
import Image from "next/image";
import ProductViewModal from "../../product/components/productViewModal";
import cn from "classnames";
import { useInventoryData, InventoryItem } from "./table/useInventoryData";
import InventoryStockCell from "./table/InventoryStockCell";
import InventoryStatusBadge from "./table/InventoryStatusBadge";

export type { InventoryItem };

interface InventoryTableProps {
  isDark?: boolean;
  onSyncRegister?: () => void;
  syncTrigger?: number;
}

export default function InventoryTable({
  isDark = false,
  syncTrigger = 0,
}: InventoryTableProps) {
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

  const {
    inventory,
    loading,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
    flashSuccessId,
    handleStockUpdate,
  } = useInventoryData(syncTrigger);

  const columns = [
    {
      header: "Product",
      id: "Product",
      accessorKey: "device_model",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3 py-1">
            <Image
              src={item.image}
              alt={item.device_model}
              width={40}
              height={40}
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
      cell: ({ row }: { row: any }) => (
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
      ),
    },
    {
      header: "Price",
      id: "Price",
      accessorKey: "price",
      cell: ({ row }: { row: any }) => (
        <span className="font-semibold text-sm text-cyan-400">
          ₹{Number(row.original.price).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Stock Count",
      id: "Stock Count",
      accessorKey: "stock_count",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        return (
          <InventoryStockCell
            item={item}
            isDark={isDark}
            isEditing={editingId === item.id}
            editValue={editValue}
            isFlashed={flashSuccessId === item.id}
            onStartEdit={() => {
              setEditingId(item.id);
              setEditValue(item.stock_count.toString());
            }}
            onEditChange={setEditValue}
            onCancelEdit={() => setEditingId(null)}
            onSubmitEdit={() => handleStockUpdate(item, editValue)}
          />
        );
      },
    },
    {
      header: "Status",
      id: "Status",
      cell: ({ row }: { row: any }) => (
        <InventoryStatusBadge stockCount={row.original.stock_count} />
      ),
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
        isLoading={loading}
      />
    </div>
  );
}
