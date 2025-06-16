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

function addProduct() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add City</p>
      <form action="" className="flex-1 w-full p-3">
        <Inputcontainer type={"City Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="City Name"
            placeholder="Enter city name"
            {...register("City Name")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"District"} error={errors?.price} isDark={isDark}>
          <Input
            id="District"
            placeholder="Enter city district"
            {...register("District")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"State"} error={errors?.price} isDark={isDark}>
          <Input
            id="State"
            placeholder="Enter city State"
            {...register("State")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Pincode"} error={errors?.price} isDark={isDark}>
          <Input
            id="Pincode"
            placeholder="Enter city pincode"
            {...register("pincode")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <div>
          <ToggleButton
            isDark={isDark}
            activeLabel="Accepting"
            inactiveLabel="Not Accepting"
            handler={() => {}}
          />
        </div>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button name={"Submit"} handler={() => {}} />
      </div>
    </BlurredPopupLayout>
  );
}

export default addProduct;
