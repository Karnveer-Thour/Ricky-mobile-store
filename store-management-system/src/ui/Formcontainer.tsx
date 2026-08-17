import React from "react";

interface FormcontainerProps {
  children: React.ReactNode;
  className?: string;
}

function Formcontainer({ children, className = "" }: FormcontainerProps) {
  return (
    <div
      className={`w-full bg-[#0e0e1c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export default Formcontainer;
