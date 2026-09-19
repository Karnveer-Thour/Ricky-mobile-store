import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  MapPin,
  Bell,
  Upload,
  Loader2,
  LogOut,
  Check,
  Shield,
  Save,
  Plus,
  Trash2,
  Star,
  Pencil,
} from "lucide-react";
import { DELIVERY_ADDRESSES } from "../data";
import { apiService } from "../services/apiService";
import { useApp } from "../AppContext";
import { profileSchema, type ProfileFormValues } from "../utils/validation.schemas";
import FieldError from "../components/ui/FieldError";
import { useToast } from "../hooks/useToast";
import AddAddressModal from "../components/profile/AddAddressModal";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, openAuthModal, updateUserProfile } = useApp();
  const toast = useToast();

  const [profileTab, setProfileTab] = useState<
    "info" | "addresses" | "settings"
  >("info");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Delivery Addresses state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [selectedAddressForEdit, setSelectedAddressForEdit] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    dateBirth: "1998-05-20",
    pictureUrl: "",
  });

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors: profileErrors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      dateBirth: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "+91 98765 43210",
        dateBirth: user.dateBirth ? user.dateBirth.split("T")[0] : "",
        pictureUrl:
          user.pictureUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
      });
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        dateBirth: user.dateBirth ? user.dateBirth.split("T")[0] : "",
      });
    }
  }, [user, reset]);

  const loadAddresses = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingAddresses(true);
    try {
      const res = await apiService.fetchDeliveryAddresses(user.id);
      if (res.status) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      console.warn("Failed to load addresses", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user]);

  useEffect(() => {
    if (profileTab === "addresses") {
      loadAddresses();
    }
  }, [profileTab, loadAddresses]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const res = await apiService.uploadImage(file, "avatars");
    setIsUploadingAvatar(false);

    if (res.status && res.url) {
      setFormData((prev) => ({ ...prev, pictureUrl: res.url! }));
      await updateUserProfile({ pictureUrl: res.url });
      toast.profile.avatarSuccess();
    } else {
      toast.profile.avatarError(res.message || "Failed to upload avatar to Cloudinary");
    }
  };

  const handleSaveProfile = async (data: ProfileFormValues) => {
    setIsSavingProfile(true);
    const updatePayload: {
      firstName: string;
      lastName?: string;
      email: string;
      mobileNumber: string;
      dateBirth?: string;
      pictureUrl?: string;
    } = {
      firstName: data.firstName.trim(),
      lastName: data.lastName ? data.lastName.trim() : "",
      email: data.email.trim(),
      mobileNumber: data.mobileNumber.trim(),
      pictureUrl: formData.pictureUrl,
    };

    if (data.dateBirth && data.dateBirth.trim() !== "") {
      updatePayload.dateBirth = data.dateBirth.trim();
    }

    const res = await updateUserProfile(updatePayload);
    setIsSavingProfile(false);

    if (res.success) {
      setIsSavedAlert(true);
      toast.profile.saved();
      setTimeout(() => setIsSavedAlert(false), 2500);
    } else {
      toast.error(
        "Profile Update Failed",
        res.message || "Failed to update profile on backend.",
      );
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      toast.error(
        "Cannot Delete Address",
        "You must keep at least one delivery address.",
      );
      return;
    }
    try {
      const res = await apiService.deleteDeliveryAddress(id);
      if (res.status) {
        toast.delivery.addressDeleted();
        loadAddresses();
      } else {
        toast.error("Delete failed", res.message || "You must keep at least one delivery address.");
      }
    } catch (err: any) {
      toast.error("Delete failed", err.message || "Failed to delete address.");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await apiService.toggleDeliveryAddressStatus(id, true);
      if (res.status) {
        toast.delivery.addressDefaultSet();
        loadAddresses();
      } else {
        toast.error("Failed to update default address", res.message);
      }
    } catch (err: any) {
      toast.error("Failed to update default address", err.message);
    }
  };


  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-32 pb-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#00cfff]/10 border border-[#00cfff]/20 flex items-center justify-center mx-auto mb-6 text-[#00cfff]">
          <User size={30} />
        </div>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-wider mb-2"
        >
          ACCOUNT LOGIN REQUIRED
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
          Sign in or create your Ricky Mobile Store account to manage your
          profile, delivery addresses, and track orders across Khanna & Punjab.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => openAuthModal("login")}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="px-8 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-wider shadow-lg shadow-[#00cfff]/20 cursor-pointer"
          >
            SIGN IN NOW
          </button>
          <button
            onClick={() => openAuthModal("register")}
            className="px-6 py-3.5 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-sm cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl border border-white/8 text-gray-400 hover:text-white hover:border-white/15 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-4xl font-extrabold text-white tracking-widest"
          >
            MY ACCOUNT
          </h1>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 flex flex-col gap-1.5">
          {[
            { id: "info", label: "Account Info", Icon: User },
            { id: "addresses", label: "Addresses", Icon: MapPin },
            { id: "settings", label: "Notifications", Icon: Bell },
          ].map((tab) => {
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  profileTab === tab.id
                    ? "bg-[#00cfff] text-[#07070f] shadow-md shadow-[#00cfff]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/4"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}

          <div className="mt-6 p-4 rounded-2xl bg-white/2 border border-white/6 text-xs text-gray-400 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <Shield size={14} /> Verified Customer
            </div>
            <p className="text-[11px] text-gray-500">
              Eligible for Khanna Same-Day Delivery & 0% Bajaj EMI loans.
            </p>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3 bg-[#0e0e1c] border border-white/6 rounded-3xl p-6 sm:p-8">
          {profileTab === "info" && (
            <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-6" noValidate>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={
                      formData.pictureUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format"
                    }
                    alt="Profile Avatar"
                    className="w-16 h-16 rounded-full border border-white/15 object-cover"
                  />
                  <input
                    type="file"
                    id="avatar-upload-input"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload-input"
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    {isUploadingAvatar ? (
                      <Loader2
                        size={16}
                        className="text-[#00cfff] animate-spin"
                      />
                    ) : (
                      <Upload size={16} className="text-white" />
                    )}
                  </label>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Logged in as{" "}
                    <span className="text-[#00cfff] font-mono">
                      {formData.email}
                    </span>
                  </p>
                </div>
              </div>

              {isSavedAlert && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
                  <Check size={14} /> Profile details saved successfully!
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="profile-firstname"
                    type="text"
                    autoComplete="given-name"
                    {...rhfRegister("firstName")}
                    className={`w-full bg-white/4 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all ${
                      profileErrors.firstName
                        ? "border-red-500/60 focus:border-red-500/80"
                        : "border-white/8 focus:border-[#00cfff]/50"
                    }`}
                  />
                  <FieldError message={profileErrors.firstName?.message} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1">
                    Last Name
                  </label>
                  <input
                    id="profile-lastname"
                    type="text"
                    autoComplete="family-name"
                    {...rhfRegister("lastName")}
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00cfff]/50"
                  />
                  <FieldError message={profileErrors.lastName?.message} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    autoComplete="email"
                    {...rhfRegister("email")}
                    className={`w-full bg-white/4 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all ${
                      profileErrors.email
                        ? "border-red-500/60 focus:border-red-500/80"
                        : "border-white/8 focus:border-[#00cfff]/50"
                    }`}
                  />
                  <FieldError message={profileErrors.email?.message} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1">
                    Mobile (WhatsApp) <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="profile-mobile"
                    type="tel"
                    autoComplete="tel"
                    {...rhfRegister("mobileNumber")}
                    className={`w-full bg-white/4 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all ${
                      profileErrors.mobileNumber
                        ? "border-red-500/60 focus:border-red-500/80"
                        : "border-white/8 focus:border-[#00cfff]/50"
                    }`}
                  />
                  <FieldError message={profileErrors.mobileNumber?.message} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="profile-datebirth"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    {...rhfRegister("dateBirth")}
                    className={`w-full bg-white/4 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all ${
                      profileErrors.dateBirth
                        ? "border-red-500/60 focus:border-red-500/80"
                        : "border-white/8 focus:border-[#00cfff]/50"
                    }`}
                  />
                  <FieldError message={profileErrors.dateBirth?.message} />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="profile-save"
                  type="submit"
                  disabled={isSavingProfile}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="px-6 py-2.5 bg-[#00cfff] text-[#07070f] font-extrabold text-xs tracking-wider rounded-xl hover:bg-[#00cfff]/90 disabled:opacity-60 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#00cfff]/20"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      SAVE CHANGES
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {profileTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Synced with backend delivery network
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAddressForEdit(null);
                    setIsAddAddressModalOpen(true);
                  }}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="px-3.5 py-1.5 bg-[#00cfff] text-[#07070f] font-extrabold text-xs tracking-wider rounded-xl hover:bg-[#00cfff]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00cfff]/20"
                >
                  <Plus size={13} /> ADD NEW ADDRESS
                </button>
              </div>

              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-10 text-gray-400 gap-2 text-xs">
                  <Loader2 size={16} className="animate-spin text-[#00cfff]" />
                  Loading delivery addresses…
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const houseStreet = [
                      addr.address?.houseNumber,
                      addr.address?.streetNumber,
                    ]
                      .filter(Boolean)
                      .join(", ");
                    const areaCity = [addr.address?.areaName, addr.address?.city]
                      .filter(Boolean)
                      .join(", ");
                    const distStatePin = [
                      addr.address?.district,
                      addr.address?.state,
                      addr.address?.pincode ? `PIN: ${addr.address.pincode}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ");

                    return (
                      <div
                        key={addr.id}
                        className="p-4 bg-white/2 rounded-2xl border border-white/6 hover:border-white/15 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#00cfff] px-2 py-0.5 rounded-md bg-[#00cfff]/10">
                              {addr.label || "Home"}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-md font-semibold flex items-center gap-1">
                                <Star size={10} className="fill-emerald-400" /> Default Address
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="px-2.5 py-1 text-[11px] text-gray-400 hover:text-white border border-white/8 hover:border-white/20 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Star size={11} /> Set Default
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAddressForEdit(addr);
                                setIsAddAddressModalOpen(true);
                              }}
                              className="px-2 py-1 text-gray-400 hover:text-[#00cfff] border border-white/8 hover:border-[#00cfff]/30 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              title="Edit address"
                            >
                              <Pencil size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400 border border-white/8 hover:border-red-500/30 rounded-lg transition-all cursor-pointer"
                              title="Delete address"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {addr.customer ? `${addr.customer.firstName || ""} ${addr.customer.lastName || ""}`.trim() : formData.firstName}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {houseStreet ? `${houseStreet}, ` : ""}{areaCity}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          {distStatePin}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          📞 {addr.countryCode || "+91"} {addr.mobileNumber}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/3 border border-dashed border-white/10 text-center space-y-2">
                    <p className="text-xs text-gray-300">
                      No custom addresses saved in your backend account yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressForEdit(null);
                        setIsAddAddressModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#00cfff]/10 hover:bg-[#00cfff]/20 text-[#00cfff] text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      + Add Your First Address
                    </button>
                  </div>
                  <div className="pt-2">
                    <p className="text-[11px] text-gray-400 mb-2 uppercase font-mono tracking-wider">
                      Demo / Sample Shipping Addresses
                    </p>
                    <div className="space-y-2 opacity-70">
                      {DELIVERY_ADDRESSES.map((addr) => (
                        <div
                          key={addr.id}
                          className="p-3 bg-white/2 rounded-xl border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#00cfff]">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-md font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-white">
                            {addr.name}
                          </p>
                          <p className="text-xs text-gray-400">{addr.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <AddAddressModal
                isOpen={isAddAddressModalOpen}
                onClose={() => {
                  setIsAddAddressModalOpen(false);
                  setSelectedAddressForEdit(null);
                }}
                onSuccess={loadAddresses}
                initialData={selectedAddressForEdit}
              />
            </div>
          )}

          {profileTab === "settings" && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm">
                Notification & Order Preferences
              </h3>
              <p className="text-xs text-gray-400">
                Manage order milestone alerts, delivery driver pings, and
                WhatsApp updates.
              </p>
              <div className="space-y-3 pt-2 text-xs text-gray-300">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/3 border border-white/6 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#00cfff] w-4 h-4 rounded"
                  />
                  <div>
                    <span className="font-semibold block text-white">
                      Order Status & Dispatch SMS
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Receive SMS pings when package is out for delivery in
                      Khanna
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/3 border border-white/6 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#00cfff] w-4 h-4 rounded"
                  />
                  <div>
                    <span className="font-semibold block text-white">
                      WhatsApp Order & Loan Alerts
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Instant updates on Bajaj Finserv approval and tracking
                      links
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
