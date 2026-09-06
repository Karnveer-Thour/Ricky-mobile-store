"use client";
import { toggleDarkMode } from "@/store/slices/isDarkMode.slice";
import { storeType } from "@/types/store.index";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";

function DarkModeToggle() {
  const isDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
        isDark
          ? "bg-slate-800/90 border-slate-700/80 hover:border-cyan-500/50 text-slate-200"
          : "bg-slate-100 border-slate-200 hover:border-amber-400/80 text-slate-700 shadow-xs"
      }`}
      aria-label="Toggle dark mode"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
          isDark ? "text-cyan-400" : "text-amber-500"
        }`}
      >
        {isDark ? (
          <Moon size={14} className="fill-cyan-400/20" />
        ) : (
          <Sun size={14} className="fill-amber-400/30" />
        )}
      </div>
      <span className="text-xs font-semibold select-none">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}

export default DarkModeToggle;
