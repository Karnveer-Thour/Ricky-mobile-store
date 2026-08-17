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
    <div
      className={classNames(
        "flex min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950" : "bg-slate-50",
      )}
    >
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={classNames(
          "flex-1 min-h-screen overflow-y-auto transition-all duration-300",
          isOpen ? "md:ml-64" : "md:ml-[72px]",
        )}
      >
        {children}
      </div>
      {/* Footer strip */}
      <div
        className={classNames(
          "fixed bottom-0 left-0 w-full h-6 z-40 flex items-center justify-center border-t transition-colors duration-300",
          isDark
            ? "bg-slate-900 border-white/5 text-slate-500"
            : "bg-white border-slate-200 text-slate-400",
        )}
      >
        <p className="text-xs">
          © 2025 Ricky Mobile Store · All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default layout;
