"use client";
import React from "react";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[95%] overflow-hidden sm:ms-7 max-sm:ms-4 h-auto rounded-3xl mt-8 border bg-white shadow-lg flex max-sm:flex-col max-sm:justify-center items-center py-10">
      {children}
    </div>
  );
}

export default Card;
