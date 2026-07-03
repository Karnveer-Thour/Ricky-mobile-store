"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { AlertCircle, User, MapPin, Check, Plus } from "lucide-react";

interface DispatchCard {
  id: string;
  customer: string;
  phone: string;
  payment: string;
  lender?: string;
  installment?: number;
  landmark: string;
  items: string;
  status: "pending_override" | "ready_to_pack" | "out_for_delivery" | "delivered";
}

const INITIAL_CARDS: DispatchCard[] = [
  { id: "RMS-88392", customer: "Aarav Sharma", phone: "+91 98765 43210", payment: "EMI BAJAJ", lender: "Bajaj Finserv", installment: 10990, landmark: "Near GT Road Temple", items: "iPhone 15 Pro Max ×1", status: "pending_override" },
  { id: "RMS-88390", customer: "Priya S.", phone: "+91 99123 45678", payment: "UPI", landmark: "Sector 4 Park", items: "OnePlus 12 ×1", status: "ready_to_pack" },
  { id: "RMS-88389", customer: "Rahul D.", phone: "+91 98877 66554", payment: "CARD", landmark: "Opp. Khanna Railway Stn", items: "Samsung Galaxy S24 Ultra ×1", status: "out_for_delivery" },
  { id: "RMS-88388", customer: "Meera P.", phone: "+91 97766 55443", payment: "UPI", landmark: "GT Road School", items: "Nothing Phone (2) ×1", status: "delivered" },
];

export default function DispatchBoardPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [cards, setCards] = useState<DispatchCard[]>(INITIAL_CARDS);
  const [selectedCard, setSelectedCard] = useState<DispatchCard | null>(null);
  const [flashCardId, setFlashCardId] = useState<string | null>(null);

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
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const getColCards = (status: DispatchCard["status"]) => {
    return cards.filter((c) => c.status === status);
  };

  const pendingCount = getColCards("pending_override").length;

  return (
    <div className="w-[95%] mx-auto mt-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div>
          <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}>
            Order Dispatch Board
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time fulfillment stream. Drag/move cards to advance delivery state.
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Column 1: Pending Overrides */}
        <div className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/30" : "bg-gray-100"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Pending Overrides
            </span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#ff2d55] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </div>
          <div className="space-y-3 min-h-[300px]">
            {getColCards("pending_override").map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                isDark={isDark}
                isFlashed={flashCardId === card.id}
                onClick={() => setSelectedCard(card)}
                onMove={(status) => moveCard(card.id, status)}
              />
            ))}
          </div>
        </div>

        {/* Column 2: Ready to Pack */}
        <div className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/30" : "bg-gray-100"}`}>
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Ready to Pack
            </span>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {getColCards("ready_to_pack").map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                isDark={isDark}
                onClick={() => setSelectedCard(card)}
                onMove={(status) => moveCard(card.id, status)}
              />
            ))}
          </div>
        </div>

        {/* Column 3: Out for Delivery */}
        <div className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/30" : "bg-gray-100"}`}>
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Out for Delivery
            </span>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {getColCards("out_for_delivery").map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                isDark={isDark}
                onClick={() => setSelectedCard(card)}
                onMove={(status) => moveCard(card.id, status)}
              />
            ))}
          </div>
        </div>

        {/* Column 4: Delivered */}
        <div className={`p-4 rounded-2xl ${isDark ? "bg-gray-800/30" : "bg-gray-100"}`}>
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-green-400">
              Delivered
            </span>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {getColCards("delivered").map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                isDark={isDark}
                onClick={() => setSelectedCard(card)}
                onMove={(status) => moveCard(card.id, status)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Details Side Panel */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md h-screen p-6 shadow-2xl flex flex-col justify-between ${
            isDark ? "bg-gray-900 border-l border-gray-800 text-white" : "bg-white border-l border-gray-200 text-gray-800"
          }`}>
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

                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Items</p>
                  <p className="text-sm font-semibold">{selectedCard.items}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">Payment Method</span>
                    <span className="text-sm font-bold">{selectedCard.payment}</span>
                  </div>
                  {selectedCard.lender && (
                    <div>
                      <span className="text-xs text-gray-500 block">Lender Provider</span>
                      <span className="text-sm font-bold">{selectedCard.lender}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-1">Landmark Affiliation</span>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin size={14} className="text-red-400" /> {selectedCard.landmark}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500">Quick status shift:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => moveCard(selectedCard.id, "ready_to_pack")}
                  className="py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs"
                >
                  Ready to Pack
                </button>
                <button
                  onClick={() => moveCard(selectedCard.id, "out_for_delivery")}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Dispatch Delivery
                </button>
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
}

function KanbanCard({ card, isDark, isFlashed = false, onClick, onMove }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
        isFlashed
          ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
          : isDark
          ? "bg-gray-900 border-gray-800 hover:border-gray-700 text-white"
          : "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-500" style={{ fontFamily: "'DM Mono', monospace" }}>
          {card.id}
        </span>
        {card.status === "pending_override" && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d55]" />
        )}
      </div>
      <p className="font-semibold text-sm">{card.customer}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{card.items}</p>

      {/* Quick Move Action buttons inside card */}
      <div className="mt-3 flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
        {card.status === "pending_override" && (
          <button
            onClick={() => onMove("ready_to_pack")}
            className="px-2 py-1 bg-yellow-500 text-white rounded text-[10px] font-bold"
          >
            Pack
          </button>
        )}
        {card.status === "ready_to_pack" && (
          <button
            onClick={() => onMove("out_for_delivery")}
            className="px-2 py-1 bg-blue-500 text-white rounded text-[10px] font-bold"
          >
            Dispatch
          </button>
        )}
        {card.status === "out_for_delivery" && (
          <button
            onClick={() => onMove("delivered")}
            className="px-2 py-1 bg-green-500 text-white rounded text-[10px] font-bold"
          >
            Deliver
          </button>
        )}
        {card.status === "delivered" && (
          <span className="text-green-500 text-[10px] font-bold flex items-center gap-0.5">
            <Check size={10} /> Del
          </span>
        )}
      </div>
    </div>
  );
}
