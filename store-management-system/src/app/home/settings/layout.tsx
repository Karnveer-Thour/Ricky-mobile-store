"use client";

import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";

function page({children}:{children:React.ReactNode}) {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  return (
    <>
      {children}
    </>
  );
}

export default page;
