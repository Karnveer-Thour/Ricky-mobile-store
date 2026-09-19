/**
 * validation.schemas.ts
 *
 * Centralised Yup validation schemas for store-web forms.
 * Used by react-hook-form via @hookform/resolvers/yup.
 */
import * as yup from "yup";

// ---------------------------------------------------------------------------
// Reusable field rules
// ---------------------------------------------------------------------------

const emailField = yup
  .string()
  .trim()
  .required("Email address is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long");

const passwordField = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password is too long")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .matches(/[0-9]/, "Must contain at least one number")
  .matches(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)");

const phoneField = yup
  .string()
  .trim()
  .required("Mobile number is required")
  .matches(
    /^[+]?[\d\s\-().]{7,15}$/,
    "Enter a valid mobile number (e.g. +91 98765 43210)",
  );

const nameField = (label: string) =>
  yup
    .string()
    .trim()
    .required(`${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .max(50, `${label} is too long`);

// ---------------------------------------------------------------------------
// Sign In Schema
// ---------------------------------------------------------------------------

export const signInSchema = yup.object({
  email: emailField,
  password: yup.string().required("Password is required").min(1, "Password is required"),
});

export type SignInFormValues = yup.InferType<typeof signInSchema>;

// ---------------------------------------------------------------------------
// Create Account Schema
// ---------------------------------------------------------------------------

export const createAccountSchema = yup.object({
  firstName: nameField("First name"),
  lastName: yup.string().trim().max(50, "Last name is too long").optional(),
  mobileNumber: phoneField,
  email: emailField,
  password: passwordField,
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export type CreateAccountFormValues = yup.InferType<typeof createAccountSchema>;

// ---------------------------------------------------------------------------
// Checkout Address Schema
// ---------------------------------------------------------------------------

export const checkoutAddressSchema = yup.object({
  name: nameField("Recipient name"),
  mobile: phoneField,
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian pincode"),
  street: yup
    .string()
    .trim()
    .required("Street address is required")
    .min(5, "Street address is too short"),
  landmark: yup
    .string()
    .trim()
    .required("Landmark is required for the delivery rider to locate you")
    .min(3, "Please provide a more specific landmark"),
});

export type CheckoutAddressFormValues = yup.InferType<typeof checkoutAddressSchema>;

// ---------------------------------------------------------------------------
// Profile Update Schema
// ---------------------------------------------------------------------------

export const profileSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name must be at most 25 characters"),
  lastName: yup
    .string()
    .trim()
    .max(25, "Last name must be at most 25 characters")
    .optional(),
  email: emailField,
  mobileNumber: yup
    .string()
    .trim()
    .required("Mobile number is required")
    .matches(
      /^(?:(?:\+|0{0,2})91[\s\-]*)?[0]?[6-9](?:[\s\-]?\d){9}$/,
      "Enter a valid 10-digit mobile number (e.g. 98765 43210 or 08847009521)",
    ),
  dateBirth: yup
    .string()
    .optional()
    .test("valid-dob", "Date of birth cannot be in the future", (val) => {
      if (!val) return true;
      const d = new Date(val);
      return !isNaN(d.getTime()) && d <= new Date();
    })
    .test("min-age", "You must be at least 13 years old", (val) => {
      if (!val) return true;
      const d = new Date(val);
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
        age--;
      }
      return age >= 13;
    })
    .test("max-age", "Please enter a valid birth year (within 120 years)", (val) => {
      if (!val) return true;
      const d = new Date(val);
      if (isNaN(d.getTime())) return false;
      const minYear = new Date().getFullYear() - 120;
      return d.getFullYear() >= minYear;
    }),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Delivery Address Schema (Backend API compatible)
// ---------------------------------------------------------------------------

export const deliveryAddressSchema = yup.object({
  label: yup
    .string()
    .oneOf(["Home", "Work"], "Select Home or Work")
    .required("Address label is required"),
  houseNumber: yup
    .string()
    .trim()
    .required("House / Flat number is required")
    .max(15, "House number must be at most 15 characters"),
  streetNumber: yup
    .string()
    .trim()
    .required("Street name / number is required")
    .max(25, "Street number must be at most 25 characters"),
  areaName: yup
    .string()
    .trim()
    .required("Area / Colony name is required")
    .max(150, "Area name must be at most 150 characters"),
  city: yup
    .string()
    .trim()
    .required("City is required")
    .max(30, "City must be at most 30 characters"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian pincode"),
  district: yup
    .string()
    .trim()
    .required("District is required")
    .max(30, "District must be at most 30 characters"),
  state: yup
    .string()
    .trim()
    .required("State is required")
    .max(20, "State must be at most 20 characters"),
  mobileNumber: phoneField,
  isDefault: yup.boolean().optional(),
});

export type DeliveryAddressFormValues = yup.InferType<typeof deliveryAddressSchema>;

// ---------------------------------------------------------------------------
// Product Review Schema
// ---------------------------------------------------------------------------

export const productReviewSchema = yup.object({
  rating: yup
    .number()
    .required("Please select a rating")
    .min(1, "Minimum rating is 1 star")
    .max(5, "Maximum rating is 5 stars"),
  userName: yup.string().trim().max(50, "Name is too long").optional(),
  reviewText: yup
    .string()
    .trim()
    .required("Review text is required")
    .min(5, "Review must be at least 5 characters")
    .max(500, "Review must be at most 500 characters"),
});

export type ProductReviewFormValues = yup.InferType<typeof productReviewSchema>;

