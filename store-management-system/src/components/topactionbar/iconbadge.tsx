"use client";
import { storeType } from "@/types/store.index";
import React from "react";
import { useSelector } from "react-redux";

interface IconbadgeProps {
  children: React.ReactNode;
  unreadcount?: number;
  isDark: boolean;
}

function Iconbadge({
  children,
  unreadcount,
  isDark,
}: IconbadgeProps): React.JSX.Element {
  return (
    <div
      className={`sm:outline w-15 h-[80%] rounded-xl flex items-center justify-center ${
        isDark ? "bg-gray-500" : "bg-gray-100"
      } cursor-pointer hover:bg-gray-300`}
    >
      <div className="relative">
        {/* Message Icon */}
        {children}
        {/* Notification Badge */}
        {unreadcount && (
          <div className="absolute -top-1 -right-2 bg-blue-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadcount}
          </div>
        )}
      </div>
    </div>
  );
}

export default Iconbadge;
