import React from "react";
import { MapPin } from "lucide-react";

interface DeliveryInputBarProps {
  pincode: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function DeliveryInputBar({
  pincode,
  onInputChange,
  onSubmit,
}: DeliveryInputBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-3">
      <div className="relative flex-1">
        <MapPin
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit PIN code (e.g. 141401)"
          value={pincode}
          onChange={onInputChange}
          className="w-full bg-white/4 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/50"
        />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="px-5 py-2 bg-[#00cfff] hover:bg-[#00cfff]/90 text-[#07070f] text-xs font-extrabold rounded-xl transition-all tracking-wider shrink-0 cursor-pointer shadow-md shadow-[#00cfff]/20"
      >
        CHECK
      </button>
    </div>
  );
}
