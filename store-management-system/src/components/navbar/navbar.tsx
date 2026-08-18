"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home as Dashboard,
  User as Profile,
  Users as Customers,
  Settings,
  Building2 as Cities,
  LayoutGrid as Whatsapp,
  LogOut,
  ListCollapse as Products,
  StretchHorizontal as Categories,
  BadgeDollarSign as Sales,
  Archive as InventoryIcon,
  Columns3 as DispatchIcon,
  MessageSquare as ChatIcon,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import cn from "classnames";
import Navitem from "./navItem";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/** Section divider label — only shown when sidebar is open */
function SectionLabel({ label, isOpen }: { label: string; isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="px-3 pt-3 pb-1"
        >
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 select-none">
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fallbackName, setFallbackName] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMenuVisibility = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    setFallbackName(localStorage.getItem("name"));
  }, []);

  const adminInitials = (fallbackName || "Admin")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex top-0 overflow-hidden max-md:fixed max-md:right-0 bottom-0 md:fixed z-50">
      <motion.div
        animate={{ width: isOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "h-screen flex flex-col overflow-hidden",
          "bg-slate-900 border-r border-white/5 shadow-2xl",
          !isOpen && "max-md:bg-transparent",
        )}
      >
        {/* ── Brand Header ─────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Smartphone size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-white font-bold text-sm leading-none whitespace-nowrap">
                  Ricky Store
                </p>
                <p className="text-cyan-400 text-[10px] font-medium tracking-wide whitespace-nowrap">
                  Management System
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Toggle Button ─────────────────────────────── */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200 max-md:text-slate-800"
          >
            {isOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} className="max-md:text-slate-800" />
            )}
          </button>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 flex flex-col gap-0.5",
            !isOpen && "max-md:hidden",
          )}
        >
          {/* MAIN */}
          <SectionLabel label="Main" isOpen={isOpen} />
          <Navitem
            icon={<Dashboard size={18} />}
            label="Dashboard"
            isOpen={isOpen}
            linkTo="/home/features/dashboard"
          />

          {/* MANAGEMENT */}
          <SectionLabel label="Management" isOpen={isOpen} />
          <Navitem
            icon={<Customers size={18} />}
            label="Customers"
            isOpen={isOpen}
            linkTo="/home/features/customers"
          />
          <Navitem
            icon={<Products size={18} />}
            label="Products"
            isOpen={isOpen}
            linkTo="/home/features/product"
          />
          <Navitem
            icon={<Categories size={18} />}
            label="Categories"
            isOpen={isOpen}
            linkTo="/home/features/categories"
          />
          <Navitem
            icon={<Cities size={18} />}
            label="Cities"
            isOpen={isOpen}
            linkTo="/home/features/cities"
          />

          {/* OPERATIONS */}
          <SectionLabel label="Operations" isOpen={isOpen} />
          <Navitem
            icon={<InventoryIcon size={18} />}
            label="Inventory"
            isOpen={isOpen}
            linkTo="/home/features/inventory"
          />
          <Navitem
            icon={<DispatchIcon size={18} />}
            label="Dispatch"
            isOpen={isOpen}
            linkTo="/home/features/dispatch"
          />
          <Navitem
            icon={<Sales size={18} />}
            label="Sales"
            isOpen={isOpen}
            linkTo="/home/features/sales"
          />

          {/* COMMUNICATION */}
          <SectionLabel label="Communication" isOpen={isOpen} />
          <Navitem
            icon={<ChatIcon size={18} />}
            label="Support Chat"
            isOpen={isOpen}
            linkTo="/home/features/chat"
          />
          <Navitem
            icon={<Whatsapp size={18} />}
            label="WhatsApp"
            isOpen={isOpen}
            linkTo="/home/features/whatsapp"
          />
        </div>

        {/* ── Bottom Settings + Profile ─────────────────── */}
        <div
          className={cn(
            "border-t border-white/5 px-3 pt-3 pb-4 flex flex-col gap-0.5 shrink-0",
            !isOpen && "max-md:hidden",
          )}
        >
          <Navitem
            icon={<Settings size={18} />}
            label="Settings"
            isOpen={isOpen}
            linkTo="/home/settings"
          />

          {/* Admin profile strip */}
          <div
            className={cn(
              "mt-2 flex items-center gap-3 rounded-xl p-2.5 cursor-pointer",
              "hover:bg-white/5 transition-all duration-200",
            )}
            onClick={toggleMenuVisibility}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-cyan-400/30">
              <span className="text-white text-xs font-bold">
                {adminInitials}
              </span>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-white text-xs font-semibold truncate whitespace-nowrap">
                    {fallbackName || "Admin"}
                  </p>
                  <p className="text-slate-500 text-[10px] truncate whitespace-nowrap">
                    Store Manager
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {isOpen && (
              <ChevronRight size={14} className="text-slate-600 shrink-0" />
            )}
          </div>

          {/* Logout dropdown */}
          <AnimatePresence>
            {menuVisible && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mt-1"
              >
                <Navitem
                  icon={<LogOut size={18} />}
                  label="Logout"
                  isOpen={isOpen}
                  linkTo="/home/logout"
                  menu={toggleMenuVisibility}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
