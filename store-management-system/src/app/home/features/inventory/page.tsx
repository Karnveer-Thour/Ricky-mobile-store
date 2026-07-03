"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { Search, RotateCw, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";

interface InventoryItem {
  id: number;
  device_model: string;
  sku: string;
  price: number;
  stock_count: number;
  image: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1, device_model: "iPhone 15 Pro Max", sku: "IPH15PM-256", price: 129900, stock_count: 50, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop&auto=format" },
  { id: 2, device_model: "Samsung Galaxy S24 Ultra", sku: "SAMS24U-256", price: 119999, stock_count: 35, image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=100&h=100&fit=crop&auto=format" },
  { id: 3, device_model: "OnePlus 12", sku: "OP12-256", price: 59999, stock_count: 0, image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=100&h=100&fit=crop&auto=format" },
  { id: 4, device_model: "Google Pixel 8 Pro", sku: "PIX8P-128", price: 98999, stock_count: 2, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop&auto=format" },
  { id: 5, device_model: "Nothing Phone (2)", sku: "NOTH2-256", price: 41999, stock_count: 70, image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=100&h=100&fit=crop&auto=format" },
  { id: 6, device_model: "Xiaomi 14 Ultra", sku: "XIA14U-512", price: 92999, stock_count: 3, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&auto=format" },
];

export default function InventoryPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [flashSuccessId, setFlashSuccessId] = useState<number | null>(null);

  const filtered = inventory.filter(
    (item) =>
      item.device_model.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleDoubleClick = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.stock_count.toString());
  };

  const handleStockUpdateSubmit = (id: number) => {
    const val = parseInt(editValue);
    if (isNaN(val) || val < 0) {
      alert("Please enter a valid stock count.");
      return;
    }

    // Optimistic Update
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock_count: val } : item))
    );
    setEditingId(null);

    // Flash success indicator
    setFlashSuccessId(id);
    setTimeout(() => {
      setFlashSuccessId(null);
    }, 1500);
  };

  const handleSyncOffline = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Offline register synchronized successfully!");
    }, 2000);
  };

  return (
    <div className="w-[95%] mx-auto mt-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex max-sm:flex-col items-center gap-4 border-b border-gray-700 pb-4">
        <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}>
          Inventory Data Grid
        </h1>
        <div className="flex-grow sm:text-right">
          <Button
            name={syncing ? "Syncing..." : "Sync Offline Register"}
            handler={handleSyncOffline}
            className="flex items-center gap-2"
          />
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search model name or SKU..."
            className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none transition-all ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-[#00cfff]"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500"
            }`}
          />
        </div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          Double-click Stock cells to edit
        </div>
      </div>

      {/* Grid Container */}
      <div className={`border rounded-2xl overflow-hidden shadow-md ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={isDark ? "bg-gray-800/50 text-gray-400" : "bg-gray-100 text-gray-600"}>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Product</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">SKU</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Price</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider">Stock Count</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className={isDark ? "divide-y divide-gray-800" : "divide-y divide-gray-200"}>
            {filtered.map((item) => {
              const isOutOfStock = item.stock_count === 0;
              const isLowStock = item.stock_count > 0 && item.stock_count <= 3;
              const isFlashed = flashSuccessId === item.id;

              return (
                <tr
                  key={item.id}
                  className={`transition-colors relative ${
                    isOutOfStock
                      ? isDark
                        ? "bg-[#D97706]/10 text-white border-l-4 border-[#D97706]"
                        : "bg-[#FFFBEB] text-gray-800 border-l-4 border-[#D97706]"
                      : isLowStock
                      ? "border-l-4 border-[#ff2d55]"
                      : ""
                  } ${isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50"}`}
                >
                  {/* Model & Image */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.device_model}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-700"
                    />
                    <div>
                      <p className="font-semibold text-sm">{item.device_model}</p>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="p-4 text-sm text-gray-500">{item.sku}</td>

                  {/* Price */}
                  <td className="p-4 text-sm font-semibold">
                    ₹{item.price.toLocaleString("en-IN")}
                  </td>

                  {/* Stock Count (Double-click Editable) */}
                  <td
                    className={`p-4 text-sm font-bold cursor-pointer transition-all ${
                      isFlashed ? "bg-green-500/20 text-green-400" : ""
                    }`}
                    onDoubleClick={() => handleDoubleClick(item)}
                  >
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleStockUpdateSubmit(item.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className={`w-20 px-2 py-1 rounded text-center border text-sm ${
                            isDark
                              ? "bg-gray-900 border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-800"
                          }`}
                          autoFocus
                        />
                        <button
                          onClick={() => handleStockUpdateSubmit(item.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span>{item.stock_count}</span>
                    )}
                  </td>

                  {/* Status Indicator */}
                  <td className="p-4 text-right">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D97706]/20 text-[#D97706]">
                        <ShieldAlert size={12} /> Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ff2d55]/20 text-[#ff2d55]">
                        <AlertTriangle size={12} /> Only {item.stock_count} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                        <CheckCircle2 size={12} /> In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
