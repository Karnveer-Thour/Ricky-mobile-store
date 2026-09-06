import React from "react";
import { Send } from "lucide-react";
import { CannedReply } from "./types";

interface ChatInputBarProps {
  inputText: string;
  onInputChange: (val: string) => void;
  onSend: (textToSend?: string) => void;
  cannedReplies: CannedReply[];
  isDark: boolean;
}

export default function ChatInputBar({
  inputText,
  onInputChange,
  onSend,
  cannedReplies,
  isDark,
}: ChatInputBarProps) {
  return (
    <div className="shrink-0">
      {/* Quick Canned Responses Bar */}
      <div
        className={`px-3 py-2 border-t flex items-center gap-2 overflow-x-auto ${
          isDark
            ? "bg-slate-950/60 border-slate-800/80"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <span
          className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Quick Actions:
        </span>
        {cannedReplies.map((canned, i) => (
          <button
            key={i}
            onClick={() => onSend(canned.text)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
              isDark
                ? "bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs"
            }`}
          >
            {canned.icon}
            <span>{canned.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div
        className={`p-3 border-t flex items-center gap-2 ${
          isDark
            ? "border-slate-800 bg-slate-900/90"
            : "border-slate-200 bg-white"
        }`}
      >
        <input
          type="text"
          placeholder="Type your response or paste payment link..."
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          className={`flex-1 px-4 py-2.5 rounded-xl text-xs outline-none transition-colors border ${
            isDark
              ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600 focus:bg-white"
          }`}
        />
        <button
          onClick={() => onSend()}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
