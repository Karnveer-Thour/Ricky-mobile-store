"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeType } from "@/types/store.index";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertOctagon, Info, X, Loader2 } from "lucide-react";
import {
  executeConfirmAction,
  executeCancelAction,
} from "@/store/slices/confirm.slice";

export default function GlobalConfirmModal() {
  const dispatch = useDispatch();
  const confirmState = useSelector((state: storeType) => state.Confirm) || {};
  const isDark =
    useSelector((state: storeType) => state.DarkMode?.isDarkMode) ?? false;
  const {
    isOpen = false,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
  } = confirmState;

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: (
            <AlertOctagon
              size={28}
              className={isDark ? "text-rose-400" : "text-rose-600"}
            />
          ),
          badgeBg: isDark
            ? "bg-rose-500/15 border-rose-500/30"
            : "bg-rose-50 border-rose-200",
          confirmBtn:
            "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/30",
          accentBorder: isDark ? "border-rose-500/30" : "border-rose-200",
        };
      case "warning":
        return {
          icon: (
            <AlertTriangle
              size={28}
              className={isDark ? "text-amber-400" : "text-amber-600"}
            />
          ),
          badgeBg: isDark
            ? "bg-amber-500/15 border-amber-500/30"
            : "bg-amber-50 border-amber-200",
          confirmBtn:
            "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-amber-950/30 font-bold",
          accentBorder: isDark ? "border-amber-500/30" : "border-amber-200",
        };
      default:
        return {
          icon: (
            <Info
              size={28}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
          ),
          badgeBg: isDark
            ? "bg-cyan-500/15 border-cyan-500/30"
            : "bg-cyan-50 border-cyan-200",
          confirmBtn:
            "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-950/30 font-bold",
          accentBorder: isDark ? "border-cyan-500/30" : "border-cyan-200",
        };
    }
  };

  const currentVariant = getVariantStyles();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => !loading && executeCancelAction(dispatch)}
          className={`fixed inset-0 backdrop-blur-md ${
            isDark ? "bg-black/80" : "bg-slate-900/40"
          }`}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border p-6 flex flex-col items-center text-center space-y-4 ${
            isDark
              ? "bg-slate-900/95 backdrop-blur-2xl border-slate-700/80 shadow-black/80 text-white"
              : "bg-white border-slate-200 shadow-2xl shadow-slate-400/30 text-slate-900"
          }`}
        >
          {/* Top Close Button */}
          {!loading && (
            <button
              onClick={() => executeCancelAction(dispatch)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              }`}
              aria-label="Close confirmation"
            >
              <X size={18} />
            </button>
          )}

          {/* Icon Badge */}
          <div
            className={`p-3.5 rounded-2xl border ${currentVariant.badgeBg} shadow-sm`}
          >
            {currentVariant.icon}
          </div>

          {/* Title & Message */}
          <div className="space-y-1.5 max-w-sm">
            <h3
              className={`text-lg font-extrabold tracking-wide ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-xs leading-relaxed font-normal ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => executeCancelAction(dispatch)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors disabled:opacity-50 cursor-pointer ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => executeConfirmAction(dispatch)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${currentVariant.confirmBtn}`}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
