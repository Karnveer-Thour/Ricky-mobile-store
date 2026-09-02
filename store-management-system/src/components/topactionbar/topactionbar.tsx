"use client";
import React, { useState, useEffect } from "react";
import { Search, Command } from "lucide-react";
import Actionbuttons from "./actionbuttons";
import DarkModeToggle from "./darkModeToggle";
import { motion } from "framer-motion";
import GlobalSearchModal from "./globalSearchModal";

function Topactionbar({
  isDark = false,
}: {
  isDark?: boolean;
}): React.JSX.Element {
  const [unreadMessages, setUnreadmessages] = useState(3);
  const [unreadNotifications, setUnreadnotifications] = useState(4);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-[95%] rounded-2xl h-16 flex items-center justify-between max-sm:mt-5 max-md:mt-10 ms-7 max-sm:ms-4 ${
          isDark
            ? "bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,207,255,0.08)]"
            : "bg-white/80 backdrop-blur-xl border border-gray-200 shadow-md"
        } transition-all p-2`}
      >
        {/* Left Section: Search bar and date */}
        <div className="h-full w-[70%] md:w-[50%] max-sm:w-[100%] flex items-center sm:ms-4">
          {/* Search bar trigger */}
          <div
            onClick={() => setSearchModalOpen(true)}
            className={`h-[90%] w-130 max-sm:w-[100%] rounded-full cursor-pointer ${
              isDark
                ? "bg-slate-800/80 border border-white/10 hover:border-[#00cfff]/60 hover:shadow-[0_0_15px_rgba(0,207,255,0.2)]"
                : "bg-gray-100 hover:border-blue-400 hover:ring-2 hover:ring-blue-100"
            } flex items-center justify-between px-4 transition-all duration-200 group`}
          >
            <div className="flex items-center gap-3">
              <Search
                size={18}
                className={`transition-colors ${
                  isDark
                    ? "text-gray-400 group-hover:text-[#00cfff]"
                    : "text-gray-400 group-hover:text-blue-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Search products, orders, customers...
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/60">
              <Command size={10} /> K
            </div>
          </div>

          {/* Date */}
          <div className="w-50 ms-4 h-full px-3 flex items-center justify-center max-lg:hidden overflow-hidden">
            <h3
              className={`font-semibold text-xs tracking-wide uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {formattedDate}
            </h3>
          </div>
        </div>

        <div>
          <DarkModeToggle />
        </div>

        {/* Right Section: Action icons (messages and notifications) */}
        <div className="h-full w-50 flex items-center justify-evenly me-4 max-sm:hidden max-md:gap-2 sm:ms-3">
          <Actionbuttons
            unreadMessages={unreadMessages}
            unreadNotifications={unreadNotifications}
            isDark={isDark}
          />
        </div>
      </motion.div>

      {/* Global Command Palette Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        isDark={isDark}
      />
    </>
  );
}

export default Topactionbar;
