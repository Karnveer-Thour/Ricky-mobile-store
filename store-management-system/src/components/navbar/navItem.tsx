"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, MouseEventHandler } from "react";
import cn from "classnames";

interface NavitemProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  menu?: MouseEventHandler<HTMLAnchorElement>;
  linkTo: string;
  isDark?: boolean;
}

const Navitem: React.FC<NavitemProps> = ({
  icon,
  label,
  isOpen,
  menu,
  linkTo,
  isDark = true,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = linkTo !== "" && pathname === linkTo;

  const handleWarmup = () => {
    if (linkTo) router.prefetch(linkTo);
  };

  const handlePointerDown = () => {
    if (linkTo && pathname !== linkTo) {
      if (typeof window !== "undefined" && (window as any).__navProgressStart) {
        (window as any).__navProgressStart();
      }
      router.push(linkTo);
    }
  };

  return (
    <div
      onMouseEnter={handleWarmup}
      onFocus={handleWarmup}
      className="relative group flex items-center"
    >
      <Link
        href={linkTo}
        prefetch={true}
        onClick={menu}
        onPointerDown={handlePointerDown}
        className={cn(
          "w-full flex items-center gap-3 rounded-xl cursor-pointer overflow-hidden transition-all duration-150 relative select-none",
          isOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
          isActive
            ? isDark
              ? "bg-cyan-500/15 text-cyan-300 font-bold shadow-[inset_0_0_14px_rgba(0,207,255,0.2)] border border-cyan-500/30"
              : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200/90 shadow-xs"
            : isDark
              ? "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent active:bg-white/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 border border-transparent active:bg-slate-200/70",
        )}
      >
        {/* Active glowing indicator */}
        {isActive && (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r",
              isDark
                ? "bg-cyan-400 shadow-[0_0_10px_rgba(0,207,255,0.9)]"
                : "bg-cyan-500 shadow-[0_0_8px_rgba(0,207,255,0.6)]",
            )}
          />
        )}

        {/* Icon */}
        <span
          className={cn(
            "shrink-0 transition-transform duration-100 group-hover:scale-105",
            isActive
              ? isDark
                ? "text-cyan-400"
                : "text-cyan-600"
              : isDark
                ? "text-slate-400 group-hover:text-cyan-300"
                : "text-slate-500 group-hover:text-slate-800",
            isOpen ? "ml-1" : "",
          )}
        >
          {icon}
        </span>

        {/* Label — shown only when sidebar is expanded */}
        {isOpen && (
          <span className="text-xs font-semibold whitespace-nowrap truncate">
            {label}
          </span>
        )}
      </Link>

      {/* Floating Tooltip when collapsed */}
      {!isOpen && (
        <div
          className={cn(
            "absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-75 z-50",
            isDark
              ? "bg-slate-900 border border-slate-700 text-cyan-300 shadow-cyan-950/50"
              : "bg-slate-900 text-white border border-slate-800 shadow-slate-400/40",
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default Navitem;
