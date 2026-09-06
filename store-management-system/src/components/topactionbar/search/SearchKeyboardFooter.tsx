import React from "react";

interface SearchKeyboardFooterProps {
  isDark: boolean;
}

export default function SearchKeyboardFooter({
  isDark,
}: SearchKeyboardFooterProps) {
  const kbdClass = `px-1.5 py-0.5 rounded border text-[10px] font-semibold ${
    isDark
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-slate-300 text-slate-700 shadow-2xs"
  }`;

  return (
    <div
      className={`px-4 py-2.5 border-t-2 flex items-center justify-between text-[11px] ${
        isDark
          ? "bg-slate-950/80 border-slate-800 text-slate-400"
          : "bg-slate-100/90 border-slate-200 text-slate-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>
          <kbd className={kbdClass}>↑↓</kbd> Navigate
        </span>
        <span>
          <kbd className={kbdClass}>↵</kbd> Select
        </span>
        <span>
          <kbd className={kbdClass}>esc</kbd> Close
        </span>
      </div>
      <span className="text-cyan-600 dark:text-cyan-400 font-bold">
        Ricky Enterprise CMS
      </span>
    </div>
  );
}
