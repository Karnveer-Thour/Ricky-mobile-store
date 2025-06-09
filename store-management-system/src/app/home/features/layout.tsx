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
      <div
        className={`flex-1 h-[95vh] ${isDark ? "bg-gray-500" : "bg-gray-100"} transition-all duration-300`}
      >
        <div className="h-[2%] w-20 flex items-center justify-evenly ms-5 gap-5 sm:hidden ">
          <Actionbuttons unreadMessages={30} unreadNotifications={12} isDark={isDark} />
        </div>
        <Topactionbar isDark={isDark} />
        <div
          className={`overflow-y-auto flex flex-col justify-center ${isDark ? "bg-gray-500" : "bg-gray-100"} transition-all duration-300`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
