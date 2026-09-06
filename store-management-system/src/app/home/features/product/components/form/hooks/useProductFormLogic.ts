import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { productService, categoryService } from "@/services";
import { useProductMediaUpload } from "./useProductMediaUpload";
import { useProductVariantsState } from "./useProductVariantsState";
import { useProductAiLogic } from "./useProductAiLogic";

export interface UseProductFormLogicOptions {
  mode: "add" | "update";
}

export function useProductFormLogic({ mode }: UseProductFormLogicOptions) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [cachedCategory, setCachedCategory] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
      price: "",
      discount: "0",
      imageUrl: "",
      warranty: "1 Year Official Brand Warranty",
      specifications: "",
      description: "",
    },
  });

  const media = useProductMediaUpload(setValue);
  const variants = useProductVariantsState(mode);

  const currentCategoryId = watch("categoryId") || selectedCategoryId;
  const selectedCategory =
    categories.find((c) => (c.id || c._id) === currentCategoryId) ||
    ((cachedCategory?.id || cachedCategory?._id) === currentCategoryId
      ? cachedCategory
      : null);
  const categoryHasColors = selectedCategory
    ? selectedCategory.hasColors !== false
    : true;
  const categoryHasVariants = selectedCategory
    ? selectedCategory.hasVariants === true
    : false;

  const ai = useProductAiLogic({
    getValues,
    setValue,
    categories,
    selectedCategoryId,
    imageUrl: media.imageUrl,
    setImageUrl: media.setImageUrl,
    setImages: media.setImages,
    colorVariants: variants.colorVariants,
    setColorVariants: variants.setColorVariants,
    setSubmitError,
  });

  // On mount: fetch categories & (if update mode) read stored product data
  useEffect(() => {
    let targetCatId = "";

    if (mode === "update" && typeof window !== "undefined") {
      const stored = localStorage.getItem("productData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProductId(parsed._id || parsed.id || "");
          setValue("name", parsed.productName || parsed.name || "");

          if (parsed.category && typeof parsed.category === "object") {
            setCachedCategory(parsed.category);
          }

          targetCatId =
            parsed.categoryId ||
            parsed.category?.id ||
            parsed.category?._id ||
            (typeof parsed.category === "string" ? parsed.category : "");

          setSelectedCategoryId(targetCatId);
          setValue("categoryId", targetCatId);
          setValue("price", String(parsed.price || ""));
          setValue("discount", String(parsed.discount ?? "0"));
          setValue(
            "warranty",
            parsed.warranty || "1 Year Official Brand Warranty",
          );
          setValue("specifications", parsed.specifications || "");
          setValue("description", parsed.description || "");

          if (
            parsed.colors &&
            Array.isArray(parsed.colors) &&
            parsed.colors.length > 0
          ) {
            variants.setColorVariants(
              parsed.colors.map((c: any) => ({
                name: c.name || c.colorName || "Variant",
                quantity: Number(c.quantity) || 0,
              })),
            );
          } else if (
            parsed.productColors &&
            Array.isArray(parsed.productColors) &&
            parsed.productColors.length > 0
          ) {
            variants.setColorVariants(
              parsed.productColors.map((c: any) => ({
                name: c.name || c.colorName || "Variant",
                quantity: Number(c.quantity) || 0,
              })),
            );
          } else {
            const currentQty = Number(
              parsed.quantity ?? parsed.quantiy ?? parsed.stockCount ?? 10,
            );
            variants.setDirectQuantity(currentQty);
            variants.setColorVariants([
              { name: "Standard", quantity: currentQty },
            ]);
          }

          if (
            parsed.variants &&
            Array.isArray(parsed.variants) &&
            parsed.variants.length > 0
          ) {
            variants.setProductVariants(
              parsed.variants.map((v: any) => ({
                ram: v.ram || "8 GB",
                storage: v.storage || "128 GB",
                color: v.color || "Standard",
                quantity: Number(v.quantity) || 0,
              })),
            );
          }

          const existingImg = parsed.imageUrl || parsed.image || "";
          media.setImageUrl(existingImg);
          setValue("imageUrl", existingImg);

          if (parsed.images && Array.isArray(parsed.images)) {
            media.setImages(parsed.images);
          } else if (existingImg) {
            media.setImages([existingImg]);
          }
        } catch (e) {
          console.warn("Failed to parse productData from localStorage", e);
        }
      }
    }

    setLoadingCategories(true);
    categoryService
      .fetchCategories(1, 100)
      .then((cats) => {
        setCategories(cats || []);
        if (mode === "update" && targetCatId && !watch("categoryId")) {
          setValue("categoryId", targetCatId);
        }
      })
      .catch((err) => {
        console.warn("Failed to load categories", err);
        setCategories([]);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, [mode, media, setValue, variants, watch]);

  const totalCalculatedQuantity = variants.calculateTotalQuantity(
    categoryHasVariants,
    categoryHasColors,
  );

  const onSubmit = async (data: any) => {
    const finalCategoryId = data.categoryId || selectedCategoryId;
    if (!finalCategoryId) {
      setSubmitError("Please select a valid category from the list.");
      return;
    }

    let validVariants: any[] = [];
    let validColors: any[] = [];

    if (categoryHasVariants) {
      validVariants = variants.productVariants
        .filter(
          (v) =>
            (v.ram?.trim() || v.storage?.trim() || v.color?.trim()) &&
            Number(v.quantity) >= 0,
        )
        .map((v) => ({
          ram: v.ram?.trim() || undefined,
          storage: v.storage?.trim() || undefined,
          color: categoryHasColors ? v.color?.trim() || "Standard" : undefined,
          quantity: Number(v.quantity) || 0,
        }));

      if (validVariants.length === 0) {
        setSubmitError(
          "Please specify at least one product variant (RAM / Storage / Quantity).",
        );
        return;
      }
    } else if (categoryHasColors) {
      validColors = variants.colorVariants
        .filter((c) => c.name.trim().length > 0)
        .map((c) => ({
          name: c.name.trim(),
          quantity: Number(c.quantity) || 0,
        }));

      if (validColors.length === 0) {
        setSubmitError(
          "Please specify at least one color variant with quantity.",
        );
        return;
      }
    } else {
      if (variants.directQuantity < 0) {
        setSubmitError("Stock quantity cannot be negative.");
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (mode === "add") {
        const payload = {
          name: data.name,
          categoryId: finalCategoryId,
          price: parseFloat(data.price),
          discount: parseFloat(data.discount) || 0,
          imageUrl: media.imageUrl || data.imageUrl,
          images: media.images.length > 0 ? media.images : undefined,
          description: data.description,
          specifications: data.specifications,
          warranty: data.warranty,
          colors:
            categoryHasColors && validColors.length > 0
              ? validColors
              : undefined,
          variants:
            categoryHasVariants && validVariants.length > 0
              ? validVariants
              : undefined,
          quantity: totalCalculatedQuantity,
        };

        const response = await productService.createProduct(payload);
        if (response && response.ok) {
          router.push("/home/features/product");
        } else {
          setSubmitError(response?.message || "Failed to add product");
        }
      } else {
        const payload = {
          name: data.name,
          price: String(data.price),
          categoryId: String(finalCategoryId),
          discount: data.discount ? String(data.discount) : "0",
          description: data.description || `${data.name} details`,
          specifications: data.specifications || "",
          warranty: data.warranty || "1 Year Official Brand Warranty",
          quantity: totalCalculatedQuantity,
          quantiy: totalCalculatedQuantity,
          imageUrl: media.imageUrl || data.imageUrl || undefined,
          productColors: validColors,
          variants: validVariants,
        };

        const res = await productService.updateProduct(productId, payload);
        if (res.ok) {
          router.back();
        } else {
          setSubmitError(
            res.message || "Failed to update product. Please try again.",
          );
        }
      }
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          `An error occurred while ${
            mode === "add" ? "creating" : "updating"
          } the product.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    router,
    productId,
    imageUrl: media.imageUrl,
    setImageUrl: media.setImageUrl,
    images: media.images,
    setImages: media.setImages,
    isUploading: media.isUploading,
    uploadError: media.uploadError,
    handleImageChange: media.handleImageChange,
    handleRemoveImage: media.handleRemoveImage,

    colorVariants: variants.colorVariants,
    setColorVariants: variants.setColorVariants,
    directQuantity: variants.directQuantity,
    setDirectQuantity: variants.setDirectQuantity,
    productVariants: variants.productVariants,
    setProductVariants: variants.setProductVariants,
    handleAddColor: variants.handleAddColor,
    handleRemoveColor: variants.handleRemoveColor,
    handleColorChange: variants.handleColorChange,
    handleAddVariant: () => variants.handleAddVariant(categoryHasColors),
    handleAddPresetVariant: (ram: string, storage: string) =>
      variants.handleAddPresetVariant(ram, storage, categoryHasColors),
    handleRemoveVariant: variants.handleRemoveVariant,
    handleVariantChange: variants.handleVariantChange,
    totalCalculatedQuantity,

    isGeneratingAI: ai.isGeneratingAI,
    isAuditing: ai.isAuditing,
    auditResult: ai.auditResult,
    isAuditModalOpen: ai.isAuditModalOpen,
    setIsAuditModalOpen: ai.setIsAuditModalOpen,
    aiSuccessMessage: ai.aiSuccessMessage,
    setAiSuccessMessage: ai.setAiSuccessMessage,
    handleAIGenerate: ai.handleAIGenerate,
    handleAIAudit: ai.handleAIAudit,
    handleApplyAuditSuggestions: ai.handleApplyAuditSuggestions,

    isSubmitting,
    submitError,
    setSubmitError,
    categories,
    loadingCategories,
    selectedCategory,
    categoryHasColors,
    categoryHasVariants,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    errors,
    onSubmit,
  };
}
