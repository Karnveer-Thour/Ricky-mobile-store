import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import cn from "classnames";

interface toggleButtonProps {
  isDark?: boolean;
  activeLabel: string;
  inactiveLabel: string;
  handler: (active: boolean) => void;
  formProp?: any;
  active?: boolean;
  defaultActive?: boolean;
  activeDefault?: boolean;
}

function ToggleButton({
  isDark: isDarkProp,
  activeLabel,
  inactiveLabel,
  handler,
  formProp = {},
  active,
  defaultActive,
  activeDefault,
}: toggleButtonProps) {
  const reduxDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const isDark = isDarkProp !== undefined ? isDarkProp : reduxDark ?? false;

  const initial = active ?? defaultActive ?? activeDefault ?? false;
  const [isActive, setIsActive] = useState(initial);

  useEffect(() => {
    if (active !== undefined) {
      setIsActive(active);
    }
  }, [active]);

  useEffect(() => {
    setIsActive(defaultActive ?? activeDefault ?? false);
  }, [defaultActive, activeDefault]);

  const toggle = () => {
    const next = !isActive;
    setIsActive(next);
    handler(next);
  };

  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isActive}
          onChange={toggle}
          {...formProp}
        />
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-colors duration-200",
            isActive
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xs"
              : isDark
                ? "bg-slate-800 border border-slate-700"
                : "bg-slate-200 border border-slate-300",
          )}
        />
        <div
          className={cn(
            "absolute w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200",
            isActive ? "translate-x-5.5" : "translate-x-1",
          )}
        />
      </label>
      <span
        className={cn(
          "ml-2.5 font-semibold text-xs transition-colors select-none",
          isActive
            ? isDark
              ? "text-cyan-400"
              : "text-cyan-700"
            : isDark
              ? "text-slate-400"
              : "text-slate-500",
        )}
      >
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}

export default ToggleButton;
