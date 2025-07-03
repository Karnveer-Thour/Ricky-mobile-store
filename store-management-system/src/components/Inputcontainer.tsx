import React from "react";

interface InputContainerProps {
  type: string;
  children: React.ReactNode;
  error?: { message?: string };
  isDark?: boolean;
}

function Inputcontainer({
  type,
  children,
  error,
  isDark = false,
}: InputContainerProps) {
  return (
    <div className="mb-5 overflow-hidden">
      <label
        htmlFor={type}
        className={`block text-sm/6 text-[1rem] font-semibold ${isDark ? "text-white" : "text-gray-500"} ms-1`}
      >
        &nbsp;{type[0].toUpperCase() + type.slice(1)}
      </label>
      {children}
      <p className="block mt-1 ms-2 text-sm text-red-600 sm:text-base">
        {error?.message}
      </p>
    </div>
  );
}

export default Inputcontainer;
