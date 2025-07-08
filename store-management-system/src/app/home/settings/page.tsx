"use client";

import Button from "@/components/Button";
import { storeType } from "@/types/store.index";
import { Delete, Trash, Upload } from "lucide-react";
import { useSelector } from "react-redux";

function Page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  return (
    <div className="flex flex-col h-[81vh] w-full overflow-hidden">
      <div className=" w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p
          className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
        >
          General
        </p>
        <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
        ></hr>
      </div>
      <div className="w-[93%] flex-1 overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 flex max-sm:flex-col max-sm:justify-between items-center gap-4">
         <div className="flex-1 h-[30%] overflow-hidden flex justify-between items-center border-b-2 pb-4">
          <div className="w-[15%] h-[90%] ms-9 rounded-full flex justify-center items-center">
            <img
              src="https://plus.unsplash.com/premium_photo-1747054587747-bd631e58c312?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="h-[30%] w-[20%] flex justify-evenly me-9">
            <div className="h-full w-[30%] flex justify-center items-center">
              <Button
                isDark={isDark}
                name={<Trash size={20} />}
                className="w-full h-10"
              />
            </div>
            <div className="h-full w-[60%] flex justify-center items-center">
              <Button
                isDark={isDark}
                name={
                  <div className="flex justify-center gap-3 items-center overflow-hidden">
                    <Upload size={20} /> Upload
                  </div>
                }
                className="w-full h-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
