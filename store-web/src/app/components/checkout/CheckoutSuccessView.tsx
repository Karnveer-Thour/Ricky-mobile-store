import React from "react";
import { Check } from "lucide-react";

export default function CheckoutSuccessView() {
  return (
    <div className="text-center py-28 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-green-500/12 border border-green-500/25 flex items-center justify-center mb-6">
        <Check size={36} className="text-green-400" />
      </div>
      <h2
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="text-5xl font-extrabold text-white tracking-widest mb-3"
      >
        ORDER PLACED!
      </h2>
      <p className="text-gray-600 text-sm">Redirecting to order tracking…</p>
    </div>
  );
}
