import React, { useState, useEffect } from "react";

interface toggleButtonProps {
  isDark?: boolean;
  activeLabel: string;
  inactiveLabel: string;
  handler: (active: boolean) => void;
  formProp?: any;
  defaultActive?: boolean;
  activeDefault?: boolean;
}

function ToggleButton({
  isDark = false,
  activeLabel,
  inactiveLabel,
  handler,
  formProp = {},
  defaultActive,
  activeDefault,
}: toggleButtonProps) {
  const initial = defaultActive ?? activeDefault ?? false;
  const [isActive, setIsActive] = useState(initial);

  useEffect(() => {
    setIsActive(defaultActive ?? activeDefault ?? false);
  }, [defaultActive, activeDefault]);

  const toggle = () => {
    const next = !isActive;
    setIsActive(next);
    handler(next);
  };

  return (
    <div className="flex items-center justify-center max-lg:hidden max-md:ms-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isActive}
          onChange={toggle}
          {...formProp}
        />
        <div
          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
            isActive
              ? "bg-cyan-500"
              : isDark
                ? "bg-gray-700 border-2 border-white/20"
                : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        ></div>
      </label>
      <span
        className={`ml-3 font-semibold text-xs ${
          isDark ? "text-slate-300" : "text-gray-700"
        }`}
      >
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}

export default ToggleButton;
