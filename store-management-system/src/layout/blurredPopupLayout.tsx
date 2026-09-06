"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import cn from "classnames";

import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

interface BlurredPopupLayoutProps {
  isDark?: boolean;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  maxWidth?: string;
  onClose?: () => void;
}

function BlurredPopupLayout({
  isDark: isDarkProp,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "max-w-xl",
  onClose,
}: BlurredPopupLayoutProps) {
  const router = useRouter();
  const reduxDark = useSelector(
    (state: storeType) => state.DarkMode?.isDarkMode,
  );
  const isDark = isDarkProp !== undefined ? isDarkProp : (reduxDark ?? false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) {
          onClose();
        } else {
          router.back();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 w-full h-full flex justify-center items-center backdrop-blur-xl z-50 p-2 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden box-border",
        isDark ? "bg-slate-950/80" : "bg-slate-900/40",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className={cn(
          "relative flex flex-col w-full rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] max-w-[calc(100vw-1rem)]",
          maxWidth,
          isDark
            ? "bg-slate-900/95 text-white border-t-2 border-cyan-400 border-x border-b border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(0,207,255,0.12)]"
            : "bg-white text-slate-800 border-t-2 border-cyan-500 border-x border-b border-slate-200 shadow-2xl shadow-slate-400/30",
        )}
      >
        {/* Header if title provided */}
        {(title || icon) && (
          <div
            className={cn(
              "flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b shrink-0 gap-3",
              isDark ? "border-slate-800/80" : "border-slate-100",
            )}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {icon && (
                <div
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border",
                    isDark
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700",
                  )}
                >
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h2
                    className={cn(
                      "text-base sm:text-xl font-bold tracking-tight truncate",
                      isDark ? "text-white" : "text-slate-900",
                    )}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p
                    className={cn(
                      "text-[11px] sm:text-xs mt-0.5 truncate",
                      isDark ? "text-slate-400" : "text-slate-500",
                    )}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className={cn(
                "p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer shrink-0",
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-100",
              )}
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-5">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BlurredPopupLayout;
