import React from "react";

interface BlurredPopupLayoutProps {
  isDark?: boolean;
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

function BlurredPopupLayout({
  isDark = false,
  width,
  height,
  children,
}: BlurredPopupLayoutProps) {
  return (
    <div className="fixed left-0 bottom-0 w-[101vw] h-[100vh] flex justify-center items-center backdrop-blur-sm z-10 overflow-y-scroll">
      <div
        className={`flex flex-col justify-evenly items-center gap-4 w-[40%] h-[20%] ${
          isDark ? "bg-gray-500 text-white" : "bg-white text-gray-700"
        } rounded-xl shadow-lg ${isDark && "shadow-white border border-white"} p-4`}
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  );
}

export default BlurredPopupLayout;
