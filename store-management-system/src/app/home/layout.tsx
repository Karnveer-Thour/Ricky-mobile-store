"use client";
import Navbar from "@/components/navbar/navbar";
import { storeType } from "@/types/store.index";
import classNames from "classnames";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  return (
    <div className={`flex`}>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={classNames(
          "flex-1 h-auto overflow-y-auto p-5 transition-all duration-300",
          isOpen ? "md:ml-64" : "md:ml-20",
          isDark ? "bg-gray-500" : "bg-gray-100",
        )}
      >
        {children}
      </div>
      <div className="fixed bottom-0 left-0 w-full h-7 dark:bg-gray-800 transition-colors duration-300 flex items-center justify-center">
        <p className="text-center dark:text-gray-300 text-sm">
          © Copyrights Karanveer Thour 2025. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default layout;
