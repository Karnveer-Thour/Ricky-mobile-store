"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Smartphone,
  Users,
  FolderTree,
  MessageCircle,
  TrendingUp,
  Settings,
  Truck,
  Package,
  Command,
  ArrowRight,
  X,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { customerService } from "@/services/customer.service";
import { categoryService } from "@/services/category.service";

interface SearchResultItem {
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

const STATIC_NAV_ITEMS: SearchResultItem[] = [
  {
    id: "nav-dash",
    title: "Dashboard Overview",
    subtitle: "Real-time metrics, sales graphs and revenue stats",
    category: "Navigation",
    href: "/home/features/dashboard",
    icon: <TrendingUp size={16} className="text-cyan-400" />,
  },
  {
    id: "nav-prod",
    title: "Product Catalog",
    subtitle: "Manage mobile phones, accessories and stock listings",
    category: "Navigation",
    href: "/home/features/product",
    icon: <Smartphone size={16} className="text-blue-400" />,
  },
  {
    id: "nav-cust",
    title: "Customer Directory",
    subtitle: "View customer profiles, contacts and order history",
    category: "Navigation",
    href: "/home/features/customers",
    icon: <Users size={16} className="text-emerald-400" />,
  },
  {
    id: "nav-wa",
    title: "WhatsApp Group Sales",
    subtitle: "Record flash sales, group broadcasts and EMI bookings",
    category: "Navigation",
    href: "/home/features/whatsapp",
    icon: <MessageCircle size={16} className="text-green-400" />,
  },
  {
    id: "nav-chat",
    title: "Support Live Chat",
    subtitle: "Resolve inquiries, share UPI links and verify Bajaj EMI",
    category: "Navigation",
    href: "/home/features/chat",
    icon: <MessageCircle size={16} className="text-purple-400" />,
  },
  {
    id: "nav-dispatch",
    title: "Dispatch & Live Tracking",
    subtitle: "Track rider locations, OTP handovers and deliveries",
    category: "Navigation",
    href: "/home/features/dispatch",
    icon: <Truck size={16} className="text-amber-400" />,
  },
  {
    id: "nav-inv",
    title: "Inventory Stocks",
    subtitle: "SKU tracking, low stock alerts and restock orders",
    category: "Navigation",
    href: "/home/features/inventory",
    icon: <Package size={16} className="text-orange-400" />,
  },
  {
    id: "nav-sett",
    title: "Store Settings & Security",
    subtitle: "Admin profile, banking credentials and preferences",
    category: "Navigation",
    href: "/home/settings",
    icon: <Settings size={16} className="text-slate-400" />,
  },
  {
    id: "act-upload-sale",
    title: "Quick Action: Upload WhatsApp Sale",
    subtitle: "Record a new sale with instant Bajaj / Home Credit EMI",
    category: "Actions",
    href: "/home/features/whatsapp/uploadsale",
    icon: <CreditCard size={16} className="text-yellow-400" />,
    badge: "Fast Action",
  },
];

export default function GlobalSearchModal({
  isOpen,
  onClose,
  isDark = true,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>(STATIC_NAV_ITEMS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
      setResults(STATIC_NAV_ITEMS);
    }
  }, [isOpen]);

  // Live searching across products, categories and customers
  useEffect(() => {
    if (!query.trim()) {
      setResults(STATIC_NAV_ITEMS);
      return;
    }

    const trimmed = query.toLowerCase();
    let isCancelled = false;

    async function performSearch() {
      setLoading(true);
      try {
        const filteredNav = STATIC_NAV_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(trimmed) ||
            item.subtitle.toLowerCase().includes(trimmed),
        );

        // Fetch dynamic items if available
        let dynamicItems: SearchResultItem[] = [];

        try {
          const prods = await productService.fetchProducts(1, 10);
          if (Array.isArray(prods)) {
            prods
              .filter(
                (p: any) =>
                  (p.name && p.name.toLowerCase().includes(trimmed)) ||
                  (p.description &&
                    p.description.toLowerCase().includes(trimmed)),
              )
              .slice(0, 4)
              .forEach((p: any) => {
                dynamicItems.push({
                  id: `prod-${p._id || p.id}`,
                  title: p.name || "Mobile Device",
                  subtitle: `₹${Number(p.price || 0).toLocaleString("en-IN")} • ${p.brand || "In Stock"}`,
                  category: "Products",
                  href: "/home/features/product",
                  icon: <Smartphone size={16} className="text-cyan-400" />,
                  badge: `₹${p.price}`,
                });
              });
          }
        } catch {}

        try {
          const custs = await customerService.fetchCustomers(1, 10);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
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
          className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border ${
            isDark
              ? "bg-slate-900/95 border-slate-700/80 shadow-cyan-950/40 text-slate-100"
              : "bg-white border-slate-200 shadow-slate-400/20 text-slate-800"
          }`}
        >
          {/* Top Search Input Box */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search size={20} className="text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, customers, orders, or pages (Type to filter)..."
              className="w-full bg-transparent text-base font-medium outline-none placeholder-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
            <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              <Command size={11} /> K
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5 space-y-1">
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
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-500/15 border border-cyan-500/30 text-white"
                          : "bg-cyan-50 border border-cyan-200 text-cyan-900"
                        : "hover:bg-white/5 border border-transparent"
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
                          <p className="text-sm font-bold truncate">
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                      <ArrowRight
                        size={14}
                        className={`transition-transform ${isSelected ? "text-cyan-400 translate-x-0.5" : "text-transparent"}`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                  ↑↓
                </kbd>{" "}
                Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                  ↵
                </kbd>{" "}
                Select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                  esc
                </kbd>{" "}
                Close
              </span>
            </div>
            <span className="text-cyan-400 font-semibold">
              Ricky Enterprise CMS
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
