"use client";
import { toggleDarkMode } from "@/store/slices/isDarkMode.slice";
import { storeType } from "@/types/store.index";
import { useDispatch, useSelector } from "react-redux";

function DarkModeToggle() {
  const isDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center max-lg:hidden max-md:ms-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isDark}
          onChange={() => dispatch(toggleDarkMode())}
        />
        <div
          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          } ${isDark ? "border-2 border-white p-3" : ""}`}
        ></div>
        <div
          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        ></div>
      </label>
      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}

export default DarkModeToggle;
