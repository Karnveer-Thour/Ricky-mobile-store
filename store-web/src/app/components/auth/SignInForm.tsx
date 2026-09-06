import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

interface SignInFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div>
        <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50 transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">
            Password
          </label>
          <span className="text-[10px] text-[#00cfff] hover:underline cursor-pointer">
            Forgot?
          </span>
        </div>
        <div className="relative">
          <Lock
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="w-full py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl hover:bg-[#00cfff]/90 transition-all tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00cfff]/20 disabled:opacity-50 mt-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "SIGN IN"}
      </button>
    </form>
  );
}
