import React, { ReactElement, useState } from "react";
import Input from "./Input";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";

const PasswordInput = ({
  children,
  className,
  isDark = false,
}: {
  children: (argument: { passwordVisible: boolean }) => React.ReactNode;
  className?: string;
  isDark?: boolean;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <div className="relative mt-1 w-full">
      <div
        className={`flex items-center w-full rounded-md border-2 ${isDark ? "border-white" : "border-gray-500"} focus-within:ring-2 focus-within:ring-blue-300 transition ${className}`}
      >
        {children({ passwordVisible })}
        <button
          type="button"
          onClick={() => setPasswordVisible(!passwordVisible)}
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          className={`p-2 ${isDark ? "border-white" : "text-gray-600"} hover:text-blue-500 focus:outline-none rounded-md`}
        >
          {!passwordVisible ? <Eye /> : <EyeClosed />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
