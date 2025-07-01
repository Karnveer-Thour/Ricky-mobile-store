"use client";

import Navitem from "@/components/navbar/navItem";
import { storeType } from "@/types/store.index";
import { Bolt } from "lucide-react";
import { useSelector } from "react-redux";
import React from "react";

function SettingsPage({ children }: { children: React.ReactNode }) {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);

  return (
    <div className={`flex flex-col min-h-screen w-full ${isDark ? "bg-zinc-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
        <h1
          className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
        >Settings</h1>
        <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
        ></hr>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 mt-4 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-[250px] min-w-[200px] border-r px-4 py-6 
          ${isDark?"bg-gray-50 text-gray-800 border-gray-700":"bg-zinc-800 text-white border-gray-200"}
          `}>
          <nav className="flex flex-col gap-2">
            <Navitem
              icon={<Bolt size={20} />}
              label="General"
              isOpen={true}
              linkTo="/home/settings"
            />
            <Navitem
              icon={<Bolt size={20} />}
              label="Security"
              isOpen={true}
              linkTo="/home/settings/secuirity"
            />
            <Navitem
              icon={<Bolt size={20} />}
              label="Banking"
              isOpen={true}
              linkTo="/home/settings/banking"
            />
          </nav>
        </aside>

        {/* Children Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;
