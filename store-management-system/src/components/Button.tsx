import React from "react";
import { Loader2 } from "lucide-react";
import cn from "classnames";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "name"> {
  name: React.ReactNode;
  handler?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  isDark?: boolean;
}

function Button({
  name,
  handler,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "submit",
  icon,
  isDark: isDarkProp,
  ...props
}: ButtonProps) {
  const reduxDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const isDark = isDarkProp !== undefined ? isDarkProp : reduxDark ?? false;

  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[#00cfff] hover:bg-[#00b8e6] text-slate-950 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30",
    secondary: isDark
      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600"
      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-xs",
    ghost: isDark
      ? "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-white/10"
      : "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200",
    danger:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20",
  };

  return (
    <button
      type={type}
      onClick={handler}
      disabled={disabled || loading}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon}
          <span>{name}</span>
        </>
      )}
    </button>
  );
}

export default Button;
