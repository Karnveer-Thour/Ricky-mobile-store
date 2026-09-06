import React from "react";
import { AlertTriangle, Truck } from "lucide-react";
import { evaluatePincode } from "../DeliveryChecker";

interface CheckoutAddressStepProps {
  name: string;
  setName: (val: string) => void;
  mobile: string;
  setMobile: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  landmark: string;
  setLandmark: (val: string) => void;
  onContinue: () => void;
}

export default function CheckoutAddressStep({
  name,
  setName,
  mobile,
  setMobile,
  pincode,
  setPincode,
  street,
  setStreet,
  landmark,
  setLandmark,
  onContinue,
}: CheckoutAddressStepProps) {
  const isLandmarkEmpty = landmark.trim() === "";

  const handleContinueClick = () => {
    if (isLandmarkEmpty) {
      alert("Landmark is required so delivery riders can locate your address!");
      return;
    }
    onContinue();
  };

  return (
    <div className="space-y-6">
      <h2
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="text-2xl font-extrabold text-white tracking-widest"
      >
        DELIVERY ADDRESS
      </h2>

      <div className="space-y-4 bg-white/2 p-6 rounded-3xl border border-white/5">
        <div>
          <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Recipient Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
              6-Digit Pincode
            </label>
            <input
              type="text"
              maxLength={6}
              pattern="[0-9]*"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Street Address
          </label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
          />
        </div>

        {/* Landmark Field with Amber Reminder if Empty */}
        <div>
          <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Nearby Landmark (Required)</span>
            {isLandmarkEmpty && (
              <span className="text-[var(--color-ricky-accent-amber)] text-[10px] flex items-center gap-1 font-bold">
                <AlertTriangle size={10} /> REQUIRED FOR RIDER
              </span>
            )}
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near Khanna Railway Station or GT Road Temple"
            className={`w-full bg-white/4 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all ${
              isLandmarkEmpty
                ? "border-2 border-[var(--color-ricky-accent-amber)] placeholder-[var(--color-ricky-accent-amber)]/40"
                : "border border-white/8 focus:border-[#00cfff]/40"
            }`}
          />
        </div>

        {pincode.length === 6 &&
          (() => {
            const dInfo = evaluatePincode(pincode);
            return dInfo.isDeliverable ? (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  dInfo.zone === "khanna"
                    ? "bg-[#00cfff]/10 border-[#00cfff]/30 text-[#00cfff]"
                    : dInfo.zone === "ludhiana"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-white/5 border-white/10 text-gray-300"
                }`}
              >
                <Truck size={16} className="shrink-0" />
                <div>
                  <span className="font-bold block">{dInfo.speedText}</span>
                  <span className="text-[11px] opacity-80">
                    {dInfo.locationName} · Expected: {dInfo.expectedDateText}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                ⚠️ {dInfo.speedText}
              </div>
            );
          })()}
      </div>

      <button
        onClick={handleContinueClick}
        className="w-full py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest cursor-pointer"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        CONTINUE TO PAYMENT
      </button>
    </div>
  );
}
