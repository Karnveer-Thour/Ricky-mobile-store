"use client";
import React, { useState } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "@/components/select";
import { PlusIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

function addProduct() {
  const router = useRouter();
  const pathName=usePathname();
  const [colorCount, setColorCount] = useState([1]);
  const isDark=useSelector((store:storeType)=>store.DarkMode.isDarkMode)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const Categories = [
    {
      id:1,
      value: "Mobile",
      name: "Mobile",
    },
    {
      id:2,
      value: "SmartWatches",
      name: "SmartWatches",
    },
  ];
  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add Product</p>
      <form action="" className="flex-1 w-full p-3">
        <Inputcontainer type={"Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="Name"
            placeholder="Enter product's name"
            {...register("name")}
            className={`border-2 ${isDark?"border-white text-white":"border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <div className="flex items-center justify-between w-full bg-transparent">
          <Inputcontainer type={"Category"} error={errors?.category} isDark={isDark}>
            <Select className={`w-full border-2`} isDark={isDark}>
              {Categories.map((category) => (
                <option key={category.id} value={category.value}>{category.name}</option>
              ))}
            </Select>
          </Inputcontainer>
        </div>
        <Inputcontainer type={"Price"} error={errors?.price} isDark={isDark}>
          <Input
            id="Price"
            placeholder="Enter product's price"
            {...register("price")}
            className={`border-2 ${isDark?"border-white text-white":"border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Discount"} error={errors?.discount} isDark={isDark}>
          <Input
            id="discount"
            placeholder="Enter product's discount"
            {...register("discount")}
            className={`border-2 ${isDark?"border-white text-white":"border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Color"} error={errors?.color} isDark={isDark}>
          <div className="w-full flex justify-between items-center flex-wrap">
            {colorCount.map((count) => (
              <div key={count} className="w-[48%] flex justify-between">
                <div className="w-[60%]">
                  <Inputcontainer type={"Color Name"} error={errors?.colorName} isDark={isDark}>
                    <Input
                      id="ColorName"
                      placeholder="Enter product's Color Name"
                      {...register("Color Name")}
                      className={`border-2 ${isDark?"border-white text-white":"border-gray-500"} font-bold`}
                    />
                  </Inputcontainer>
                </div>
                <div className="w-[36%]">
                  <Inputcontainer
                    type={"Color Quantity"}
                    error={errors?.colorQuantity} isDark={isDark}
                  >
                    <Input
                      id="ColorQuantity"
                      placeholder="Enter Quantity"
                      {...register("Color Name")}
                      className={`border-2 ${isDark?"border-white text-white":"border-gray-500"} font-bold`}
                    />
                  </Inputcontainer>
                </div>
              </div>
            ))}
            <div className="w-[30%] m-auto">
              <Button
                name={<PlusIcon size={24} />}
                value={"Add"}
                handler={(e) => {
                  e.preventDefault();
                  setColorCount([...colorCount,colorCount.length+1]);
                }}
              />
            </div>
          </div>
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
