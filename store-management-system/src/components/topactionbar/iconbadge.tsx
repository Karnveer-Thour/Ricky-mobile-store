"use client";
import React from "react";

interface IconbadgeProps {
  children: React.ReactNode;
  unreadcount?: number;
}

function Iconbadge({ children, unreadcount }: IconbadgeProps) {
  return (
    <div className="sm:outline w-15 h-[80%] rounded-xl flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-300">
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
