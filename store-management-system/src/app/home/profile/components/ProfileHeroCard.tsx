import React from "react";
import {
  Camera,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Save,
} from "lucide-react";
import Image from "next/image";
import { AdminProfileData } from "./types";

interface ProfileHeroCardProps {
  profile: AdminProfileData;
  isDark: boolean;
  isSaving: boolean;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
  onSave: (e: React.FormEvent) => void;
}

export default function ProfileHeroCard({
  profile,
  isDark,
  isSaving,
  onAvatarUpload,
  onLogout,
  onSave,
}: ProfileHeroCardProps) {
  return (
    <div
      className={`p-6 rounded-3xl border transition-all ${
        isDark
          ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl"
          : "bg-white border-slate-200 shadow-sm"
      } flex flex-col md:flex-row items-center justify-between gap-6`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        {/* Avatar with live upload */}
        <div className="relative group">
          <Image
            src={
              profile.imageURL ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricky"
            }
            alt="Admin Avatar"
            width={96}
            height={96}
            className={`w-24 h-24 rounded-full object-cover border-3 shadow-xl ${
              isDark
                ? "border-cyan-400/50 bg-slate-800"
                : "border-cyan-500/40 bg-slate-100"
            }`}
          />
          <label
            className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-500 text-slate-950 cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-transform"
            title="Change Avatar"
          >
            <Camera size={15} className="stroke-[2.5]" />
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2
              className={`text-xl font-extrabold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {profile.first_name} {profile.last_name}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                isDark
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-cyan-50 text-cyan-800 border border-cyan-200"
              }`}
            >
              <ShieldCheck size={11} />
              {profile.role}
            </span>
          </div>
          <p
            className={`text-xs flex items-center justify-center sm:justify-start gap-1.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <Mail
              size={12}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
            <span>{profile.email}</span>
            <span className={isDark ? "text-slate-600" : "text-slate-300"}>
              •
            </span>
            <Phone
              size={12}
              className={isDark ? "text-emerald-400" : "text-emerald-600"}
            />
            <span>{profile.phone}</span>
          </p>
          <p
            className={`text-[11px] flex items-center justify-center sm:justify-start gap-1 pt-1 ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <Calendar size={11} />
            <span>Store Admin Member since {profile.joined_date}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onLogout}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isDark
              ? "bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400"
              : "bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 shadow-xs"
          }`}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Save size={15} />
          <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
        </button>
      </div>
    </div>
  );
}
