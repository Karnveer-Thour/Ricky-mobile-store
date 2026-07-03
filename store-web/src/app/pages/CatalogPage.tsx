import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { PRODUCTS, CATEGORIES, pct, fmt } from "../data";
import {
  Smartphone, Heart, Zap, Truck, Shield, CreditCard, MapPin, CheckCircle2, BadgePercent, ChevronRight, Star
} from "lucide-react";
import { AffordabilityBadge } from "../components/AffordabilityWidget";

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
      ))}
    </div>
  );
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [catFilter, setCatFilter] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter((p) => {
    const mc = catFilter === null || p.categoryId === catFilter;
    const ms = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-14 px-4">
        <div className="absolute -top-10 left-1/3 w-[500px] h-[300px] bg-[#00cfff]/6 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#8b5cf6]/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00cfff]/8 border border-[#00cfff]/15 rounded-full text-xs text-[#00cfff] mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Zap size={10} fill="currentColor" />
              NEW ARRIVALS — SUMMER 2024
            </div>
            <h1
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-none tracking-widest mb-5"
            >
              NEXT-GEN<br />
              <span className="text-[#00cfff]">MOBILE</span><br />
              STORE
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
              Flagship smartphones, exclusive deals, and same-day delivery. Every phone you want, at prices that make sense.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                SHOP NOW
              </button>
              <button
                onClick={() => navigate("/offers")}
                className="px-6 py-3 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-sm"
              >
                View Offers
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { Icon: Truck, label: "Free Delivery" },
                { Icon: Shield, label: "Genuine Products" },
                { Icon: CreditCard, label: "Easy EMI" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-gray-600 text-xs">
                  <Icon size={13} className="text-[#00cfff]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full border border-[#00cfff]/8" />
              <div className="absolute inset-6 rounded-full border border-[#00cfff]/5 bg-[#00cfff]/3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format"
                  alt="Featured iPhone 15 Pro Max"
                  className="w-56 h-56 object-cover rounded-3xl shadow-2xl shadow-[#00cfff]/10 hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => navigate("/products/iphone-15-pro-max")}
                />
              </div>
              <div className="absolute top-4 right-0 px-3 py-1.5 bg-[#0e0e1c] border border-white/10 rounded-xl shadow-xl">
                <p className="text-xs text-[#00cfff] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(129900)}</p>
                <p className="text-[10px] text-gray-600">iPhone 15 Pro Max</p>
              </div>
              <div className="absolute bottom-6 left-0 flex items-center gap-2 px-3 py-2 bg-[#0e0e1c] border border-white/10 rounded-xl shadow-xl">
                <CheckCircle2 size={13} className="text-green-400" />
                <p className="text-[10px] text-gray-400">In Stock · Ships today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2">
        <div
          onClick={() => navigate("/products/samsung-galaxy-s24-ultra")}
          className="flex items-center gap-3 px-5 py-3.5 bg-[#ff2d55]/8 border border-[#ff2d55]/20 rounded-2xl cursor-pointer hover:bg-[#ff2d55]/12 transition-all"
        >
          <BadgePercent size={16} className="text-[#ff2d55] shrink-0" />
          <p className="text-sm text-white">
            <span className="font-bold text-[#ff2d55]">SALE ON NOW</span>{" "}
            <span className="text-gray-400">— Up to {pct(PRODUCTS[1].price, PRODUCTS[1].discount)}% off Samsung S24 Ultra. Limited stock.</span>
          </p>
          <ChevronRight size={14} className="text-gray-600 ml-auto shrink-0" />
        </div>
      </div>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setCatFilter(null)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${catFilter === null ? "bg-[#00cfff] text-[#07070f]" : "bg-white/4 border border-white/8 text-gray-500 hover:text-white hover:border-white/15"}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCatFilter(c.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${catFilter === c.id ? "bg-[#00cfff] text-[#07070f]" : "bg-white/4 border border-white/8 text-gray-500 hover:text-white hover:border-white/15"}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-sm">
            <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phones, brands..."
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/40 transition-all"
            />
          </div>
        </div>

        <div className="flex items-end justify-between mb-6">
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-3xl font-extrabold text-white tracking-widest"
          >
            {search ? `"${search}"` : "FEATURED PHONES"}
          </h2>
          <span className="text-xs text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{filtered.length} products</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <Smartphone size={44} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => {
              const ep = product.price - product.discount;
              const avgR = product.reviews.length
                ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
                : 0;
              // Map product ID to page slug for route compatibility
              const productSlug = product.name.toLowerCase().replace(/ /g, "-");
              return (
                <div
                  key={product.id}
                  className="group bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden hover:border-[#00cfff]/15 hover:shadow-lg hover:shadow-[#00cfff]/4 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="relative aspect-square overflow-hidden bg-[#141425] cursor-pointer"
                      onClick={() => navigate(`/products/${productSlug}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.badge && (
                          <span className="px-2.5 py-1 bg-[#ff2d55] text-white text-xs font-bold rounded-lg leading-none">
                            {product.badge}
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="px-2.5 py-1 bg-[#00cfff] text-[#07070f] text-xs font-bold rounded-lg leading-none">
                            -{pct(product.price, product.discount)}%
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                      >
                        <Heart
                          size={15}
                          className={wishlist.includes(product.id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-white"}
                        />
                      </button>
                    </div>

                    <div className="p-4 cursor-pointer" onClick={() => navigate(`/products/${productSlug}`)}>
                      <div className="flex gap-1.5 mb-3">
                        {product.colors.slice(0, 4).map((c) => (
                          <div
                            key={c.id}
                            title={c.colorName}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-[10px] text-gray-700 self-center">+{product.colors.length - 4}</span>
                        )}
                      </div>

                      <h3 className="font-semibold text-white text-[15px] leading-snug">{product.name}</h3>

                      {avgR > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <StarRow rating={avgR} size={11} />
                          <span className="text-[10px] text-gray-700">({product.reviews.length})</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-baseline gap-2 mt-2">
                        <span
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {fmt(ep)}
                        </span>
                        {product.discount > 0 && (
                          <span
                            className="text-xs text-gray-700 line-through"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            {fmt(product.price)}
                          </span>
                        )}
                        {/* EMI Teaser Badges next to standard prices */}
                        <div className="mt-1">
                          <AffordabilityBadge price={ep} />
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-700 mt-2 flex items-center gap-1">
                        <Shield size={9} className="text-[#00cfff]" />
                        {product.warranty}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => addToCart(product.id, product.colors[0].id, product.colors[0].colorName, 1)}
                      className="w-full py-2.5 bg-white/4 border border-white/8 text-white font-semibold rounded-xl text-sm hover:bg-[#00cfff] hover:text-[#07070f] hover:border-[#00cfff] transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Ricky */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/4">
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-3xl font-extrabold text-white tracking-widest mb-8 text-center"
        >
          WHY RICKY STORE?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Truck,       title: "Free Delivery",  desc: "Free shipping on all orders above ₹5,000. Same-day delivery in Bengaluru." },
            { Icon: Shield,      title: "100% Genuine",   desc: "Every product is brand-verified and comes with full manufacturer warranty." },
            { Icon: CreditCard,  title: "Flexible EMI",   desc: "0% EMI up to 24 months via Bajaj Finserv, Home Credit, HDFC, and more." },
            { Icon: MapPin,      title: "Easy Returns",   desc: "7-day hassle-free returns. Our team picks it up from your doorstep." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-[#00cfff]/12 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#00cfff]/8 border border-[#00cfff]/12 flex items-center justify-center mb-4">
                <Icon size={17} className="text-[#00cfff]" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1.5">{title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Simple wrapper Search icon component since Lucide might have different layouts or Search is used.
function SearchIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
