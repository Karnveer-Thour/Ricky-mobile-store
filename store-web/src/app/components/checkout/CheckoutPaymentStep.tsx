import React from "react";
import { fmt } from "../../data";

interface CheckoutPaymentStepProps {
  payMethod: string;
  setPayMethod: (val: string) => void;
  itemsTotal: number;
  tenureParam: string | null;
  onBack: () => void;
  onContinue: () => void;
}

export default function CheckoutPaymentStep({
  payMethod,
  setPayMethod,
  itemsTotal,
  tenureParam,
  onBack,
  onContinue,
}: CheckoutPaymentStepProps) {
  const paymentOptions = [
    {
      id: "UPI",
      label: "UPI",
      desc: "Google Pay, PhonePe, Paytm — instant transfer",
    },
    {
      id: "CARD",
      label: "Credit / Debit Card",
      desc: "Visa, Mastercard, RuPay — all banks",
    },
    { id: "NETBANKING", label: "Net Banking", desc: "50+ banks supported" },
    {
      id: "EMI_BAJAJ",
      label: "Bajaj Finserv EMI",
      desc: "0% EMI, up to 24 months — pre-approved",
    },
    {
      id: "EMI_HOMECREDIT",
      label: "Home Credit EMI",
      desc: "Flexible plans starting at ₹999/mo",
    },
  ];

  return (
    <div>
      <h2
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="text-2xl font-extrabold text-white tracking-widest mb-5"
      >
        PAYMENT METHOD
      </h2>
      <div className="space-y-2.5 mb-6">
        {paymentOptions.map((pm) => (
          <label
            key={pm.id}
            className={`flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
              payMethod === pm.id
                ? "border-[#00cfff]/30 bg-[#00cfff]/4"
                : "border-white/6 bg-white/2 hover:border-white/12"
            }`}
          >
            <input
              type="radio"
              name="pay"
              checked={payMethod === pm.id}
              onChange={() => setPayMethod(pm.id)}
              className="mt-0.5 accent-[#00cfff]"
            />
            <div>
              <p className="text-sm font-semibold text-white">{pm.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{pm.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {payMethod.startsWith("EMI") && (
        <div className="p-4 bg-[#8b5cf6]/6 border border-[#8b5cf6]/15 rounded-2xl mb-6">
          <p
            className="text-xs font-bold text-[#8b5cf6] tracking-wide mb-3"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            EMI BREAKDOWN (PRE-APPROVED)
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {[
              [
                "Provider",
                payMethod === "EMI_BAJAJ" ? "Bajaj Finserv" : "Home Credit",
              ],
              ["Tenure", tenureParam ? `${tenureParam} months` : "12 months"],
              ["Interest Rate", "0% p.a."],
              [
                "Monthly EMI",
                fmt(Math.round(itemsTotal / parseInt(tenureParam || "12"))),
              ],
              ["Processing Fee", fmt(499)],
              [
                "Down Payment",
                payMethod === "EMI_BAJAJ"
                  ? "₹0"
                  : fmt(Math.round(itemsTotal * 0.1)),
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-gray-700">{k}</span>
                <span
                  className="text-white font-semibold"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3.5 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest cursor-pointer"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          REVIEW ORDER
        </button>
      </div>
    </div>
  );
}
