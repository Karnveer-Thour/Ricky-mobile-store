import React from "react";

type ButtonProps = {
  name: string;
  handler?: React.MouseEventHandler<HTMLButtonElement>;
  value?: string | number | readonly string[];
  className?: string;
  [key: string]: any;
};

function Button({ name, handler, value, className, ...props }: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={handler || undefined}
      value={value}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-300 ${className}`}
      {...props}
    >
      {name}
    </button>
  );
}

export default Button;
