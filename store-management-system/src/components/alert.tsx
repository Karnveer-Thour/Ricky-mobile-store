"use client";
import { CLOSEALERT } from "@/store/slices/alert.slice";
import { storeType } from "@/types/store.index";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

const Alert = () => {
  const [isVisible, setVisible] = useState(true);
  const { type, message, id } = useSelector(
    (store: storeType) => store.Alert || {},
  );
  const dispatchAlert = useDispatch();

  const alertStyles = {
    success:
      "bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20",
    error: "bg-rose-950/90 border-rose-500/50 text-rose-300 shadow-rose-500/20",
  };

  const closeAlertLogic = (closeTime?: number, reVisibleTime?: number) => {
    if (type) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          dispatchAlert(CLOSEALERT());
          setVisible(true);
        }, reVisibleTime || 1000);
      }, closeTime || 3500);

      return () => clearTimeout(timer);
    }
  };

  const handleClose = () => {
    closeAlertLogic(100, 300);
  };

  useEffect(() => {
    return closeAlertLogic(3500, 800);
  }, [id]);

  return (
    <AnimatePresence>
      {type && isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`z-50 border px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl fixed bottom-6 right-6 max-md:left-6 flex items-center gap-3 max-w-md ${
            alertStyles[type]
          }`}
          role="alert"
          aria-live="assertive"
        >
          {type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle size={20} className="text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium pr-6">{message}</span>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-current opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
