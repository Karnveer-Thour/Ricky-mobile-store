import React from "react";
import { Link } from "react-router";
import {
  Smartphone,
  Search,
  Heart,
  ShoppingCart,
  Package,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "../../AppContext";
import UserMenuDropdown from "./UserMenuDropdown";
import StorefrontMobileNav from "./StorefrontMobileNav";

interface StorefrontHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export default function StorefrontHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  menuOpen,
  onToggleMenu,
}: StorefrontHeaderProps) {
  const { wishlist, cartCount, setCartOpen } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#07070f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00cfff] to-[#0077ff] flex items-center justify-center text-[#07070f] shadow-lg shadow-[#00cfff]/20 group-hover:scale-105 transition-transform duration-300">
            <Smartphone size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-2xl font-extrabold tracking-widest text-white block leading-none"
            >
              RICKY<span className="text-[#00cfff]">MOBILE</span>
            </span>
            <span
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-[10px] text-gray-400 tracking-widest block mt-0.5"
            >
              STORE & REPAIR
            </span>
          </div>
        </Link>

        <form
          onSubmit={onSearchSubmit}
          className="flex-1 relative max-w-sm mx-auto hidden sm:block"
        >
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
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

          <UserMenuDropdown />

          <button
            type="button"
            onClick={onToggleMenu}
            className="sm:hidden p-2.5 text-gray-500 hover:text-white transition-all cursor-pointer"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <StorefrontMobileNav
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onClose={onToggleMenu}
        />
      )}
    </header>
  );
}
