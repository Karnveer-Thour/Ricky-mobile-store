"use client";
import Actionbuttons from "@/components/topactionbar/actionbuttons";
import Topactionbar from "@/components/topactionbar/topactionbar";
import { storeType } from "@/types/store.index";
import React from "react";
import { useSelector } from "react-redux";

function layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  return (
    <>
      <div className="flex-1 min-h-screen pb-6 transition-all duration-300 bg-transparent">
        {/* Mobile action buttons */}
        <div className="h-[2%] w-20 flex items-center justify-evenly ms-5 gap-5 sm:hidden">
          <Actionbuttons
            unreadMessages={30}
            unreadNotifications={12}
            isDark={isDark}
          />
        </div>
        <Topactionbar isDark={isDark} />
        {/* Main content area */}
        <div
          className={`min-h-[calc(100vh-80px)] flex flex-col transition-all duration-300 ${
            isDark ? "bg-slate-950" : "bg-slate-50"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
