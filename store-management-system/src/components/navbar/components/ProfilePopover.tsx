"use client";

import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import cn from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PROFILE_MENU_ITEMS } from "../navConfig";

interface ProfilePopoverProps {
  isOpen: boolean;
  isDark?: boolean;
  adminName: string;
  adminEmail: string;
  adminAvatar: string;
  adminInitials: string;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfilePopover({
  isOpen,
  isDark = true,
  adminName,
  adminEmail,
  adminAvatar,
  adminInitials,
  onClose,
  onLogout,
}: ProfilePopoverProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        y: isOpen ? 10 : 0,
        x: isOpen ? 0 : -10,
      }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: isOpen ? 8 : 0, x: isOpen ? 0 : -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "rounded-2xl overflow-hidden shadow-2xl border p-2 flex flex-col gap-1 z-50 transition-colors",
        isDark
          ? "bg-slate-900/98 backdrop-blur-2xl border-slate-700/80 shadow-cyan-950/50 text-slate-100"
          : "bg-white/98 backdrop-blur-2xl border-slate-200 shadow-slate-300/60 text-slate-800",
        isOpen
          ? "absolute bottom-full left-3 right-3 mb-2"
          : "absolute left-full bottom-2 ml-3 w-64 shadow-2xl shadow-black/30",
      )}
    >
      <div
        className={cn(
          "px-3 py-2.5 border-b flex items-center gap-2.5",
          isDark ? "border-white/10" : "border-slate-100",
        )}
      >
        {adminAvatar ? (
          <Image
            src={adminAvatar}
            alt="Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover border border-cyan-400/40 shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {adminInitials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs font-extrabold truncate",
              isDark ? "text-white" : "text-slate-800",
            )}
          >
            {adminName}
          </p>
          <p
            className={cn(
              "text-[10px] truncate",
              isDark ? "text-slate-400" : "text-slate-500",
            )}
          >
            {adminEmail}
          </p>
        </div>
      </div>

      {PROFILE_MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            onClose();
            router.push(item.linkTo);
          }}
          className={cn(
            "w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer",
            isDark
              ? "text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-400"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}

      <div
        className={cn(
          "border-t my-0.5",
          isDark ? "border-white/10" : "border-slate-100",
        )}
      />

      <button
        onClick={onLogout}
        className={cn(
          "w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer",
          isDark
            ? "text-rose-400 hover:bg-rose-500/15 hover:text-rose-300"
            : "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
        )}
      >
        <LogOut
          size={15}
          className={
            isDark ? "text-rose-400 shrink-0" : "text-rose-600 shrink-0"
          }
        />
        <span>Sign Out / Logout</span>
      </button>
    </motion.div>
  );
}
