"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import cn from "classnames";

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
  isDark = true,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "max-w-xl",
  onClose,
}: BlurredPopupLayoutProps) {
  const router = useRouter();

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
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-screen h-screen flex justify-center items-center backdrop-blur-xl bg-slate-950/75 z-50 p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className={cn(
          "relative flex flex-col w-full rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh]",
          maxWidth,
          isDark
            ? "bg-slate-900/95 text-white border-t-2 border-cyan-400 border-x border-b border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(0,207,255,0.12)]"
            : "bg-white text-slate-800 border border-slate-200 shadow-2xl",
        )}
      >
        {/* Header if title provided */}
        {(title || icon) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default BlurredPopupLayout;
