import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  children,
  className = "",
}: {
  children: (argument: { passwordVisible: boolean }) => React.ReactNode;
  className?: string;
  isDark?: boolean;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <div className="relative w-full">
      <div
        className={`flex items-center w-full rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#00cfff]/60 focus-within:bg-white/10 transition-all duration-200 ${className}`}
      >
        {children({ passwordVisible })}
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          className="p-3 text-gray-400 hover:text-white focus:outline-none transition-colors cursor-pointer"
        >
          {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
