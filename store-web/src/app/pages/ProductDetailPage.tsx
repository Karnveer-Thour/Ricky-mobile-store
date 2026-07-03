import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { PRODUCTS, fmt } from "../data";
import { ArrowLeft, Heart, Minus, Plus, Shield, CreditCard, Star } from "lucide-react";
import AffordabilityWidget from "../components/AffordabilityWidget";
import ChatbotOverlay from "../components/ChatbotOverlay";

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  // Find product by slug
  const sp = PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/ /g, "-") === slug
  );

  const [selColorId, setSelColorId] = useState<number | null>(
    sp ? sp.colors[0].id : null
  );
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");

  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotLender, setChatbotLender] = useState<"bajaj" | "homecredit">("bajaj");

  if (!sp) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-400">
        <p>Product not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-[#00cfff] underline">
          Back to Store
        </button>
      </div>
    );
  }

  const selColor = sp.colors.find((c) => c.id === selColorId) ?? sp.colors[0];

  const handleEMISelect = (lender: "bajaj" | "homecredit", tenure: number) => {
    setChatbotLender(lender);
    setIsChatbotOpen(true);
  };

  const handleChatbotApproval = (lender: "bajaj" | "homecredit", limit: number, tenure: number) => {
    setIsChatbotOpen(false);
    navigate(
      `/checkout?lender=${lender}&tenure=${tenure}&productId=${sp.id}&colorId=${selColor.id}&qty=${qty}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-8 text-sm"
      >
        <ArrowLeft size={15} />
        Back to Store
      </button>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="md:sticky md:top-24 self-start space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#0e0e1c] border border-white/5 relative group">
            <img
              src={sp.image}
              alt={sp.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            {sp.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-[#ff2d55] text-white text-xs font-bold rounded-xl">
                  {sp.badge}
                </span>
              </div>
            )}
          </div>

          {/* Affordability Calculator Widget integrated directly below product images/specs */}
          <AffordabilityWidget
            price={sp.price - sp.discount}
            onCheckout={handleEMISelect}
            onSupportChat={() => navigate("/chat")}
          />
        </div>

        <div>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-5xl font-extrabold text-white tracking-widest leading-none mb-3"
          >
            {sp.name}
          </h1>

          {sp.reviews.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <StarRow
                rating={Math.round(
                  sp.reviews.reduce((s, r) => s + r.rating, 0) / sp.reviews.length
                )}
                size={14}
              />
              <span className="text-sm text-gray-600">
                {(
                  sp.reviews.reduce((s, r) => s + r.rating, 0) / sp.reviews.length
                ).toFixed(1)}{" "}
                ({sp.reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {fmt(sp.price - sp.discount)}
            </span>
            {sp.discount > 0 && (
              <>
                <span
                  className="text-lg text-gray-700 line-through"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {fmt(sp.price)}
                </span>
                <span className="px-2.5 py-0.5 bg-green-500/12 border border-green-500/20 text-green-400 text-xs font-bold rounded-lg">
                  Save {fmt(sp.discount)}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-700 mb-5 flex items-center gap-1.5">
            <Shield size={10} className="text-[#00cfff]" />
            {sp.warranty}
          </p>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {sp.description}
          </p>

          {/* Color picker */}
          <div className="mb-6">
            <p
              className="text-xs text-gray-600 uppercase tracking-widest mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Color — <span className="text-white">{selColor.colorName}</span>
            </p>
            <div className="flex gap-3">
              {sp.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelColorId(c.id)}
                  title={c.colorName}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    c.id === selColorId
                      ? "border-[#00cfff] scale-110 shadow-md shadow-[#00cfff]/20"
                      : "border-white/15 hover:border-white/30"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="text-[11px] text-gray-700 mt-2">
              {selColor.quantity} units available
            </p>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <p
              className="text-xs text-gray-600 uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Qty
            </p>
            <div className="inline-flex items-center bg-white/4 border border-white/8 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/8 transition-all"
              >
                <Minus size={13} />
              </button>
              <span
                className="text-white w-8 text-center text-sm border-x border-white/8"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(selColor.quantity, qty + 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/8 transition-all"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => addToCart(sp.id, selColor.id, selColor.colorName, qty)}
              className="flex-1 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              ADD TO CART
            </button>
            <button
              onClick={() => toggleWishlist(sp.id)}
              className="w-14 flex items-center justify-center border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
            >
              <Heart
                size={17}
                className={
                  wishlist.includes(sp.id)
                    ? "text-[#ff2d55] fill-[#ff2d55]"
                    : "text-gray-500"
                }
              />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/6 mb-5">
            <div className="flex gap-0">
              {(["specs", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-[#00cfff] text-[#00cfff]"
                      : "border-transparent text-gray-600 hover:text-gray-300"
                  }`}
                >
                  {tab === "reviews"
                    ? `Reviews (${sp.reviews.length})`
                    : "Specifications"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "specs" && (
            <div>
              {sp.specifications.split("|").map((spec, i) => {
                const ci = spec.indexOf(":");
                const key = spec.slice(0, ci).trim();
                const val = spec.slice(ci + 1).trim();
                return (
                  <div key={i} className="flex gap-6 py-3 border-b border-white/4">
                    <span
                      className="text-xs text-gray-700 w-24 shrink-0"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {key}
                    </span>
                    <span className="text-xs text-gray-400">{val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              {sp.reviews.length === 0 ? (
                <p className="text-gray-700 text-sm py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                sp.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-white/3 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{r.title}</p>
                        <p className="text-xs text-gray-700 mt-0.5">{r.user}</p>
                      </div>
                      <StarRow rating={r.rating} size={11} />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* EMI teaser fallback */}
          <div className="mt-6 p-4 bg-[#8b5cf6]/6 border border-[#8b5cf6]/15 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard size={13} className="text-[#8b5cf6]" />
              <p className="text-xs font-bold text-[#8b5cf6] tracking-wide">
                EASY EMI AVAILABLE
              </p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Starting from{" "}
              <span
                className="text-white"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {fmt(Math.round((sp.price - sp.discount) / 12))}/mo
              </span>{" "}
              — 0% interest via Bajaj Finserv &amp; Home Credit. No cost EMI on
              select cards.
            </p>
          </div>
        </div>
      </div>

      <ChatbotOverlay
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        productPrice={sp.price - sp.discount}
        productName={sp.name}
        onApproval={handleChatbotApproval}
        lender={chatbotLender}
      />
    </div>
  );
}
