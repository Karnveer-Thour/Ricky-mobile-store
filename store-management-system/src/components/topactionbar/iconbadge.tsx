"use client";
import React from "react";

interface IconbadgeProps {
  children: React.ReactNode;
  unreadcount?: number;
  isDark: boolean;
}

function Iconbadge({
  children,
  unreadcount,
  isDark,
}: IconbadgeProps): React.JSX.Element {
  return (
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
        isDark
          ? "bg-slate-800/80 border border-white/10 hover:border-cyan-500/50 hover:bg-slate-700/80 text-slate-300"
          : "bg-slate-100/90 border border-slate-200/90 hover:border-cyan-400 hover:bg-slate-200/70 text-slate-700 shadow-xs"
      } cursor-pointer`}
    >
      <div className="relative flex items-center justify-center">
        {children}
        {unreadcount !== undefined && unreadcount > 0 && (
          <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-md shadow-cyan-500/30 ring-2 ring-white dark:ring-slate-900">
            {unreadcount > 99 ? "99+" : unreadcount}
          </span>
        )}
      </div>
    </div>
  );
}

export default Iconbadge;
