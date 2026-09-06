import React, { forwardRef } from "react";
import cn from "classnames";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  className?: string;
  customMargin?: string;
  isDark?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      placeholder,
      className = "",
      customMargin,
      isDark: isDarkProp,
      ...props
    },
    ref,
  ) => {
    const reduxDark = useSelector(
      (state: storeType) => state.DarkMode?.isDarkMode,
    );
    const isDark = isDarkProp !== undefined ? isDarkProp : (reduxDark ?? false);

    return (
      <input
        ref={ref}
        id={id}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#00cfff]/30",
          isDark
            ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:border-[#00cfff] focus:bg-slate-900/90"
            : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#00cfff] focus:bg-white shadow-xs",
          customMargin,
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
