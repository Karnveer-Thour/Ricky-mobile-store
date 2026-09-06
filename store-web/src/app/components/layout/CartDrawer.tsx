import React from "react";
import { useNavigate } from "react-router";
import { X, ShoppingCart, Minus, Plus } from "lucide-react";
import { useApp } from "../../AppContext";
import { fmt } from "../../data";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    products,
    cart,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    updateQty,
  } = useApp();

  return (
    <>
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-[#0e0e1c] border-l border-white/6 flex flex-col transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-2xl font-extrabold text-white tracking-widest"
          >
            YOUR CART
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center">
              <ShoppingCart size={28} className="text-gray-700" />
            </div>
            <p className="text-gray-600 text-sm">
              Your cart is empty.
              <br />
              Find something you love.
            </p>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="px-5 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all tracking-wide cursor-pointer"
            >
              Browse Phones
            </button>
          </div>
        ) : (
          <>
            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
              style={{ scrollbarWidth: "none" }}
            >
              {cart.map((item) => {
                const p = products.find((pr) => pr.id === item.productId);
                if (!p) return null;
                const ep = p.price - p.discount;
                return (
                  <div
                    key={`${item.productId}-${item.colorId}`}
                    className="flex gap-3 p-4 bg-white/3 rounded-2xl border border-white/5"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-snug truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.colorName}
                      </p>
                      <p
                        className="text-sm text-[#00cfff] mt-1"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {fmt(ep)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.productId, item.colorId, -1)
                          }
                          className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-white hover:bg-white/12 transition-all cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span
                          className="text-sm text-white w-4 text-center"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.productId, item.colorId, 1)
                          }
                          className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-white hover:bg-white/12 transition-all cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                    <p
                      className="text-sm font-semibold text-white shrink-0"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {fmt(ep * item.qty)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-5 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span
                  style={{ fontFamily: "'DM Mono', monospace" }}
                  className="text-white"
                >
                  {fmt(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>
                  {fmt(cartTotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest cursor-pointer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
