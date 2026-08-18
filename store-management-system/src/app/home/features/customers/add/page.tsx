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
import { UserPlus, Check, X } from "lucide-react";

function addCustomer() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobileNumber: "",
    },
  });

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
      setSubmitError(
        res.message || "Failed to create customer. Please try again.",
      );
    }
  };

  return (
    <BlurredPopupLayout
      title="Add New Customer"
      subtitle="Register a new customer account and credentials"
      icon={<UserPlus size={20} />}
      isDark={isDark}
      maxWidth="max-w-xl"
    >
      {submitError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <X size={14} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form
        id="add-customer-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Inputcontainer
            label="First Name"
            required
            error={errors?.firstName}
            isDark={isDark}
          >
            <Input
              id="firstName"
              placeholder="e.g. Rahul"
              {...register("firstName", { required: "First name is required" })}
            />
          </Inputcontainer>

          <Inputcontainer
            label="Last Name"
            required
            error={errors?.lastName}
            isDark={isDark}
          >
            <Input
              id="lastName"
              placeholder="e.g. Sharma"
              {...register("lastName", { required: "Last name is required" })}
            />
          </Inputcontainer>
        </div>

        <Inputcontainer
          label="Email Address"
          required
          error={errors?.email}
          isDark={isDark}
        >
          <Input
            id="email"
            type="email"
            placeholder="e.g. rahul.sharma@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address",
              },
            })}
          />
        </Inputcontainer>

        <Inputcontainer
          label="Mobile Number"
          error={errors?.mobileNumber}
          isDark={isDark}
        >
          <Input
            id="mobileNumber"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            {...register("mobileNumber")}
          />
        </Inputcontainer>

        <Inputcontainer
          label="Password"
          required
          error={errors?.password}
          isDark={isDark}
        >
          <PasswordInput isDark={isDark}>
            {({ passwordVisible }) => (
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
                className="bg-transparent border-0 focus:ring-0 focus:bg-transparent"
              />
            )}
          </PasswordInput>
        </Inputcontainer>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <Button
            type="button"
            name="Cancel"
            variant="ghost"
            handler={() => router.back()}
          />
          <Button
            type="submit"
            name="Create Account"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={<Check size={16} />}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}

export default addCustomer;
