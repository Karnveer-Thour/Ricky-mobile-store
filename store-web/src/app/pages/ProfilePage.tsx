import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, MapPin, Heart, Bell } from "lucide-react";
import { DELIVERY_ADDRESSES } from "../data";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profileTab, setProfileTab] = useState<"info" | "addresses" | "settings">("info");
  const [profileData] = useState({
    firstName: "Ricky",
    lastName: "Sharma",
    email: "ricky.sharma@gmail.com",
    mobileNumber: "+91 98765 43210",
    dateBirth: "1995-07-14",
    pictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          MY PROFILE
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 flex flex-col gap-1">
          {[
            { id: "info", label: "Account Info", Icon: User },
            { id: "addresses", label: "Addresses", Icon: MapPin },
            { id: "settings", label: "Settings", Icon: Bell },
          ].map((tab) => {
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  profileTab === tab.id
                    ? "bg-[#00cfff] text-[#07070f]"
                    : "text-gray-500 hover:text-white hover:bg-white/4"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3 bg-[#0e0e1c] border border-white/5 rounded-3xl p-6">
          {profileTab === "info" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={profileData.pictureUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border border-white/10"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-xs text-gray-600">Member since 2024</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-700 block mb-1">Email</span>
                  <span className="text-white font-semibold">{profileData.email}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-700 block mb-1">Mobile</span>
                  <span className="text-white font-semibold">{profileData.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-700 block mb-1">Date of Birth</span>
                  <span className="text-white font-semibold">{profileData.dateBirth}</span>
                </div>
              </div>
            </div>
          )}

          {profileTab === "addresses" && (
            <div className="space-y-4">
              {DELIVERY_ADDRESSES.map((addr) => (
                <div key={addr.id} className="p-4 bg-white/2 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-[#00cfff]">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[9px] rounded-md font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white">{addr.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{addr.address}</p>
                </div>
              ))}
            </div>
          )}

          {profileTab === "settings" && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm">Notification Settings</h3>
              <p className="text-xs text-gray-600">Configure how you receive tracking pings and loan alerts.</p>
              <div className="space-y-3 pt-2 text-sm text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#00cfff]" />
                  <span>Order milestone updates (SMS)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#00cfff]" />
                  <span>Promotional alerts & offers (WhatsApp)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
