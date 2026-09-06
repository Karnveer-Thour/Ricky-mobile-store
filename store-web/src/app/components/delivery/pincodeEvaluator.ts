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
      speedText: "Same-Day Express Delivery (Within 2–3 Hours)",
      expectedDateText: "Today by 7:00 PM",
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
      speedText: "Next-Day Guaranteed Express Delivery",
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
      speedText: "Express Regional Delivery (1–2 Business Days)",
      expectedDateText: "In 1–2 Days",
      locationName: "Punjab / Chandigarh Region",
      freeDelivery: true,
      codAvailable: true,
      storePickupAvailable: false,
    };
  }

  // Pan-India Valid Pincodes
  if (/^[1-8][0-9]{5}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      isDeliverable: true,
      zone: "national",
      speedText: "Standard Air Courier (2–4 Business Days)",
      expectedDateText: "In 2–4 Business Days",
      locationName: "All-India Delivery Network",
      freeDelivery: true,
      codAvailable: true,
      storePickupAvailable: false,
    };
  }

  return {
    pincode: cleanPin,
    isDeliverable: false,
    zone: "invalid",
    speedText: "Delivery currently not serviceable to this pincode.",
    expectedDateText: "",
    locationName: "",
    freeDelivery: false,
    codAvailable: false,
    storePickupAvailable: false,
  };
}
