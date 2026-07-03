import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { PRODUCTS, fmt } from "../data";
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
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
          MY WISHLIST
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-700 bg-white/2 rounded-3xl border border-white/5">
          <p className="text-sm">Your wishlist is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-xs"
          >
            Go Shop Phones
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {wishlistedProducts.map((p) => {
            const ep = p.price - p.discount;
            return (
              <div
                key={p.id}
                className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-4 flex gap-4 items-center"
              >
                <img src={p.image} alt={p.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{p.name}</h3>
                  <p className="text-sm text-[#00cfff] mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep)}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addToCart(p.id, p.colors[0].id, p.colors[0].colorName, 1)}
                      className="px-3 py-1.5 bg-[#00cfff] text-[#07070f] rounded-xl text-xs font-bold hover:bg-[#00cfff]/90 transition-all flex items-center gap-1"
                    >
                      <ShoppingCart size={11} /> Add
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-1.5 border border-white/10 rounded-xl hover:bg-white/5 text-gray-500 hover:text-[#ff2d55]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
