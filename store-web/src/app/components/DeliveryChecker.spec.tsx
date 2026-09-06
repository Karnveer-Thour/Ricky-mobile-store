import { describe, it, expect } from "vitest";
import { evaluatePincode } from "./DeliveryChecker";

describe("evaluatePincode Engine", () => {
  it("should evaluate Khanna hyperlocal pincodes (141401, 141417) with same-day express delivery", () => {
    const res141401 = evaluatePincode("141401");
    expect(res141401.isDeliverable).toBe(true);
    expect(res141401.zone).toBe("khanna");
    expect(res141401.speedText).toContain("Same-Day Express Delivery");
    expect(res141401.storePickupAvailable).toBe(true);
    expect(res141401.freeDelivery).toBe(true);

    const res141417 = evaluatePincode("141417");
    expect(res141417.isDeliverable).toBe(true);
    expect(res141417.zone).toBe("khanna");
  });

  it("should evaluate Ludhiana District & surrounding towns (141001, 141114, 147301) with next-day express delivery", () => {
    const resLudhiana = evaluatePincode("141001");
    expect(resLudhiana.isDeliverable).toBe(true);
    expect(resLudhiana.zone).toBe("ludhiana");
    expect(resLudhiana.speedText).toContain("Next-Day");

    const resGobindgarh = evaluatePincode("147301");
    expect(resGobindgarh.isDeliverable).toBe(true);
    expect(resGobindgarh.zone).toBe("ludhiana");
    expect(resGobindgarh.locationName).toBe("Mandi Gobindgarh");

    const resSamrala = evaluatePincode("141114");
    expect(resSamrala.isDeliverable).toBe(true);
    expect(resSamrala.zone).toBe("ludhiana");
  });

  it("should evaluate other Punjab/Tricity pincodes with regional delivery", () => {
    const resMohali = evaluatePincode("160055");
    expect(resMohali.isDeliverable).toBe(true);
    expect(resMohali.zone).toBe("punjab");
    expect(resMohali.speedText).toContain("1–2 Business Days");
  });

  it("should evaluate Pan-India valid pincodes with national courier delivery", () => {
    const resDelhi = evaluatePincode("110001");
    expect(resDelhi.isDeliverable).toBe(true);
    expect(resDelhi.zone).toBe("national");
    expect(resDelhi.speedText).toContain("2–4 Business Days");
  });

  it("should reject invalid pincodes", () => {
    const resInvalidShort = evaluatePincode("1414");
    expect(resInvalidShort.isDeliverable).toBe(false);
    expect(resInvalidShort.zone).toBe("invalid");

    const resInvalidNonNumeric = evaluatePincode("ABCDEF");
    expect(resInvalidNonNumeric.isDeliverable).toBe(false);
  });
});
