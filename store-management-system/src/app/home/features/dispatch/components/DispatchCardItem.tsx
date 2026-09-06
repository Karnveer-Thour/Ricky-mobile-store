import React from "react";
import { Check, RotateCcw } from "lucide-react";
import cn from "classnames";
import { DispatchCard } from "./types";

interface DispatchCardItemProps {
  card: DispatchCard;
  isDark: boolean;
  isFlashed?: boolean;
  onClick: () => void;
  onMove: (status: DispatchCard["status"]) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export default function DispatchCardItem({
  card,
  isDark,
  isFlashed = false,
  onClick,
  onMove,
  onDragStart,
  onDragEnd,
}: DispatchCardItemProps) {
  return (
    <div
      id={`card-${card.id}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-150 relative select-none ${
        isFlashed
          ? "border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse"
          : isDark
            ? "bg-slate-900 border-slate-800 hover:border-slate-700 text-white"
            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs"
      }`}
    >
      {/* Drag handle dots */}
      <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
          <circle cx="2" cy="2" r="1.5" />
          <circle cx="8" cy="2" r="1.5" />
          <circle cx="2" cy="7" r="1.5" />
          <circle cx="8" cy="7" r="1.5" />
          <circle cx="2" cy="12" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
        </svg>
      </div>

      <div className="flex items-start justify-between mb-2">
        <span
          className={cn(
            "text-[10px] font-bold",
            isDark ? "text-slate-500" : "text-slate-400",
          )}
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {card.id}
        </span>
        {card.status === "pending_override" && (
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        )}
      </div>
      <p className="font-semibold text-sm">{card.customer}</p>
      <p
        className={cn(
          "text-xs mt-0.5 truncate",
          isDark ? "text-slate-400" : "text-slate-500",
        )}
      >
        {card.items}
      </p>

      {/* Quick Move Action buttons inside card */}
      <div
        className="mt-3 flex items-center justify-end gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {card.status === "pending_override" && (
          <button
            onClick={() => onMove("ready_to_pack")}
            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
          >
            Pack
          </button>
        )}
        {card.status === "ready_to_pack" && (
          <button
            onClick={() => onMove("out_for_delivery")}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
          >
            Dispatch
          </button>
        )}
        {card.status === "out_for_delivery" && (
          <button
            onClick={() => onMove("delivered")}
            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
          >
            Deliver
          </button>
        )}
        {card.status === "delivered" && (
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
              <Check size={10} /> Del
            </span>
            <button
              onClick={() => onMove("returned")}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={10} /> Return
            </button>
          </div>
        )}
        {card.status === "returned" && (
          <span className="text-purple-600 text-[10px] font-bold flex items-center gap-0.5">
            <RotateCcw size={10} /> Returned
          </span>
        )}
      </div>
    </div>
  );
}
