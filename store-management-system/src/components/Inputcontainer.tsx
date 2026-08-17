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
}: InputContainerProps) {
  const labelText = type[0].toUpperCase() + type.slice(1);
  return (
    <div className="mb-5 w-full">
      <label
        htmlFor={type}
        className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2"
      >
        {labelText}
      </label>
      {children}
      {error?.message && (
        <p className="mt-1.5 text-xs text-rose-400 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Inputcontainer;
