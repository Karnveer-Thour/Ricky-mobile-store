"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";
import cn from "classnames";
import Navitem from "./navItem";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { SUCCESSALERT } from "@/store/slices/alert.slice";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";

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
          transition={{ duration: 0.15 }}
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
  const [adminName, setAdminName] = useState<string>("Ricky Thour");
  const [adminEmail, setAdminEmail] = useState<string>("ricky@rickymobile.com");
  const [adminRole, setAdminRole] = useState<string>("Super Admin");
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Sync profile details dynamically
  const loadAdminProfile = () => {
    if (typeof window !== "undefined") {
      try {
        const storedProfile = localStorage.getItem("ricky_admin_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.first_name || parsed.last_name) {
            setAdminName(`${parsed.first_name || ""} ${parsed.last_name || ""}`.trim());
          }
          if (parsed.email) setAdminEmail(parsed.email);
          if (parsed.role) setAdminRole(parsed.role);
          if (parsed.imageURL) setAdminAvatar(parsed.imageURL);
        } else {
          const legacyName = localStorage.getItem("name");
          if (legacyName) setAdminName(legacyName);
        }
      } catch {}
    }
  };

  useEffect(() => {
    loadAdminProfile();
    const handleStorageChange = () => loadAdminProfile();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Proactively prefetch all routes for instant 0ms navigation
  useEffect(() => {
    const routes = [
      "/home/features/dashboard",
      "/home/features/customers",
      "/home/features/product",
      "/home/features/categories",
      "/home/features/cities",
      "/home/features/inventory",
      "/home/features/dispatch",
      "/home/features/sales",
      "/home/features/chat",
      "/home/features/whatsapp",
      "/home/profile",
      "/home/settings",
    ];
    routes.forEach((r) => {
      try {
        router.prefetch(r);
      } catch {}
    });
  }, [router]);

  // Close dropup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuVisible(false);
    openGlobalConfirm(dispatch, {
      title: "Sign Out of Ricky Mobile Store?",
      message:
        "Are you sure you want to end your current administrative session?",
      confirmText: "Yes, Sign Out",
      cancelText: "Stay Logged In",
      variant: "danger",
      onConfirm: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("auth");
        }
        dispatch(SUCCESSALERT("Logged out successfully. See you soon!"));
        router.push("/auth/login");
      },
    });
  };

  const adminInitials =
    adminName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "RA";

  return (
    <div className="flex top-0 max-md:fixed max-md:right-0 bottom-0 md:fixed z-50">
      <motion.div
        animate={{ width: isOpen ? 256 : 72 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "h-screen flex flex-col will-change-[width]",
          "bg-slate-900 border-r border-white/5 shadow-2xl relative",
          !isOpen && "max-md:bg-transparent",
        )}
      >
        {/* ── Executive Brand Header with Integrated Collapse ────────────── */}
        <div className="flex items-center justify-between px-3.5 py-4 border-b border-white/5 shrink-0 h-18">
          <div
            onClick={!isOpen ? toggleSidebar : undefined}
            className={cn(
              "flex items-center gap-3 cursor-pointer select-none",
              !isOpen && "w-full justify-center",
            )}
            title={!isOpen ? "Expand Sidebar" : undefined}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 hover:scale-105 transition-transform">
              <Smartphone size={18} className="text-slate-950 stroke-[2.5]" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden min-w-0"
                >
                  <p className="text-white font-extrabold text-sm leading-none whitespace-nowrap">
                    Ricky Store
                  </p>
                  <p className="text-cyan-400 text-[10px] font-bold tracking-wide whitespace-nowrap mt-1">
                    Management Hub
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sleek inline collapse toggle button when expanded */}
          <AnimatePresence>
            {isOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose size={17} />
              </motion.button>
            )}
          </AnimatePresence>
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

        {/* ── Bottom Admin Profile Strip with Drop-up Popover ── */}
        <div
          ref={profileMenuRef}
          className={cn(
            "border-t border-white/5 px-3 pt-3 pb-4 flex flex-col gap-1 shrink-0 relative",
            !isOpen && "max-md:hidden",
          )}
        >
          {/* Drop-up Menu Popover */}
          <AnimatePresence>
            {menuVisible && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: isOpen ? 10 : 0,
                  x: isOpen ? 0 : -10,
                }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: isOpen ? 8 : 0,
                  x: isOpen ? 0 : -8,
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn(
                  "rounded-2xl overflow-hidden shadow-2xl border bg-slate-900/98 backdrop-blur-2xl border-slate-700/80 shadow-cyan-950/50 p-2 flex flex-col gap-1 z-50",
                  isOpen
                    ? "absolute bottom-full left-3 right-3 mb-2"
                    : "absolute left-full bottom-2 ml-3 w-64 shadow-2xl shadow-black/90",
                )}
              >
                {/* User Summary Header */}
                <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2.5">
                  {adminAvatar ? (
                    <img
                      src={adminAvatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-cyan-400/40 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {adminInitials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-extrabold truncate">
                      {adminName}
                    </p>
                    <p className="text-slate-400 text-[10px] truncate">
                      {adminEmail}
                    </p>
                  </div>
                </div>

                {/* Option 1: Profile */}
                <button
                  onClick={() => {
                    setMenuVisible(false);
                    router.push("/home/profile");
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Profile size={15} className="text-cyan-400 shrink-0" />
                  <span>My Profile</span>
                </button>

                {/* Option 2: Settings */}
                <button
                  onClick={() => {
                    setMenuVisible(false);
                    router.push("/home/settings");
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings size={15} className="text-blue-400 shrink-0" />
                  <span>Account Settings</span>
                </button>

                <div className="border-t border-white/10 my-0.5" />

                {/* Option 3: Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut size={15} className="text-rose-400 shrink-0" />
                  <span>Sign Out / Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Strip Clicker */}
          <div
            onClick={() => setMenuVisible(!menuVisible)}
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 cursor-pointer transition-all duration-150 group select-none",
              !isOpen && "justify-center",
              menuVisible || pathname === "/home/profile"
                ? "bg-cyan-500/15 border border-cyan-500/30"
                : "hover:bg-white/5",
            )}
            title="Click for Profile & Logout options"
          >
            {adminAvatar ? (
              <img
                src={adminAvatar}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-cyan-400/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-cyan-400/30">
                <span className="text-white text-xs font-extrabold">
                  {adminInitials}
                </span>
              </div>
            )}

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-white text-xs font-bold truncate whitespace-nowrap group-hover:text-cyan-400 transition-colors">
                    {adminName}
                  </p>
                  <p className="text-slate-400 text-[10px] truncate whitespace-nowrap flex items-center gap-1">
                    <ShieldCheck size={10} className="text-cyan-400" />
                    {adminRole}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {isOpen && (
              <div className="text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0">
                {menuVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
