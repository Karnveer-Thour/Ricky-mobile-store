import React from "react";

function Button({ name, handler, value, className, ...props }) {
  return (
    <button
      type="submit"
      onClick={handler || undefined}
      value={value}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 ${className}`}
      {...props}
    >
      {name}
    </button>
  );
}

export default Button;
