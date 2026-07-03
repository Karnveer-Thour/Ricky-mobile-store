import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { PRODUCTS, pct, fmt } from "../data";
import { ArrowLeft, Tag, Zap, RotateCcw, Heart } from "lucide-react";

export default function OffersPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const dealProducts = PRODUCTS.filter((p) => p.discount > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          OFFERS & DEALS
        </h1>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff2d55]/15 via-[#8b5cf6]/10 to-[#00cfff]/10 border border-white/8 p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff2d55]/8 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff2d55]/15 border border-[#ff2d55]/25 rounded-full text-xs text-[#ff2d55] font-bold mb-4"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <Tag size={10} /> LIMITED TIME DEALS
          </div>
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-5xl font-extrabold text-white tracking-widest mb-2"
          >
            SAVE UP TO {Math.max(...PRODUCTS.map((p) => pct(p.price, p.discount)))}%
          </h2>
          <p className="text-gray-400 text-sm max-w-md">
            Handpicked deals on flagship phones. All orders include free delivery, full warranty, and our 7-day return guarantee.
          </p>
        </div>
      </div>

      {/* Deal categories */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { Icon: Zap,       title: "Flash Sales",  desc: "Lightning deals updated every 24h", color: "text-yellow-400", bg: "bg-yellow-400/8 border-yellow-400/15" },
          { Icon: Tag,       title: "Best Prices",  desc: "Guaranteed lowest price on flagships", color: "text-[#00cfff]", bg: "bg-[#00cfff]/8 border-[#00cfff]/15" },
          { Icon: RotateCcw, title: "Cashback",     desc: "Up to ₹3,000 cashback on UPI payments", color: "text-green-400", bg: "bg-green-400/8 border-green-400/15" },
        ].map(({ Icon, title, desc, color, bg }) => (
          <div key={title} className={`flex items-start gap-4 p-5 rounded-2xl border ${bg}`}>
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className={`text-sm font-bold ${color}`}>{title}</p>
              <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-2xl font-extrabold text-white tracking-widest mb-5">
        ALL DEALS <span className="text-gray-700 text-base font-normal" style={{ fontFamily: "'DM Mono', monospace" }}>({dealProducts.length} offers)</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealProducts.map((product) => {
          const ep = product.price - product.discount;
          const productSlug = product.name.toLowerCase().replace(/ /g, "-");
          return (
            <div key={product.id} className="group bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff2d55]/15 hover:shadow-lg hover:shadow-[#ff2d55]/4 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-[#141425] cursor-pointer" onClick={() => navigate(`/products/${productSlug}`)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-3 py-1.5 bg-[#ff2d55] text-white text-sm font-extrabold rounded-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>-{pct(product.price, product.discount)}% OFF</span>
                  {product.badge && <span className="px-2.5 py-1 bg-[#00cfff] text-[#07070f] text-xs font-bold rounded-lg">{product.badge}</span>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all">
                  <Heart size={15} className={wishlist.includes(product.id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-white"} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-[15px] leading-snug mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep)}</span>
                  <span className="text-sm text-gray-700 line-through" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(product.price)}</span>
                </div>
                <p className="text-xs text-green-400 font-semibold mb-3">You save {fmt(product.discount)}</p>
                <button
                  onClick={() => addToCart(product.id, product.colors[0].id, product.colors[0].colorName, 1)}
                  className="w-full py-2.5 bg-[#ff2d55] text-white font-bold rounded-xl text-sm hover:bg-[#ff2d55]/90 transition-all"
                >
                  Grab Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
