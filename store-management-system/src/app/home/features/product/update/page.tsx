"use client";
import React from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { Edit3 } from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import AiAuditModal from "../components/aiAuditModal";
import {
  ProductBasicInfoSection,
  ProductVariantsSection,
  ProductSpecsSection,
  ProductMediaSection,
  ProductFormHeader,
  ProductFormActions,
  useProductFormLogic,
} from "../components/form";

function UpdateProduct() {
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    router,
    imageUrl,
    setImageUrl,
    images,
    isUploading,
    uploadError,
    isSubmitting,
    submitError,
    isGeneratingAI,
    isAuditing,
    auditResult,
    isAuditModalOpen,
    setIsAuditModalOpen,
    aiSuccessMessage,
    setAiSuccessMessage,
    categories,
    loadingCategories,
    selectedCategory,
    categoryHasColors,
    categoryHasVariants,
    colorVariants,
    handleAddColor,
    handleRemoveColor,
    handleColorChange,
    productVariants,
    handleAddVariant,
    handleAddPresetVariant,
    handleRemoveVariant,
    handleVariantChange,
    directQuantity,
    setDirectQuantity,
    totalCalculatedQuantity,
    handleImageChange,
    handleRemoveImage,
    handleAIGenerate,
    handleAIAudit,
    handleApplyAuditSuggestions,
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    onSubmit,
  } = useProductFormLogic({ mode: "update" });

  return (
    <BlurredPopupLayout
      title="Update Product"
      subtitle="Modify product specifications, variant pricing, and live inventory"
      icon={<Edit3 size={20} />}
      isDark={isDark}
      maxWidth="max-w-3xl"
      onClose={() => router.push("/home/features/product")}
    >
      {/* AI Audit Modal Dialog */}
      {isAuditModalOpen && auditResult && (
        <AiAuditModal
          auditResult={auditResult}
          isDark={isDark}
          productName={getValues("name")}
          currentValues={{
            warranty: getValues("warranty"),
            description: getValues("description"),
            specifications: getValues("specifications"),
          }}
          onClose={() => setIsAuditModalOpen(false)}
          onApply={handleApplyAuditSuggestions}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ProductFormHeader
          aiSuccessMessage={aiSuccessMessage}
          onDismissAiMessage={() => setAiSuccessMessage("")}
          categoryName={selectedCategory?.name}
          hasVariants={categoryHasVariants}
        />

        <ProductBasicInfoSection
          register={register}
          errors={errors}
          isDark={isDark}
          categories={categories}
          loadingCategories={loadingCategories}
          isGeneratingAI={isGeneratingAI}
          isAuditing={isAuditing}
          onAIGenerate={handleAIGenerate}
          onAIAudit={handleAIAudit}
        />

        <ProductVariantsSection
          isDark={isDark}
          categoryHasVariants={categoryHasVariants}
          categoryHasColors={categoryHasColors}
          totalCalculatedQuantity={totalCalculatedQuantity}
          productVariants={productVariants}
          colorVariants={colorVariants}
          directQuantity={directQuantity}
          onAddPresetVariant={handleAddPresetVariant}
          onAddVariant={handleAddVariant}
          onRemoveVariant={handleRemoveVariant}
          onVariantChange={handleVariantChange}
          onAddColor={handleAddColor}
          onRemoveColor={handleRemoveColor}
          onColorChange={handleColorChange}
          onDirectQuantityChange={setDirectQuantity}
        />

        <ProductSpecsSection register={register} isDark={isDark} />

        <ProductMediaSection
          isDark={isDark}
          imageUrl={imageUrl}
          images={images}
          isUploading={isUploading}
          uploadError={uploadError}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onSelectPrimaryImage={(img) => {
            setImageUrl(img);
            setValue("imageUrl", img);
          }}
        />

        <ProductFormActions
          submitLabel="Save Changes"
          submitError={submitError}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
        />
      </form>
    </BlurredPopupLayout>
  );
}

export default UpdateProduct;
