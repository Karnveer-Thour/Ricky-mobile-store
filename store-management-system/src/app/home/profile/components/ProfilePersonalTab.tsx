import React from "react";
import { User } from "lucide-react";
import { AdminProfileData } from "./types";

interface ProfilePersonalTabProps {
  profile: AdminProfileData;
  isDark: boolean;
  onChange: (field: keyof AdminProfileData, value: string) => void;
}

export default function ProfilePersonalTab({
  profile,
  isDark,
  onChange,
}: ProfilePersonalTabProps) {
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
        <User
          size={18}
          className={isDark ? "text-cyan-400" : "text-cyan-600"}
        />
        <span>Personal & Account Credentials</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            First Name
          </label>
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) => onChange("first_name", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Last Name
          </label>
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) => onChange("last_name", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Official Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Mobile Phone
          </label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Admin Role
          </label>
          <input
            type="text"
            value={profile.role}
            onChange={(e) => onChange("role", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Branch Authority
          </label>
          <input
            type="text"
            disabled
            value="Head Office & Flagship Hub"
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none cursor-not-allowed ${
              isDark
                ? "bg-slate-900 border border-slate-800 text-slate-400"
                : "bg-slate-100 border border-slate-200 text-slate-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
