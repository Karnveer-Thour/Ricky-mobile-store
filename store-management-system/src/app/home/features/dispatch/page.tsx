"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { AlertCircle, MapPin, Check, RotateCcw } from "lucide-react";

interface DispatchCard {
  id: string;
  customer: string;
  phone: string;
  payment: string;
  lender?: string;
  installment?: number;
  landmark: string;
  items: string;
  status:
    | "pending_override"
    | "ready_to_pack"
    | "out_for_delivery"
    | "delivered"
    | "returned";
}

type ColumnStatus = DispatchCard["status"];

const STATUS_ORDER: ColumnStatus[] = [
  "pending_override",
  "ready_to_pack",
  "out_for_delivery",
  "delivered",
  "returned",
];

const COLUMNS: { status: ColumnStatus; label: string; color: string; accent: string }[] = [
  { status: "pending_override", label: "Pending Overrides", color: "text-red-400",    accent: "border-red-400/60 bg-red-500/10 shadow-[0_0_16px_rgba(239,68,68,0.25)]" },
  { status: "ready_to_pack",    label: "Ready to Pack",    color: "text-yellow-400", accent: "border-yellow-400/60 bg-yellow-500/10 shadow-[0_0_16px_rgba(234,179,8,0.25)]" },
  { status: "out_for_delivery", label: "Out for Delivery", color: "text-blue-400",   accent: "border-blue-400/60 bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.25)]" },
  { status: "delivered",        label: "Delivered",         color: "text-green-400",  accent: "border-green-400/60 bg-green-500/10 shadow-[0_0_16px_rgba(34,197,94,0.25)]" },
  { status: "returned",         label: "Returned",          color: "text-purple-400", accent: "border-purple-400/60 bg-purple-500/10 shadow-[0_0_16px_rgba(168,85,247,0.25)]" },
];

export default function DispatchBoardPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [cards, setCards] = useState<DispatchCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<DispatchCard | null>(null);
  const [flashCardId, setFlashCardId] = useState<string | null>(null);

  // Drag state
  const draggingId = useRef<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnStatus | null>(null);

  // Simulate real-time alerts arriving via WebSocket gateway
  useEffect(() => {
    const timer = setTimeout(() => {
      const newCard: DispatchCard = {
        id: "RMS-88395",
        customer: "Karan V.",
        phone: "+91 95555 44332",
        payment: "EMI HOMECREDIT",
        lender: "Home Credit",
        installment: 5499,
        landmark: "Khanna Court Compound",
        items: "Google Pixel 8 Pro ×1",
        status: "pending_override",
      };

      setCards((prev) => {
        // Prevent duplicate injection
        if (prev.some((c) => c.id === newCard.id)) return prev;
        return [newCard, ...prev];
      });

      // Highlight/Flash the new card
      setFlashCardId(newCard.id);
      setTimeout(() => {
        setFlashCardId(null);
      }, 4000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const moveCard = (id: string, newStatus: DispatchCard["status"]) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card) return prev;

      const currentIndex = STATUS_ORDER.indexOf(card.status);
      const newIndex = STATUS_ORDER.indexOf(newStatus);

      // Stop reverse order (only allow progression forward in the delivery lifecycle)
      if (newIndex <= currentIndex) return prev;

      return prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    });

    if (selectedCard && selectedCard.id === id) {
      setSelectedCard((prev) => {
        if (!prev) return null;
        const currentIndex = STATUS_ORDER.indexOf(prev.status);
        const newIndex = STATUS_ORDER.indexOf(newStatus);
        if (newIndex > currentIndex) {
          return { ...prev, status: newStatus };
        }
        return prev;
      });
    }
  };

  const getColCards = (status: DispatchCard["status"]) =>
    cards.filter((c) => c.status === status);

  const pendingCount = getColCards("pending_override").length;

  // ── Drag handlers ──────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggingId.current = id;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      const el = document.getElementById(`card-${id}`);
      if (el) el.style.opacity = "0.4";
    }, 0);
  };

  const handleDragEnd = (id: string) => {
    draggingId.current = null;
    setDragOverCol(null);
    const el = document.getElementById(`card-${id}`);
    if (el) el.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent, status: ColumnStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(status);
  };

  const handleDrop = (e: React.DragEvent, status: ColumnStatus) => {
    e.preventDefault();
    if (draggingId.current) moveCard(draggingId.current, status);
    setDragOverCol(null);
  };

  const handleDragLeave = () => setDragOverCol(null);

  return (
    <div className="page-container">
      {/* Page header — standardized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-medium mb-1 text-slate-500">
            Home &rsaquo; Dispatch
          </p>
          <h1
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Order Dispatch Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fulfillment stream. Move cards to advance delivery state.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold animate-pulse">
            <AlertCircle size={15} />
            {pendingCount} Pending Override{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const isOver = dragOverCol === col.status;
          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              onDragLeave={handleDragLeave}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                isOver
                  ? col.accent
                  : `border-transparent ${isDark ? "bg-gray-800/30" : "bg-gray-100"}`
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                {col.status === "pending_override" && pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ff2d55] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </div>
              <div className="space-y-3 min-h-[300px]">
                {getColCards(col.status).length === 0 && isOver && (
                  <div className="h-20 rounded-xl border-2 border-dashed border-current opacity-30 flex items-center justify-center text-xs text-slate-400">
                    Drop here
                  </div>
                )}
                {getColCards(col.status).map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    isDark={isDark}
                    isFlashed={flashCardId === card.id}
                    onClick={() => setSelectedCard(card)}
                    onMove={(status) => moveCard(card.id, status)}
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onDragEnd={() => handleDragEnd(card.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Side Panel */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-md h-screen p-6 shadow-2xl flex flex-col justify-between ${
              isDark
                ? "bg-gray-900 border-l border-gray-800 text-white"
                : "bg-white border-l border-gray-200 text-gray-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00cfff]">
                  Order Details
                </span>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedCard.customer}</h3>
                  <p className="text-sm text-gray-500">{selectedCard.phone}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
                >
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    Items
                  </p>
                  <p className="text-sm font-semibold">{selectedCard.items}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Payment Method
                    </span>
                    <span className="text-sm font-bold">
                      {selectedCard.payment}
                    </span>
                  </div>
                  {selectedCard.lender && (
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Lender Provider
                      </span>
                      <span className="text-sm font-bold">
                        {selectedCard.lender}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-1">
                    Landmark Affiliation
                  </span>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin size={14} className="text-red-400" />{" "}
                    {selectedCard.landmark}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-gray-500 block mb-1">
                    Current Status
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedCard.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  card: DispatchCard;
  isDark: boolean;
  isFlashed?: boolean;
  onClick: () => void;
  onMove: (status: DispatchCard["status"]) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function KanbanCard({
  card,
  isDark,
  isFlashed = false,
  onClick,
  onMove,
  onDragStart,
  onDragEnd,
}: CardProps) {
  return (
    <div
      id={`card-${card.id}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-150 relative select-none ${
        isFlashed
          ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
          : isDark
            ? "bg-gray-900 border-gray-800 hover:border-gray-700 text-white"
            : "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
      }`}
    >
      {/* Drag handle dots */}
      <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
          <circle cx="2" cy="2"  r="1.5"/>
          <circle cx="8" cy="2"  r="1.5"/>
          <circle cx="2" cy="7"  r="1.5"/>
          <circle cx="8" cy="7"  r="1.5"/>
          <circle cx="2" cy="12" r="1.5"/>
          <circle cx="8" cy="12" r="1.5"/>
        </svg>
      </div>

      <div className="flex items-start justify-between mb-2">
        <span
          className="text-[10px] font-bold text-gray-500"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {card.id}
        </span>
        {card.status === "pending_override" && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d55]" />
        )}
      </div>
      <p className="font-semibold text-sm">{card.customer}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{card.items}</p>

      {/* Quick Move Action buttons inside card */}
      <div
        className="mt-3 flex items-center justify-end gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {card.status === "pending_override" && (
          <button
            onClick={() => onMove("ready_to_pack")}
            className="px-2 py-1 bg-yellow-500 hover:bg-yellow-400 text-white rounded text-[10px] font-bold transition-colors"
          >
            Pack
          </button>
        )}
        {card.status === "ready_to_pack" && (
          <button
            onClick={() => onMove("out_for_delivery")}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded text-[10px] font-bold transition-colors"
          >
            Dispatch
          </button>
        )}
        {card.status === "out_for_delivery" && (
          <button
            onClick={() => onMove("delivered")}
            className="px-2 py-1 bg-green-500 hover:bg-green-400 text-white rounded text-[10px] font-bold transition-colors"
          >
            Deliver
          </button>
        )}
        {card.status === "delivered" && (
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 text-[10px] font-bold flex items-center gap-0.5">
              <Check size={10} /> Del
            </span>
            <button
              onClick={() => onMove("returned")}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={10} /> Return
            </button>
          </div>
        )}
        {card.status === "returned" && (
          <span className="text-purple-400 text-[10px] font-bold flex items-center gap-0.5">
            <RotateCcw size={10} /> Returned
          </span>
        )}
      </div>
    </div>
  );
}

