"use client";

import React, { useState, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import cn from "classnames";
import { storeType } from "@/types/store.index";
import Navitem from "./navItem";
import { NAV_SECTIONS } from "./navConfig";
import { useClickOutside } from "./hooks/useClickOutside";
import { useAdminProfile } from "./hooks/useAdminProfile";
import SectionLabel from "./components/SectionLabel";
import NavbarBrandHeader from "./components/NavbarBrandHeader";
import ProfilePopover from "./components/ProfilePopover";
import ProfileStrip from "./components/ProfileStrip";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const isDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const [menuVisible, setMenuVisible] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileMenuRef, () => setMenuVisible(false), menuVisible);
  const {
    adminName,
    adminEmail,
    adminRole,
    adminAvatar,
    adminInitials,
    handleLogout,
  } = useAdminProfile();

  return (
    <div className="flex top-0 max-md:fixed max-md:right-0 bottom-0 md:fixed z-50">
      <motion.div
        animate={{ width: isOpen ? 256 : 72 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "h-screen flex flex-col will-change-[width] transition-colors duration-200 shadow-2xl relative",
          isDark
            ? "bg-slate-900 border-r border-white/5 text-slate-100"
            : "bg-white/95 backdrop-blur-xl border-r border-slate-200/90 shadow-slate-200/50 text-slate-800",
          !isOpen && "max-md:bg-transparent",
        )}
      >
        <NavbarBrandHeader
          isOpen={isOpen}
          toggleSidebar={() => setIsOpen(!isOpen)}
          isDark={isDark}
        />

        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 flex flex-col gap-0.5",
            !isOpen && "max-md:hidden",
          )}
        >
          {NAV_SECTIONS.map((section) => (
            <Fragment key={section.id}>
              <SectionLabel
                label={section.label}
                isOpen={isOpen}
                isDark={isDark}
              />
              {section.items.map((item) => (
                <Navitem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isOpen={isOpen}
                  isDark={isDark}
                  linkTo={item.linkTo}
                />
              ))}
            </Fragment>
          ))}
        </div>

        <div
          ref={profileMenuRef}
          className={cn(
            "px-3 pt-3 pb-4 flex flex-col gap-1 shrink-0 relative border-t transition-colors",
            isDark ? "border-white/5" : "border-slate-100",
            !isOpen && "max-md:hidden",
          )}
        >
          <AnimatePresence>
            {menuVisible && (
              <ProfilePopover
                isOpen={isOpen}
                isDark={isDark}
                adminName={adminName}
                adminEmail={adminEmail}
                adminAvatar={adminAvatar}
                adminInitials={adminInitials}
                onClose={() => setMenuVisible(false)}
                onLogout={() => handleLogout(() => setMenuVisible(false))}
              />
            )}
          </AnimatePresence>
          <ProfileStrip
            isOpen={isOpen}
            isDark={isDark}
            menuVisible={menuVisible}
            adminName={adminName}
            adminRole={adminRole}
            adminAvatar={adminAvatar}
            adminInitials={adminInitials}
            onClick={() => setMenuVisible(!menuVisible)}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
