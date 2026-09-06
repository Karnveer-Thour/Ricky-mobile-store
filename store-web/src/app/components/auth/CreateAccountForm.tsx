import React from "react";
import { User, Phone, Mail, Lock, Loader2 } from "lucide-react";

interface CreateAccountFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  mobileNumber: string;
  setMobileNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateAccountForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  mobileNumber,
  setMobileNumber,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit,
}: CreateAccountFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            First Name
          </label>
          <div className="relative">
            <User
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              required
              placeholder="Ricky"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Sharma"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
          Phone Number (WhatsApp)
        </label>
        <div className="relative">
          <Phone
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
          />
        </div>
      </div>

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
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="password"
              required
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            Confirm
          </label>
          <input
            type="password"
            required
            placeholder="••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="w-full py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl hover:bg-[#00cfff]/90 transition-all tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00cfff]/20 disabled:opacity-50 mt-3"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "CREATE ACCOUNT"
        )}
      </button>
    </form>
  );
}
