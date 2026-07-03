import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { PRODUCTS, fmt, DELIVERY_ADDRESSES, CartItem } from "../data";
import { ArrowLeft, Home, Briefcase, Check, AlertTriangle } from "lucide-react";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal, setTrackedOrderId } = useApp();

  const [checkoutStep, setCheckoutStep] = useState(1);
  const [payMethod, setPayMethod] = useState("UPI");
  const [selAddrId, setSelAddrId] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Address form states
  const [street, setStreet] = useState("24, MG Road");
  const [pincode, setPincode] = useState("560034");
  const [landmark, setLandmark] = useState("");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [name, setName] = useState("Ricky Sharma");

  // OTP Verification state
  const [otp, setOtp] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Handle URL parameters for EMI pre-fill
  const lenderParam = searchParams.get("lender");
  const tenureParam = searchParams.get("tenure");
  const productIdParam = searchParams.get("productId");
  const colorIdParam = searchParams.get("colorId");
  const qtyParam = searchParams.get("qty");

  // Local checkout items (defaults to cart, or URL pre-filled item)
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (productIdParam && colorIdParam) {
      const pid = parseInt(productIdParam);
      const cid = parseInt(colorIdParam);
      const qty = parseInt(qtyParam || "1");
      const p = PRODUCTS.find((pr) => pr.id === pid);
      if (p) {
        const color = p.colors.find((c) => c.id === cid);
        setCheckoutItems([
          {
            productId: pid,
            colorId: cid,
            colorName: color ? color.colorName : "Default",
            qty,
          },
        ]);
        if (lenderParam) {
          setPayMethod(lenderParam === "bajaj" ? "EMI_BAJAJ" : "EMI_HOMECREDIT");
        }
        return;
      }
    }
    setCheckoutItems(cart);
  }, [cart, productIdParam, colorIdParam, qtyParam, lenderParam]);

  const itemsTotal = checkoutItems.reduce((sum, item) => {
    const p = PRODUCTS.find((pr) => pr.id === item.productId);
    return sum + (p ? (p.price - p.discount) * item.qty : 0);
  }, 0);

  const isKhannaPincode = (pin: string) => {
    // Khanna Punjab pin codes usually start with 1414
    return pin.startsWith("1414") || pin === "141401";
  };

  const handlePlaceOrder = () => {
    // Trigger SMS OTP verification step first
    setShowOtpVerification(true);
  };

  const handleVerifyOtpAndSubmit = () => {
    if (otp !== "1234") {
      alert("Invalid OTP! Hint: Use 1234");
      return;
    }

    setIsVerifyingOtp(true);

    // Simulate POST /sale
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setShowOtpVerification(false);
      setOrderPlaced(true);
      clearCart();

      const simulatedOrderId = "RMS-" + Math.floor(Math.random() * 900000 + 100000);
      setTrackedOrderId(simulatedOrderId);

      setTimeout(() => {
        setOrderPlaced(false);
        navigate(`/orders/${simulatedOrderId}/track`);
      }, 2000);
    }, 1500);
  };

  const isLandmarkEmpty = landmark.trim() === "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-8 text-sm"
      >
        <ArrowLeft size={15} /> Continue Shopping
      </button>

      {orderPlaced ? (
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
      ) : showOtpVerification ? (
        <div className="max-w-md mx-auto p-6 bg-[#0e0e1c] border border-white/10 rounded-3xl text-center space-y-6">
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-3xl font-extrabold text-white tracking-widest"
          >
            VERIFY MOBILE OTP
          </h2>
          <p className="text-sm text-gray-600">
            We've sent a 4-digit code to {mobile}. Please enter it to authorize this transaction.
          </p>

          <input
            type="text"
            pattern="[0-9]*"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP (e.g. 1234)"
            className="w-full text-center tracking-widest text-2xl font-bold bg-white/4 border border-white/8 rounded-xl py-3 text-white focus:outline-none focus:border-[#00cfff]/40"
          />

          <div className="flex gap-3">
            <button
              onClick={() => setShowOtpVerification(false)}
              className="flex-1 py-3 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyOtpAndSubmit}
              disabled={isVerifyingOtp || otp.length < 4}
              className="flex-1 py-3 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-400 transition-all text-sm"
            >
              {isVerifyingOtp ? "Verifying..." : "CONFIRM ORDER"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-4xl font-extrabold text-white tracking-widest mb-8"
          >
            CHECKOUT
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {["Delivery", "Payment", "Confirm"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (i + 1 < checkoutStep) setCheckoutStep(i + 1);
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

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Address & Landmark Form */}
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <h2
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-2xl font-extrabold text-white tracking-widest"
                  >
                    DELIVERY ADDRESS
                  </h2>

                  <div className="space-y-4 bg-white/2 p-6 rounded-3xl border border-white/5">
                    <div>
                      <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
                          6-Digit Pincode
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          pattern="[0-9]*"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
                      />
                    </div>

                    {/* Landmark Field with Amber Reminder if Empty */}
                    <div>
                      <label className="block text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Nearby Landmark (Required)</span>
                        {isLandmarkEmpty && (
                          <span className="text-[var(--color-ricky-accent-amber)] text-[10px] flex items-center gap-1 font-bold">
                            <AlertTriangle size={10} /> REQUIRED FOR RIDER
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Khanna Railway Station or GT Road Temple"
                        className={`w-full bg-white/4 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all ${
                          isLandmarkEmpty
                            ? "border-2 border-[var(--color-ricky-accent-amber)] placeholder-[var(--color-ricky-accent-amber)]/40"
                            : "border border-white/8 focus:border-[#00cfff]/40"
                        }`}
                      />
                    </div>

                    {pincode.length === 6 && !isKhannaPincode(pincode) && (
                      <div className="p-3 bg-[var(--color-ricky-accent-amber)]/10 border border-[var(--color-ricky-accent-amber)]/30 rounded-xl text-xs text-[var(--color-ricky-accent-amber)]">
                        ⚠️ delivery outside Khanna boundaries detected. Order will fallback to standard national shipping (3-5 days).
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (isLandmarkEmpty) {
                        alert("Landmark is required so delivery riders can locate your address!");
                        return;
                      }
                      setCheckoutStep(2);
                    }}
                    className="w-full py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {checkoutStep === 2 && (
                <div>
                  <h2
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-2xl font-extrabold text-white tracking-widest mb-5"
                  >
                    PAYMENT METHOD
                  </h2>
                  <div className="space-y-2.5 mb-6">
                    {[
                      { id: "UPI",            label: "UPI",                 desc: "Google Pay, PhonePe, Paytm — instant transfer" },
                      { id: "CARD",           label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay — all banks" },
                      { id: "NETBANKING",     label: "Net Banking",         desc: "50+ banks supported" },
                      { id: "EMI_BAJAJ",      label: "Bajaj Finserv EMI",   desc: "0% EMI, up to 24 months — pre-approved" },
                      { id: "EMI_HOMECREDIT", label: "Home Credit EMI",     desc: "Flexible plans starting at ₹999/mo" },
                    ].map((pm) => (
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
                          ["Provider", payMethod === "EMI_BAJAJ" ? "Bajaj Finserv" : "Home Credit"],
                          ["Tenure", tenureParam ? `${tenureParam} months` : "12 months"],
                          ["Interest Rate", "0% p.a."],
                          ["Monthly EMI", fmt(Math.round(itemsTotal / parseInt(tenureParam || "12")))],
                          ["Processing Fee", fmt(499)],
                          ["Down Payment", payMethod === "EMI_BAJAJ" ? "₹0" : fmt(Math.round(itemsTotal * 0.1))],
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
                      onClick={() => setCheckoutStep(1)}
                      className="px-5 py-3.5 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCheckoutStep(3)}
                      className="flex-1 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      REVIEW ORDER
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {checkoutStep === 3 && (
                <div>
                  <h2
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-2xl font-extrabold text-white tracking-widest mb-5"
                  >
                    REVIEW ORDER
                  </h2>
                  <div className="space-y-3 mb-5">
                    {checkoutItems.map((item) => {
                      const p = PRODUCTS.find((pr) => pr.id === item.productId);
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
                            <p className="text-sm font-semibold text-white truncate">{p.name}</p>
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
                      <span className="text-green-400 font-semibold">
                        {isKhannaPincode(pincode) ? "Same-Day Hyperlocal" : "National Standard"}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5 text-base">
                      <span>Total</span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(itemsTotal)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="px-5 py-3.5 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3.5 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-400 transition-all text-sm tracking-widest"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      PLACE ORDER
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar summary */}
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
                    const p = PRODUCTS.find((pr) => pr.id === item.productId);
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
                    <span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(itemsTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
