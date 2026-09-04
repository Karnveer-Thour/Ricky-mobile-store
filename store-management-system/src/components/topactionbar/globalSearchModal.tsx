"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  Package,
  Command,
  ArrowRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { customerService } from "@/services/customer.service";
import { categoryService } from "@/services/category.service";
import { STATIC_NAV_ITEMS } from "./constants/statticNavItems";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Products" | "Customers" | "Categories" | "Navigation" | "Actions";
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>(STATIC_NAV_ITEMS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(STATIC_NAV_ITEMS);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Live query search against products & customers
  useEffect(() => {
    if (!query.trim()) {
      setResults(STATIC_NAV_ITEMS);
      return;
    }

    let isCancelled = false;
    async function performSearch() {
      setLoading(true);
      const trimmed = query.trim().toLowerCase();
      const dynamicItems: SearchResultItem[] = [];

      try {
        const filteredNav = STATIC_NAV_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(trimmed) ||
            item.subtitle.toLowerCase().includes(trimmed) ||
            item.category.toLowerCase().includes(trimmed),
        );

        // Query Products
        try {
          const prods = await productService.fetchProducts(1, 20);
          if (Array.isArray(prods)) {
            prods
              .filter(
                (p: any) =>
                  (p.name && p.name.toLowerCase().includes(trimmed)) ||
                  (p.productName &&
                    p.productName.toLowerCase().includes(trimmed)) ||
                  (p.brand && p.brand.toLowerCase().includes(trimmed)),
              )
              .slice(0, 4)
              .forEach((p: any) => {
                dynamicItems.push({
                  id: `prod-${p.id || p._id}`,
                  title: p.name || p.productName || "Mobile Device",
                  subtitle: `₹${Number(p.price || 0).toLocaleString("en-IN")} · ${p.quantity ?? 10} in stock`,
                  category: "Products",
                  href: "/home/features/product",
                  icon: <Package size={16} className="text-cyan-400" />,
                  badge: p.brand || "Device",
                });
              });
          }
        } catch {}

        // Query Customers
        try {
          const custs = await customerService.fetchCustomers(1, 20);
          if (Array.isArray(custs)) {
            custs
              .filter(
                (c: any) =>
                  (c.name && c.name.toLowerCase().includes(trimmed)) ||
                  (c.email && c.email.toLowerCase().includes(trimmed)) ||
                  (c.phone && c.phone.includes(trimmed)),
              )
              .slice(0, 3)
              .forEach((c: any) => {
                dynamicItems.push({
                  id: `cust-${c._id || c.id}`,
                  title: c.name || c.email || "Customer",
                  subtitle: `${c.phone || c.email || "Registered customer"}`,
                  category: "Customers",
                  href: "/home/features/customers",
                  icon: <Users size={16} className="text-emerald-400" />,
                });
              });
          }
        } catch {}

        if (!isCancelled) {
          const combined = [...dynamicItems, ...filteredNav];
          setResults(combined);
          setSelectedIndex(0);
        }
      } catch (err) {
        if (!isCancelled) {
          setResults(
            STATIC_NAV_ITEMS.filter((item) =>
              item.title.toLowerCase().includes(trimmed),
            ),
          );
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    const timer = setTimeout(performSearch, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Keyboard navigation inside modal
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

  const handleSelect = (item: SearchResultItem) => {
    router.push(item.href);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
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
          {/* Top Search Input Box */}
          <div className={`p-4 border-b-2 ${
            isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50/90"
          }`}>
            <div className={`flex items-center w-full px-3.5 py-2.5 rounded-xl border-2 transition-all gap-3 ${
              isDark
                ? "bg-slate-950 border-slate-700/80 text-white focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
                : "bg-white border-slate-300 text-slate-900 shadow-xs focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20"
            }`}>
              <Search size={19} className={isDark ? "text-cyan-400 shrink-0" : "text-cyan-600 shrink-0"} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, customers, orders, or pages (Type to filter)..."
                className={`w-full bg-transparent text-sm font-semibold outline-none ${
                  isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
                }`}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className={`p-1 rounded-md transition-colors ${
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-800"
                  }`}
                >
                  <X size={16} />
                </button>
              )}
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
                isDark
                  ? "bg-slate-800 text-slate-400 border-slate-700"
                  : "bg-slate-100 text-slate-700 border-slate-300 shadow-2xs"
              }`}>
                <Command size={11} /> K
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className={`max-h-96 overflow-y-auto p-2 divide-y space-y-1 ${
            isDark ? "divide-white/5" : "divide-slate-100"
          }`}>
            {results.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Search size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No results found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for product model, customer name, or feature
                </p>
              </div>
            ) : (
              results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-500/15 border-cyan-500/40 text-white"
                          : "bg-cyan-50/80 border-cyan-300 text-cyan-950 shadow-xs"
                        : isDark
                        ? "hover:bg-white/5 border-transparent text-slate-300"
                        : "hover:bg-slate-100/70 border-transparent text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-400"
                            : isDark
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-500 dark:text-cyan-300 border border-cyan-400/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isDark
                          ? "bg-slate-800/80 text-slate-400 border-slate-700"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {item.category}
                      </span>
                      <ArrowRight
                        size={14}
                        className={`transition-transform ${isSelected ? (isDark ? "text-cyan-400 translate-x-0.5" : "text-cyan-600 translate-x-0.5") : "text-transparent"}`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className={`px-4 py-2.5 border-t-2 flex items-center justify-between text-[11px] ${
            isDark
              ? "bg-slate-950/80 border-slate-800 text-slate-400"
              : "bg-slate-100/90 border-slate-200 text-slate-600"
          }`}>
            <div className="flex items-center gap-3">
              <span>
                <kbd className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-white border-slate-300 text-slate-700 shadow-2xs"
                }`}>
                  ↑↓
                </kbd>{" "}
                Navigate
              </span>
              <span>
                <kbd className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-white border-slate-300 text-slate-700 shadow-2xs"
                }`}>
                  ↵
                </kbd>{" "}
                Select
              </span>
              <span>
                <kbd className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-white border-slate-300 text-slate-700 shadow-2xs"
                }`}>
                  esc
                </kbd>{" "}
                Close
              </span>
            </div>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">
              Ricky Enterprise CMS
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}

