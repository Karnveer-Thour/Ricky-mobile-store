import { useState } from "react";
import { ColorVariant, ProductVariantItem } from "../ProductVariantsSection";

export function useProductVariantsState(mode: "add" | "update") {
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    {
      name: mode === "add" ? "Default" : "Standard",
      quantity: mode === "add" ? 20 : 10,
    },
  ]);
  const [directQuantity, setDirectQuantity] = useState<number>(
    mode === "add" ? 25 : 10,
  );
  const [productVariants, setProductVariants] = useState<ProductVariantItem[]>([
    {
      ram: "8 GB",
      storage: "128 GB",
      color: "Default",
      quantity: mode === "add" ? 15 : 10,
    },
  ]);

  const handleAddColor = () => {
    setColorVariants((prev) => [...prev, { name: "", quantity: 10 }]);
  };

  const handleRemoveColor = (index: number) => {
    setColorVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorChange = (
    index: number,
    field: "name" | "quantity",
    value: any,
  ) => {
    setColorVariants((prev) =>
      prev.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            [field]:
              field === "quantity" ? Math.max(0, parseInt(value) || 0) : value,
          };
        }
        return c;
      }),
    );
  };

  const handleAddVariant = (hasColors: boolean) => {
    setProductVariants((prev) => [
      ...prev,
      {
        ram: "8 GB",
        storage: "256 GB",
        color: hasColors ? "Standard" : "",
        quantity: 10,
      },
    ]);
  };

  const handleAddPresetVariant = (
    ram: string,
    storage: string,
    hasColors: boolean,
  ) => {
    setProductVariants((prev) => [
      ...prev,
      {
        ram,
        storage,
        color: hasColors ? "Standard" : "",
        quantity: 10,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setProductVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantItem,
    value: any,
  ) => {
    setProductVariants((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          return {
            ...v,
            [field]:
              field === "quantity" ? Math.max(0, parseInt(value) || 0) : value,
          };
        }
        return v;
      }),
    );
  };

  const calculateTotalQuantity = (
    categoryHasVariants: boolean,
    categoryHasColors: boolean,
  ) => {
    return categoryHasVariants
      ? productVariants.reduce(
          (acc, curr) => acc + (Number(curr.quantity) || 0),
          0,
        )
      : categoryHasColors
        ? colorVariants.reduce(
            (acc, curr) => acc + (Number(curr.quantity) || 0),
            0,
          )
        : directQuantity;
  };

  return {
    colorVariants,
    setColorVariants,
    directQuantity,
    setDirectQuantity,
    productVariants,
    setProductVariants,
    handleAddColor,
    handleRemoveColor,
    handleColorChange,
    handleAddVariant,
    handleAddPresetVariant,
    handleRemoveVariant,
    handleVariantChange,
    calculateTotalQuantity,
  };
}
