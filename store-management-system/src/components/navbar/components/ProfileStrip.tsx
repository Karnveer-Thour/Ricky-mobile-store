"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronUp, ChevronDown } from "lucide-react";
import cn from "classnames";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ProfileStripProps {
  isOpen: boolean;
  isDark?: boolean;
  menuVisible: boolean;
  adminName: string;
  adminRole: string;
  adminAvatar: string;
  adminInitials: string;
  onClick: () => void;
}

export default function ProfileStrip({
  isOpen,
  isDark = true,
  menuVisible,
  adminName,
  adminRole,
  adminAvatar,
  adminInitials,
  onClick,
}: ProfileStripProps) {
  const pathname = usePathname();

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-150 group select-none",
        !isOpen && "justify-center",
        menuVisible || pathname === "/home/profile"
          ? isDark
            ? "bg-cyan-500/15 border border-cyan-500/30"
            : "bg-cyan-50 border border-cyan-200"
          : isDark
            ? "hover:bg-white/5"
            : "hover:bg-slate-100",
      )}
      title="Click for Profile & Logout options"
    >
      {adminAvatar ? (
        <Image
          src={adminAvatar}
          alt="Admin"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover shrink-0 border border-cyan-400/40"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-cyan-400/30">
          <span className="text-white text-xs font-extrabold">
            {adminInitials}
          </span>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            <p
              className={cn(
                "text-xs font-bold truncate whitespace-nowrap transition-colors",
                isDark
                  ? "text-white group-hover:text-cyan-400"
                  : "text-slate-800 group-hover:text-cyan-700",
              )}
            >
              {adminName}
            </p>
            <p
              className={cn(
                "text-[10px] truncate whitespace-nowrap flex items-center gap-1",
                isDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              <ShieldCheck size={10} className="text-cyan-500" />
              {adminRole}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className={cn(
            "transition-colors shrink-0",
            isDark
              ? "text-slate-500 group-hover:text-cyan-400"
              : "text-slate-400 group-hover:text-slate-700",
          )}
        >
          {menuVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      )}
    </div>
  );
}
