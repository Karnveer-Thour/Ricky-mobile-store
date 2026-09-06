"use client";

import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";

interface SectionLabelProps {
  label: string;
  isOpen: boolean;
  isDark?: boolean;
}

/**
 * Animated section category divider heading.
 * Visible only when the sidebar is in expanded mode.
 */
export default function SectionLabel({
  label,
  isOpen,
  isDark = true,
}: SectionLabelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="px-3 pt-3 pb-1"
        >
          <span
            className={cn(
              "text-[10px] font-bold tracking-widest uppercase select-none",
              isDark ? "text-slate-500" : "text-slate-400",
            )}
          >
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
