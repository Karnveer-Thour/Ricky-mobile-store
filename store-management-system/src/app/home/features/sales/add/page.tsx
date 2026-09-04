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

function addSale() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data: any) => {
    console.log("Adding sale:", data);
    router.back();
  };

  return (
    <BlurredPopupLayout width={"520px"} height={"auto"} isDark={isDark}>
      <div className="p-4 space-y-4">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Add Delivery City / Zone</h2>
        <form
          id="add-sale-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-3"
        >
          <Inputcontainer type={"City Name"} error={errors?.name} isDark={isDark}>
            <Input
              id="City Name"
              placeholder="Enter city name"
              {...register("name")}
              isDark={isDark}
            />
          </Inputcontainer>
          <Inputcontainer
            type={"District"}
            error={errors?.district}
            isDark={isDark}
          >
            <Input
              id="District"
              placeholder="Enter city district"
              {...register("district")}
              isDark={isDark}
            />
          </Inputcontainer>
          <Inputcontainer type={"State"} error={errors?.state} isDark={isDark}>
            <Input
              id="State"
              placeholder="Enter State"
              {...register("state")}
              isDark={isDark}
            />
          </Inputcontainer>
          <Inputcontainer
            type={"Pincode"}
            error={errors?.pincode}
            isDark={isDark}
          >
            <Input
              id="Pincode"
              placeholder="Enter pincode"
              {...register("pincode")}
              isDark={isDark}
            />
          </Inputcontainer>
          <div className="pt-2">
            <ToggleButton
              isDark={isDark}
              activeLabel="Accepting Orders"
              inactiveLabel="Not Accepting"
              handler={(val: boolean) => console.log("Toggle status:", val)}
            />
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            name={"Cancel"}
            variant="secondary"
            isDark={isDark}
            handler={() => router.back()}
          />
          <Button
            name={"Add Location"}
            isDark={isDark}
            handler={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </BlurredPopupLayout>
  );
}

export default addSale;
