import React from "react";

type ButtonProps = {
  name: string | any;
  handler?: React.MouseEventHandler<HTMLButtonElement>;
  value?: string | number | readonly string[];
  className?: string;
  [key: string]: any;
};

function Button({ name, handler, value, className = "", ...props }: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={handler || undefined}
      value={value}
      className={`w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold tracking-wider uppercase text-[#07070f] bg-[#00cfff] hover:bg-[#00cfff]/90 active:scale-[0.98] shadow-lg shadow-[#00cfff]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {name}
    </button>
  );
}

export default Button;
