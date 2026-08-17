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
    gradient: "from-cyan-400 to-blue-500",
    iconBg: "bg-cyan-500/15",
    iconText: "text-cyan-400",
    glow: "hover:shadow-[0_0_24px_rgba(0,207,255,0.25)]",
    border: "hover:border-cyan-500/40",
  },
  blue: {
    gradient: "from-blue-400 to-indigo-500",
    iconBg: "bg-blue-500/15",
    iconText: "text-blue-400",
    glow: "hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]",
    border: "hover:border-blue-500/40",
  },
  purple: {
    gradient: "from-purple-400 to-pink-500",
    iconBg: "bg-purple-500/15",
    iconText: "text-purple-400",
    glow: "hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]",
    border: "hover:border-purple-500/40",
  },
  emerald: {
    gradient: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-400",
    glow: "hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]",
    border: "hover:border-emerald-500/40",
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
      whileHover={{ scale: 1.025, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "flex-1 min-w-[180px] rounded-2xl p-5 shadow-lg border transition-all duration-300 cursor-default",
        accent.glow,
        accent.border,
        isDark
          ? "bg-slate-800/80 text-white border-white/8 backdrop-blur-xl"
          : "bg-white text-gray-800 border-slate-200",
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
              accent.iconText,
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
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
              isUp ? "trend-up" : "trend-down",
            )}
          >
            {isUp ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
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
          "text-sm font-medium mt-1",
          isDark ? "text-slate-400" : "text-slate-500",
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
