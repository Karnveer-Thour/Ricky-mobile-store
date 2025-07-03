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
import UploaderInput from "@/components/inputuploaders/multiuploaderinput/uploaderInput";
import { Eye, EyeClosed } from "lucide-react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import PasswordInput from "@/components/passwordInput";
import SingleUploaderInput from "@/components/inputuploaders/singleuploaderinput/singleuploaderinput";

function updateCustomer() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Update Customer</p>
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
        <Inputcontainer
          type={"Mobile Number"}
          error={errors?.price}
          isDark={isDark}
        >
          <Input
            id="Mobile Number"
            placeholder="Enter Mobile Number"
            {...register("pincode")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <div className="flex items-center">
          <Inputcontainer
            type={"Profile Picture"}
            error={errors?.price}
            isDark={isDark}
          >
            <SingleUploaderInput isDark={isDark} features={{crop:true}}/>
          </Inputcontainer>
          <div className={`ms-20 self-baseline`}>
            <Inputcontainer
              type={"Date of Birth"}
              error={errors?.price}
              isDark={isDark}
            >
              <div
                className={` border-2 ${isDark ? "#ffffff" : " #6a7282"} rounded-md mt-1.5`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        InputLabelProps: {
                          style: { color: isDark ? "#fff" : "#6b7280" },
                        },
                        InputProps: {
                          style: {
                            color: isDark ? "#fff" : "#6b7280",
                            borderColor: isDark ? "#fff" : "#6b7280",
                          }, // input text color
                        },
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: isDark ? "#fff" : "#6b7280",
                            },
                            "&:hover fieldset": {
                              borderColor: isDark ? "#fff" : "#6b7280",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: isDark ? "#fff" : "#6b7280",
                            },
                          },
                          "& .MuiSvgIcon-root": {
                            color: isDark ? "#fff" : "#6b7280",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </Inputcontainer>
          </div>
        </div>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button name={"Submit"} handler={() => {}} />
      </div>
    </BlurredPopupLayout>
  );
}

export default updateCustomer;
