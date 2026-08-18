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
import { UserCheck, Check, X } from "lucide-react";

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
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("customerData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCustomerId(parsed._id || parsed.id || "");
          setValue(
            "firstName",
            parsed.firstName || parsed.name?.split(" ")[0] || "",
          );
          setValue(
            "lastName",
            parsed.lastName || parsed.name?.split(" ").slice(1).join(" ") || "",
          );
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
      setSubmitError(
        res.message || "Failed to update customer. Please try again.",
      );
    }
  };

  return (
    <BlurredPopupLayout
      title="Edit Customer Profile"
      subtitle="Update contact information and user attributes"
      icon={<UserCheck size={20} />}
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
        id="update-customer-form"
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
              placeholder="Enter First Name"
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
              placeholder="Enter Last Name"
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
            placeholder="Enter Email Address"
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
            placeholder="Mobile Number"
            {...register("mobileNumber")}
          />
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
            name="Save Changes"
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

export default updateCustomer;
