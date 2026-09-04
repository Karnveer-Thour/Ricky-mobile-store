"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import {
  AlertCircle,
  MapPin,
  Check,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import cn from "classnames";

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

const COLUMNS: { status: ColumnStatus; label: string; darkColor: string; lightColor: string; accent: string }[] = [
  { status: "pending_override", label: "Pending Overrides", darkColor: "text-rose-400",   lightColor: "text-rose-700 font-bold",   accent: "border-rose-400/60 bg-rose-500/10 shadow-[0_0_16px_rgba(244,63,94,0.25)]" },
  { status: "ready_to_pack",    label: "Ready to Pack",    darkColor: "text-amber-400",  lightColor: "text-amber-700 font-bold",  accent: "border-amber-400/60 bg-amber-500/10 shadow-[0_0_16px_rgba(245,158,11,0.25)]" },
  { status: "out_for_delivery", label: "Out for Delivery", darkColor: "text-blue-400",   lightColor: "text-blue-700 font-bold",   accent: "border-blue-400/60 bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.25)]" },
  { status: "delivered",        label: "Delivered",        darkColor: "text-emerald-400", lightColor: "text-emerald-700 font-bold", accent: "border-emerald-400/60 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.25)]" },
  { status: "returned",         label: "Returned",         darkColor: "text-purple-400", lightColor: "text-purple-700 font-bold",  accent: "border-purple-400/60 bg-purple-500/10 shadow-[0_0_16px_rgba(168,85,247,0.25)]" },
];

const INITIAL_DISPATCH_CARDS: DispatchCard[] = [
  {
    id: "RMS-89211",
    customer: "Gurpreet Singh",
    phone: "+91 98140 11223",
    payment: "Bajaj Finserv EMI",
    lender: "Bajaj Finance",
    installment: 6299,
    landmark: "Clock Tower Plaza, Ludhiana",
    items: "Apple iPhone 16 Pro Max 256GB Desert Titanium ×1",
    status: "pending_override",
  },
  {
    id: "RMS-89212",
    customer: "Simranjit Kaur",
    phone: "+91 98722 33445",
    payment: "HDFC Debit EMI",
    lender: "HDFC Bank",
    installment: 4199,
    landmark: "Near Model Town Park, Jalandhar",
    items: "Samsung Galaxy S24 Ultra 512GB Titanium Gray ×1",
    status: "pending_override",
  },
  {
    id: "RMS-89213",
    customer: "Harmanpreet Cheema",
    phone: "+91 98881 22334",
    payment: "Cash on Delivery",
    landmark: "Sector 17 Market Complex, Chandigarh",
    items: "OnePlus 12 16GB/512GB Flowy Emerald ×1",
    status: "pending_override",
  },
  {
    id: "RMS-89214",
    customer: "Rahul Verma",
    phone: "+91 99155 66778",
    payment: "Prepaid UPI",
    landmark: "Mall Road Commercial Block, Amritsar",
    items: "Vivo X100 Pro 512GB Asteroid Black ×1",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89215",
    customer: "Amritpal Dhillon",
    phone: "+91 97800 12345",
    payment: "Home Credit EMI",
    lender: "Home Credit",
    installment: 3499,
    landmark: "GT Road Hub, Phagwara",
    items: "Xiaomi 14 Ultra 512GB White ×1",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89216",
    customer: "Maninder Bains",
    phone: "+91 94172 99881",
    payment: "Credit Card Full",
    landmark: "Sarabha Nagar Market, Ludhiana",
    items: "Apple iPhone 15 128GB Blue ×1 + 20W Adapter",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89217",
    customer: "Pooja Sharma",
    phone: "+91 98765 88990",
    payment: "Prepaid UPI",
    landmark: "Civil Lines, Patiala",
    items: "Nothing Phone (2) 256GB Dark Gray ×1",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89218",
    customer: "Vikramjeet Sandhu",
    phone: "+91 98150 44556",
    payment: "Cash on Delivery",
    landmark: "Ferozepur Road City Center, Ludhiana",
    items: "Google Pixel 8a 128GB Bay Blue ×1",
    status: "out_for_delivery",
  },
  {
    id: "RMS-89219",
    customer: "Jasleen Grewal",
    phone: "+91 98889 11223",
    payment: "Bajaj Finserv EMI",
    lender: "Bajaj Finance",
    installment: 5899,
    landmark: "Phase 7 Industrial Area, Mohali",
    items: "Samsung Galaxy Z Fold 6 256GB Silver Shadow ×1",
    status: "out_for_delivery",
  },
  {
    id: "RMS-89220",
    customer: "Arun Kumar",
    phone: "+91 98144 55667",
    payment: "Prepaid NetBanking",
    landmark: "BMC Chowk, Jalandhar",
    items: "Realme GT 6 256GB Fluid Silver ×1",
    status: "out_for_delivery",
  },
  {
    id: "RMS-89221",
    customer: "Navjot Singh",
    phone: "+91 99140 33445",
    payment: "Prepaid UPI",
    landmark: "Ranjit Avenue B-Block, Amritsar",
    items: "Apple iPhone 16 128GB Teal ×1",
    status: "delivered",
  },
  {
    id: "RMS-89222",
    customer: "Deepika Malhotra",
    phone: "+91 98721 99001",
    payment: "HDFC Credit Card",
    landmark: "South City Enclave, Ludhiana",
    items: "OnePlus Nord 4 256GB Mercurial Silver ×1",
    status: "delivered",
  },
  {
    id: "RMS-89223",
    customer: "Taranjit Gill",
    phone: "+91 98880 77889",
    payment: "Bajaj Finserv EMI",
    lender: "Bajaj Finance",
    installment: 4999,
    landmark: "Urban Estate Phase 2, Patiala",
    items: "iQOO 12 5G 256GB Legend White ×1",
    status: "delivered",
  },
  {
    id: "RMS-89224",
    customer: "Raman Deep",
    phone: "+91 95011 22334",
    payment: "Cash on Delivery",
    landmark: "Dugri Phase 1, Ludhiana",
    items: "Motorola Edge 50 Pro 256GB Black Beauty ×1",
    status: "returned",
  },
  {
    id: "RMS-89225",
    customer: "Sunil Joshi",
    phone: "+91 98788 44556",
    payment: "Cash on Delivery",
    landmark: "Court Road, Bathinda",
    items: "Samsung Galaxy A55 5G 128GB Awesome Iceblue ×1",
    status: "returned",
  },
];

export default function DispatchBoardPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [cards, setCards] = useState<DispatchCard[]>(INITIAL_DISPATCH_CARDS);
  const [selectedCard, setSelectedCard] = useState<DispatchCard | null>(null);
  const [flashCardId, setFlashCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state: cards per column & per-column page tracking
  const [pageSize, setPageSize] = useState<number>(3);
  const [colPages, setColPages] = useState<{ [key in ColumnStatus]?: number }>({});

  // Drag state
  const draggingId = useRef<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnStatus | null>(null);

  // Simulate real-time alerts arriving via WebSocket gateway
  useEffect(() => {
    const timer = setTimeout(() => {
      const newCard: DispatchCard = {
        id: "RMS-89226",
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
        if (prev.some((c) => c.id === newCard.id)) return prev;
        return [newCard, ...prev];
      });

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

  // Filtered cards by search query
  const filteredCards = cards.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.customer.toLowerCase().includes(q) ||
      c.items.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.landmark.toLowerCase().includes(q)
    );
  });

  const getColCards = (status: DispatchCard["status"]) =>
    filteredCards.filter((c) => c.status === status);

  const pendingCount = getColCards("pending_override").length;

  // Column-level pagination helpers
  const getColCurrentPage = (status: ColumnStatus) => colPages[status] || 1;

  const getColTotalPages = (status: ColumnStatus) => {
    const total = getColCards(status).length;
    if (pageSize >= 100) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  };

  const getPagedColCards = (status: ColumnStatus) => {
    const all = getColCards(status);
    if (pageSize >= 100) return all;
    const page = getColCurrentPage(status);
    const startIndex = (page - 1) * pageSize;
    return all.slice(startIndex, startIndex + pageSize);
  };

  const changeColPage = (status: ColumnStatus, newPage: number) => {
    const total = getColTotalPages(status);
    const clamped = Math.max(1, Math.min(newPage, total));
    setColPages((prev) => ({ ...prev, [status]: clamped }));
  };

  // Advance / Rewind all columns together
  const advanceAllPages = (delta: number) => {
    setColPages((prev) => {
      const next: { [key in ColumnStatus]?: number } = {};
      STATUS_ORDER.forEach((st) => {
        const current = prev[st] || 1;
        const total = getColTotalPages(st);
        next[st] = Math.max(1, Math.min(current + delta, total));
      });
      return next;
    });
  };

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
    <div className="page-container space-y-6">
      {/* Page header & Real-time Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium mb-1 text-slate-500">
            Home &rsaquo; Dispatch Management
          </p>
          <h1
            className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Order Dispatch & Fulfillment Board
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Live delivery stream ({filteredCards.length} active orders). Drag or click to advance fulfillment stages.
          </p>
        </div>

        {/* Filter bar and pending badge */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box with clear border */}
          <div className={`flex items-center px-3 py-2 rounded-xl border-2 transition-all gap-2 ${
            isDark
              ? "bg-slate-900 border-slate-700 text-white focus-within:border-cyan-400"
              : "bg-white border-slate-300 text-slate-900 shadow-xs focus-within:border-cyan-500"
          }`}>
            <Search size={16} className={isDark ? "text-slate-400" : "text-slate-500"} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setColPages({});
              }}
              placeholder="Search dispatch orders..."
              className="bg-transparent text-xs font-semibold outline-none w-44 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {pendingCount > 0 && (
            <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-pulse">
              <AlertCircle size={14} />
              {pendingCount} Pending Override{pendingCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const isOver = dragOverCol === col.status;
          const colAllCards = getColCards(col.status);
          const colPagedCards = getPagedColCards(col.status);
          const currentPage = getColCurrentPage(col.status);
          const totalPages = getColTotalPages(col.status);

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              onDragLeave={handleDragLeave}
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDark
                        ? "bg-slate-800 text-slate-300 border border-slate-700"
                        : "bg-white text-slate-700 border border-slate-300 shadow-2xs"
                    }`}>
                      {colAllCards.length}
                    </span>
                  </div>

                  {/* Column-level Page indicator & Prev/Next */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => changeColPage(col.status, currentPage - 1)}
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
                      <span className={`text-[10px] font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {currentPage}/{totalPages}
                      </span>
                      <button
                        onClick={() => changeColPage(col.status, currentPage + 1)}
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

                {/* Cards Container */}
                <div className="space-y-3 min-h-[340px]">
                  {colAllCards.length === 0 && (
                    <div className="h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
                      No orders in this stage
                    </div>
                  )}
                  {colPagedCards.map((card) => (
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

              {/* Column Footer Pagination Notice */}
              {colAllCards.length > pageSize && pageSize < 100 && (
                <div className={`mt-3 pt-2 border-t text-[10px] flex items-center justify-between ${
                  isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"
                }`}>
                  <span>
                    Showing {Math.min((currentPage - 1) * pageSize + 1, colAllCards.length)}–
                    {Math.min(currentPage * pageSize, colAllCards.length)} of {colAllCards.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => changeColPage(col.status, currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="hover:underline disabled:opacity-30 cursor-pointer"
                    >
                      Prev
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => changeColPage(col.status, currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="hover:underline disabled:opacity-30 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Global Board Pagination & Controls Toolbar */}
      <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDark
          ? "bg-slate-900/60 border-slate-800 text-slate-300"
          : "bg-white border-slate-200 text-slate-700 shadow-sm"
      }`}>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold">Cards per column:</span>
          {[3, 5, 10, 100].map((size) => (
            <button
              key={size}
              onClick={() => {
                setPageSize(size);
                setColPages({});
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                pageSize === size
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
              }`}
            >
              {size === 100 ? "All" : size}
            </button>
          ))}
          <span className="text-slate-400 ml-2">
            ({filteredCards.length} total orders loaded)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => advanceAllPages(-1)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-xs"
            }`}
          >
            <ChevronLeft size={14} /> Prev Pages
          </button>

          <button
            onClick={() => setColPages({})}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
            }`}
          >
            Reset to Page 1
          </button>

          <button
            onClick={() => advanceAllPages(1)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-xs"
            }`}
          >
            Next Pages <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Details Side Panel */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-md h-screen p-6 shadow-2xl flex flex-col justify-between transition-colors ${
              isDark
                ? "bg-slate-900 border-l border-slate-800 text-white"
                : "bg-white border-l border-slate-200 text-slate-800"
            }`}
          >
            <div>
              <div
                className={`flex items-center justify-between border-b pb-4 mb-6 ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-cyan-400" : "text-cyan-700"
                  }`}
                >
                  Order Details
                </span>
                <button
                  onClick={() => setSelectedCard(null)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                  }`}
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
          ? "border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse"
          : isDark
            ? "bg-slate-900 border-slate-800 hover:border-slate-700 text-white"
            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs"
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
      <p className={cn("text-xs mt-0.5 truncate", isDark ? "text-slate-400" : "text-slate-500")}>
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

