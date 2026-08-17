"use client";
import React from "react";
import { motion } from "framer-motion";

interface BlurredPopupLayoutProps {
  isDark?: boolean;
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

function BlurredPopupLayout({
  isDark = false,
  width,
  height,
  children,
}: BlurredPopupLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-screen h-screen flex justify-center items-center backdrop-blur-md bg-black/60 z-50 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`flex flex-col justify-between items-center gap-4 w-[90%] sm:w-[50%] md:w-[40%] rounded-2xl shadow-2xl p-6 ${
          isDark
            ? "bg-slate-900/90 text-white border border-white/10 shadow-[0_0_30px_rgba(0,207,255,0.15)]"
            : "bg-white/95 text-gray-800 border border-gray-200"
        }`}
        style={{ width, height }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default BlurredPopupLayout;
