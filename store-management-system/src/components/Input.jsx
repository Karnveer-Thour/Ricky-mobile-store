import React from "react";

function Input({ id, placeholder, className = "", ...props }) {
  return (
    <input
      className={`mt-1 block w-full px-2 py-2 rounded-md border-2 focus:ring-blue-300 ${className}`}
      placeholder={placeholder}
      id={id}
      {...props}
    />
  );
}

export default Input;
