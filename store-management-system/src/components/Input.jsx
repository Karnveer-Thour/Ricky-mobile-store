import React from "react";

function Input({ id, placeholder, className = "", ...props }) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      className={`
        w-full px-3 py-2 
        rounded-md  
        text-white 
        appearance-none 
        shadow-none 
        transition 
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;