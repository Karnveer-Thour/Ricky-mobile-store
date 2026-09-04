import React from "react";
import { AlertCircle } from "lucide-react";
import cn from "classnames";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

interface InputContainerProps {
  type?: string;
  label?: string;
  children: React.ReactNode;
  error?: { message?: string } | any;
  isDark?: boolean;
  required?: boolean;
  className?: string;
}

function Inputcontainer({
  type,
  label,
  children,
  error,
  required = false,
  className = "",
  isDark: isDarkProp,
}: InputContainerProps) {
  const reduxDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const isDark = isDarkProp !== undefined ? isDarkProp : reduxDark ?? false;

  const displayLabel =
    label || (type ? type[0].toUpperCase() + type.slice(1) : "");

  return (
    <div className={cn("w-full mb-4", className)}>
      {displayLabel && (
        <label
          htmlFor={type}
          className={cn(
            "flex items-center gap-1 text-xs font-semibold tracking-wide mb-1.5",
            isDark ? "text-slate-300" : "text-slate-700",
          )}
        >
          <span>{displayLabel}</span>
          {required && (
            <span className={isDark ? "text-cyan-400 font-bold" : "text-cyan-600 font-bold"}>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs text-rose-500 font-medium">
          <AlertCircle size={12} className="shrink-0" />
          <span>
            {typeof error === "string"
              ? error
              : error.message || "This field is required"}
          </span>
        </p>
      )}
    </div>
  );
}

export default Inputcontainer;
