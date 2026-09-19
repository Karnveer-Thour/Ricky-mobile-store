import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";

interface PopularPincodesProps {
  currentPincode: string;
  onSelectPincode: (pin: string) => void;
}

const DEFAULT_POPULAR = [
  { label: "Khanna", pin: "141401" },
  { label: "Khanna Rural", pin: "141417" },
  { label: "Ludhiana Central", pin: "141001" },
  { label: "Ludhiana Model Town", pin: "141002" },
  { label: "Samrala", pin: "141114" },
  { label: "Gobindgarh", pin: "147301" },
  { label: "Doraha", pin: "141119" },
  { label: "Sahnewal", pin: "141120" },
  { label: "Mohali", pin: "160055" },
  { label: "Chandigarh", pin: "160017" },
];

export default function PopularPincodes({
  currentPincode,
  onSelectPincode,
}: PopularPincodesProps) {
  const [cities, setCities] = useState(DEFAULT_POPULAR);

  useEffect(() => {
    let isMounted = true;
    apiService
      .fetchAcceptedCities(1, 10)
      .then((res) => {
        if (isMounted && res.status && res.cities && res.cities.length > 0) {
          const top10 = res.cities.slice(0, 10).map((c: any) => ({
            label: c.cityName,
            pin: String(c.cityPincode),
          }));
          setCities(top10);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch top cities:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
      <span className="text-[10px] text-gray-500 font-mono font-semibold">
        Top 10 Cities:
      </span>
      {cities.map((item) => (
        <button
          key={item.pin}
          type="button"
          onClick={() => onSelectPincode(item.pin)}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
            currentPincode === item.pin
              ? "bg-[#00cfff]/15 border-[#00cfff]/40 text-[#00cfff]"
              : "bg-white/3 border-white/6 text-gray-400 hover:text-white hover:border-white/20"
          }`}
        >
          {item.label} ({item.pin})
        </button>
      ))}
    </div>
  );
}

