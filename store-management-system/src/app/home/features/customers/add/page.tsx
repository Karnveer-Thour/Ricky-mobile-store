"use client";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import ToggleButton from "@/components/togglebutton";
import UploaderInput from "@/components/uploaderInput";
import { Eye, EyeClosed } from "lucide-react";
import PasswordInput from "@/components/passwordInput";

function addCustomer() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add Customer</p>
      <form action="" className="flex-1 w-full p-3">
        <Inputcontainer
          type={"First Name"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="First Name"
            placeholder="Enter First Name"
            {...register("District")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Last Name"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="Last Name"
            placeholder="Enter Last Name"
            {...register("State")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Email"} error={errors?.price} isDark={isDark}>
          <Input
            id="Email"
            placeholder="Enter Email Address"
            {...register("pincode")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"password"} error={errors?.price} isDark={isDark}>
          <PasswordInput
            isDark={isDark}
            className="focus-within:ring-blue-600 focus-within:ring-inset"
          >
            {({ passwordVisible }) => (
              <Input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
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
        <Button name={"Submit"} handler={() => {}} />
      </div>
    </BlurredPopupLayout>
  );
}

export default addCustomer;
