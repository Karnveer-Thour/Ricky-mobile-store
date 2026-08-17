"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { customerService } from "@/services/customer.service";

function updateCustomer() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [customerId, setCustomerId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("customerData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCustomerId(parsed._id || parsed.id || "");
          setValue("firstName", parsed.firstName || parsed.name || "");
          setValue("lastName", parsed.lastName || "");
          setValue("email", parsed.email || "");
          setValue("mobileNumber", parsed.mobile || parsed.mobileNumber || "");
        } catch (e) {
          console.warn("Failed to parse customerData from localStorage", e);
        }
      }
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    if (!customerId) {
      setSubmitError("No customer ID selected for update.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
    };

    const res = await customerService.updateCustomer(customerId, payload);
    setIsSubmitting(false);

    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("customerData");
      }
      router.back();
    } else {
      setSubmitError(res.message || "Failed to update customer. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Update Customer</p>
      {submitError && (
        <p className="text-sm text-red-500 font-semibold mt-2">{submitError}</p>
      )}
      <form id="update-customer-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-3">
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
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button
          name={isSubmitting ? "Updating..." : "Submit"}
          handler={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </div>
    </BlurredPopupLayout>
  );
}

export default updateCustomer;
