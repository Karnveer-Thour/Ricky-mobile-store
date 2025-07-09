import * as yup from "yup";

export const changePasswordValidator = yup.object({
  password: yup
    .string()
    .min(8, "Password must be contain 8 characters")
    .required("Password required"),
  newPassword: yup
    .string()
    .min(8, "Password must be contain 8 characters")
    .notOneOf([yup.ref("password")],"Previous password and new password can't be same")
    .required("Password required"),
    confirm_password: yup
        .string()
        .min(8, "Password must be contain 8 characters")
        .required("Password required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
