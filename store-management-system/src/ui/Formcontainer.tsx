import React from "react";

interface FormcontainerProps {
  children: React.ReactNode;
  className?: string;
}

function Formcontainer({ children, className }: FormcontainerProps) {
  return (
    <div
      className={`w-full bg-transparent backdrop-blur-md scale-110 border-1 border-white rounded-lg shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default Formcontainer;
