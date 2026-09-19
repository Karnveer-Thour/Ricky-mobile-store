import { describe, it, expect, vi } from "vitest";
import { apiService } from "./apiService";
import {
  deliveryAddressSchema,
  productReviewSchema,
  profileSchema,
} from "../utils/validation.schemas";
import { evaluatePincode } from "../components/DeliveryChecker";

describe("Pincode Availability & Delivery Address API", () => {
  it("should validate a correct delivery address against deliveryAddressSchema", async () => {
    const validAddress = {
      label: "Home",
      houseNumber: "House 102",
      streetNumber: "Main Bazaar Road",
      areaName: "Gulmohar Colony",
      city: "Khanna",
      pincode: "141401",
      district: "Ludhiana",
      state: "Punjab",
      mobileNumber: "+91 98765 43210",
      isDefault: true,
    };

    const validated = await deliveryAddressSchema.validate(validAddress);
    expect(validated.city).toBe("Khanna");
    expect(validated.pincode).toBe("141401");
    expect(validated.label).toBe("Home");
  });

  it("should reject an invalid pincode or missing house number in deliveryAddressSchema", async () => {
    const invalidAddress = {
      label: "Home",
      houseNumber: "",
      streetNumber: "Main Road",
      areaName: "Area",
      city: "Khanna",
      pincode: "1414", // not 6 digits
      district: "Ludhiana",
      state: "Punjab",
      mobileNumber: "123",
    };

    await expect(deliveryAddressSchema.validate(invalidAddress)).rejects.toThrow();
  });

  it("should validate productReviewSchema with rating and text", async () => {
    const validReview = {
      rating: 5,
      userName: "Karan",
      reviewText: "Amazing phone and super fast delivery in Khanna!",
    };

    const validated = await productReviewSchema.validate(validReview);
    expect(validated.rating).toBe(5);
    expect(validated.reviewText).toContain("Khanna");
  });

  it("should reject review with rating out of range or empty text", async () => {
    const invalidReview = {
      rating: 0,
      reviewText: "",
    };

    await expect(productReviewSchema.validate(invalidReview)).rejects.toThrow();
  });

  it("apiService.checkPincodeAvailability should return structured availability for valid 6-digit pin", async () => {
    const res = await apiService.checkPincodeAvailability("141401");
    expect(res).toHaveProperty("isAvailable");
    expect(res).toHaveProperty("isAccepting");
    expect(res).toHaveProperty("backendVerified");
  });

  it("apiService.checkPincodeAvailability should reject non-6-digit pin", async () => {
    const res = await apiService.checkPincodeAvailability("123");
    expect(res.isAvailable).toBe(false);
    expect(res.message).toContain("6-digit");
  });

  it("evaluatePincode should correctly flag deliverable vs undeliverable pincodes", () => {
    // Deliverable zones
    expect(evaluatePincode("141401").isDeliverable).toBe(true);
    expect(evaluatePincode("141001").isDeliverable).toBe(true);
    expect(evaluatePincode("160017").isDeliverable).toBe(true);

    // Undeliverable zones (outside serviceable region)
    expect(evaluatePincode("110001").isDeliverable).toBe(false);
    expect(evaluatePincode("400001").isDeliverable).toBe(false);
    expect(evaluatePincode("560001").isDeliverable).toBe(false);
    expect(evaluatePincode("123").isDeliverable).toBe(false);
  });
});

describe("Profile Validation Schema (profileSchema)", () => {
  it("should validate a valid profile with Indian mobile number and empty date of birth", async () => {
    const validProfile = {
      firstName: "Karanveer",
      lastName: "Thour",
      email: "karanveerthour76@gmail.com",
      mobileNumber: "08847009521",
      dateBirth: "",
    };

    const validated = await profileSchema.validate(validProfile);
    expect(validated.firstName).toBe("Karanveer");
    expect(validated.lastName).toBe("Thour");
    expect(validated.mobileNumber).toBe("08847009521");
  });

  it("should validate a profile with a valid past date of birth", async () => {
    const validProfile = {
      firstName: "Ricky",
      lastName: "Makol",
      email: "ricky@example.com",
      mobileNumber: "+91 98765 43210",
      dateBirth: "1995-06-15",
    };

    const validated = await profileSchema.validate(validProfile);
    expect(validated.dateBirth).toBe("1995-06-15");
  });

  it("should reject a profile with future date of birth", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const invalidProfile = {
      firstName: "Karanveer",
      email: "karan@example.com",
      mobileNumber: "9876543210",
      dateBirth: futureDate.toISOString().split("T")[0],
    };

    await expect(profileSchema.validate(invalidProfile)).rejects.toThrow(
      "Date of birth cannot be in the future",
    );
  });

  it("should reject a profile with age less than 13 years", async () => {
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 5);
    const invalidProfile = {
      firstName: "Karanveer",
      email: "karan@example.com",
      mobileNumber: "9876543210",
      dateBirth: recentDate.toISOString().split("T")[0],
    };

    await expect(profileSchema.validate(invalidProfile)).rejects.toThrow(
      "You must be at least 13 years old",
    );
  });

  it("should reject an invalid mobile number or invalid email", async () => {
    const invalidProfile = {
      firstName: "K",
      email: "not-an-email",
      mobileNumber: "12345",
    };

    await expect(profileSchema.validate(invalidProfile)).rejects.toThrow();
  });
});
