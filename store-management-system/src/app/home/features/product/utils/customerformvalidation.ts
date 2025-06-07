import * as yup from "yup";

export const Customerformvalidationschema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  manual_Login: yup.boolean().required("Manual login selection is required"),
  rating: yup
    .number()
    .min(0, "Minimum rating is 1")
    .max(5, "Maximum rating is 5")
    .required("Rating is required"),
});

export const CustomerUpdateformvalidationschema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  manual_Login: yup.boolean().required("Manual login selection is required"),
  rating: yup
    .number()
    .min(0, "Minimum rating is 1")
    .max(5, "Maximum rating is 5")
    .required("Rating is required"),
});
