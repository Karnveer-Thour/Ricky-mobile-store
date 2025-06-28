"use client";
import * as yup from "yup";
import { differenceInYears } from "date-fns";

export const Personalinfovalidation = yup.object({
  first_name: yup
    .string()
    .required("First name required")
    .min(3, "First name must contain 3 characters"),
  last_name: yup.string().nullable(),
  email: yup.string().email("Enter a valid email").required("Email required"),
  date_birth: yup
    .string()
    .required("Date of birth is required")
    .test("is-adult", "You must be at least 18 years old", (value) => {
      if (!value) return false; // If no date is provided, fail validation

      const today = new Date();
      const dob = new Date(value);
      const age = differenceInYears(today, dob); // Calculate age

      return age >= 18; // Return true if age is 18 or older
    }),
  phone: yup
    .string()
    .min(10, "Phone Number must have 10 characters")
    .max(10, "Phone Number can't be more than 10 characters")
    .nullable(),
});

export const Addressinfovalidation = yup.object({
  city: yup
    .string()
    .min(3, "City name must have 3 characters")
    .transform((curr, org) => (org === "" ? null : curr))
    .nullable(),
  country: yup
    .string()
    .min(3, "Country name must have 3 characters")
    .transform((curr, org) => (org === "" ? null : curr))
    .nullable(),
  postal_code: yup
    .string()
    .min(5, "Postal code must have 5 characters")
    .transform((curr, org) => (org === "" ? null : curr))
    .nullable(),
});
