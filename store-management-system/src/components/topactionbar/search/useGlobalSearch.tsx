import React, { useState, useEffect } from "react";
import { Package, Users } from "lucide-react";
import { productService } from "@/services/product.service";
import { customerService } from "@/services/customer.service";
import { STATIC_NAV_ITEMS } from "../constants/statticNavItems";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Products" | "Customers" | "Categories" | "Navigation" | "Actions";
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export function useGlobalSearch(isOpen: boolean) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>(STATIC_NAV_ITEMS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(STATIC_NAV_ITEMS);
      setSelectedIndex(0);
    }
  }, [isOpen]);

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
          setResults([...dynamicItems, ...filteredNav]);
          setSelectedIndex(0);
        }
      } catch {
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

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    loading,
  };
}
