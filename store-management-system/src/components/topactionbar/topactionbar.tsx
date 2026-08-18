"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import Actionbuttons from "./actionbuttons";
import DarkModeToggle from "./darkModeToggle";
import { motion } from "framer-motion";

function Topactionbar({
  isDark = false,
}: {
  isDark?: boolean;
}): React.JSX.Element {
  const [unreadMessages, setUnreadmessages] = useState(12);
  const [unreadNotifications, setUnreadnotifications] = useState(30);
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);
  return (
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
        {/* Search bar */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className={`h-[90%] w-130 max-sm:w-[100%] rounded-full ${
            isDark
              ? "bg-slate-800/80 border border-white/10 focus-within:border-[#00cfff]/60 focus-within:shadow-[0_0_15px_rgba(0,207,255,0.2)]"
              : "bg-gray-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
          } flex items-center justify-center transition-all duration-200`}
        >
          <input
            className={`h-full w-[88%] outline-none px-4 rounded-full font-medium text-sm ${
              isDark
                ? "bg-transparent text-white placeholder-gray-400"
                : "bg-transparent text-gray-700 placeholder-gray-400"
            }`}
            id="search"
            name="search"
            autoComplete="off"
            placeholder="Search products, orders, customers..."
            type="text"
          />
          <Search
            size={18}
            className={`me-3 cursor-pointer ${
              isDark
                ? "text-gray-400 hover:text-[#00cfff]"
                : "text-gray-400 hover:text-blue-600"
            } transition-colors`}
          />
        </motion.div>
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
  );
}

export default Topactionbar;
