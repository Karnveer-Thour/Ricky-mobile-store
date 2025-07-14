"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
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
    } catch (error) {
      throw new Error(String(error));
    }
  };

  return (
    <>
      <Maincontainer>
        <Formcontainer className="max-w-xl p-8">
          <div className="h-32 flex justify-center items-center">
            <img
              src="/assets/images/logo.png"
              alt="loading"
              className=" border-2 h-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-white p-2 h-auto">
            Welcome to{" "}
            <span className="text-[#ffb396]">Ricky mobile store!</span>
          </h1>
          <h2 className="text-xl text-center text-white p-2 h-auto">
            Admin Login
          </h2>

          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit(() => {
              submitForm();
            })}
          >
            <Inputcontainer type={"email"} error={errors?.email} isDark={true}>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                className={
                  "border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-white"
                }
              />
            </Inputcontainer>
            <Inputcontainer
              type={"password"}
              error={errors?.password}
              isDark={true}
            >
              <PasswordInput>
                {({ passwordVisible }) => (
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="flex-1 px-4 py-2 rounded-md focus:outline-none border-none bg-transparent text-white"
                    customMargin="mt-0"
                    {...register("password")}
                  />
                )}
              </PasswordInput>
            </Inputcontainer>
            <Button
              name={"Login"}
              handler={undefined}
              value={undefined}
              className={"max-w-[100%]"}
            />
          </form>
        </Formcontainer>
        <h1 className="mt-8 text-white">
          © Copyrights Karanveer Thour 2025. All Rights Reserved.
        </h1>
      </Maincontainer>
    </>
  );
}
