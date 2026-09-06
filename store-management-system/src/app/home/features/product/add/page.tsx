"use client";
import React from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { PackagePlus } from "lucide-react";
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

function AddProduct() {
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
  } = useProductFormLogic({ mode: "add" });

  return (
    <BlurredPopupLayout
      title="Add New Product"
      subtitle="Configure basic information, multi-color stock variants, and Cloudinary gallery"
      icon={<PackagePlus className="w-6 h-6 text-white" />}
      isDark={isDark}
      maxWidth="max-w-5xl"
      onClose={() => router.push("/home/features/product")}
    >
      {/* AI Discrepancy & Catalog Health Modal */}
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
          submitLabel="Create Product"
          submitError={submitError}
          isSubmitting={isSubmitting}
          disabled={categories.length === 0}
          onCancel={() => router.push("/home/features/product")}
        />
      </form>
    </BlurredPopupLayout>
  );
}

export default AddProduct;
