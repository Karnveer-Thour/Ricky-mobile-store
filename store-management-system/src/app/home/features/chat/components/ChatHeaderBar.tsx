import React from "react";
import { MessageSquare, Volume2, VolumeX } from "lucide-react";

interface ChatHeaderBarProps {
  isDark: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function ChatHeaderBar({
  isDark,
  soundEnabled,
  onToggleSound,
}: ChatHeaderBarProps) {
  return (
    <div
      className={`pb-3 flex items-center justify-between shrink-0 border-b ${
        isDark ? "border-white/10" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-purple-500/20">
          <MessageSquare size={22} />
        </div>
        <div>
          <h1
            className={`text-2xl font-extrabold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Customer Support &amp; EMI Recovery Hub
          </h1>
          <p
            className={`text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Live resolution for Bajaj Cardless EMI, UPI Split payments and order
            inquiries
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            soundEnabled
              ? isDark
                ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                : "bg-purple-50 border-purple-200 text-purple-700"
              : isDark
                ? "bg-slate-800 border-slate-700 text-slate-400"
                : "bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{soundEnabled ? "Audio Chime On" : "Muted"}</span>
        </button>
      </div>
    </div>
  );
}
