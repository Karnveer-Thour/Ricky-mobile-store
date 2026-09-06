"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import cn from "classnames";

interface CountCardProps {
  title: string;
  count: number;
  isDark?: boolean;
  icon?: ReactNode;
  trend?: number; // positive = up, negative = down, undefined = no badge
  trendLabel?: string;
  accentColor?: "cyan" | "blue" | "purple" | "emerald";
}

const accentMap = {
  cyan: {
    gradient: "from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500",
    iconBg:
      "bg-cyan-50 text-cyan-600 border border-cyan-200/80 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-transparent",
    glow: "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_0_24px_rgba(0,207,255,0.25)]",
    border: "hover:border-cyan-400/80 dark:hover:border-cyan-500/40",
  },
  blue: {
    gradient:
      "from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500",
    iconBg:
      "bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-500/15 dark:text-blue-400 dark:border-transparent",
    glow: "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]",
    border: "hover:border-blue-400/80 dark:hover:border-blue-500/40",
  },
  purple: {
    gradient:
      "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500",
    iconBg:
      "bg-purple-50 text-purple-600 border border-purple-200/80 dark:bg-purple-500/15 dark:text-purple-400 dark:border-transparent",
    glow: "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]",
    border: "hover:border-purple-400/80 dark:hover:border-purple-500/40",
  },
  emerald: {
    gradient:
      "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
    iconBg:
      "bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-transparent",
    glow: "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]",
    border: "hover:border-emerald-400/80 dark:hover:border-emerald-500/40",
  },
};

function CountCard({
  isDark,
  title,
  count,
  icon,
  trend,
  trendLabel,
  accentColor = "cyan",
}: CountCardProps) {
  const accent = accentMap[accentColor];
  const hasTrend = trend !== undefined;
  const isUp = hasTrend && trend >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "flex-1 min-w-[180px] rounded-2xl p-5 border transition-all duration-300 cursor-default",
        accent.glow,
        accent.border,
        isDark
          ? "bg-slate-800/80 text-white border-white/8 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-white text-slate-800 border-slate-200/90 shadow-sm shadow-slate-100",
      )}
    >
      {/* Header row — icon badge + trend pill */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon badge */}
        {icon ? (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              accent.iconBg,
            )}
          >
            {icon}
          </div>
        ) : (
          <div className={cn("w-10 h-10 rounded-xl", accent.iconBg)} />
        )}

        {/* Trend badge */}
        {hasTrend && (
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
              isUp
                ? isDark
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : isDark
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                  : "bg-rose-50 text-rose-700 border border-rose-200",
            )}
          >
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Count */}
      <p
        className={cn(
          "text-4xl font-extrabold tracking-tight bg-gradient-to-r bg-clip-text text-transparent leading-none mb-1",
          accent.gradient,
        )}
      >
        {count.toLocaleString()}
      </p>

      {/* Label */}
      <p
        className={cn(
          "text-sm font-semibold mt-1.5",
          isDark ? "text-slate-400" : "text-slate-600",
        )}
      >
        {title}
      </p>

      {/* Trend label sub-text */}
      {hasTrend && trendLabel && (
        <p
          className={cn(
            "text-xs mt-1",
            isDark ? "text-slate-500" : "text-slate-400",
          )}
        >
          {trendLabel}
        </p>
      )}
    </motion.div>
  );
}

export default CountCard;
