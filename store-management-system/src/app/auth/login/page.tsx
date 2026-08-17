"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Smartphone, ShieldCheck, Mail, Lock } from "lucide-react";
import Inputcontainer from "@/components/Inputcontainer";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Loginvalidationschema } from "@/library/yup/login.yup";
import { SUCCESSALERT } from "@/store/slices/alert.slice";
import Formcontainer from "@/ui/Formcontainer";
import Maincontainer from "@/ui/Maincontainer";
import PasswordInput from "@/components/passwordInput";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Loginvalidationschema),
  });

  const submitForm = () => {
    try {
      dispatch(SUCCESSALERT("Login Successfully"));
      router.push("/home/features/dashboard");
    } catch (error) {
      throw new Error(String(error));
    }
  };

  return (
    <Maincontainer>
      <Formcontainer className="max-w-md p-8 sm:p-10 flex flex-col items-center">
        {/* Brand Logo Header */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00cfff] to-[#0077ff] flex items-center justify-center text-[#07070f] shadow-xl shadow-[#00cfff]/25 mb-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <Smartphone size={28} className="stroke-[2.5]" />
        </div>

        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-3xl font-extrabold text-white tracking-widest text-center"
        >
          RICKY<span className="text-[#00cfff]">MOBILE</span>
        </h1>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00cfff]/10 border border-[#00cfff]/20 rounded-full text-xs font-bold text-[#00cfff] mt-2 mb-6">
          <ShieldCheck size={13} />
          ADMIN MANAGEMENT PORTAL
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(() => {
            submitForm();
          })}
        >
          <Inputcontainer type="email" error={errors?.email} isDark={true}>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-4 text-gray-500 pointer-events-none" />
              <Input
                id="email"
                placeholder="Ricky@gmail.com"
                {...register("email")}
                className="pl-11"
              />
            </div>
          </Inputcontainer>

          <Inputcontainer type="password" error={errors?.password} isDark={true}>
            <PasswordInput>
              {({ passwordVisible }) => (
                <div className="relative flex-1 flex items-center">
                  <Lock size={16} className="absolute left-4 text-gray-500 pointer-events-none" />
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Enter admin password"
                    className="pl-11 bg-transparent border-none focus:border-none focus:bg-transparent"
                    {...register("password")}
                  />
                </div>
              )}
            </PasswordInput>
          </Inputcontainer>

          <Button
            name="LOGIN TO DASHBOARD"
            className="mt-2"
          />
        </form>
      </Formcontainer>

      <p className="mt-8 text-xs text-gray-500 text-center tracking-wide">
        © {new Date().getFullYear()} Ricky Mobile Store · Admin Security System
      </p>
    </Maincontainer>
  );
}
