import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { DeliveryInfo, evaluatePincode } from "./delivery/pincodeEvaluator";
import DeliveryInputBar from "./delivery/DeliveryInputBar";
import PopularPincodes from "./delivery/PopularPincodes";
import DeliveryStatusResult from "./delivery/DeliveryStatusResult";

export { evaluatePincode };
export type { DeliveryInfo };

interface DeliveryCheckerProps {
  className?: string;
  compact?: boolean;
  showTitle?: boolean;
  onPincodeValidated?: (info: DeliveryInfo) => void;
}

export default function DeliveryChecker({
  className = "",
  showTitle = true,
  onPincodeValidated,
}: DeliveryCheckerProps) {
  const [pincode, setPincode] = useState(() => {
    try {
      return typeof window !== "undefined"
        ? localStorage.getItem("rms_pincode") || "141401"
        : "141401";
    } catch {
      return "141401";
    }
  });

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(() =>
    evaluatePincode("141401"),
  );

  const handleCheck = (inputPin: string) => {
    const info = evaluatePincode(inputPin);
    setDeliveryInfo(info);
    if (info.isDeliverable && typeof window !== "undefined") {
      try {
        localStorage.setItem("rms_pincode", info.pincode);
      } catch {
        // ignore storage errors
      }
    }
    if (onPincodeValidated) {
      onPincodeValidated(info);
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      handleCheck(pincode);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      handleCheck(val);
    }
  };

  const handleSelectPopular = (pin: string) => {
    setPincode(pin);
    handleCheck(pin);
  };

  return (
    <div
      className={`bg-[#0e0e1c]/90 border border-white/8 rounded-2xl p-4 sm:p-5 transition-all ${className}`}
    >
      {showTitle && (
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00cfff]/10 flex items-center justify-center text-[#00cfff]">
              <Truck size={13} />
            </div>
            <span
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-sm font-extrabold text-white tracking-wider"
            >
              CHECK DELIVERY & PINCODE AVAILABILITY
            </span>
          </div>
          <span className="text-[10px] text-[#00cfff] font-mono font-semibold">
            KHANNA & ALL-PUNJAB
          </span>
        </div>
      )}

      <DeliveryInputBar
        pincode={pincode}
        onInputChange={handleInputChange}
        onSubmit={() => handleCheck(pincode)}
      />

      <PopularPincodes
        currentPincode={pincode}
        onSelectPincode={handleSelectPopular}
      />

      <DeliveryStatusResult info={deliveryInfo} />
    </div>
  );
}
