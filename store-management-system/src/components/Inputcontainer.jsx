import React from "react";

function Inputcontainer({ type,children,error }) {
  
  return (
    <div className="mb-5 w-[90%]">
      <label htmlFor={type} className="block text-sm/6 text-[1rem] font-semibold text-white ms-1">
        &nbsp;{type[0].toUpperCase()+type.slice(1)}
      </label>
     {children}
    <p className="block mt-1 ms-2 text-sm text-red-600 sm:text-base">
      {error?.message}
    </p>
    </div>
  );
}

export default Inputcontainer;
