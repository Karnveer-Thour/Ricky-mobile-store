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
import { categoryService } from "@/services/category.service";

function addCategory() {
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
      name: data.name,
      description: data.description || "",
    };

    const res = await categoryService.createCategory(payload);
    setIsSubmitting(false);

    if (res.ok) {
      router.back();
    } else {
      setSubmitError(res.message || "Failed to create category. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add Category</p>
      {submitError && (
        <p className="text-sm text-red-500 font-semibold mt-2">{submitError}</p>
      )}
      <form id="add-category-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-3">
        <Inputcontainer type={"Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="Name"
            placeholder="Enter category name"
            {...register("name", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Description"}
          error={errors?.description}
          isDark={isDark}
        >
          <Input
            id="Description"
            placeholder="Enter category description"
            {...register("description")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
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

export default addCategory;
