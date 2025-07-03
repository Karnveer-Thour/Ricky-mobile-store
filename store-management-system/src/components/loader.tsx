import React from "react";

interface LoaderProps {
  size?: number;
  color?: string;
  lineSize?: number;
  label?: string;
  fullscreen?: boolean;
  overlay?: boolean;
  isDark?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 80,
  color = "#2563eb",
  lineSize = 6,
  label = "",
  fullscreen = false,
  overlay = false,
  isDark = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center z-50 ${
        fullscreen ? "fixed inset-0" : ""
      } ${overlay ? (isDark ? "bg-black/60" : "bg-white/60") : ""} ${className}`}
    >
      <div
        className="animate-spin rounded-full border-t-transparent"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${lineSize}px`,
          borderStyle: "solid",
          borderColor: color,
          borderTopColor: "transparent",
        }}
      />
      {label && (
        <span className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;
