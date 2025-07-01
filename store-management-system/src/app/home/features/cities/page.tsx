"use client";

import Button from "@/components/Button";
import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";
import CategoryTable from "./components/citiesTable";
import { usePathname, useRouter } from "next/navigation";
import CityTable from "./components/citiesTable";

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const pathName = usePathname();
  const router = useRouter();
  return (
    <>
      <div className=" w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p
          className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
        >
          Cities
        </p>
        <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
        ></hr>
      </div>
      <div className="w-[95%] h-[50vh] mt-8 ms-6 flex flex-col items-center justify-center">
        <div className=" w-full flex flex-row justify-between items-center">
          <div className="flex-1 overflow-hidden sm:ms-7 max-sm:ms-4 h-auto p-3 flex justify-center items-center">
            <Button
              name={"Add City"}
              handler={() => router.push(`${pathName}/add`)}
            />
          </div>
        </div>
        <div className="w-full h-[80%] ms-7 overflow-hidden flex justify-center items-center">
          <CityTable isDark={isDark} />
        </div>
      </div>
    </>
  );
}

export default page;
