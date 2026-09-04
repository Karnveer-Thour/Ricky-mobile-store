"use client";

import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";
import Changepassword from "../components/changepassword";
import { changePasswordValidator } from "../utils/changePasswordValidator";

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  return (
    <div
      className={`w-full sm:px-8 space-y-8 overflow-hidden ${isDark ? "bg-transparent text-white" : "bg-transparent text-slate-900"}`}
    >
      <div className={`flex items-center gap-4 border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <h1
          className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Security & Authentication
        </h1>
        <hr
          className={`flex-1 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}
        />
      </div>
      <Changepassword isDark={isDark} validator={changePasswordValidator} />
    </div>
  );
}

export default page;
