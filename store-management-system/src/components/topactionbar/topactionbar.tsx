"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import Actionbuttons from "./actionbuttons";
import DarkModeToggle from "./darkModeToggle";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

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
    <div className="w-[95%] rounded-2xl h-15 flex items-center justify-between max-sm:mt-5 max-md:mt-10 ms-7 max-sm:ms-4 sm:bg-gray-700 transform-view transition-all p-1">
      {/* Left Section: Search bar and date */}
      <div className="h-[80%] w-[70%] md:w-[50%] max-sm:w-[100%] flex items-center sm:ms-8">
        {/* Search bar */}
        <div
          className={`h-[100%] w-130 max-sm:w-[100%] rounded-full ${isDark ? "bg-gray-700 border-2 border-white" : "bg-gray-100"} flex items-center justify-center`}
        >
          <input
            className={`h-full w-[88%] outline-none p-3 rounded-full max-sm:text-white font-bold text-md ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600"} `}
            id="search"
            name="search"
            autoComplete="off"
            autoFocus
            placeholder="Search"
            type="text"
          />
          <Search
            className={`flex-1 cursor-pointer ${isDark ? "text-white" : "text-gray-500"} max-sm:text-white hover:text-blue-700 `}
          />
        </div>
        {/* Date */}
        <div className="w-50 ms-4 h-[100%] px-3 flex items-center justify-center max-lg:hidden overflow-hidden">
          <h3 className="font-semibold cursor-default text-white text-center">
            {formattedDate}
          </h3>
        </div>
      </div>

      <div>
        <DarkModeToggle />
      </div>

      {/* Right Section: Action icons (messages and notifications) */}
      <div className="h-[100%] w-50 flex items-center justify-evenly me-8 max-sm:hidden max-md:gap-2 sm:ms-3">
        <Actionbuttons
          unreadMessages={unreadMessages}
          unreadNotifications={unreadNotifications}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

export default Topactionbar;
