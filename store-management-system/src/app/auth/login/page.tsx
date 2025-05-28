"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

// Import UI components
import Inputcontainer from "@/components/Inputcontainer";
import Button from "@/components/Button";
import Input from "@/components/Input";

// Import Redux actions and validation schema
import Maincontainer from "@/UI/Maincontainer";
import Formcontainer from "@/UI/Formcontainer";
import { Loginvalidationschema } from "@/library/yup/login.yup";

export default function Login() {
  const dispatch = useDispatch();

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Initialize react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Loginvalidationschema), // Yup validation schema
  });

  return (
    <>
      {/* Show skeleton loader while loading */}
      {/* {auth.isLoading && <Skeltonloader />} */}

      {/* Render login form when not loading */}
      
        <Maincontainer>
          <Formcontainer className="max-w-md p-8">
            {/* Login form header */}
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 p-2 h-auto">
              Admin Login
            </h2>

            {/* Login form */}
            <form className="space-y-6" onSubmit={handleSubmit(()=>{})}>
              {/* Email input */}
              <Inputcontainer type={"email"} error={errors?.email}>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </Inputcontainer>

              {/* Password input */}
              <Inputcontainer type={"password"} error={errors?.password}>
                <Input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </Inputcontainer>

              {/* Toggle password visibility */}

              {/* Login button */}
              <Button name={"Login"} handler={undefined} value={undefined} className={"mt-9"} />

              {/* Forgot password and sign-up links */}
            </form>
          </Formcontainer>
        </Maincontainer>
      
    </>
  );
}
