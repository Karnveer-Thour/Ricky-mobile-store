import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router";
import { useApp } from "../AppContext";
import { PRODUCTS, fmt } from "../data";
import {
  Smartphone, Search, Heart, ShoppingCart, Package, User, X, Menu, Minus, Plus
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const {
    cart,
    wishlist,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    updateQty,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col justify-between">
      {/* nav-001: Global Header Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#07070f]/90 backdrop-blur-xl border-b border-white/5" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-[#00cfff] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Smartphone size={15} className="text-[#07070f]" />
            </div>
            <span
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-xl font-extrabold tracking-widest text-white"
            >
              RICKY<span className="text-[#00cfff]">.</span>
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex-1 relative max-w-sm mx-auto hidden sm:block">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phones, brands..."
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/40 transition-all"
            />
          </form>

          <div className="flex items-center gap-1 ml-auto">
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ff2d55] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#00cfff] rounded-full text-[9px] font-bold text-[#07070f] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/orders"
              className="hidden sm:flex p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              aria-label="My Orders"
            >
              <Package size={19} />
            </Link>

            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 ml-1 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-sm text-gray-400 hover:border-[#00cfff]/30 hover:text-white transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#00cfff] flex items-center justify-center">
                <User size={11} className="text-[#07070f]" />
              </div>
              <span>Ricky</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2.5 text-gray-500 hover:text-white transition-all"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden bg-[#0e0e1c] border-t border-white/5 px-4 py-3 flex flex-col gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search phones..."
                className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none"
              />
            </form>
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-all"
            >
              <Package size={15} /> My Orders
            </Link>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-all"
            >
              <User size={15} /> Profile
            </Link>
          </div>
        )}
      </header>

      {/* Main Page Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ftr-001: Trust Footer */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-12 mt-8 bg-[#0e0e1c]/40" role="contentinfo">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-[#00cfff] flex items-center justify-center">
                <Smartphone size={13} className="text-[#07070f]" />
              </div>
              <span
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-lg font-extrabold text-white tracking-widest"
              >
                RICKY<span className="text-[#00cfff]">.</span>
              </span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Your trusted destination for premium smartphones. Authentic products, guaranteed delivery.
            </p>
          </div>
          {[
            {
              title: "EMI PARTNERS",
              links: [
                { label: "✅ Bajaj Finserv Authorized Partner", to: "#" },
                { label: "🏠 Home Credit Partner Store", to: "#" },
                { label: "💳 No Cost Credit Card EMI", to: "#" },
              ],
            },
            {
              title: "SUPPORT",
              links: [
                { label: "Track Order", to: "/orders" },
                { label: "Return Policy", to: "/faq" },
                { label: "Warranty Claims", to: "/chat" },
                { label: "Contact Us", to: "/chat" },
                { label: "FAQs", to: "/faq" },
              ],
            },
            {
              title: "COMPANY",
              links: [
                { label: "About Ricky", to: "/about" },
                { label: "Careers", to: "/about" },
                { label: "Privacy Policy", to: "/faq" },
                { label: "Terms of Use", to: "/faq" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4
                className="text-[10px] text-gray-700 tracking-widest mb-4 font-bold"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith("#") ? (
                      <span className="text-xs text-gray-500">{link.label}</span>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-xs text-gray-600 hover:text-[#00cfff] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/4 flex flex-wrap justify-between items-center gap-3 text-xs text-gray-800">
          <p>© 2024 Ricky Mobile Store. Serving Khanna & Punjab. All rights reserved.</p>
          <p style={{ fontFamily: "'DM Mono', monospace" }}>Made with precision in India</p>
        </div>
      </footer>

      {/* Cart Drawer */}
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
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
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
              onClick={() => setCartOpen(false)}
              className="px-5 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all tracking-wide"
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
                const p = PRODUCTS.find((pr) => pr.id === item.productId)!;
                const ep = p.price - p.discount;
                return (
                  <div
                    key={`${item.productId}-${item.colorId}`}
                    className="flex gap-3 p-4 bg-white/3 rounded-2xl border border-white/5"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-snug truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.colorName}</p>
                      <p
                        className="text-sm text-[#00cfff] mt-1"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {fmt(ep)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.productId, item.colorId, -1)}
                          className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-white hover:bg-white/12 transition-all"
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
                          onClick={() => updateQty(item.productId, item.colorId, 1)}
                          className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-white hover:bg-white/12 transition-all"
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
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-white">
                  {fmt(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(cartTotal)}</span>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
