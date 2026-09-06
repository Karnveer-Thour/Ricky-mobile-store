import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { User, Package, Heart, LogOut, ChevronDown } from "lucide-react";
import { useApp } from "../../AppContext";

export default function UserMenuDropdown() {
  const { user, logout, wishlist, openAuthModal } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal("login")}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-4 py-2 rounded-xl bg-[#00cfff] text-[#07070f] font-extrabold text-xs tracking-wider hover:bg-[#00cfff]/90 transition-all cursor-pointer shadow-md shadow-[#00cfff]/20"
      >
        <User size={13} className="stroke-[2.5]" />
        SIGN IN
      </button>
    );
  }

  return (
    <div className="relative hidden sm:block" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        className="flex items-center gap-2 ml-1 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-sm text-gray-300 hover:border-[#00cfff]/40 hover:text-white transition-all cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00cfff] to-[#0077ff] flex items-center justify-center text-[#07070f] font-bold text-xs overflow-hidden">
          {user.pictureUrl ? (
            <img
              src={user.pictureUrl}
              alt={user.firstName}
              className="w-full h-full object-cover"
            />
          ) : (
            user.firstName.charAt(0).toUpperCase()
          )}
        </div>
        <span className="font-semibold text-xs">{user.firstName}</span>
        <ChevronDown
          size={13}
          className={`text-gray-500 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {userDropdownOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-[#0e0e1c] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 border-b border-white/5">
            <p className="text-xs font-bold text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[11px] text-gray-500 truncate font-mono">
              {user.email}
            </p>
          </div>
          <Link
            to="/profile"
            onClick={() => setUserDropdownOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <User size={14} className="text-[#00cfff]" /> My Profile
          </Link>
          <Link
            to="/orders"
            onClick={() => setUserDropdownOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Package size={14} className="text-[#00cfff]" /> My Orders
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setUserDropdownOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Heart size={14} className="text-[#ff2d55]" /> Wishlist (
            {wishlist.length})
          </Link>
          <div className="h-[1px] bg-white/5 my-1" />
          <button
            type="button"
            onClick={() => {
              logout();
              setUserDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
