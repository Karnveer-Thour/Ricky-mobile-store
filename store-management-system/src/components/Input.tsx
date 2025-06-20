import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  className?: string;
  customMargin?:string;
}

function Input({ id, placeholder, className = "",customMargin, ...props }: InputProps) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      className={`
        w-full px-3 py-2 
        rounded-md  
        ${customMargin??"mt-1.5"}
        text-gray-600
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
