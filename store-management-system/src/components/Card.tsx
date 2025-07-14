"use client";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  isDark?: boolean;
}

function Card({ children, isDark = false }: CardProps) {
  return (
    <div
      className={`
        w-[95%] h-auto mt-8 rounded-3xl border shadow-lg py-10 
        overflow-hidden flex items-center max-sm:flex-col max-sm:justify-center 
        sm:ms-7 max-sm:ms-4 
        ${isDark ? "bg-gray-900 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
