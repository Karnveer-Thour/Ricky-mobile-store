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
import ToggleButton from "@/components/togglebutton";
import { cityService } from "@/services/city.service";

function addCity() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [isAccepting, setIsAccepting] = useState(true);
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
      name: data.name,
      district: data.district,
      state: data.state,
      pincode: Number(data.pincode) || 0,
      isAccepting: isAccepting,
    };

    const res = await cityService.createCity(payload);
    setIsSubmitting(false);

    if (res.ok) {
      router.back();
    } else {
      setSubmitError(res.message || "Failed to create city. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add City</p>
      {submitError && (
        <p className="text-sm text-red-500 font-semibold mt-2">{submitError}</p>
      )}
      <form id="add-city-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-3">
        <Inputcontainer type={"City Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="City Name"
            placeholder="Enter city name"
            {...register("name", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"District"} error={errors?.district} isDark={isDark}>
          <Input
            id="District"
            placeholder="Enter city district"
            {...register("district", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"State"} error={errors?.state} isDark={isDark}>
          <Input
            id="State"
            placeholder="Enter city State"
            {...register("state", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Pincode"} error={errors?.pincode} isDark={isDark}>
          <Input
            id="Pincode"
            type="number"
            placeholder="Enter city pincode"
            {...register("pincode", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <div className="mt-2">
          <ToggleButton
            isDark={isDark}
            activeLabel="Accepting"
            inactiveLabel="Not Accepting"
            handler={(val: boolean) => setIsAccepting(val)}
          />
        </div>
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

export default addCity;
