"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Inputcontainer from "@/components/Inputcontainer";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { storeType } from "@/types/store.index";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

function page() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    formState: { errors },
  } = useForm({});

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add Category</p>
      <form action="" className="flex-1 w-full p-3">
        <Inputcontainer type={"Account holder name"} error={errors?.name} isDark={isDark}>
          <Input
            id="Name"
            placeholder="Enter Account Holder name"
            {...register("name")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Bank name"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="Enter Bank Name"
            placeholder="Enter category description"
            {...register("description")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Account Number"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="Account Number"
            placeholder="Enter Account Number"
            {...register("description")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"IFSC Code"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="IFSC Code"
            placeholder="Enter IFSC Code"
            {...register("description")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button name={"Submit"} handler={() => {}} />
      </div>
    </BlurredPopupLayout>
  );
}

export default page;
