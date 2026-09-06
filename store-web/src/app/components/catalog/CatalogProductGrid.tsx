import React from "react";
import { Search, Heart } from "lucide-react";
import { fmt } from "../../data";
import { AffordabilityBadge } from "../AffordabilityWidget";

interface CatalogProductGridProps {
  products: any[];
  filtered: any[];
  categories: any[];
  catFilter: string | number | null;
  setCatFilter: (val: string | number | null) => void;
  search: string;
  setSearch: (val: string) => void;
  loadingProducts: boolean;
  wishlist: (string | number)[];
  onToggleWishlist: (id: string | number) => void;
  onAddToCart: (
    productId: string | number,
    colorId: string | number,
    colorName: string,
    qty: number,
  ) => void;
  onProductClick: (productName: string) => void;
}

export default function CatalogProductGrid({
  products,
  filtered,
  categories,
  catFilter,
  setCatFilter,
  search,
  setSearch,
  loadingProducts,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
}: CatalogProductGridProps) {
  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            onClick={() => setCatFilter(null)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              catFilter === null
                ? "bg-[#00cfff] text-[#07070f]"
                : "bg-white/4 border border-white/8 text-gray-400 hover:text-white hover:border-white/15"
            }`}
          >
            All Models
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                String(catFilter) === String(c.id)
                  ? "bg-[#00cfff] text-[#07070f]"
                  : "bg-white/4 border border-white/8 text-gray-400 hover:text-white hover:border-white/15"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search phone or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00cfff]/40"
          />
        </div>
      </div>

      {loadingProducts ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#00cfff] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400 font-mono">
            Loading Ricky Mobile Store inventory...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-base font-semibold text-white mb-2">
            No smartphones matched your search
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Try checking other categories or visit our Khanna store directly.
          </p>
          <button
            onClick={() => {
              setCatFilter(null);
              setSearch("");
            }}
            className="px-5 py-2 bg-[#00cfff] text-[#07070f] font-bold text-xs rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const netPrice = p.price - p.discount;
            const hasDiscount = p.discount > 0;
            const isWish = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                className="bg-[#0e0e1c] border border-white/6 rounded-2xl p-4 flex flex-col justify-between hover:border-[#00cfff]/30 transition-all group"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-3.5 cursor-pointer">
                    <img
                      src={p.image}
                      alt={p.name}
                      onClick={() => onProductClick(p.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => onToggleWishlist(p.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-[#07070f]/70 backdrop-blur-md text-gray-400 hover:text-white transition-all cursor-pointer"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={14}
                        className={
                          isWish ? "text-[#ff2d55] fill-[#ff2d55]" : ""
                        }
                      />
                    </button>
                    {p.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#00cfff] text-[#07070f] font-bold text-[9px] rounded-md uppercase font-mono">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <p
                    onClick={() => onProductClick(p.name)}
                    className="text-sm font-bold text-white mb-1 hover:text-[#00cfff] transition-colors cursor-pointer line-clamp-1"
                  >
                    {p.name}
                  </p>

                  <p className="text-[11px] text-gray-400 line-clamp-1 mb-2.5">
                    {p.specifications ||
                      p.warranty ||
                      "Brand Warranty Included"}
                  </p>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span
                      className="text-lg font-extrabold text-[#00cfff]"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {fmt(netPrice)}
                    </span>
                    {hasDiscount && (
                      <span
                        className="text-xs text-gray-500 line-through"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {fmt(p.price)}
                      </span>
                    )}
                  </div>

                  {/* Affordability Badge (Bajaj EMI) */}
                  <AffordabilityBadge price={netPrice} />
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() =>
                      onAddToCart(
                        p.id,
                        p.colors?.[0]?.id || 1,
                        p.colors?.[0]?.colorName || "Default",
                        1,
                      )
                    }
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="flex-1 py-2 bg-[#00cfff] text-[#07070f] font-extrabold text-xs rounded-xl hover:bg-[#00cfff]/90 transition-all tracking-wider cursor-pointer shadow-md shadow-[#00cfff]/15"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => onProductClick(p.name)}
                    className="px-3 py-2 border border-white/10 hover:border-white/20 rounded-xl text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
