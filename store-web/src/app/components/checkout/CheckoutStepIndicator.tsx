import React from "react";
import { Check } from "lucide-react";

interface CheckoutStepIndicatorProps {
  checkoutStep: number;
  onStepClick: (step: number) => void;
}

export default function CheckoutStepIndicator({
  checkoutStep,
  onStepClick,
}: CheckoutStepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {["Delivery", "Payment", "Confirm"].map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <button
            onClick={() => {
              if (i + 1 < checkoutStep) onStepClick(i + 1);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              checkoutStep > i + 1
                ? "bg-green-500 text-white cursor-pointer"
                : checkoutStep === i + 1
                  ? "bg-[#00cfff] text-[#07070f]"
                  : "bg-white/6 text-gray-700"
            }`}
          >
            {checkoutStep > i + 1 ? <Check size={12} /> : i + 1}
          </button>
          <span
            className={`text-sm font-medium hidden sm:block ${
              checkoutStep === i + 1 ? "text-white" : "text-gray-700"
            }`}
          >
            {s}
          </span>
          {i < 2 && <div className="w-8 sm:w-12 h-px bg-white/8" />}
        </div>
      ))}
    </div>
  );
}
