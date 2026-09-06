"use client";
import React from "react";
import { Package, Shield } from "lucide-react";
import cn from "classnames";

interface ProductCoreInfoCardProps {
  sku: string;
  name: string;
  price: number;
  discount: number;
  sellingPrice: number;
  stock: number;
  status: string;
  warranty?: string;
  isDark?: boolean;
}

export default function ProductCoreInfoCard({
  sku,
  name,
  price,
  discount,
  sellingPrice,
  stock,
  status,
  warranty = "1 Year Official Brand Warranty",
  isDark = false,
}: ProductCoreInfoCardProps) {
  return (
    <div className="space-y-3 min-w-0">
      <div>
        <p
          className={cn(
            "text-xs font-mono font-bold uppercase tracking-wider",
            isDark ? "text-cyan-400/80" : "text-cyan-700",
          )}
        >
          {sku}
        </p>
        <h2
          className={cn(
            "text-lg sm:text-xl font-extrabold leading-tight mt-0.5 break-words",
            isDark ? "text-white" : "text-slate-900",
          )}
        >
          {name}
        </h2>
      </div>

      {/* Financial Summary */}
      <div
        className={cn(
          "grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl border min-w-0",
          isDark
            ? "bg-slate-900/70 border-slate-800"
            : "bg-white border-slate-200 shadow-2xs",
        )}
      >
        <div className="min-w-0">
          <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate">
            MRP
          </p>
          <p
            className={cn(
              "text-xs font-semibold truncate",
              isDark ? "text-slate-300" : "text-slate-700",
            )}
          >
            ₹{price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[9px] sm:text-[10px] uppercase font-bold truncate",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          >
            Discount
          </p>
          <p
            className={cn(
              "text-xs font-semibold truncate",
              isDark ? "text-emerald-400" : "text-emerald-600",
            )}
          >
            -₹{discount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[9px] sm:text-[10px] uppercase font-bold truncate",
              isDark ? "text-cyan-400" : "text-cyan-700",
            )}
          >
            Net Selling
          </p>
          <p
            className={cn(
              "text-xs sm:text-sm font-extrabold truncate",
              isDark ? "text-cyan-300" : "text-cyan-700",
            )}
          >
            ₹{sellingPrice.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Stock Level & Status */}
      <div
        className={cn(
          "flex items-center justify-between p-2.5 rounded-xl border",
          isDark
            ? "bg-slate-900/50 border-slate-800"
            : "bg-white border-slate-200 shadow-2xs",
        )}
      >
        <div className="flex items-center gap-2">
          <Package size={16} className="text-slate-400" />
          <p
            className={cn(
              "text-xs font-bold",
              isDark ? "text-white" : "text-slate-900",
            )}
          >
            {stock} Units in Inventory
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2.5 py-0.5 rounded-full border",
            status === "In Stock"
              ? isDark
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
              : status === "Low Stock"
                ? isDark
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-amber-50 text-amber-700 border-amber-200"
                : isDark
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-rose-50 text-rose-700 border-rose-200",
          )}
        >
          {status}
        </span>
      </div>

      {/* Warranty */}
      <div
        className={cn(
          "flex items-center gap-2 text-xs p-2.5 rounded-xl border",
          isDark
            ? "bg-slate-900/50 border-slate-800 text-slate-300"
            : "bg-white border-slate-200 text-slate-700 shadow-2xs",
        )}
      >
        <Shield
          size={16}
          className={cn("shrink-0", isDark ? "text-cyan-400" : "text-cyan-600")}
        />
        <span>{warranty}</span>
      </div>
    </div>
  );
}
