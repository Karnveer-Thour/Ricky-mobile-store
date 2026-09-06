import React from "react";
import { fmt, CartItem } from "../../data";
import { evaluatePincode } from "../DeliveryChecker";

interface CheckoutReviewStepProps {
  checkoutItems: CartItem[];
  products: any[];
  itemsTotal: number;
  street: string;
  landmark: string;
  pincode: string;
  payMethod: string;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export default function CheckoutReviewStep({
  checkoutItems,
  products,
  itemsTotal,
  street,
  landmark,
  pincode,
  payMethod,
  onBack,
  onPlaceOrder,
}: CheckoutReviewStepProps) {
  return (
    <div>
      <h2
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="text-2xl font-extrabold text-white tracking-widest mb-5"
      >
        REVIEW ORDER
      </h2>
      <div className="space-y-3 mb-5">
        {checkoutItems.map((item) => {
          const p = products.find(
            (pr: any) => String(pr.id) === String(item.productId),
          );
          if (!p) return null;
          const ep = p.price - p.discount;
          return (
            <div
              key={`${item.productId}-${item.colorId}`}
              className="flex gap-4 p-4 bg-white/3 rounded-2xl border border-white/5"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {p.name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {item.colorName} · Qty {item.qty}
                </p>
                <p
                  className="text-sm text-[#00cfff] mt-1"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {fmt(ep * item.qty)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-white/3 rounded-2xl border border-white/5 mb-5 text-sm space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Delivery Address</span>
          <span className="text-white font-semibold truncate max-w-[200px]">
            {street}, {landmark}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Payment Method</span>
          <span className="text-white font-semibold">
            {payMethod.replace("_", " ")}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Type</span>
          <span className="text-[#00cfff] font-semibold">
            {evaluatePincode(pincode).speedText.split("(")[0].trim() ||
              "Express Delivery"}
          </span>
        </div>
        <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5 text-base">
          <span>Total</span>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>
            {fmt(itemsTotal)}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3.5 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          className="flex-1 py-3.5 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-400 transition-all text-sm tracking-widest cursor-pointer"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}
