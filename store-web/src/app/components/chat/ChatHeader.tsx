import React from "react";
import { X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-ricky-accent-green-light)] animate-pulse" />
        <span className="text-sm font-semibold text-white">
          EMI Eligibility Bot
        </span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
      >
        <X size={18} />
      </button>
    </div>
  );
}
