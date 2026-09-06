"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, PanelLeftClose } from "lucide-react";
import cn from "classnames";

interface NavbarBrandHeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDark?: boolean;
}

export default function NavbarBrandHeader({
  isOpen,
  toggleSidebar,
  isDark = true,
}: NavbarBrandHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3.5 py-4 border-b shrink-0 h-18 transition-colors",
        isDark ? "border-white/5" : "border-slate-100",
      )}
    >
      <div
        onClick={!isOpen ? toggleSidebar : undefined}
        className={cn(
          "flex items-center gap-3 cursor-pointer select-none",
          !isOpen && "w-full justify-center",
        )}
        title={!isOpen ? "Expand Sidebar" : undefined}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 hover:scale-105 transition-transform">
          <Smartphone size={18} className="text-slate-950 stroke-[2.5]" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden min-w-0"
            >
              <p
                className={cn(
                  "font-extrabold text-sm leading-none whitespace-nowrap",
                  isDark ? "text-white" : "text-slate-900",
                )}
              >
                Ricky Store
              </p>
              <p className="text-cyan-500 text-[10px] font-bold tracking-wide whitespace-nowrap mt-1">
                Management Hub
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              isDark
                ? "text-slate-400 hover:text-white hover:bg-white/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
            )}
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose size={17} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
