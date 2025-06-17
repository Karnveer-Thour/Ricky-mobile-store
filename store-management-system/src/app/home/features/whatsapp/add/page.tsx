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

function addWhatsappGroup() {
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
        <Inputcontainer type={"Group Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="Group Name"
            placeholder="Enter Group Name"
            {...register("Group Name")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Group Url"} error={errors?.price} isDark={isDark}>
          <Input
            id="Group Url"
            placeholder="Enter Group Url"
            {...register("Group Url")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <div>
          <ToggleButton
            isDark={isDark}
            activeLabel="Active"
            inactiveLabel="Inactive"
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

export default addWhatsappGroup;
