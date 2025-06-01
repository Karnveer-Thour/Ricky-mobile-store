import React from "react";

function Formcontainer({ children, className }) {
  return (
    <div
      className={`w-full bg-transparent backdrop-blur-md scale-110 border-1 border-white rounded-lg shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default Formcontainer;
