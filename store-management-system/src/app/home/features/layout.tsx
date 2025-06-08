"use client";
import Actionbuttons from "@/components/topactionbar/actionbuttons";
import Topactionbar from "@/components/topactionbar/topactionbar";
import React from "react";

function layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      <div className="flex-1 h-[95vh] bg-gray-100 transition-all duration-300">
        <div className="h-[2%] w-20 flex items-center justify-evenly ms-5 gap-5 sm:hidden ">
          <Actionbuttons unreadMessages={30} unreadNotifications={12} />
        </div>
        <Topactionbar />
        <div className="overflow-y-auto flex flex-col justify-center bg-gray-100 transition-all duration-300">
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
