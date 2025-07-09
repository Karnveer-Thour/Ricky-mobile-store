"use client";

import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";
import Changepassword from "../components/changepassword";
import { changePasswordValidator } from "../utils/changePasswordValidator";

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  return (
    <div className={`w-full px-4 sm:px-10 py-8 space-y-8 overflow-hidden ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <div className=" w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p
          className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
        >
          Secuirity and authentication
        </p>
        <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
        ></hr>
      </div>
        <Changepassword isDark={isDark} validator={changePasswordValidator}/>
    </div>
  );
}

export default page;
