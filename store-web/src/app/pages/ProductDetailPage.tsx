import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { fmt } from "../data";
import { ArrowLeft, Heart, Minus, Plus, Shield, CreditCard, Star, Cpu, Layers } from "lucide-react";
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
  const { products, loadingProducts, wishlist, toggleWishlist, addToCart } = useApp();
  const [fetchedProduct, setFetchedProduct] = useState<any | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // Find product by slug or id from state
  const cachedProduct = products.find(
    (p) =>
      p.name.toLowerCase().replace(/ /g, "-") === slug ||
      String(p.id) === slug ||
      p.name.toLowerCase() === slug?.toLowerCase()
  );

  const sp = cachedProduct || fetchedProduct;

  useEffect(() => {
    if (!cachedProduct && slug) {
      setIsFetching(true);
      import("../services/apiService").then(({ apiService }) => {
        apiService.fetchProductById(slug).then((res) => {
          if (res) {
            setFetchedProduct({
              id: res.id || slug,
              name: res.productName || res.name || "Unnamed Product",
              price: Number(res.price) || 0,
              discount: Number(res.discount) || 0,
              description: res.description || "",
              quantity: Number(res.quantity || res.stockCount) || 10,
              warranty: res.warranty || "1 Year Official Brand Warranty for Device and 6 Months for In-Box Accessories",
              specifications: res.specifications || res.brand || "",
              categoryId: res.categoryId || 1,
              colors:
                res.colors && res.colors.length > 0
                  ? res.colors
                  : [{ id: 1, colorName: "Default", quantity: 10, hex: "#000000" }],
              reviews: res.reviews || [],
              image:
                res.imageUrl ||
                res.image ||
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format",
              images: res.images || (res.imageUrl ? [res.imageUrl] : []),
              badge: res.badge || null,
            });
          }
          setIsFetching(false);
        });
      });
    }
  }, [cachedProduct, slug]);

  const [activeImage, setActiveImage] = useState<string>("");
  const [selColorId, setSelColorId] = useState<any | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");

  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotLender, setChatbotLender] = useState<"bajaj" | "homecredit">("bajaj");

  useEffect(() => {
    if (sp) {
      if (!activeImage) {
        setActiveImage(sp.image);
      }
      if (!selColorId && sp.colors && sp.colors.length > 0) {
        setSelColorId(sp.colors[0].id);
      }
    }
  }, [sp, activeImage, selColorId]);

  if (loadingProducts || isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-36 text-center">
        <div className="w-10 h-10 border-2 border-[#00cfff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!sp) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center text-gray-400">
        <p className="text-lg font-semibold text-white mb-2">Product Not Found</p>
        <p className="text-sm text-gray-500 mb-6">The item you're looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all cursor-pointer"
        >
          Back to Store
        </button>
      </div>
    );
  }

  const selColor =
    (sp.colors || []).find((c: any) => c.id === selColorId) ||
    (sp.colors || [])[0] ||
    { id: 1, colorName: "Default", quantity: 10 };

  const currentDisplayImage = activeImage || sp.image;
  const imageList: string[] = sp.images && sp.images.length > 0 ? sp.images : [sp.image];

  // Parse specifications into structured Flipkart key-value rows
  const rawSpecs = sp.specifications || "";
  const specItems: Array<{ key: string; val: string }> = [];

  if (rawSpecs.includes("\n")) {
    rawSpecs.split("\n").forEach((line: string) => {
      const clean = line.replace(/^[•\-\*]\s*/, "").trim();
      if (!clean) return;
      const ci = clean.indexOf(":");
      if (ci !== -1) {
        specItems.push({ key: clean.slice(0, ci).trim(), val: clean.slice(ci + 1).trim() });
      } else {
        specItems.push({ key: "Feature", val: clean });
      }
    });
  } else if (rawSpecs.includes("|")) {
    rawSpecs.split("|").forEach((spec: string) => {
      const clean = spec.trim();
      if (!clean) return;
      const ci = clean.indexOf(":");
      if (ci !== -1) {
        specItems.push({ key: clean.slice(0, ci).trim(), val: clean.slice(ci + 1).trim() });
      } else {
        specItems.push({ key: "Feature", val: clean });
      }
    });
  } else if (rawSpecs.trim().length > 0) {
    specItems.push({ key: "Overview", val: rawSpecs.trim() });
  }

  const handleEMISelect = (lender: "bajaj" | "homecredit") => {
    setChatbotLender(lender);
    setIsChatbotOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-8 text-sm cursor-pointer"
      >
        <ArrowLeft size={15} />
        Back to Store
      </button>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery & Affordability Column */}
        <div className="md:sticky md:top-24 self-start space-y-5">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#0e0e1c] border border-white/5 relative group">
            <img
              src={currentDisplayImage}
              alt={sp.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            {sp.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-[#ff2d55] text-white text-xs font-bold rounded-xl shadow-lg">
                  {sp.badge}
                </span>
              </div>
            )}
          </div>

          {/* Multi-Image Thumbnail Switcher */}
          {imageList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {imageList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    currentDisplayImage === imgUrl
                      ? "border-[#00cfff] shadow-lg shadow-[#00cfff]/20 scale-105"
                      : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                  }`}
                >
                  <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Affordability Calculator Widget */}
          <AffordabilityWidget
            price={sp.price - sp.discount}
            onCheckout={handleEMISelect}
            onSupportChat={() => navigate("/chat")}
          />
        </div>

        {/* Product Details & Specs Column */}
        <div>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-5xl font-extrabold text-white tracking-widest leading-none mb-3"
          >
            {sp.name}
          </h1>

          {sp.reviews && sp.reviews.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <StarRow
                rating={Math.round(
                  sp.reviews.reduce((s: number, r: any) => s + r.rating, 0) / sp.reviews.length
                )}
                size={14}
              />
              <span className="text-sm text-gray-500">
                {(
                  sp.reviews.reduce((s: number, r: any) => s + r.rating, 0) / sp.reviews.length
                ).toFixed(1)}{" "}
                ({sp.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price & Savings */}
          <div className="flex items-baseline gap-4 mb-4">
            <span
              className="text-3xl font-extrabold text-[#00cfff]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {fmt(sp.price - sp.discount)}
            </span>
            {sp.discount > 0 && (
              <>
                <span
                  className="text-lg text-gray-600 line-through"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {fmt(sp.price)}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Save {fmt(sp.discount)}
                </span>
              </>
            )}
          </div>

          {/* Official Warranty Badge */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/3 border border-white/8 text-xs text-gray-300 mb-6">
            <Shield size={16} className="text-[#00cfff] shrink-0" />
            <span className="font-medium">{sp.warranty || "1 Year Official Brand Warranty"}</span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-6">{sp.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <p
              className="text-xs text-gray-400 uppercase tracking-widest mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Color: <span className="text-white font-semibold">{selColor.colorName || selColor.name}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {(sp.colors || []).map((c: any) => {
                const isSelected = c.id === selColorId;
                const colorTitle = c.colorName || c.name || "Default";
                const isOutOfStock = c.quantity === 0;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelColorId(c.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isOutOfStock
                        ? "border-red-500/20 bg-red-500/5 text-gray-600 opacity-60 line-through"
                        : isSelected
                        ? "border-[#00cfff] bg-[#00cfff]/10 text-white shadow-md shadow-[#00cfff]/10"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {c.hex && (
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    <span>{colorTitle}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({c.quantity})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <p
              className="text-xs text-gray-400 uppercase tracking-widest"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Qty
            </p>
            <div className="inline-flex items-center bg-white/4 border border-white/8 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={selColor.quantity === 0}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <span
                className="text-white w-8 text-center text-sm border-x border-white/8"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {selColor.quantity === 0 ? 0 : qty}
              </span>
              <button
                onClick={() => setQty(Math.min(selColor.quantity, qty + 1))}
                disabled={selColor.quantity === 0 || qty >= selColor.quantity}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/8 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => addToCart(sp.id, selColor.id, selColor.colorName || selColor.name || "Default", qty)}
              disabled={selColor.quantity === 0}
              className={`flex-1 py-3.5 font-extrabold rounded-2xl transition-all text-sm tracking-widest ${
                selColor.quantity === 0
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-[#00cfff] text-[#07070f] hover:bg-[#00cfff]/90 cursor-pointer shadow-lg shadow-[#00cfff]/20"
              }`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {selColor.quantity === 0 ? "COLOR OUT OF STOCK" : "ADD TO CART"}
            </button>
            <button
              onClick={() => toggleWishlist(sp.id)}
              className="w-14 flex items-center justify-center border border-white/10 rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
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
                  className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                    activeTab === tab
                      ? "border-[#00cfff] text-[#00cfff]"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "reviews"
                    ? `Reviews (${(sp.reviews || []).length})`
                    : "Flipkart Standard Specifications"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "specs" && (
            <div className="space-y-2">
              {specItems.length > 0 ? (
                specItems.map((spec, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-white/5">
                    <span
                      className="text-xs text-[#00cfff]/90 uppercase font-bold sm:w-36 shrink-0 tracking-wide"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {spec.key}
                    </span>
                    <span className="text-xs text-gray-300 font-medium mt-1 sm:mt-0 leading-relaxed">
                      {spec.val}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic py-3">
                  Technical specifications not listed for this model.
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              {(sp.reviews || []).length === 0 ? (
                <p className="text-gray-500 text-sm py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                (sp.reviews || []).map((r: any) => (
                  <div
                    key={r.id}
                    className="p-4 bg-white/3 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">
                        {r.author || r.reviewerName || "Verified Buyer"}
                      </span>
                      <StarRow rating={r.rating} size={12} />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {r.comment || r.review}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Chatbot Overlay */}
      {isChatbotOpen && (
        <ChatbotOverlay
          isOpen={isChatbotOpen}
          lender={chatbotLender}
          productPrice={sp.price - sp.discount}
          productName={sp.name}
          onApproval={() => setIsChatbotOpen(false)}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}
    </div>
  );
}
