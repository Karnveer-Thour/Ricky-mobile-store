"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalSearch, SearchResultItem } from "./search/useGlobalSearch";
import SearchModalInput from "./search/SearchModalInput";
import SearchResultsList from "./search/SearchResultsList";
import SearchKeyboardFooter from "./search/SearchKeyboardFooter";

export type { SearchResultItem };

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  isDark = true,
}: GlobalSearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, results, selectedIndex, setSelectedIndex } =
    useGlobalSearch(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (item: SearchResultItem) => {
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + results.length) % (results.length || 1),
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border-2 transition-colors ${
            isDark
              ? "bg-slate-900/98 border-slate-700/80 shadow-cyan-950/60 text-slate-100"
              : "bg-white border-slate-300 shadow-2xl text-slate-800"
          }`}
        >
          <SearchModalInput
            inputRef={inputRef}
            query={query}
            onQueryChange={setQuery}
            onKeyDown={handleKeyDown}
            isDark={isDark}
          />

          <SearchResultsList
            results={results}
            selectedIndex={selectedIndex}
            onHoverIndex={setSelectedIndex}
            onSelect={handleSelect}
            isDark={isDark}
          />

          <SearchKeyboardFooter isDark={isDark} />
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
