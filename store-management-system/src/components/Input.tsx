import React, { forwardRef } from "react";
import cn from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  className?: string;
  customMargin?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, placeholder, className = "", customMargin, ...props }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-500",
          "bg-slate-950/60 border border-slate-700/60",
          "focus:outline-none focus:border-[#00cfff] focus:ring-1 focus:ring-[#00cfff]/30 focus:bg-slate-900/90",
          "transition-all duration-150",
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
