import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProductVariantsState } from "./useProductVariantsState";

describe("useProductVariantsState Hook", () => {
  it("initializes default state for add mode", () => {
    const { result } = renderHook(() => useProductVariantsState("add"));
    expect(result.current.colorVariants).toEqual([
      { name: "Default", quantity: 20 },
    ]);
    expect(result.current.directQuantity).toBe(25);
    expect(result.current.productVariants).toHaveLength(1);
    expect(result.current.productVariants[0].ram).toBe("8 GB");
  });

  it("initializes default state for update mode", () => {
    const { result } = renderHook(() => useProductVariantsState("update"));
    expect(result.current.colorVariants).toEqual([
      { name: "Standard", quantity: 10 },
    ]);
    expect(result.current.directQuantity).toBe(10);
    expect(result.current.productVariants).toHaveLength(1);
  });

  it("handles adding, modifying, and removing color variants", () => {
    const { result } = renderHook(() => useProductVariantsState("add"));

    act(() => {
      result.current.handleAddColor();
    });
    expect(result.current.colorVariants).toHaveLength(2);

    act(() => {
      result.current.handleColorChange(1, "name", "Midnight Blue");
      result.current.handleColorChange(1, "quantity", 30);
    });
    expect(result.current.colorVariants[1]).toEqual({
      name: "Midnight Blue",
      quantity: 30,
    });

    act(() => {
      result.current.handleRemoveColor(0);
    });
    expect(result.current.colorVariants).toHaveLength(1);
    expect(result.current.colorVariants[0].name).toBe("Midnight Blue");
  });

  it("handles adding and modifying product variants", () => {
    const { result } = renderHook(() => useProductVariantsState("add"));

    act(() => {
      result.current.handleAddPresetVariant("12 GB", "512 GB", true);
    });
    expect(result.current.productVariants).toHaveLength(2);
    expect(result.current.productVariants[1]).toEqual({
      ram: "12 GB",
      storage: "512 GB",
      color: "Standard",
      quantity: 10,
    });

    act(() => {
      result.current.handleVariantChange(1, "quantity", 45);
    });
    expect(result.current.productVariants[1].quantity).toBe(45);
  });

  it("accurately calculates total stock quantity across variant configurations", () => {
    const { result } = renderHook(() => useProductVariantsState("add"));

    // Case 1: Category has structured variants
    const totalWithVariants = result.current.calculateTotalQuantity(true, true);
    expect(totalWithVariants).toBe(15); // initial default variant has qty 15

    // Case 2: Category has color-only variants
    const totalWithColors = result.current.calculateTotalQuantity(false, true);
    expect(totalWithColors).toBe(20); // initial default color has qty 20

    // Case 3: Category has no variants or colors (direct stock)
    const totalDirect = result.current.calculateTotalQuantity(false, false);
    expect(totalDirect).toBe(25); // initial direct quantity is 25
  });
});
