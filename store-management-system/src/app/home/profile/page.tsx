"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeType } from "@/types/store.index";
import Topactionbar from "@/components/topactionbar/topactionbar";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";
import { useRouter } from "next/navigation";
import { User, Store, Lock, Save } from "lucide-react";
import {
  AdminProfileData,
  DEFAULT_PROFILE,
  STORAGE_KEY,
  ProfileTabId,
  ProfileHeroCard,
  ProfilePersonalTab,
  ProfileStoreTab,
  ProfileSecurityTab,
} from "./components";

export default function ProfilePage() {
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const dispatch = useDispatch();
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfileData>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("general");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setProfile(JSON.parse(saved));
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
        }
      } catch {}
    }
  }, []);

  const handleChange = (field: keyof AdminProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleChange("imageURL", reader.result);
          dispatch(
            SUCCESSALERT("Profile picture updated! Click Save to confirm."),
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    openGlobalConfirm(dispatch, {
      title: "Sign Out of Administrative Portal?",
      message: "Are you sure you want to end your session on this device?",
      confirmText: "Yes, Sign Out",
      cancelText: "Stay Logged In",
      variant: "danger",
      onConfirm: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("auth");
        }
        dispatch(SUCCESSALERT("Signed out successfully."));
        router.push("/auth/login");
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        localStorage.setItem(
          "name",
          `${profile.first_name} ${profile.last_name}`.trim(),
        );
        window.dispatchEvent(new Event("storage"));
      }

      setTimeout(() => {
        setIsSaving(false);
        dispatch(
          SUCCESSALERT("Admin Profile & Store details saved successfully!"),
        );
      }, 400);
    } catch {
      setIsSaving(false);
      dispatch(ERRORALERT("Failed to save profile changes."));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      <Topactionbar isDark={isDark} />

      <div className="w-[95%] mx-auto px-2 max-w-6xl space-y-6">
        {/* Header Title & Tabs */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
            isDark ? "border-white/10" : "border-slate-200"
          } pb-4`}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <User size={26} />
            </div>
            <div>
              <h1
                className={`text-2xl font-extrabold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Administrator Profile & Store Settings
              </h1>
              <p
                className={`text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Manage your credentials, store outlet details, and security
                preferences
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 p-1 rounded-xl self-start ${
              isDark
                ? "bg-slate-900/80 border border-slate-800"
                : "bg-slate-100 border border-slate-200"
            }`}
          >
            {[
              {
                id: "general",
                label: "Personal Info",
                icon: <User size={14} />,
              },
              {
                id: "store",
                label: "Store & Branch",
                icon: <Store size={14} />,
              },
              { id: "security", label: "Security", icon: <Lock size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ProfileTabId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <ProfileHeroCard
          profile={profile}
          isDark={isDark}
          isSaving={isSaving}
          onAvatarUpload={handleAvatarUpload}
          onLogout={handleLogout}
          onSave={handleSave}
        />

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === "general" && (
            <ProfilePersonalTab
              profile={profile}
              isDark={isDark}
              onChange={handleChange}
            />
          )}

          {activeTab === "store" && (
            <ProfileStoreTab
              profile={profile}
              isDark={isDark}
              onChange={handleChange}
            />
          )}

          {activeTab === "security" && (
            <ProfileSecurityTab
              isDark={isDark}
              onLogout={handleLogout}
              onChangePassword={() =>
                dispatch(
                  SUCCESSALERT(
                    "Password reset OTP sent to registered admin email",
                  ),
                )
              }
            />
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Save size={16} />
              <span>{isSaving ? "Saving changes..." : "Save All Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
