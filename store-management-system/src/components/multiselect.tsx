import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import cn from "classnames";

interface MultiselectProps {
  Heading: React.ReactNode;
  children: React.ReactNode;
  isDark?: boolean;
}

function Multiselect({
  Heading,
  children,
  isDark: isDarkProp,
}: MultiselectProps) {
  const reduxDark = useSelector(
    (state: storeType) => state.DarkMode?.isDarkMode,
  );
  const isDark = isDarkProp !== undefined ? isDarkProp : (reduxDark ?? false);

  const [selectorOpened, setSelectorOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  const hideSelector = useCallback((e: { target: any }) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) && // Click is outside the menu
      buttonRef.current &&
      !buttonRef.current.contains(e.target) // Click is outside the button
    ) {
      setSelectorOpened(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", hideSelector);
    return () => {
      document.removeEventListener("mousedown", hideSelector);
    };
  }, [hideSelector]);

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "w-full px-4 py-2.5 border rounded-xl text-sm font-medium flex justify-between items-center cursor-pointer transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#00cfff]/30",
          isDark
            ? "bg-slate-900 border-slate-700/60 text-white hover:border-[#00cfff]/60"
            : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs",
        )}
        onClick={() => setSelectorOpened((prev) => !prev)}
        aria-expanded={selectorOpened}
      >
        <span className="text-sm font-medium">{Heading}</span>
        {selectorOpened ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dropdown Menu */}
      {selectorOpened && (
        <div
          ref={menuRef}
          className={cn(
            "absolute w-full h-auto p-4 border mt-1.5 rounded-2xl shadow-xl z-50 transition-all duration-150 backdrop-blur-xl",
            isDark
              ? "bg-slate-900/95 border-slate-700 text-white shadow-black/60"
              : "bg-white border-slate-200 text-slate-800 shadow-slate-300/50",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Multiselect;
