import Button from "@/components/Button";
import Input from "@/components/Input";
import Inputcontainer from "@/components/Inputcontainer";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { updatePassword } from "@/Redux/Services/adminServices";
// import { changePasswordValidator } from "./Utils/Objects/changePasswordValidator";

function Changepassword({
  isDark = false,
  validator,
}: {
  isDark?: boolean;
  validator?: any;
}) {
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
      className={`p-6 rounded-2xl border transition-colors duration-200 max-w-xl ${
        isDark
          ? "bg-slate-900/40 border-white/10 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      <h2 className="text-lg font-bold mb-4">Change Password</h2>

      <form onSubmit={() => {}} className="space-y-4">
        <Inputcontainer type="Current Password" error={errors.password}>
          <Input
            id="Current Password"
            type="password"
            placeholder="Enter your current password"
            {...register("password")}
            isDark={isDark}
          />
        </Inputcontainer>

        <Inputcontainer type="New Password" error={errors.newPassword}>
          <Input
            id="New Password"
            type="password"
            placeholder="Enter your new password"
            {...register("newPassword")}
            isDark={isDark}
          />
        </Inputcontainer>

        <Inputcontainer type="Confirm Password" error={errors.confirm_password}>
          <Input
            id="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            {...register("confirm_password")}
            isDark={isDark}
          />
        </Inputcontainer>

        <div className="pt-2">
          <Button
            name={"Update Password"}
            type="submit"
            isDark={isDark}
            disabled={!formUpdatable}
          />
        </div>
      </form>
    </div>
  );
}

export default Changepassword;
