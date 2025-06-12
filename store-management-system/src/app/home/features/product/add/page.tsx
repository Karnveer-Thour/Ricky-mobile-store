"use client";
import React from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

function addProduct() {
  const router = useRouter();
  return (
    <BlurredPopupLayout width={"60%"} height={"60%"}>
        <p className="text-2xl font-bold mt-5">Add Product</p>
        <form action="" className="flex-1"></form>
        <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
          <Button name={"Cancel"} handler={()=>router.back()} />
          <Button name={"Submit"} handler={()=>{}} />
        </div>
    </BlurredPopupLayout>
  );
}

export default addProduct;
