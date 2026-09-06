"use client";
import React from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import cn from "classnames";

interface CardProps {
  children: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

function Card({ children, isDark: isDarkProp, className = "" }: CardProps) {
  const reduxDark = useSelector(
    (state: storeType) => state.DarkMode?.isDarkMode,
  );
  const isDark = isDarkProp !== undefined ? isDarkProp : (reduxDark ?? false);

  return (
    <div
      className={cn(
        "w-[95%] h-auto mt-8 rounded-3xl border py-10 overflow-hidden flex items-center max-sm:flex-col max-sm:justify-center sm:ms-7 max-sm:ms-4 transition-colors duration-200",
        isDark
          ? "bg-slate-900 text-white border-slate-800 shadow-xl shadow-black/20"
          : "bg-white text-slate-800 border-slate-200 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
