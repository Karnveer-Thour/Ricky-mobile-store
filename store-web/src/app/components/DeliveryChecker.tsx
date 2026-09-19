import React, { useState, useEffect } from "react";
import { Truck, Loader2 } from "lucide-react";
import { DeliveryInfo, evaluatePincode } from "./delivery/pincodeEvaluator";
import DeliveryInputBar from "./delivery/DeliveryInputBar";
import PopularPincodes from "./delivery/PopularPincodes";
import DeliveryStatusResult from "./delivery/DeliveryStatusResult";
import { apiService } from "../services/apiService";
import { useToast } from "../hooks/useToast";

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
  const toast = useToast();
  const [isChecking, setIsChecking] = useState(false);
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

  const handleCheck = async (inputPin: string, isManual = false) => {
    const cleanPin = inputPin.trim().replace(/\D/g, "");
    const info = evaluatePincode(cleanPin);
    setDeliveryInfo(info);

    if (cleanPin.length === 6) {
      setIsChecking(true);
      try {
        const res = await apiService.checkPincodeAvailability(cleanPin);
        if (res.isAvailable) {
          info.isDeliverable = true;
          info.backendVerified = true;
          info.cityName = res.cityName;
          info.district = res.district;
          info.state = res.state;
          if (res.cityName) {
            info.locationName = `${res.cityName}${res.district ? `, ${res.district}` : ""} (${res.state || "Punjab"})`;
          }
          info.speedText = res.message || "Yes, it is available for delivery";
        } else {
          info.isDeliverable = false;
          info.backendVerified = true;
          info.speedText = res.message || "City not available for delivery";
        }
        setDeliveryInfo({ ...info });

        if (info.isDeliverable && typeof window !== "undefined") {
          try {
            localStorage.setItem("rms_pincode", cleanPin);
          } catch {
            // ignore
          }
        }
        if (onPincodeValidated) {
          onPincodeValidated(info);
        }

        if (isManual) {
          if (info.isDeliverable) {
            toast.delivery.serviceable(
              info.locationName || cleanPin,
              info.speedText,
            );
          } else {
            toast.delivery.unserviceable(cleanPin);
          }
        }
      } catch (e) {
        console.warn("Pincode check error:", e);
      } finally {
        setIsChecking(false);
      }
    } else if (isManual && cleanPin.length > 0) {
      toast.warning(
        "Incomplete Pincode",
        "Please enter a 6-digit Indian PIN code.",
      );
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      handleCheck(pincode, false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      handleCheck(val, false);
    }
  };

  const handleSelectPopular = (pin: string) => {
    setPincode(pin);
    handleCheck(pin, true);
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
        isChecking={isChecking}
        onInputChange={handleInputChange}
        onSubmit={() => handleCheck(pincode, true)}
      />

      <PopularPincodes
        currentPincode={pincode}
        onSelectPincode={handleSelectPopular}
      />

      <DeliveryStatusResult info={deliveryInfo} />
    </div>
  );
}
