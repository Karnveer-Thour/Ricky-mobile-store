import React from "react";

interface PopularPincodesProps {
  currentPincode: string;
  onSelectPincode: (pin: string) => void;
}

const POPULAR_LOCATIONS = [
  { label: "Khanna", pin: "141401" },
  { label: "Ludhiana", pin: "141001" },
  { label: "Gobindgarh", pin: "147301" },
  { label: "Samrala", pin: "141114" },
];

export default function PopularPincodes({
  currentPincode,
  onSelectPincode,
}: PopularPincodesProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
      <span className="text-[10px] text-gray-500 font-mono">Popular:</span>
      {POPULAR_LOCATIONS.map((item) => (
        <button
          key={item.pin}
          type="button"
          onClick={() => onSelectPincode(item.pin)}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
            currentPincode === item.pin
              ? "bg-[#00cfff]/15 border-[#00cfff]/40 text-[#00cfff]"
              : "bg-white/3 border-white/6 text-gray-400 hover:text-white"
          }`}
        >
          {item.label} ({item.pin})
        </button>
      ))}
    </div>
  );
}
