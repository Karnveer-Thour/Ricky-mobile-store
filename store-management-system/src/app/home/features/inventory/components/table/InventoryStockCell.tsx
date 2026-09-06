import React from "react";
import { Check } from "lucide-react";
import cn from "classnames";
import { InventoryItem } from "./useInventoryData";

interface InventoryStockCellProps {
  item: InventoryItem;
  isDark: boolean;
  isEditing: boolean;
  editValue: string;
  isFlashed: boolean;
  onStartEdit: () => void;
  onEditChange: (val: string) => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
}

export default function InventoryStockCell({
  item,
  isDark,
  isEditing,
  editValue,
  isFlashed,
  onStartEdit,
  onEditChange,
  onCancelEdit,
  onSubmitEdit,
}: InventoryStockCellProps) {
  if (isEditing) {
    return (
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="number"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmitEdit();
            if (e.key === "Escape") onCancelEdit();
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
          type="button"
          onClick={onSubmitEdit}
          className="p-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          title="Save stock count"
        >
          <Check size={14} />
        </button>
      </div>
    );
  }

  const colors =
    item.originalProduct?.colors || item.originalProduct?.productColors || [];

  return (
    <div className="space-y-1">
      <div
        onDoubleClick={onStartEdit}
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
}
