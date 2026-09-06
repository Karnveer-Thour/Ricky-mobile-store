"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import {
  DispatchCard,
  ColumnStatus,
  STATUS_ORDER,
  COLUMNS,
  INITIAL_DISPATCH_CARDS,
  DispatchColumn,
  DispatchFilterBar,
  DispatchPaginationControls,
  DispatchDetailsDrawer,
} from "./components";

export default function DispatchBoardPage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [cards, setCards] = useState<DispatchCard[]>(INITIAL_DISPATCH_CARDS);
  const [selectedCard, setSelectedCard] = useState<DispatchCard | null>(null);
  const [flashCardId, setFlashCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state: cards per column & per-column page tracking
  const [pageSize, setPageSize] = useState<number>(3);
  const [colPages, setColPages] = useState<{ [key in ColumnStatus]?: number }>(
    {},
  );

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
      <DispatchFilterBar
        isDark={isDark}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setColPages({});
        }}
        onSearchClear={() => setSearchQuery("")}
        activeOrdersCount={filteredCards.length}
        pendingCount={pendingCount}
      />

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {COLUMNS.map((col) => (
          <DispatchColumn
            key={col.status}
            col={col}
            isDark={isDark}
            isOver={dragOverCol === col.status}
            allCards={getColCards(col.status)}
            pagedCards={getPagedColCards(col.status)}
            currentPage={getColCurrentPage(col.status)}
            totalPages={getColTotalPages(col.status)}
            flashCardId={flashCardId}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onPageChange={changeColPage}
            onCardClick={setSelectedCard}
            onMoveCard={moveCard}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {/* Bottom Master Pagination Controls Bar */}
      <DispatchPaginationControls
        isDark={isDark}
        pageSize={pageSize}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setColPages({});
        }}
        filteredCount={filteredCards.length}
        onAdvanceAllPages={advanceAllPages}
        onResetPages={() => setColPages({})}
      />

      {/* Details Side Panel */}
      {selectedCard && (
        <DispatchDetailsDrawer
          card={selectedCard}
          isDark={isDark}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
