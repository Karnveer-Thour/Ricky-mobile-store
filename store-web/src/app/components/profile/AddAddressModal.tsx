import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, MapPin, Loader2, Plus, Save, Edit3 } from "lucide-react";
import {
  deliveryAddressSchema,
  type DeliveryAddressFormValues,
} from "../../utils/validation.schemas";
import FieldError from "../ui/FieldError";
import { apiService } from "../../services/apiService";
import { useToast } from "../../hooks/useToast";
import { useApp } from "../../AppContext";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any | null;
}

export default function AddAddressModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddAddressModalProps) {
  const { user } = useApp();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryAddressFormValues>({
    resolver: yupResolver(deliveryAddressSchema),
    defaultValues: {
      label: "Home",
      houseNumber: "",
      streetNumber: "",
      areaName: "",
      city: "Khanna",
      pincode: "141401",
      district: "Ludhiana",
      state: "Punjab",
      mobileNumber: user?.mobileNumber || "",
      isDefault: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          label: (initialData.label as "Home" | "Work") || "Home",
          houseNumber: initialData.address?.houseNumber || "",
          streetNumber: initialData.address?.streetNumber || "",
          areaName: initialData.address?.areaName || "",
          city: initialData.address?.city || "Khanna",
          pincode: String(initialData.address?.pincode || "141401"),
          district: initialData.address?.district || "Ludhiana",
          state: initialData.address?.state || "Punjab",
          mobileNumber: initialData.mobileNumber || user?.mobileNumber || "",
          isDefault: initialData.isDefault ?? false,
        });
      } else {
        reset({
          label: "Home",
          houseNumber: "",
          streetNumber: "",
          areaName: "",
          city: "Khanna",
          pincode: "141401",
          district: "Ludhiana",
          state: "Punjab",
          mobileNumber: user?.mobileNumber || "",
          isDefault: true,
        });
      }
    }
  }, [isOpen, initialData, reset, user]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submitAddress = async (data: DeliveryAddressFormValues) => {
    if (!user?.id) {
      toast.error("User not found", "Please sign in to save an address.");
      return;
    }

    setIsSubmitting(true);
    const isEdit = Boolean(initialData?.id);
    const id = toast.loading(
      isEdit ? "Updating delivery address…" : "Saving delivery address…",
    );

    try {
      let res: { status: boolean; message?: string };

      if (isEdit) {
        res = await apiService.updateDeliveryAddress(initialData.id, {
          houseNumber: data.houseNumber,
          streetNumber: data.streetNumber,
          areaName: data.areaName,
          city: data.city,
          pincode: parseInt(data.pincode, 10),
          district: data.district,
          state: data.state,
          mobileNumber: data.mobileNumber,
          label: data.label as "Home" | "Work",
          isDefault: data.isDefault ?? false,
        });
      } else {
        res = await apiService.createDeliveryAddress({
          customerId: user.id,
          houseNumber: data.houseNumber,
          streetNumber: data.streetNumber,
          areaName: data.areaName,
          city: data.city,
          pincode: parseInt(data.pincode, 10),
          district: data.district,
          state: data.state,
          mobileNumber: data.mobileNumber,
          label: data.label as "Home" | "Work",
          isDefault: data.isDefault ?? true,
        });
      }

      setIsSubmitting(false);

      if (res.status) {
        toast.resolve(
          id,
          true,
          isEdit ? "Delivery address updated ✅" : "Delivery address saved ✅",
          "",
          undefined,
          isEdit
            ? `Updated your ${data.label} address.`
            : `Added to your ${data.label} addresses.`,
        );
        reset();
        onSuccess();
        onClose();
      } else {
        toast.resolve(
          id,
          false,
          "",
          res.message || (isEdit ? "Failed to update address" : "Failed to save address"),
          "Please verify your details and try again.",
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      toast.resolve(
        id,
        false,
        "",
        err.message || (isEdit ? "Failed to update address" : "Failed to save address"),
        "Network error.",
      );
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/4 border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-all ${
      hasError
        ? "border-red-500/60 focus:border-red-500/80"
        : "border-white/10 focus:border-[#00cfff]/50"
    }`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity cursor-pointer overflow-y-auto"
    >
      <div
        className="relative w-full max-w-lg bg-[#0e0e1c] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-[#00cfff]/10 overflow-hidden cursor-default my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00cfff]/10 flex items-center justify-center text-[#00cfff]">
              <MapPin size={16} />
            </div>
            <div>
              <h3
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-xl font-extrabold text-white tracking-wider"
              >
                {initialData ? "EDIT DELIVERY ADDRESS" : "ADD DELIVERY ADDRESS"}
              </h3>
              <p className="text-[11px] text-gray-400">
                {initialData
                  ? "Update your saved shipping address details"
                  : "Connected to Khanna & Punjab Shipping Network"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitAddress)} noValidate className="space-y-3.5">
          {/* Label selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                Address Type <span className="text-red-400">*</span>
              </label>
              <select
                {...register("label")}
                className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00cfff]/50"
              >
                <option value="Home" className="bg-[#0e0e1c] text-white">
                  Home (Personal)
                </option>
                <option value="Work" className="bg-[#0e0e1c] text-white">
                  Work (Office / Shop)
                </option>
              </select>
              <FieldError message={errors.label?.message} />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                Contact Mobile <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                {...register("mobileNumber")}
                className={inputClass(!!errors.mobileNumber)}
              />
              <FieldError message={errors.mobileNumber?.message} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                House / Flat No. <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 142/B or Flat 402"
                {...register("houseNumber")}
                className={inputClass(!!errors.houseNumber)}
              />
              <FieldError message={errors.houseNumber?.message} />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                Street / Road <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. G.T. Road or Model Town Rd"
                {...register("streetNumber")}
                className={inputClass(!!errors.streetNumber)}
              />
              <FieldError message={errors.streetNumber?.message} />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">
              Area / Landmark <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Near Khanna Bus Stand, Gulmohar Nagar"
              {...register("areaName")}
              className={inputClass(!!errors.areaName)}
            />
            <FieldError message={errors.areaName?.message} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Khanna"
                {...register("city")}
                className={inputClass(!!errors.city)}
              />
              <FieldError message={errors.city?.message} />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                Pincode <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="141401"
                {...register("pincode")}
                className={inputClass(!!errors.pincode)}
              />
              <FieldError message={errors.pincode?.message} />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">
                District <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ludhiana"
                {...register("district")}
                className={inputClass(!!errors.district)}
              />
              <FieldError message={errors.district?.message} />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">
              State <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Punjab"
              {...register("state")}
              className={inputClass(!!errors.state)}
            />
            <FieldError message={errors.state?.message} />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="accent-[#00cfff] w-4 h-4 rounded"
              />
              <span>Set as default shipping address</span>
            </label>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="flex-1 py-2.5 bg-[#00cfff] hover:bg-[#00cfff]/90 text-[#07070f] font-extrabold text-sm tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00cfff]/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> SAVING…
                </>
              ) : initialData ? (
                <>
                  <Save size={14} /> UPDATE ADDRESS
                </>
              ) : (
                <>
                  <Plus size={14} /> SAVE ADDRESS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
