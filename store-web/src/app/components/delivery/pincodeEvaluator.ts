export interface DeliveryInfo {
  pincode: string;
  isDeliverable: boolean;
  zone: "khanna" | "ludhiana" | "punjab" | "national" | "invalid";
  speedText: string;
  expectedDateText: string;
  locationName: string;
  freeDelivery: boolean;
  codAvailable: boolean;
  storePickupAvailable: boolean;
  backendVerified?: boolean;
  cityName?: string;
  district?: string;
  state?: string;
}

export function evaluatePincode(pin: string): DeliveryInfo {
  const cleanPin = pin.trim().replace(/\D/g, "");

  if (cleanPin.length !== 6) {
    return {
      pincode: cleanPin,
      isDeliverable: false,
      zone: "invalid",
      speedText: "Please enter a valid 6-digit Indian PIN code.",
      expectedDateText: "",
      locationName: "",
      freeDelivery: false,
      codAvailable: false,
      storePickupAvailable: false,
    };
  }

  // Khanna Hyperlocal: 141401, 141417
  if (
    cleanPin === "141401" ||
    cleanPin === "141417" ||
    cleanPin.startsWith("14140")
  ) {
    return {
      pincode: cleanPin,
      isDeliverable: true,
      zone: "khanna",
      speedText: "Yes, it is available for delivery",
      expectedDateText: "Today by 7:00 PM (Within 2–3 Hours)",
      locationName: "Khanna, District Ludhiana (Punjab)",
      freeDelivery: true,
      codAvailable: true,
      storePickupAvailable: true,
    };
  }

  // Ludhiana District & surrounding towns: 141001-141014, 141114 (Samrala), 147301 (Mandi Gobindgarh), 141119 (Doraha), 141120 (Sahnewal)
  if (
    (cleanPin.startsWith("1410") && cleanPin <= "141015") ||
    cleanPin === "141114" || // Samrala
    cleanPin === "147301" || // Mandi Gobindgarh
    cleanPin === "141119" || // Doraha
    cleanPin === "141120" || // Sahnewal
    cleanPin === "141421" // Machhiwara
  ) {
    return {
      pincode: cleanPin,
      isDeliverable: true,
      zone: "ludhiana",
      speedText: "Yes, it is available for delivery",
      expectedDateText: "Tomorrow by 2:00 PM",
      locationName:
        cleanPin === "147301"
          ? "Mandi Gobindgarh"
          : cleanPin === "141114"
            ? "Samrala"
            : "Ludhiana District (Punjab)",
      freeDelivery: true,
      codAvailable: true,
      storePickupAvailable: true,
    };
  }

  // Rest of Punjab & Tricity: 140xxx-160xxx
  const pinPrefix = parseInt(cleanPin.slice(0, 3), 10);
  if (
    (pinPrefix >= 140 && pinPrefix <= 148) ||
    (pinPrefix >= 151 && pinPrefix <= 152) ||
    pinPrefix === 160
  ) {
    return {
      pincode: cleanPin,
      isDeliverable: true,
      zone: "punjab",
      speedText: "Yes, it is available for delivery",
      expectedDateText: "In 1–2 Business Days",
      locationName: "Punjab / Chandigarh Region",
      freeDelivery: true,
      codAvailable: true,
      storePickupAvailable: false,
    };
  }

  return {
    pincode: cleanPin,
    isDeliverable: false,
    zone: "invalid",
    speedText: "City not available for delivery",
    expectedDateText: "",
    locationName: "",
    freeDelivery: false,
    codAvailable: false,
    storePickupAvailable: false,
  };
}
