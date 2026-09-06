import React from "react";
import { Link } from "react-router";
import { Search, Package, User, LogOut } from "lucide-react";
import { useApp } from "../../AppContext";

interface StorefrontMobileNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function StorefrontMobileNav({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClose,
}: StorefrontMobileNavProps) {
  const { user, logout, openAuthModal } = useApp();

  return (
    <div className="sm:hidden bg-[#0e0e1c] border-t border-white/5 px-4 py-4 flex flex-col gap-3">
      <form onSubmit={onSearchSubmit} className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
        />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search phones..."
          className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none"
        />
      </form>
      {user ? (
        <div className="p-3 bg-white/3 rounded-2xl border border-white/6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-gray-500 font-mono truncate">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs flex items-center gap-1 cursor-pointer"
          >
            <LogOut size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            onClose();
            openAuthModal("login");
          }}
          className="w-full py-2.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl text-xs tracking-wider cursor-pointer"
        >
          SIGN IN / CREATE ACCOUNT
        </button>
      )}
      <Link
        to="/orders"
        onClick={onClose}
        className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-all"
      >
        <Package size={15} /> My Orders
      </Link>
      <Link
        to="/profile"
        onClick={onClose}
        className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-all"
      >
        <User size={15} /> Profile & Addresses
      </Link>
    </div>
  );
}
