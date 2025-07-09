import Input from "@/components/Input";
import Inputcontainer from "@/components/Inputcontainer";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { updatePassword } from "@/Redux/Services/adminServices";
// import { changePasswordValidator } from "./Utils/Objects/changePasswordValidator";

function Changepassword({ isDark = false,validator }: { isDark?: boolean, validator?: any }) {
  const dispatch = useDispatch();
  const [formUpdatable, setFormUpdatable] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validator),
  });

  const formValues = watch();

  useEffect(() => {
    const isAnyFieldFilled =
      formValues.password !== "" ||
      formValues.confirm_password !== "" ||
      formValues.newPassword !== "";

    setFormUpdatable(isAnyFieldFilled);
  }, [
    formValues.password,
    formValues.confirm_password,
    formValues.newPassword,
  ]);

  const PasswordChange = (data: Record<string, any>) => {
    const { confirm_password, ...rest } = data;
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md mb-6 transition-colors duration-300`}
    >
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <form onSubmit={() => {}}>
        <Inputcontainer type="Current Password" error={errors.password}>
          <Input
            id="Current Password"
            placeholder="Enter your Current Password"
            {...register("password")}
            className={isDark ? "bg-gray-700 text-white placeholder-gray-400" : ""}
          />
        </Inputcontainer>

        <Inputcontainer type="New password" error={errors.newPassword}>
          <Input
            id="New password"
            placeholder="Enter your New password"
            {...register("newPassword")}
            className={isDark ? "bg-gray-700 text-white placeholder-gray-400" : ""}
          />
        </Inputcontainer>

        <Inputcontainer type="Confirm password" error={errors.confirm_password}>
          <Input
            id="Confirm password"
            placeholder="Confirm your New password"
            {...register("confirm_password")}
            className={isDark ? "bg-gray-700 text-white placeholder-gray-400" : ""}
          />
        </Inputcontainer>

        <button
          type="submit"
          className={`px-4 py-2 rounded-md mt-1 transition-all duration-200 ${
            isDark
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!formUpdatable}
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default Changepassword;