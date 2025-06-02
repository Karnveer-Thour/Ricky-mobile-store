import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  className?: string;
}

function Input({ id, placeholder, className = "", ...props }: InputProps) {
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
