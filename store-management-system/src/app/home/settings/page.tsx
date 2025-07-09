"use client";

import Button from "@/components/Button";
import Select from "@/components/select";
import { storeType } from "@/types/store.index";
import { Trash, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import Detail from "./components/detail";

function Page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);

  return (
    <div className="w-full px-4 sm:px-10 py-8 space-y-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
          General Settings
        </h1>
        <hr className="flex-1 border-t border-gray-300" />
      </div>

      {/* Profile Section */}
      <section className="flex flex-col sm:flex-row items-center justify-between border-b pb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src="https://plus.unsplash.com/premium_photo-1747054587747-bd631e58c312?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex gap-3 mt-4 sm:mt-0 sm:me-9">
          <Button
            isDark={isDark}
            name={<Trash size={18} />}
            className="w-10 h-10"
          />
          <Button
            isDark={isDark}
            name={
              <span className="flex items-center gap-2 text-sm font-medium">
                <Upload size={18} /> Upload
              </span>
            }
            className="h-10 px-4"
          />
        </div>
      </section>

      {/* Details */}
      <section className="space-y-6">
        <Detail
          title="Name"
          details={[{ id: 1, value: "John Doe" }]}
        />
        <Detail
          title="Contacts"
          details={[
            { id: 1, title: "Email", value: "Thour77@gmail.com" },
            { id: 2, title: "Phone", value: "8156789654" },
          ]}
        />
      </section>


      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="font-medium text-base text-gray-700 dark:text-gray-200">
            Theme:
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {isDark ? "Dark Mode" : "Light Mode"}
          </span>
        </div>

        <Select className="w-44" isDark={isDark}>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </Select>
      </section>
    </div>
  );
}

export default Page;