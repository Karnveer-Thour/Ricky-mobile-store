import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

interface InventoryStatusBadgeProps {
  stockCount: number;
}

export default function InventoryStatusBadge({
  stockCount,
}: InventoryStatusBadgeProps) {
  if (stockCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
        <ShieldAlert size={12} /> Out of Stock
      </span>
    );
  }

  if (stockCount <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
        <AlertTriangle size={12} /> Only {stockCount} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 size={12} /> In Stock
    </span>
  );
}
