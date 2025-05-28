import * as yup from "yup";

export const Loginvalidationschema = yup.object({
  email: yup
    .string()
    .required("email required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .min(8, "Password must be contain 8 characters")
    .required("Password required"),
});
