"use client";
import { useState, useEffect } from "react";
import type { Variants } from "framer-motion";

import MetricSummaryChart, {
  metricSummaryChartTypes,
} from "@/components/charts/barchart";
import DualLineChart from "@/components/charts/duallinechart";
import SingleLineChart from "@/components/charts/singlelinechart";
import CountCard from "@/components/countcard";
import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  FolderTree,
  MapPin,
  BarChart3,
  TrendingUp,
  Calendar,
  Package,
} from "lucide-react";
import cn from "classnames";
import { customerService } from "@/services/customer.service";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { cityService } from "@/services/city.service";

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function ChartCard({
  title,
  subtitle,
  isDark,
  children,
}: {
  title: string;
  subtitle?: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden",
        isDark
          ? "bg-slate-800/80 border-white/8 shadow-xl shadow-black/20"
          : "bg-white border-slate-200 shadow-sm",
      )}
    >
      <div
        className={cn(
          "px-5 py-4 border-b",
          isDark ? "border-white/8" : "border-slate-100",
        )}
      >
        <p
          className={cn(
            "text-base font-semibold",
            isDark ? "text-white" : "text-slate-800",
          )}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={cn(
              "text-xs mt-0.5",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-1 p-3">{children}</div>
    </div>
  );
}

function Page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [cList, pList, catList, cityList] = await Promise.all([
          customerService.fetchCustomers(1, 100).catch(() => []),
          productService.fetchProducts(1, 100).catch(() => []),
          categoryService.fetchCategories(1, 100).catch(() => []),
          cityService.fetchCities(1, 100).catch(() => []),
        ]);
        setCustomers(Array.isArray(cList) ? cList : []);
        setProducts(Array.isArray(pList) ? pList : []);
        setCategories(Array.isArray(catList) ? catList : []);
        setCities(Array.isArray(cityList) ? cityList : []);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const metricBarChartData = [
    {
      metric: metricSummaryChartTypes.Sales,
      value: products.length > 0 ? products.length * 12 : 0,
    },
    { metric: metricSummaryChartTypes.Customers, value: customers.length },
    { metric: metricSummaryChartTypes.Payments, value: categories.length },
    { metric: metricSummaryChartTypes.Products, value: products.length },
  ];

  const lineChartData = [
    {
      name: "Jan",
      uv: Math.max(1, products.length * 2),
      pv: Math.max(1, customers.length),
      amt: 2400,
    },
    {
      name: "Feb",
      uv: Math.max(2, products.length * 3),
      pv: Math.max(2, customers.length * 2),
      amt: 2210,
    },
    {
      name: "Mar",
      uv: Math.max(3, products.length * 4),
      pv: Math.max(3, customers.length * 3),
      amt: 2290,
    },
    {
      name: "Apr",
      uv: Math.max(4, products.length * 5),
      pv: Math.max(4, customers.length * 4),
      amt: 2000,
    },
    {
      name: "May",
      uv: Math.max(5, products.length * 6),
      pv: Math.max(5, customers.length * 5),
      amt: 2181,
    },
    {
      name: "Jun",
      uv: Math.max(6, products.length * 8),
      pv: Math.max(6, customers.length * 6),
      amt: 2500,
    },
    {
      name: "Jul",
      uv: products.length * 10,
      pv: customers.length * 8,
      amt: 2100,
    },
  ];

  const singleLineChartData = [
    { name: "Jan", pv: Math.max(10, products.length * 100), amt: 2400 },
    { name: "Feb", pv: Math.max(25, products.length * 250), amt: 2210 },
    { name: "Mar", pv: Math.max(40, products.length * 400), amt: 2290 },
    { name: "Apr", pv: Math.max(60, products.length * 600), amt: 2000 },
    { name: "May", pv: Math.max(85, products.length * 850), amt: 2181 },
    { name: "Jun", pv: Math.max(110, products.length * 1100), amt: 2500 },
    { name: "Jul", pv: products.length * 1500, amt: 2100 },
  ];

  return (
    <div className="page-container pb-12">
      {/* ── Page Header ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          {/* Breadcrumb */}
          <p
            className={cn(
              "text-xs font-medium mb-1",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            Home &rsaquo; Dashboard
          </p>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight",
              isDark ? "text-white" : "text-slate-900",
            )}
          >
            Dashboard
          </h1>
          <p
            className={cn(
              "text-sm mt-0.5",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            Welcome back, Admin. Real-time store performance and inventory
            overview.
          </p>
        </div>

        {/* Date badge */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm",
            isDark
              ? "bg-slate-800 border-white/8 text-slate-300"
              : "bg-white border-slate-200 text-slate-600",
          )}
        >
          <Calendar size={14} className="text-cyan-400" />
          <span className="font-medium">{today}</span>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Total Customers"
            count={customers.length}
            icon={<Users size={20} />}
            trend={customers.length > 0 ? customers.length : undefined}
            trendLabel="Registered users"
            accentColor="cyan"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Total Products"
            count={products.length}
            icon={<ShoppingBag size={20} />}
            trend={products.length > 0 ? products.length : undefined}
            trendLabel="In catalog"
            accentColor="blue"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Total Categories"
            count={categories.length}
            icon={<FolderTree size={20} />}
            trend={categories.length > 0 ? categories.length : undefined}
            trendLabel="Active categories"
            accentColor="purple"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Accepted Cities"
            count={cities.length}
            icon={<MapPin size={20} />}
            trend={cities.length > 0 ? cities.length : undefined}
            trendLabel="Service locations"
            accentColor="emerald"
          />
        </motion.div>
      </motion.div>

      {/* ── Charts Row 1 ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-cyan-400" />
          <h2
            className={cn(
              "text-base font-semibold",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            Store Metrics &amp; Live Catalog
          </h2>
          <span
            className={cn(
              "text-xs",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            — Live database breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4">
          <ChartCard
            title="Performance Trends"
            subtitle="Catalog & Customer growth comparison"
            isDark={isDark}
          >
            <div className="h-72">
              <DualLineChart isDark={isDark} data={lineChartData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Recent Products"
            subtitle="Latest additions to inventory"
            isDark={isDark}
          >
            <div className="h-72 overflow-y-auto pr-1">
              {/* Column headers */}
              <div
                className={cn(
                  "grid grid-cols-3 text-xs font-semibold uppercase tracking-wider pb-2 mb-1 border-b",
                  isDark
                    ? "text-slate-500 border-white/8"
                    : "text-slate-400 border-slate-100",
                )}
              >
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
              </div>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Package
                    size={28}
                    className={
                      isDark ? "text-slate-600 mb-2" : "text-slate-300 mb-2"
                    }
                  />
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isDark ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    No products added yet
                  </p>
                </div>
              ) : (
                products.slice(0, 10).map((prod: any, index: number) => (
                  <div
                    key={prod.id || prod._id || index}
                    className={cn(
                      "grid grid-cols-3 text-sm items-center py-2.5 border-b transition-colors rounded px-1",
                      isDark
                        ? "text-slate-300 border-white/5 hover:bg-white/4"
                        : "text-slate-700 border-slate-50 hover:bg-slate-50",
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium text-xs truncate pr-2",
                        isDark ? "text-slate-300" : "text-slate-800",
                      )}
                    >
                      {prod.name || prod.productName || `Product #${index + 1}`}
                    </span>
                    <span className="font-semibold text-xs text-cyan-400">
                      ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          (prod.quantity ?? prod.quantiy ?? 10) > 0
                            ? "bg-emerald-500"
                            : "bg-red-500",
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium text-xs",
                          (prod.quantity ?? prod.quantiy ?? 10) > 0
                            ? "text-emerald-500"
                            : "text-red-500",
                        )}
                      >
                        {(prod.quantity ?? prod.quantiy ?? 10) > 0
                          ? `${prod.quantity ?? prod.quantiy ?? 10} in stock`
                          : "Out of stock"}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </ChartCard>
        </div>
      </motion.div>

      {/* ── Charts Row 2 ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-blue-400" />
          <h2
            className={cn(
              "text-base font-semibold",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            Database Distribution
          </h2>
          <span
            className={cn(
              "text-xs",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            — Summary of records across modules
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4">
          <ChartCard
            title="Catalog Valuation Projection"
            subtitle="Estimated inventory revenue scale"
            isDark={isDark}
          >
            <div className="h-72">
              <SingleLineChart isDark={isDark} data={singleLineChartData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Live Records Overview"
            subtitle="Sales · Customers · Categories · Products"
            isDark={isDark}
          >
            <div className="h-72 flex justify-center items-center">
              <MetricSummaryChart isDark={isDark} data={metricBarChartData} />
            </div>
          </ChartCard>
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
