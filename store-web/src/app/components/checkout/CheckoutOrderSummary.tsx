import React from "react";
import { fmt, CartItem } from "../../data";

interface CheckoutOrderSummaryProps {
  checkoutItems: CartItem[];
  products: any[];
  itemsTotal: number;
}

export default function CheckoutOrderSummary({
  checkoutItems,
  products,
  itemsTotal,
}: CheckoutOrderSummaryProps) {
  return (
    <div>
      <div className="sticky top-24 p-5 bg-[#0e0e1c] border border-white/6 rounded-3xl">
        <h3
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-lg font-extrabold text-white tracking-widest mb-4"
        >
          ORDER SUMMARY
        </h3>
        <div className="space-y-2.5 mb-4">
          {checkoutItems.map((item) => {
            const p = products.find(
              (pr: any) => String(pr.id) === String(item.productId),
            );
            if (!p) return null;
            return (
              <div
                key={`${item.productId}-${item.colorId}`}
                className="flex justify-between gap-2 text-xs"
              >
                <span className="text-gray-600 truncate">
                  {p.name} ×{item.qty}
                </span>
                <span
                  className="text-white shrink-0"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {fmt((p.price - p.discount) * item.qty)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-white/5 pt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-700">
            <span>Shipping</span>
            <span className="text-green-400">FREE</span>
          </div>
          <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
            <span>Total</span>
            <span style={{ fontFamily: "'DM Mono', monospace" }}>
              {fmt(itemsTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
