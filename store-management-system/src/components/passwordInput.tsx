import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import cn from "classnames";

const PasswordInput = ({
  children,
  className = "",
  isDark: isDarkProp,
}: {
  children: (argument: { passwordVisible: boolean }) => React.ReactNode;
  className?: string;
  isDark?: boolean;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const reduxDark = useSelector(
    (state: storeType) => state.DarkMode?.isDarkMode,
  );
  const isDark = isDarkProp !== undefined ? isDarkProp : (reduxDark ?? false);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "flex items-center w-full rounded-xl border transition-all duration-200 focus-within:border-[#00cfff] focus-within:ring-1 focus-within:ring-[#00cfff]/30",
          isDark
            ? "bg-slate-950/60 border-slate-700/60 focus-within:bg-slate-900/90"
            : "bg-slate-50 border-slate-200 focus-within:bg-white shadow-xs",
          className,
        )}
      >
        {children({ passwordVisible })}
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          className={cn(
            "p-3 transition-colors cursor-pointer",
            isDark
              ? "text-slate-400 hover:text-white"
              : "text-slate-400 hover:text-slate-800",
          )}
        >
          {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
