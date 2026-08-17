"use client";
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
  Clock,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react";
import cn from "classnames";

const lineChartData = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const singleLineChartData = [
  { name: "Jan", pv: 2400, amt: 2400 },
  { name: "Feb", pv: 1398, amt: 2210 },
  { name: "Mar", pv: 9800, amt: 2290 },
  { name: "Apr", pv: 3908, amt: 2000 },
  { name: "May", pv: 4800, amt: 2181 },
  { name: "Jun", pv: 3800, amt: 2500 },
  { name: "Jul", pv: 4300, amt: 2100 },
];

const metricBarChartData = [
  { metric: metricSummaryChartTypes.Sales, value: 24000 },
  { metric: metricSummaryChartTypes.Customers, value: 1200 },
  { metric: metricSummaryChartTypes.Payments, value: 340 },
  { metric: metricSummaryChartTypes.Products, value: 18000 },
];

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

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);

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
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
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
            count={44}
            icon={<Users size={20} />}
            trend={12}
            trendLabel="vs last month"
            accentColor="cyan"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Total Sales"
            count={107}
            icon={<ShoppingBag size={20} />}
            trend={8}
            trendLabel="vs last month"
            accentColor="blue"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Pending Orders"
            count={89}
            icon={<Clock size={20} />}
            trend={-3}
            trendLabel="vs last month"
            accentColor="purple"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <CountCard
            isDark={isDark}
            title="Accepted Orders"
            count={87}
            icon={<CheckCircle2 size={20} />}
            trend={5}
            trendLabel="vs last month"
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
            Sales &amp; Customers
          </h2>
          <span
            className={cn(
              "text-xs",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            — Current Year Overview
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4">
          <ChartCard
            title="Sales vs Customer Trends"
            subtitle="Dual-line comparison — Jan to Jul"
            isDark={isDark}
          >
            <div className="h-72">
              <DualLineChart isDark={isDark} data={lineChartData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Recent Sales"
            subtitle="Latest transactions"
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
                <span>#</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 55, 332, 523, 52].map(
                (item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "grid grid-cols-3 text-sm items-center py-2 border-b transition-colors rounded",
                      isDark
                        ? "text-slate-300 border-white/5 hover:bg-white/4"
                        : "text-slate-700 border-slate-50 hover:bg-slate-50",
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium text-xs",
                        isDark ? "text-slate-500" : "text-slate-400",
                      )}
                    >
                      #{index + 1}
                    </span>
                    <span className="font-semibold">
                      ₹{item.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-500 font-medium text-xs">
                        Done
                      </span>
                    </span>
                  </div>
                ),
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
            Annual Records
          </h2>
          <span
            className={cn(
              "text-xs",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            — Yearly performance breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4">
          <ChartCard
            title="Current Year Sales"
            subtitle="Monthly revenue trend"
            isDark={isDark}
          >
            <div className="h-72">
              <SingleLineChart isDark={isDark} data={singleLineChartData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Metric Summary"
            subtitle="Sales · Customers · Payments · Products"
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

export default page;
