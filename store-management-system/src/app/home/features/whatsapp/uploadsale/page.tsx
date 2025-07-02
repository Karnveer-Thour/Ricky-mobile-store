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
import MultiSelectorInput from "@/components/multiselectorinput";
import UploaderInput from "@/components/uploaderInput";
import ImageCropper from "@/components/imagecropper";

function UploadSale() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Upload Sale</p>
      <form action="" className="flex-1 w-full p-3">
        <Inputcontainer
          type={"Customer Name"}
          error={errors?.name}
          isDark={isDark}
        >
          <Input
            id="Customer Name"
            placeholder="Enter Customer Name"
            {...register("Group Name")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Products"} error={errors?.price} isDark={isDark}>
          <MultiSelectorInput
            values={[
              {
                name: "hi",
              },
              {
                name: "hello",
              },
              {
                name: "bye",
              },
              {
                name: "cu",
              },
            ]}
            isDark={isDark}
          />
        </Inputcontainer>
        <Inputcontainer type={"Amount"} error={errors?.price} isDark={isDark}>
          <Input
            id="Amount"
            placeholder="Enter Amount"
            {...register("Group Url")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Received Amount"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="Received Amount"
            placeholder="Enter Received Amount"
            {...register("Group Url")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer type={"Pictures"} error={errors?.price} isDark={isDark}>
          <UploaderInput />
          <ImageCropper isDark={isDark} imageURL=""/>
        </Inputcontainer>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button name={"Submit"} handler={() => {}} />
      </div>
    </BlurredPopupLayout>
  );
}

export default UploadSale;
