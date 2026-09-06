import React from "react";
import { Building2 } from "lucide-react";
import { AdminProfileData } from "./types";

interface ProfileStoreTabProps {
  profile: AdminProfileData;
  isDark: boolean;
  onChange: (field: keyof AdminProfileData, value: string) => void;
}

export default function ProfileStoreTab({
  profile,
  isDark,
  onChange,
}: ProfileStoreTabProps) {
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
        <Building2
          size={18}
          className={isDark ? "text-cyan-400" : "text-cyan-600"}
        />
        <span>Store Location & Invoicing Address</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5 md:col-span-2">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Store Outlet Name
          </label>
          <input
            type="text"
            value={profile.store_name}
            onChange={(e) => onChange("store_name", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label
            className={`font-bold ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Street Address
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => onChange("address", e.target.value)}
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
            City
          </label>
          <input
            type="text"
            value={profile.city}
            onChange={(e) => onChange("city", e.target.value)}
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
            State
          </label>
          <input
            type="text"
            value={profile.state}
            onChange={(e) => onChange("state", e.target.value)}
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
            PIN Code
          </label>
          <input
            type="text"
            value={profile.pincode}
            onChange={(e) => onChange("pincode", e.target.value)}
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
            Business GSTIN
          </label>
          <input
            type="text"
            value={profile.gstin}
            onChange={(e) => onChange("gstin", e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
              isDark
                ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
