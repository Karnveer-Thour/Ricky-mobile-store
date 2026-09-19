import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from "../../utils/validation.schemas";
import FieldError from "../ui/FieldError";

interface CreateAccountFormProps {
  isLoading: boolean;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
  }) => void;
}

export default function CreateAccountForm({
  isLoading,
  onSubmit,
}: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({
    resolver: yupResolver(createAccountSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password", "");

  const submit = (data: CreateAccountFormValues) => {
    onSubmit({
      firstName: data.firstName,
      lastName: data.lastName || "",
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: data.password,
    });
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/4 border rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
      hasError
        ? "border-red-500/60 focus:border-red-500/80"
        : "border-white/8 focus:border-[#00cfff]/50"
    }`;

  const inputClassWithIcon = (hasError: boolean) =>
    `${inputClass(hasError)} pl-9`;

  // Password strength meter
  const getStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[@$!%*?&]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(passwordValue);
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#00cfff"];
  const strengthLabels = ["", "Too weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3" noValidate>
      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            First Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User
              size={14}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.firstName ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              id="register-firstname"
              type="text"
              autoComplete="given-name"
              placeholder="Ricky"
              {...register("firstName")}
              className={inputClassWithIcon(!!errors.firstName)}
            />
          </div>
          <FieldError message={errors.firstName?.message} />
        </div>

        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            Last Name
          </label>
          <input
            id="register-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Sharma"
            {...register("lastName")}
            className={inputClass(!!errors.lastName)}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
          Phone Number (WhatsApp) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Phone
            size={14}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.mobileNumber ? "text-red-400" : "text-gray-500"}`}
          />
          <input
            id="register-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            {...register("mobileNumber")}
            className={inputClassWithIcon(!!errors.mobileNumber)}
          />
        </div>
        <FieldError message={errors.mobileNumber?.message} />
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
          Email Address <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Mail
            size={14}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-400" : "text-gray-500"}`}
          />
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...register("email")}
            className={inputClassWithIcon(!!errors.email)}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      {/* Password + Confirm */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock
              size={14}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••"
              {...register("password")}
              className={`${inputClassWithIcon(!!errors.password)} pr-8`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
            Confirm <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              id="register-confirm-password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••"
              {...register("confirmPassword")}
              className={`${inputClass(!!errors.confirmPassword)} pr-8`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showConfirm ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </div>
      </div>

      {/* Password strength bar */}
      {passwordValue.length > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= strength ? strengthColors[strength] : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
          <p
            className="text-[10px] font-medium"
            style={{ color: strengthColors[strength] || "#6b7280" }}
          >
            {strengthLabels[strength]}
          </p>
        </div>
      )}

      <button
        id="register-submit"
        type="submit"
        disabled={isLoading}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="w-full py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl hover:bg-[#00cfff]/90 transition-all tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00cfff]/20 disabled:opacity-50 mt-3"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "CREATE ACCOUNT"
        )}
      </button>
    </form>
  );
}
