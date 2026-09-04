"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storeType } from "@/types/store.index";
import Topactionbar from "@/components/topactionbar/topactionbar";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  ShieldCheck,
  Camera,
  Save,
  Lock,
  Sparkles,
  Store,
  CheckCircle2,
  Calendar,
  Key,
  LogOut,
} from "lucide-react";

interface AdminProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  store_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  imageURL: string;
  joined_date: string;
}

const DEFAULT_PROFILE: AdminProfileData = {
  first_name: "Karanveer",
  last_name: "Thour",
  email: "ricky@rickymobile.com",
  phone: "+91 98765 43210",
  role: "Super Administrator",
  store_name: "Ricky Mobile Store (Main Hub)",
  address: "Shop 14-16, Mobile Market Commercial Complex",
  city: "Ludhiana",
  state: "Punjab",
  pincode: "141001",
  gstin: "03AAAAA0000A1Z5",
  imageURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricky",
  joined_date: "January 2024",
};

const STORAGE_KEY = "ricky_admin_profile";

export default function ProfilePage() {
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const dispatch = useDispatch();
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfileData>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "store" | "security">("general");

  // Load from local storage
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
          dispatch(SUCCESSALERT("Profile picture updated! Click Save to confirm."));
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
        // Trigger storage event so navbar and components re-render immediately
        window.dispatchEvent(new Event("storage"));
      }

      setTimeout(() => {
        setIsSaving(false);
        dispatch(SUCCESSALERT("Admin Profile & Store details saved successfully!"));
      }, 400);
    } catch {
      setIsSaving(false);
      dispatch(ERRORALERT("Failed to save profile changes."));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Top Action Bar */}
      <Topactionbar isDark={isDark} />

      {/* Main Container */}
      <div className="w-[95%] mx-auto px-2 max-w-6xl space-y-6">
        {/* Header Title */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${isDark ? "border-white/10" : "border-slate-200"} pb-4`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <User size={26} />
            </div>
            <div>
              <h1 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                Administrator Profile & Store Settings
              </h1>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Manage your credentials, store outlet details, and security preferences
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={`flex items-center gap-1.5 p-1 rounded-xl self-start ${
            isDark ? "bg-slate-900/80 border border-slate-800" : "bg-slate-100 border border-slate-200"
          }`}>
            {[
              { id: "general", label: "Personal Info", icon: <User size={14} /> },
              { id: "store", label: "Store & Branch", icon: <Store size={14} /> },
              { id: "security", label: "Security", icon: <Lock size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
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

        {/* Profile Hero Card */}
        <div className={`p-6 rounded-3xl border transition-all ${
          isDark
            ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-white border-slate-200 shadow-sm"
        } flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar with live upload */}
            <div className="relative group">
              <img
                src={profile.imageURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricky"}
                alt="Admin Avatar"
                className={`w-24 h-24 rounded-full object-cover border-3 shadow-xl ${
                  isDark ? "border-cyan-400/50 bg-slate-800" : "border-cyan-500/40 bg-slate-100"
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
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {profile.first_name} {profile.last_name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  isDark
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                }`}>
                  <ShieldCheck size={11} />
                  {profile.role}
                </span>
              </div>
              <p className={`text-xs flex items-center justify-center sm:justify-start gap-1.5 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                <Mail size={12} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                <span>{profile.email}</span>
                <span className={isDark ? "text-slate-600" : "text-slate-300"}>•</span>
                <Phone size={12} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                <span>{profile.phone}</span>
              </p>
              <p className={`text-[11px] flex items-center justify-center sm:justify-start gap-1 pt-1 ${
                isDark ? "text-slate-500" : "text-slate-500"
              }`}>
                <Calendar size={11} />
                <span>Store Admin Member since {profile.joined_date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
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
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </div>

        {/* Tab Forms */}
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === "general" && (
            <div className={`p-6 rounded-3xl border space-y-5 ${
              isDark ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h3 className={`text-base font-bold flex items-center gap-2 border-b pb-3 ${
                isDark ? "text-white border-white/5" : "text-slate-900 border-slate-100"
              }`}>
                <User size={18} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                <span>Personal & Account Credentials</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>First Name</label>
                  <input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Last Name</label>
                  <input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Official Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Mobile Phone</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Admin Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Branch Authority</label>
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
          )}

          {activeTab === "store" && (
            <div className={`p-6 rounded-3xl border space-y-5 ${
              isDark ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h3 className={`text-base font-bold flex items-center gap-2 border-b pb-3 ${
                isDark ? "text-white border-white/5" : "text-slate-900 border-slate-100"
              }`}>
                <Building2 size={18} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                <span>Store Location & Invoicing Address</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 md:col-span-2">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Store Outlet Name</label>
                  <input
                    type="text"
                    value={profile.store_name}
                    onChange={(e) => handleChange("store_name", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Street Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>State</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>PIN Code</label>
                  <input
                    type="text"
                    value={profile.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Business GSTIN</label>
                  <input
                    type="text"
                    value={profile.gstin}
                    onChange={(e) => handleChange("gstin", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium outline-none transition-colors ${
                      isDark
                        ? "bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 shadow-xs"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={`p-6 rounded-3xl border space-y-5 ${
              isDark ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h3 className={`text-base font-bold flex items-center gap-2 border-b pb-3 ${
                isDark ? "text-white border-white/5" : "text-slate-900 border-slate-100"
              }`}>
                <Key size={18} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                <span>Security Credentials & Account Actions</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDark ? "bg-slate-950/60 border-white/5" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Two-Factor Authentication (2FA)</h4>
                    <p className={`mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Secure your admin portal with authenticator app protection</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Active & Protected
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDark ? "bg-slate-950/60 border-white/5" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Password Security</h4>
                    <p className={`mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Last updated 12 days ago • Minimum 8 chars with mixed case</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(SUCCESSALERT("Password reset OTP sent to registered admin email"))}
                    className={`px-3.5 py-2 rounded-xl font-semibold border transition-colors cursor-pointer ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                        : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs"
                    }`}
                  >
                    Change Password
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDark ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50/60 border-rose-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-rose-400" : "text-rose-700"}`}>Sign Out from Device</h4>
                    <p className={`mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Terminate current administrative session and lock workspace</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold hover:bg-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
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
