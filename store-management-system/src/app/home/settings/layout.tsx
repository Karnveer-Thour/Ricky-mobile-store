"use client";

import Navitem from "./components/navitem";
import { storeType } from "@/types/store.index";
import { Bolt } from "lucide-react";
import { useSelector } from "react-redux";
import React from "react";

function SettingsPage({ children }: { children: React.ReactNode }) {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);

  return (
    <div
      className={`flex flex-col min-h-screen w-full ${isDark ? "bg-zinc-950 text-white" : "bg-white text-slate-900"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4 sm:px-10 gap-4">
        <h1
          className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Settings
        </h1>
        <hr
          className={`mt-1 flex-1 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 mt-4 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-[240px] min-w-[200px] border-r px-4 py-6 transition-colors ${
            isDark
              ? "bg-slate-900/60 text-slate-200 border-slate-800"
              : "bg-slate-50 text-slate-800 border-slate-200"
          }`}
        >
          <nav className="flex flex-col gap-2">
            <Navitem
              icon={<Bolt size={18} />}
              label="General"
              isOpen={true}
              linkTo="/home/settings"
              isDark={isDark}
            />
            <Navitem
              icon={<Bolt size={18} />}
              label="Security"
              isOpen={true}
              linkTo="/home/settings/secuirity"
              isDark={isDark}
            />
            <Navitem
              icon={<Bolt size={18} />}
              label="Banking"
              isOpen={true}
              linkTo="/home/settings/banking"
              isDark={isDark}
            />
          </nav>
        </aside>

        {/* Children Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default SettingsPage;
