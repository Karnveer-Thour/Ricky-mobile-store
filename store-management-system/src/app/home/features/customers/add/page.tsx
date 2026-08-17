"use client";
import React, { useState } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import PasswordInput from "@/components/passwordInput";
import { customerService } from "@/services/customer.service";

function addCustomer() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      firstName: data.firstName || data.name,
      lastName: data.lastName || "Customer",
      email: data.email,
      password: data.password || "Customer@123",
      role: "Customer",
      mobileNumber: data.mobileNumber || "",
    };

    const res = await customerService.createCustomer(payload);
    setIsSubmitting(false);

    if (res.ok) {
      router.back();
    } else {
      setSubmitError(res.message || "Failed to create customer. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add Customer</p>
      {submitError && (
        <p className="text-sm text-red-500 font-semibold mt-2">{submitError}</p>
      )}
      <form id="add-customer-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-3">
        <Inputcontainer
          type={"First Name"}
          error={errors?.firstName}
          isDark={isDark}
        >
          <Input
            id="First Name"
            placeholder="Enter First Name"
            {...register("firstName", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Last Name"}
          error={errors?.lastName}
          isDark={isDark}
        >
          <Input
            id="Last Name"
            placeholder="Enter Last Name"
            {...register("lastName")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Email"} error={errors?.email} isDark={isDark}>
          <Input
            id="Email"
            type="email"
            placeholder="Enter Email Address"
            {...register("email", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Mobile Number"}
          error={errors?.mobileNumber}
          isDark={isDark}
        >
          <Input
            id="Mobile Number"
            placeholder="Enter Mobile Number"
            {...register("mobileNumber")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Password"} error={errors?.password} isDark={isDark}>
          <PasswordInput
            isDark={isDark}
            className="focus-within:ring-blue-600 focus-within:ring-inset"
          >
            {({ passwordVisible }) => (
              <Input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter password (e.g. Customer@123)"
                className={`flex-1 px-4 py-2 rounded-md focus:outline-none border-none bg-transparent font-bold ${isDark ? " text-white" : "text-gray-500"}`}
                customMargin="mt-0"
                {...register("password")}
              />
            )}
          </PasswordInput>
        </Inputcontainer>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button
          name={isSubmitting ? "Submitting..." : "Submit"}
          handler={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </div>
    </BlurredPopupLayout>
  );
}

export default addCustomer;
