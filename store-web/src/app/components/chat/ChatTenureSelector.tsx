import React from "react";

interface ChatTenureSelectorProps {
  productPrice: number;
  selectedTenure: number | null;
  onSelectTenure: (tenure: number) => void;
  onConfirmPlan: () => void;
}

export default function ChatTenureSelector({
  productPrice,
  selectedTenure,
  onSelectTenure,
  onConfirmPlan,
}: ChatTenureSelectorProps) {
  const getPlanMonthly = (tenure: number) => {
    if (tenure === 3) return Math.round(productPrice / 3);
    if (tenure === 6) return Math.round(productPrice / 6);
    return Math.round((productPrice * 1.12) / 12);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          {
            tenure: 3,
            label: "3 Months",
            note: "0% Interest",
            monthly: getPlanMonthly(3),
          },
          {
            tenure: 6,
            label: "6 Months",
            note: "0% Interest",
            monthly: getPlanMonthly(6),
          },
          {
            tenure: 12,
            label: "12 Months",
            note: "12% Interest",
            monthly: getPlanMonthly(12),
          },
        ].map((plan) => (
          <button
            key={plan.tenure}
            type="button"
            onClick={() => onSelectTenure(plan.tenure)}
            className={`flex-1 min-w-[120px] p-3 rounded-xl border transition-all text-left ${
              selectedTenure === plan.tenure
                ? "border-[#00cfff] bg-[#00cfff]/5 text-white"
                : "border-white/10 bg-white/4 text-gray-400 hover:border-white/20"
            }`}
          >
            <p className="text-xs font-bold text-white">{plan.label}</p>
            <p className="text-sm font-black mt-1 text-[#00cfff]">
              ₹{plan.monthly.toLocaleString("en-IN")}/mo
            </p>
            <p className="text-[9px] text-gray-500 mt-1">{plan.note}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!selectedTenure}
        onClick={onConfirmPlan}
        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all text-center ${
          selectedTenure
            ? "bg-[#00cfff] text-[#07070f] shadow-lg cursor-pointer"
            : "bg-white/10 text-white/40 cursor-not-allowed"
        }`}
      >
        {selectedTenure
          ? `Confirm ₹${getPlanMonthly(selectedTenure).toLocaleString("en-IN")}/mo Plan`
          : "Select a repayment plan"}
      </button>
    </div>
  );
}
