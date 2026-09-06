import React from "react";
import { Key, LogOut } from "lucide-react";

interface ProfileSecurityTabProps {
  isDark: boolean;
  onLogout: () => void;
  onChangePassword: () => void;
}

export default function ProfileSecurityTab({
  isDark,
  onLogout,
  onChangePassword,
}: ProfileSecurityTabProps) {
  return (
    <div
      className={`p-6 rounded-3xl border space-y-5 ${
        isDark
          ? "bg-slate-900/40 border-white/10"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <h3
        className={`text-base font-bold flex items-center gap-2 border-b pb-3 ${
          isDark
            ? "text-white border-white/5"
            : "text-slate-900 border-slate-100"
        }`}
      >
        <Key size={18} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
        <span>Security Credentials & Account Actions</span>
      </h3>

      <div className="space-y-4 text-xs">
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark
              ? "bg-slate-950/60 border-white/5"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <h4
              className={`font-bold text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Two-Factor Authentication (2FA)
            </h4>
            <p
              className={`mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Secure your admin portal with authenticator app protection
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Active & Protected
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark
              ? "bg-slate-950/60 border-white/5"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <h4
              className={`font-bold text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Password Security
            </h4>
            <p
              className={`mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Last updated 12 days ago • Minimum 8 chars with mixed case
            </p>
          </div>
          <button
            type="button"
            onClick={onChangePassword}
            className={`px-3.5 py-2 rounded-xl font-semibold border transition-colors cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs"
            }`}
          >
            Change Password
          </button>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark
              ? "bg-rose-500/5 border-rose-500/20"
              : "bg-rose-50/60 border-rose-200"
          }`}
        >
          <div>
            <h4
              className={`font-bold text-sm ${
                isDark ? "text-rose-400" : "text-rose-700"
              }`}
            >
              Sign Out from Device
            </h4>
            <p
              className={`mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Terminate current administrative session and lock workspace
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold hover:bg-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
