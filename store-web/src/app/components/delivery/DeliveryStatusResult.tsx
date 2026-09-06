import React from "react";
import { CheckCircle2, ShieldCheck, AlertCircle, Store } from "lucide-react";
import { DeliveryInfo } from "./pincodeEvaluator";

interface DeliveryStatusResultProps {
  info: DeliveryInfo;
}

export default function DeliveryStatusResult({
  info,
}: DeliveryStatusResultProps) {
  if (info.pincode.length !== 6) return null;

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        info.isDeliverable
          ? info.zone === "khanna"
            ? "bg-[#00cfff]/8 border-[#00cfff]/25"
            : "bg-emerald-500/8 border-emerald-500/20"
          : "bg-red-500/10 border-red-500/20"
      }`}
    >
      {info.isDeliverable ? (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className={
                  info.zone === "khanna" ? "text-[#00cfff]" : "text-emerald-400"
                }
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  {info.speedText}
                </span>
                <span className="text-[11px] text-gray-400">
                  Serving{" "}
                  <span className="text-white font-medium">
                    {info.locationName}
                  </span>{" "}
                  · Expected:{" "}
                  <span className="text-[#00cfff] font-bold">
                    {info.expectedDateText}
                  </span>
                </span>
              </div>
            </div>
            {info.zone === "khanna" && (
              <span className="px-2 py-0.5 bg-[#00cfff] text-[#07070f] font-bold text-[9px] rounded-md tracking-wider uppercase shrink-0">
                LOCAL KHANNA
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-white/5 text-[10px] text-gray-400 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 size={11} /> Free Delivery
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <ShieldCheck size={11} className="text-[#00cfff]" /> Cash on
              Delivery Available
            </span>
            {info.storePickupAvailable && (
              <span className="flex items-center gap-1 text-amber-300">
                <Store size={11} /> In-Store Pickup from G.T. Road, Khanna
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle size={15} />
          <span>{info.speedText}</span>
        </div>
      )}
    </div>
  );
}
