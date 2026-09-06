import React from "react";
import { X } from "lucide-react";

interface AuthModalHeaderProps {
  mode: "login" | "register";
  onClose: () => void;
  onModeSwitch: (mode: "login" | "register") => void;
}

export default function AuthModalHeader({
  mode,
  onClose,
  onModeSwitch,
}: AuthModalHeaderProps) {
  return (
    <>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        aria-label="Close modal"
      >
        <X size={18} />
      </button>

      {/* Header Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00cfff]/10 border border-[#00cfff]/20 rounded-full text-[11px] text-[#00cfff] font-mono mb-3">
          RICKY MOBILE STORE · KHANNA
        </div>
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-3xl font-extrabold text-white tracking-wider"
        >
          {mode === "login"
            ? "SIGN IN TO YOUR ACCOUNT"
            : "CREATE A NEW ACCOUNT"}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {mode === "login"
            ? "Access orders, personalized wishlist & instant loan approval"
            : "Join Khanna's favorite smartphone & electronics store"}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-white/4 border border-white/8 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => onModeSwitch("login")}
          className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            mode === "login"
              ? "bg-[#00cfff] text-[#07070f] shadow-md shadow-[#00cfff]/20"
              : "text-gray-400 hover:text-white"
          }`}
        >
          SIGN IN
        </button>
        <button
          type="button"
          onClick={() => onModeSwitch("register")}
          className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            mode === "register"
              ? "bg-[#00cfff] text-[#07070f] shadow-md shadow-[#00cfff]/20"
              : "text-gray-400 hover:text-white"
          }`}
        >
          CREATE ACCOUNT
        </button>
      </div>
    </>
  );
}
