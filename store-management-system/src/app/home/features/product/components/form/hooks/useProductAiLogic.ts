import { useState } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import {
  aiProviderService,
  AIAuditResult,
  AIEnrichedProduct,
} from "@/services/aiProvider.service";
import { ColorVariant } from "../ProductVariantsSection";

interface UseProductAiLogicProps {
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  categories: any[];
  selectedCategoryId: string;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setImages: (images: string[] | ((prev: string[]) => string[])) => void;
  colorVariants: ColorVariant[];
  setColorVariants: (colors: ColorVariant[]) => void;
  setSubmitError: (err: string) => void;
}

export function useProductAiLogic({
  getValues,
  setValue,
  categories,
  selectedCategoryId,
  imageUrl,
  setImageUrl,
  setImages,
  colorVariants,
  setColorVariants,
  setSubmitError,
}: UseProductAiLogicProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AIAuditResult | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>("");

  const handleAIGenerate = async () => {
    const currentName = getValues("name");
    if (!currentName || currentName.trim().length === 0) {
      setSubmitError(
        "Please enter a Product Name first to auto-generate details.",
      );
      return;
    }

    setIsGeneratingAI(true);
    setSubmitError("");
    setAiSuccessMessage("");

    try {
      const selectedCatId = getValues("categoryId") || selectedCategoryId;
      const matchedCat = categories.find(
        (c) => (c.id || c._id) === selectedCatId,
      );
      const currentPrice = parseFloat(getValues("price")) || undefined;

      const aiResult = await aiProviderService.generateProductDetails(
        currentName,
        matchedCat?.name,
        currentPrice,
      );

      if (aiResult.description) setValue("description", aiResult.description);
      if (aiResult.specifications)
        setValue("specifications", aiResult.specifications);
      if (aiResult.warranty) setValue("warranty", aiResult.warranty);
      if (aiResult.imageUrl) {
        setImageUrl(aiResult.imageUrl);
        setValue("imageUrl", aiResult.imageUrl);
      }
      if (aiResult.images && aiResult.images.length > 0) {
        setImages(aiResult.images);
      }
      if (aiResult.colors && aiResult.colors.length > 0) {
        setColorVariants(aiResult.colors);
      }

      setAiSuccessMessage(
        "✨ AI populated Flipkart-style specs, multi-angle photos, warranty & colors!",
      );
    } catch (e: any) {
      console.warn("AI generation error:", e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAIAudit = async () => {
    const currentName = getValues("name");
    if (!currentName || currentName.trim().length === 0) {
      setSubmitError(
        "Please enter a Product Name first to run AI Quality Audit.",
      );
      return;
    }

    setIsAuditing(true);
    setSubmitError("");
    setAiSuccessMessage("");

    try {
      const selectedCatId = getValues("categoryId") || selectedCategoryId;
      const matchedCat = categories.find(
        (c) => (c.id || c._id) === selectedCatId,
      );
      const currentPrice = parseFloat(getValues("price")) || undefined;

      const result = await aiProviderService.auditProductDetails({
        name: currentName,
        category: matchedCat?.name,
        price: currentPrice,
        description: getValues("description"),
        specifications: getValues("specifications"),
        warranty: getValues("warranty"),
        imageUrl: imageUrl || getValues("imageUrl"),
        colors: colorVariants,
      });

      setAuditResult(result);
      if (result.hasSuggestions) {
        setIsAuditModalOpen(true);
      } else {
        setAiSuccessMessage(
          "✨ AI Audit Verified: All product specifications & warranty look 100% accurate!",
        );
      }
    } catch (e: any) {
      console.warn("AI audit error:", e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyAuditSuggestions = (
    suggestions: Partial<AIEnrichedProduct>,
  ) => {
    if (suggestions.warranty) setValue("warranty", suggestions.warranty);
    if (suggestions.specifications)
      setValue("specifications", suggestions.specifications);
    if (suggestions.description)
      setValue("description", suggestions.description);
    if (suggestions.imageUrl) {
      setImageUrl(suggestions.imageUrl);
      setValue("imageUrl", suggestions.imageUrl);
    }
    if (suggestions.images && suggestions.images.length > 0) {
      setImages(suggestions.images);
    }
    if (suggestions.colors && suggestions.colors.length > 0) {
      setColorVariants(suggestions.colors);
    }
    setAiSuccessMessage("✨ Successfully applied AI recommended corrections!");
  };

  return {
    isGeneratingAI,
    isAuditing,
    auditResult,
    isAuditModalOpen,
    setIsAuditModalOpen,
    aiSuccessMessage,
    setAiSuccessMessage,
    handleAIGenerate,
    handleAIAudit,
    handleApplyAuditSuggestions,
  };
}
