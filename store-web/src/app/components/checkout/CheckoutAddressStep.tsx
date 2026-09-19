import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AlertTriangle,
  Truck,
  CheckCircle2,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Home,
  Briefcase,
  Check,
  Loader2,
} from "lucide-react";
import { evaluatePincode } from "../DeliveryChecker";
import {
  checkoutAddressSchema,
  type CheckoutAddressFormValues,
} from "../../utils/validation.schemas";
import FieldError from "../ui/FieldError";
import { useApp } from "../../AppContext";
import { apiService } from "../../services/apiService";
import { useToast } from "../../hooks/useToast";
import AddAddressModal from "../profile/AddAddressModal";

interface CheckoutAddressStepProps {
  name: string;
  mobile: string;
  pincode: string;
  street: string;
  landmark: string;
  onContinue: (data: {
    name: string;
    mobile: string;
    pincode: string;
    street: string;
    landmark: string;
  }) => void;
}

function formatStreet(addr: any): string {
  if (!addr) return "";
  const parts: string[] = [];
  if (addr.address?.houseNumber) parts.push(addr.address.houseNumber);
  if (addr.address?.streetNumber) parts.push(addr.address.streetNumber);
  if (addr.address?.areaName) parts.push(addr.address.areaName);
  return parts.join(", ") || addr.street || "";
}

function formatLocation(addr: any): string {
  if (!addr) return "";
  const parts: string[] = [];
  if (addr.address?.city) parts.push(addr.address.city);
  if (addr.address?.district && addr.address.district !== addr.address.city) {
    parts.push(addr.address.district);
  }
  if (addr.address?.state) parts.push(addr.address.state);
  return parts.join(", ") || "";
}

function getRecipient(addr: any, user: any, defaultName: string): string {
  if (addr?.customer?.firstName || addr?.customer?.lastName) {
    return `${addr.customer.firstName || ""} ${addr.customer.lastName || ""}`.trim();
  }
  if (user?.firstName || user?.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  return defaultName || "Recipient";
}

export default function CheckoutAddressStep({
  name,
  mobile,
  pincode,
  street,
  landmark,
  onContinue,
}: CheckoutAddressStepProps) {
  const { user } = useApp();
  const toast = useToast();

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const [backendCheck, setBackendCheck] = useState<{
    backendVerified: boolean;
    isAccepting: boolean;
    cityName?: string;
    district?: string;
    state?: string;
    message?: string;
  } | null>(null);

  // Form for manual entry (when no saved addresses or user chooses to enter a new one inline)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutAddressFormValues>({
    resolver: yupResolver(checkoutAddressSchema),
    mode: "onTouched",
    defaultValues: { name, mobile, pincode, street, landmark },
  });

  const watchedPincode = watch("pincode", pincode);

  // Load saved delivery addresses
  const loadAddresses = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingAddresses(true);
    try {
      const res = await apiService.fetchDeliveryAddresses(user.id);
      if (res.status && res.addresses) {
        setSavedAddresses(res.addresses);
        if (res.addresses.length > 0) {
          setSelectedAddressId((currentId) => {
            const exists = res.addresses.some((a: any) => a.id === currentId);
            if (exists) return currentId;
            const def = res.addresses.find((a: any) => a.isDefault);
            return def ? def.id : res.addresses[0].id;
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch saved addresses:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Determine currently selected address object
  const selectedAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) ||
    savedAddresses[0] ||
    null;

  // Active pincode to check serviceability
  const activePincode =
    savedAddresses.length > 0 && !showManualForm && selectedAddress
      ? String(selectedAddress.address?.pincode || selectedAddress.pincode || "")
      : watchedPincode || pincode;

  // Unified deliverability calculation
  const cleanPin = (activePincode || "").trim().replace(/\D/g, "");
  const dInfo = cleanPin.length === 6 ? evaluatePincode(cleanPin) : null;
  const isDeliverable =
    cleanPin.length === 6
      ? backendCheck && backendCheck.backendVerified
        ? backendCheck.isAccepting
        : dInfo
          ? dInfo.isDeliverable
          : false
      : false;

  // Track last toasted undeliverable pincode to avoid duplicate toasts
  const lastToastPinRef = useRef<string | null>(null);

  useEffect(() => {
    if (cleanPin.length === 6) {
      if (!isDeliverable) {
        if (lastToastPinRef.current !== cleanPin) {
          lastToastPinRef.current = cleanPin;
          toast.delivery.unserviceable(cleanPin);
        }
      } else {
        lastToastPinRef.current = null;
      }
    } else {
      lastToastPinRef.current = null;
    }
  }, [cleanPin, isDeliverable, toast]);

  // Check pincode with backend API when 6 digits are available
  useEffect(() => {
    let isMounted = true;
    if (cleanPin.length === 6) {
      apiService.checkPincodeAvailability(cleanPin).then((res) => {
        if (isMounted) {
          setBackendCheck(res);
        }
      });
    } else {
      setBackendCheck(null);
    }
    return () => {
      isMounted = false;
    };
  }, [cleanPin]);

  // Handle address deletion
  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // User must keep at least one address
    if (savedAddresses.length <= 1) {
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
        const updated = savedAddresses.filter((a) => a.id !== id);
        setSavedAddresses(updated);
        if (selectedAddressId === id && updated.length > 0) {
          setSelectedAddressId(updated[0].id);
        }
        loadAddresses();
      } else {
        toast.error(
          "Delete failed",
          res.message || "You must keep at least one delivery address.",
        );
      }
    } catch (err: any) {
      toast.error("Delete failed", err.message || "Failed to delete address.");
    }
  };

  // Continue with selected saved address
  const handleProceedWithSavedAddress = () => {
    if (!selectedAddress) {
      toast.error("No Address Selected", "Please select a delivery address.");
      return;
    }

    if (!isDeliverable) {
      toast.delivery.unserviceable(cleanPin || "selected");
      return;
    }

    const recipientName = getRecipient(selectedAddress, user, name);
    const contactMobile =
      selectedAddress.mobileNumber || user?.mobileNumber || mobile;
    const pinStr = String(
      selectedAddress.address?.pincode || selectedAddress.pincode || "141401",
    );
    const streetStr = formatStreet(selectedAddress);
    const landmarkStr =
      selectedAddress.address?.areaName ||
      (selectedAddress.address?.city
        ? `Near ${selectedAddress.address.city} Center`
        : landmark);

    onContinue({
      name: recipientName,
      mobile: contactMobile,
      pincode: pinStr,
      street: streetStr || street,
      landmark: landmarkStr || landmark,
    });
  };

  // Submit manual address form
  const handleManualFormSubmit = async (data: CheckoutAddressFormValues) => {
    if (!isDeliverable) {
      toast.delivery.unserviceable(cleanPin || data.pincode);
      return;
    }

    // Optionally persist to backend if logged in
    if (user?.id) {
      try {
        await apiService.createDeliveryAddress({
          customerId: user.id,
          houseNumber: data.street.split(",")[0] || "House",
          streetNumber: data.street.slice(0, 30),
          areaName: data.landmark || "Area",
          city: "Khanna",
          pincode: parseInt(data.pincode.replace(/\D/g, "") || "141401", 10),
          district: "Ludhiana",
          state: "Punjab",
          mobileNumber: data.mobile,
          label: "Home",
          isDefault: savedAddresses.length === 0,
        });
      } catch (err) {
        console.warn("Failed to auto-save address:", err);
      }
    }

    onContinue(data);
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/4 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all ${
      hasError
        ? "border-red-500/60 focus:border-red-500/80"
        : "border-white/8 focus:border-[#00cfff]/40"
    }`;

  const renderServiceabilityBanner = () => {
    if (cleanPin.length === 0) return null;

    if (cleanPin.length !== 6) {
      return (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0 text-amber-400" />
          <span>Please enter a complete 6-digit Indian PIN code to verify delivery.</span>
        </div>
      );
    }

    return isDeliverable && dInfo ? (
      <div
        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2.5 transition-all ${
          dInfo.zone === "khanna"
            ? "bg-[#00cfff]/10 border-[#00cfff]/30 text-[#00cfff]"
            : dInfo.zone === "ludhiana"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-white/5 border-white/10 text-gray-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Truck size={16} className="shrink-0 text-[#00cfff]" />
          <div>
            <span className="font-bold block text-white">
              Yes, it is available for delivery · {dInfo.speedText}
            </span>
            <span className="text-[11px] opacity-80">
              {backendCheck?.cityName
                ? `${backendCheck.cityName}, ${backendCheck.district || ""} (${backendCheck.state || "Punjab"})`
                : dInfo.locationName}{" "}
              · Expected: {dInfo.expectedDateText || "1–2 Days"}
            </span>
          </div>
        </div>
        {backendCheck?.backendVerified && (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[9px] rounded uppercase font-bold shrink-0">
            API VERIFIED
          </span>
        )}
      </div>
    ) : (
      <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 flex items-start gap-3 shadow-lg shadow-red-500/5">
        <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
          <AlertTriangle size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-red-400">
              Delivery Unavailable to {cleanPin}
            </p>
            <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-mono text-[9px] rounded uppercase font-bold">
              Undeliverable
            </span>
          </div>
          <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
            {backendCheck?.message && backendCheck.message !== "City not available for delivery"
              ? backendCheck.message
              : `Sorry, we currently do not deliver items to PIN code ${cleanPin}. Please choose or add an address in a serviceable location (e.g. Khanna, Ludhiana, or Punjab) to proceed with checkout.`}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-2xl font-extrabold text-white tracking-widest"
        >
          DELIVERY ADDRESS
        </h2>

        <div className="flex items-center gap-2">
          {backendCheck?.backendVerified && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] rounded-lg">
              <CheckCircle2 size={12} /> Serviceable Area
            </span>
          )}

          {user?.id && (
            <button
              type="button"
              onClick={() => {
                setEditingAddress(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00cfff]/10 hover:bg-[#00cfff]/20 text-[#00cfff] border border-[#00cfff]/30 hover:border-[#00cfff]/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus size={14} /> Add Address
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Saved Addresses List (when user has saved addresses and not in manual form mode) */}
      {savedAddresses.length > 0 && !showManualForm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
              <MapPin size={13} className="text-[#00cfff]" />
              Select an address from your saved addresses:
            </span>
            <button
              type="button"
              onClick={() => setShowManualForm(true)}
              className="text-xs text-gray-400 hover:text-[#00cfff] transition-colors underline cursor-pointer"
            >
              Enter a different address
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              const streetStr = formatStreet(addr);
              const locStr = formatLocation(addr);
              const pinStr = addr.address?.pincode || addr.pincode;
              const recipientName = getRecipient(addr, user, name);
              const contactPhone = addr.mobileNumber || user?.mobileNumber || mobile;
              const isHome = (addr.label || "").toLowerCase() === "home";

              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#00cfff]/5 border-[#00cfff] ring-1 ring-[#00cfff]/40 shadow-lg shadow-[#00cfff]/5"
                      : "bg-white/2 border-white/8 hover:border-white/20 text-gray-300"
                  }`}
                >
                  <div>
                    {/* Header: Radio, Label, Default badge, Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-[#00cfff] bg-[#00cfff]"
                              : "border-white/30 bg-transparent"
                          }`}
                        >
                          {isSelected && <Check size={10} className="text-[#07070f] stroke-[3]" />}
                        </div>

                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#00cfff] bg-[#00cfff]/10 px-2 py-0.5 rounded-md border border-[#00cfff]/20">
                          {isHome ? <Home size={11} /> : <Briefcase size={11} />}
                          {addr.label || "Address"}
                        </span>

                        {addr.isDefault && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-semibold">
                            Default
                          </span>
                        )}

                        {pinStr && !evaluatePincode(String(pinStr).trim().replace(/\D/g, "")).isDeliverable && (
                          <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-md font-semibold">
                            Undeliverable
                          </span>
                        )}
                      </div>

                      {/* Card action buttons: Edit & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit address"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#00cfff] hover:bg-[#00cfff]/10 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          title="Delete address"
                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Recipient info */}
                    <div className="mb-2">
                      <p className="text-sm font-bold text-white tracking-wide">
                        {recipientName}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {contactPhone}
                      </p>
                    </div>

                    {/* Address info */}
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {streetStr}
                    </p>
                    {locStr && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {locStr}
                      </p>
                    )}
                    <p className="text-xs text-[#00cfff] font-mono font-semibold mt-1">
                      PIN: {pinStr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Serviceability Banner for selected address */}
          {renderServiceabilityBanner()}

          {/* Continue button */}
          <button
            id="checkout-deliver-btn"
            type="button"
            onClick={handleProceedWithSavedAddress}
            disabled={!isDeliverable}
            className={`w-full py-4 font-extrabold rounded-2xl transition-all text-sm tracking-widest flex items-center justify-center gap-2 ${
              !isDeliverable
                ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-60"
                : "bg-[#00cfff] text-[#07070f] hover:bg-[#00cfff]/90 cursor-pointer shadow-lg shadow-[#00cfff]/20"
            }`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {!isDeliverable
              ? "UNDELIVERABLE ADDRESS — SELECT ANOTHER"
              : "DELIVER TO THIS ADDRESS"}
          </button>
        </div>
      ) : (
        /* VIEW 2: Address Form (when no saved addresses exist or user toggled manual entry) */
        <div className="space-y-4">
          {savedAddresses.length === 0 ? (
            <div className="p-4 bg-white/2 rounded-2xl border border-white/6 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00cfff]/10 flex items-center justify-center text-[#00cfff] shrink-0 mt-0.5">
                <MapPin size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">
                  No saved addresses found
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Please enter your delivery address below to continue. It will be saved for your future orders.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs text-gray-400">
                Enter delivery address details:
              </span>
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="text-xs text-[#00cfff] hover:underline cursor-pointer"
              >
                ← Back to saved addresses
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleManualFormSubmit)}
            noValidate
            className="space-y-4 bg-white/2 p-6 rounded-3xl border border-white/5"
          >
            {/* Recipient Name */}
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Recipient Name <span className="text-red-400">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                {...register("name")}
                className={inputClass(!!errors.name)}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Mobile */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="checkout-mobile"
                  type="tel"
                  autoComplete="tel"
                  {...register("mobile")}
                  className={inputClass(!!errors.mobile)}
                />
                <FieldError message={errors.mobile?.message} />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  6-Digit Pincode <span className="text-red-400">*</span>
                </label>
                <input
                  id="checkout-pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  {...register("pincode")}
                  className={inputClass(!!errors.pincode)}
                />
                <FieldError message={errors.pincode?.message} />
              </div>
            </div>

            {/* Delivery estimate */}
            {renderServiceabilityBanner()}

            {/* Street Address */}
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Street Address <span className="text-red-400">*</span>
              </label>
              <input
                id="checkout-street"
                type="text"
                autoComplete="street-address"
                {...register("street")}
                className={inputClass(!!errors.street)}
              />
              <FieldError message={errors.street?.message} />
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>
                  Nearby Landmark <span className="text-red-400">*</span>
                </span>
                {errors.landmark && (
                  <span className="text-red-400 text-[10px] flex items-center gap-1 font-bold">
                    <AlertTriangle size={10} /> REQUIRED FOR RIDER
                  </span>
                )}
              </label>
              <input
                id="checkout-landmark"
                type="text"
                placeholder="e.g. Near Khanna Railway Station or GT Road Temple"
                {...register("landmark")}
                className={`w-full bg-white/4 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all ${
                  errors.landmark
                    ? "border-2 border-red-500/60 placeholder-red-400/40"
                    : "border border-white/8 focus:border-[#00cfff]/40"
                }`}
              />
              <FieldError message={errors.landmark?.message} />
            </div>

            <button
              id="checkout-continue"
              type="submit"
              disabled={!isDeliverable || isSubmitting}
              className={`w-full py-3.5 font-extrabold rounded-2xl transition-all text-sm tracking-widest flex items-center justify-center gap-2 ${
                !isDeliverable || isSubmitting
                  ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-60"
                  : "bg-[#00cfff] text-[#07070f] hover:bg-[#00cfff]/90 cursor-pointer shadow-lg shadow-[#00cfff]/20"
              }`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> CONTINUING…
                </>
              ) : !isDeliverable ? (
                "UNDELIVERABLE PINCODE — CANNOT PROCEED"
              ) : (
                "CONTINUE TO PAYMENT"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAddress(null);
        }}
        onSuccess={async () => {
          await loadAddresses();
          setShowManualForm(false);
        }}
        initialData={editingAddress}
      />
    </div>
  );
}
