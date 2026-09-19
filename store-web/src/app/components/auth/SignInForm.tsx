import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { signInSchema, type SignInFormValues } from "../../utils/validation.schemas";
import FieldError from "../ui/FieldError";

interface SignInFormProps {
  isLoading: boolean;
  onSubmit: (email: string, password: string) => void;
}

export default function SignInForm({ isLoading, onSubmit }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema),
    mode: "onTouched",
  });

  const submit = (data: SignInFormValues) => {
    onSubmit(data.email, data.password);
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/4 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
      hasError
        ? "border-red-500/60 focus:border-red-500/80"
        : "border-white/8 focus:border-[#00cfff]/50"
    }`;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3.5" noValidate>
      {/* Email */}
      <div>
        <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={14}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-400" : "text-gray-500"}`}
          />
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...register("email")}
            className={inputClass(!!errors.email)}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">
            Password
          </label>
          <span className="text-[10px] text-[#00cfff] hover:underline cursor-pointer">
            Forgot?
          </span>
        </div>
        <div className="relative">
          <Lock
            size={14}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password ? "text-red-400" : "text-gray-500"}`}
          />
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className={`${inputClass(!!errors.password)} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <button
        id="signin-submit"
        type="submit"
        disabled={isLoading}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="w-full py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl hover:bg-[#00cfff]/90 transition-all tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00cfff]/20 disabled:opacity-50 mt-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "SIGN IN"}
      </button>
    </form>
  );
}
