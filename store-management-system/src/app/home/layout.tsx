"use client";
import Navbar from "@/components/navbar/navbar";
import { storeType } from "@/types/store.index";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  // Prevent flash of unstyled / blank content during redux-persist rehydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  if (!mounted) {
    return (
      <div
        className={classNames(
          "flex min-h-screen items-center justify-center transition-colors duration-200",
          isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800",
        )}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Animated logo mark */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 animate-ping" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <span className="text-2xl font-black text-slate-950">R</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-white">Ricky Mobile Store</p>
            <p className="text-xs text-slate-500">Loading your workspace...</p>
          </div>
          {/* Slim progress bar */}
          <div className="w-32 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-[loading_0.8s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "flex min-h-screen transition-colors duration-200 antialiased",
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800",
      )}
    >
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content Area */}
      <main
        className={classNames(
          "flex-1 min-h-screen flex flex-col will-change-transform transition-[margin] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pb-8",
          isOpen ? "md:ml-64" : "md:ml-[72px]",
        )}
      >
        {children}
      </main>

      {/* Subtle Footer */}
      <footer
        className={classNames(
          "fixed bottom-0 left-0 w-full h-6 z-40 flex items-center justify-center border-t transition-colors duration-200 pointer-events-none select-none",
          isDark
            ? "bg-slate-950/80 backdrop-blur-sm border-white/5 text-slate-500"
            : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-400",
        )}
      >
        <p className="text-[11px] font-medium">
          © {new Date().getFullYear()} Ricky Mobile Store Enterprise Management
        </p>
      </footer>
    </div>
  );
}
