import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { fmt, Product } from "../data";
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { apiService } from "../services/apiService";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist, addToCart, user } = useApp();
  const [remoteProducts, setRemoteProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id && !user.id.startsWith("u-demo-")) {
      setLoading(true);
      apiService
        .fetchWishlist(user.id)
        .then((res) => {
          if (res.products && Array.isArray(res.products)) {
            setRemoteProducts(res.products);
          }
        })
        .catch((err) => console.warn("Wishlist fetch failed:", err))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  // Combine products: first look in products, then in remoteProducts
  const wishlistedProducts = wishlist
    .map((id) => {
      const found = products.find((p) => String(p.id) === String(id));
      if (found) return found;
      const remote = remoteProducts.find((p) => String(p.id) === String(id));
      if (remote) {
        return {
          id: remote.id,
          name: remote.name || "Product",
          price: Number(remote.price) || 0,
          discount: Number(remote.discount) || 0,
          description: remote.description || "",
          quantity: 10,
          warranty: "1 Year Official Warranty",
          specifications: remote.specifications || "",
          categoryId: 1,
          colors: [
            { id: 1, colorName: "Default", quantity: 10, hex: "#000000" },
          ],
          reviews: [],
          image:
            remote.image ||
            remote.imageUrl ||
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format",
          badge: null,
        } as Product;
      }
      return null;
    })
    .filter(Boolean) as Product[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          MY WISHLIST ({wishlist.length})
        </h1>
      </div>

      {loading && wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white/2 rounded-3xl border border-white/5">
          <div className="w-8 h-8 border-2 border-[#00cfff] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading your wishlist...</p>
        </div>
      ) : wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-700 bg-white/2 rounded-3xl border border-white/5">
          <p className="text-sm">Your wishlist is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-xs cursor-pointer hover:bg-[#00cfff]/90 transition-all"
          >
            Go Shop Phones
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {wishlistedProducts.map((p) => {
            const ep = p.price - p.discount;
            const defaultColor = p.colors?.[0] || {
              id: 1,
              colorName: "Default",
              quantity: 10,
              hex: "#000000",
            };
            return (
              <div
                key={p.id}
                className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-4 flex gap-4 items-center"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {p.name}
                  </h3>
                  <p
                    className="text-sm text-[#00cfff] mt-1"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {fmt(ep)}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        addToCart(
                          p.id,
                          defaultColor.id,
                          defaultColor.colorName,
                          1,
                        )
                      }
                      className="px-3 py-1.5 bg-[#00cfff] text-[#07070f] rounded-xl text-xs font-bold hover:bg-[#00cfff]/90 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart size={11} /> Add
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-1.5 border border-white/10 rounded-xl hover:bg-white/5 text-gray-500 hover:text-[#ff2d55] cursor-pointer"
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
