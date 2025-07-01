import React from "react";

interface countCardProps {
  title: string;
  count: number;
  isDark?: boolean;
}

function CountCard({ isDark, title, count }: countCardProps) {
  return (
    <div className="border-2 w-[22%] h-[90%] rounded-xl p-5 shadow-md">
      <p className="text-center font-semibold text-xl">{title}</p>
      <hr
        className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
      ></hr>
      <div className="flex justify-center items-center h-[70%]">
        <p className="text-center text-6xl font-semibold">{count}</p>
      </div>
    </div>
  );
}

export default CountCard;
