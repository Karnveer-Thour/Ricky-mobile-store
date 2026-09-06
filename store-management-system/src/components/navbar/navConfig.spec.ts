import { describe, it, expect } from "vitest";
import { NAV_SECTIONS, PROFILE_MENU_ITEMS } from "./navConfig";

describe("Admin Navbar Navigation Configuration (NAV_SECTIONS)", () => {
  it("should contain exactly 4 logical sections", () => {
    expect(NAV_SECTIONS).toHaveLength(4);
    const sectionIds = NAV_SECTIONS.map((s) => s.id);
    expect(sectionIds).toEqual([
      "main",
      "management",
      "operations",
      "communication",
    ]);
  });

  it("should define valid labels and items for each section", () => {
    NAV_SECTIONS.forEach((section) => {
      expect(section.id).toBeTruthy();
      expect(section.label).toBeTruthy();
      expect(Array.isArray(section.items)).toBe(true);
      expect(section.items.length).toBeGreaterThan(0);
    });
  });

  it("should contain all 10 core administrative destinations", () => {
    const allItems = NAV_SECTIONS.flatMap((s) => s.items);
    expect(allItems).toHaveLength(10);

    const itemIds = allItems.map((item) => item.id);
    expect(itemIds).toEqual([
      "dashboard",
      "customers",
      "products",
      "categories",
      "cities",
      "inventory",
      "dispatch",
      "sales",
      "support-chat",
      "whatsapp",
    ]);
  });

  it("should have valid, non-empty, and unique linkTo routes starting with /home/features/", () => {
    const allItems = NAV_SECTIONS.flatMap((s) => s.items);
    const links = allItems.map((item) => item.linkTo);

    // Verify all routes begin with /home/features/
    links.forEach((link) => {
      expect(link.startsWith("/home/features/")).toBe(true);
    });

    // Verify uniqueness
    const uniqueLinks = new Set(links);
    expect(uniqueLinks.size).toBe(links.length);
  });

  it("should provide an icon element for every navigation item", () => {
    const allItems = NAV_SECTIONS.flatMap((s) => s.items);
    allItems.forEach((item) => {
      expect(item.icon).toBeDefined();
    });
  });
});

describe("Admin Profile Popover Menu Configuration (PROFILE_MENU_ITEMS)", () => {
  it("should define profile and settings options with valid links", () => {
    expect(PROFILE_MENU_ITEMS).toHaveLength(2);
    expect(PROFILE_MENU_ITEMS[0].id).toBe("profile");
    expect(PROFILE_MENU_ITEMS[0].linkTo).toBe("/home/profile");
    expect(PROFILE_MENU_ITEMS[1].id).toBe("settings");
    expect(PROFILE_MENU_ITEMS[1].linkTo).toBe("/home/settings");
  });

  it("should provide icon elements for all profile menu items", () => {
    PROFILE_MENU_ITEMS.forEach((item) => {
      expect(item.icon).toBeDefined();
      expect(item.label).toBeTruthy();
    });
  });
});
