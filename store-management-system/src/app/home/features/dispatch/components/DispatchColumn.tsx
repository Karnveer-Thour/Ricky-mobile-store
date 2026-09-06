import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ColumnDefinition, ColumnStatus, DispatchCard } from "./types";
import DispatchCardItem from "./DispatchCardItem";

interface DispatchColumnProps {
  col: ColumnDefinition;
  isDark: boolean;
  isOver: boolean;
  allCards: DispatchCard[];
  pagedCards: DispatchCard[];
  currentPage: number;
  totalPages: number;
  flashCardId: string | null;
  onDragOver: (e: React.DragEvent, status: ColumnStatus) => void;
  onDrop: (e: React.DragEvent, status: ColumnStatus) => void;
  onDragLeave: () => void;
  onPageChange: (status: ColumnStatus, page: number) => void;
  onCardClick: (card: DispatchCard) => void;
  onMoveCard: (id: string, newStatus: DispatchCard["status"]) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (id: string) => void;
}

export default function DispatchColumn({
  col,
  isDark,
  isOver,
  allCards,
  pagedCards,
  currentPage,
  totalPages,
  flashCardId,
  onDragOver,
  onDrop,
  onDragLeave,
  onPageChange,
  onCardClick,
  onMoveCard,
  onDragStart,
  onDragEnd,
}: DispatchColumnProps) {
  return (
    <div
      onDragOver={(e) => onDragOver(e, col.status)}
      onDrop={(e) => onDrop(e, col.status)}
      onDragLeave={onDragLeave}
      className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
        isOver
          ? col.accent
          : isDark
            ? "bg-slate-900/50 border-slate-800"
            : "bg-slate-50/90 border-slate-200 shadow-xs"
      }`}
    >
      <div>
        {/* Column Header with Count & Inline Column Pagination */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-xs uppercase tracking-wider truncate ${
                isDark ? col.darkColor : col.lightColor
              }`}
            >
              {col.label}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isDark
                  ? "bg-slate-800 text-slate-300 border border-slate-700"
                  : "bg-white text-slate-700 border border-slate-300 shadow-2xs"
              }`}
            >
              {allCards.length}
            </span>
          </div>

          {/* Column-level Page indicator & Prev/Next */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(col.status, currentPage - 1)}
                disabled={currentPage <= 1}
                className={`p-1 rounded-md transition-all ${
                  currentPage <= 1
                    ? "opacity-30 cursor-not-allowed text-slate-400"
                    : isDark
                      ? "hover:bg-slate-800 text-slate-200"
                      : "hover:bg-white text-slate-700 shadow-2xs"
                }`}
                title="Previous page"
              >
                <ChevronLeft size={13} />
              </button>
              <span
                className={`text-[10px] font-bold ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => onPageChange(col.status, currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`p-1 rounded-md transition-all ${
                  currentPage >= totalPages
                    ? "opacity-30 cursor-not-allowed text-slate-400"
                    : isDark
                      ? "hover:bg-slate-800 text-slate-200"
                      : "hover:bg-white text-slate-700 shadow-2xs"
                }`}
                title="Next page"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Card List in column */}
        <div className="space-y-3 min-h-[140px]">
          {pagedCards.length === 0 ? (
            <div
              className={`h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-xl ${
                isDark
                  ? "border-slate-800/80 text-slate-600"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              <span className="text-[11px] font-medium">No orders in lane</span>
            </div>
          ) : (
            pagedCards.map((card) => (
              <DispatchCardItem
                key={card.id}
                card={card}
                isDark={isDark}
                isFlashed={flashCardId === card.id}
                onClick={() => onCardClick(card)}
                onMove={(newStatus) => onMoveCard(card.id, newStatus)}
                onDragStart={(e) => onDragStart(e, card.id)}
                onDragEnd={() => onDragEnd(card.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
