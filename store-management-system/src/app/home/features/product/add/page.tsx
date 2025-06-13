"use client";
import React from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function addProduct() {
  const router = useRouter();

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
        
    });
  return (
    <BlurredPopupLayout width={"60%"} height={"60%"}>
      <p className="text-2xl font-bold mt-5">Add Product</p>
      <form action="" className="flex-1">
        <Inputcontainer type={"email"} error={errors?.email}>
                        <Input
                          id="email"
                          placeholder="Enter your email"
                          {...register("email")}
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

export default addProduct;
