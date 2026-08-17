import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  className?: string;
  customMargin?: string;
}

function Input({
  id,
  placeholder,
  className = "",
  customMargin,
  ...props
}: InputProps) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      className={`
        w-full px-4 py-3 
        rounded-2xl
        ${customMargin ?? "mt-0"}
        text-sm text-white placeholder-gray-500
        bg-white/5 border border-white/10
        focus:outline-none focus:border-[#00cfff]/60 focus:bg-white/10
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;
