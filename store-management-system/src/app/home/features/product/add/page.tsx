"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import Select from "@/components/select";
import {
  UploadIcon,
  Loader2,
  X,
  Image as ImageIcon,
  PackagePlus,
  Check,
  Plus,
  Trash2,
  Palette,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { uploadService, productService, categoryService } from "@/services";
import {
  aiProviderService,
  AIAuditResult,
  AIEnrichedProduct,
} from "@/services/aiProvider.service";
import AiAuditModal from "../components/aiAuditModal";
import cn from "classnames";

interface ColorVariant {
  name: string;
  quantity: number;
}

const STANDARD_WARRANTY_OPTIONS = [
  "1 Year Official Apple Brand Warranty",
  "1 Year Official Brand Warranty",
  "2 Years Extended Brand Warranty",
  "1 Year Samsung Care+ Brand Warranty",
  "6 Months Official Brand Warranty",
  "6 Months Official Accessories Warranty",
  "No Warranty / As-Is",
];

function addProduct() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AIAuditResult | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  // Multi-Color Variants State
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    { name: "Default", quantity: 20 },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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

  useEffect(() => {
    setLoadingCategories(true);
    categoryService
      .fetchCategories(1, 100)
      .then((cats) => {
        setCategories(cats || []);
      })
      .catch((err) => {
        console.warn("Failed to load categories", err);
        setCategories([]);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const res = await uploadService.uploadImage(file, "products");
    setIsUploading(false);

    if (res.status && res.url) {
      setImageUrl(res.url);
      setValue("imageUrl", res.url);
      setImages((prev) =>
        prev.includes(res.url!) ? prev : [res.url!, ...prev],
      );
    } else {
      setUploadError(res.message || "Failed to upload image to Cloudinary");
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setValue("imageUrl", "");
    setImages([]);
  };

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

  const totalCalculatedQuantity = colorVariants.reduce(
    (acc, curr) => acc + (Number(curr.quantity) || 0),
    0,
  );

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
      const selectedCatId = getValues("categoryId");
      const matchedCat = categories.find(
        (c) => (c.id || c._id) === selectedCatId,
      );
      const currentPrice = parseFloat(getValues("price")) || undefined;

      const aiResult = await aiProviderService.generateProductDetails(
        currentName,
        matchedCat?.name,
        currentPrice,
      );

      if (aiResult.description) {
        setValue("description", aiResult.description);
      }
      if (aiResult.specifications) {
        setValue("specifications", aiResult.specifications);
      }
      if (aiResult.warranty) {
        setValue("warranty", aiResult.warranty);
      }
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
        `✨ AI populated Flipkart-style specs, multi-angle photos, warranty & colors!`,
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
      const selectedCatId = getValues("categoryId");
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
    if (suggestions.warranty) {
      setValue("warranty", suggestions.warranty);
    }
    if (suggestions.specifications) {
      setValue("specifications", suggestions.specifications);
    }
    if (suggestions.description) {
      setValue("description", suggestions.description);
    }
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

  const onSubmit = async (data: any) => {
    if (!data.categoryId) {
      setSubmitError("Please select a valid category from the list.");
      return;
    }

    const validColors = colorVariants
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

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: data.name,
      price: String(data.price),
      categoryId: String(data.categoryId),
      discount: data.discount ? String(data.discount) : "0",
      description: data.description || `${data.name} details`,
      specifications: data.specifications || "",
      warranty: data.warranty || "1 Year Official Brand Warranty",
      quantity: totalCalculatedQuantity,
      quantiy: totalCalculatedQuantity,
      imageUrl: imageUrl || data.imageUrl || undefined,
      productColors: validColors,
    };

    const res = await productService.createProduct(payload);
    setIsSubmitting(false);

    if (res.ok) {
      router.back();
    } else {
      setSubmitError(
        res.message || "Failed to create product. Please try again.",
      );
    }
  };

  return (
    <BlurredPopupLayout
      title="Add New Product"
      subtitle="Fill in Flipkart-style specifications, official warranty, multi-angle images, and colors"
      icon={<PackagePlus size={20} />}
      isDark={isDark}
      maxWidth="max-w-3xl"
    >
      {/* AI Audit Modal Dialog */}
      {isAuditModalOpen && auditResult && (
        <AiAuditModal
          auditResult={auditResult}
          productName={getValues("name")}
          currentValues={{
            warranty: getValues("warranty"),
            description: getValues("description"),
            imageUrl: imageUrl || getValues("imageUrl"),
            colors: colorVariants,
          }}
          onClose={() => setIsAuditModalOpen(false)}
          onApply={handleApplyAuditSuggestions}
          isDark={isDark}
        />
      )}

      {submitError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <X size={14} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {aiSuccessMessage && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2">
          <Sparkles size={15} className="text-cyan-400 shrink-0" />
          <span>{aiSuccessMessage}</span>
        </div>
      )}

      <form
        id="add-product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-[75vh] overflow-y-auto pr-1"
      >
        {/* Product Name with AI Generator & Audit Actions */}
        <Inputcontainer
          label="Product Name"
          required
          error={errors?.name}
          isDark={isDark}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                id="name"
                placeholder="e.g. iPhone 15 Pro Max, Samsung Galaxy S24 Ultra"
                {...register("name", { required: "Product name is required" })}
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGeneratingAI}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
                title="Auto-fill Flipkart specs, warranty, images, and colors"
              >
                {isGeneratingAI ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
                <span>{isGeneratingAI ? "Generating..." : "AI Auto-Fill"}</span>
              </button>

              <button
                type="button"
                onClick={handleAIAudit}
                disabled={isAuditing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                title="Audit accuracy of specs, warranty, description, and photos"
              >
                {isAuditing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ShieldCheck size={13} />
                )}
                <span>{isAuditing ? "Auditing..." : "AI Audit"}</span>
              </button>
            </div>
          </div>
        </Inputcontainer>

        <Inputcontainer
          label="Category"
          required
          error={errors?.categoryId}
          isDark={isDark}
        >
          <Select
            isDark={isDark}
            {...register("categoryId", {
              required: "Please select a category",
            })}
          >
            <option value="" className="bg-slate-900 text-gray-400">
              {loadingCategories
                ? "Loading categories..."
                : categories.length === 0
                  ? "No categories found — please create one first"
                  : "Select Category"}
            </option>
            {categories.map((category) => (
              <option
                key={category.id || category._id}
                value={category.id || category._id}
                className="bg-slate-900 text-white py-2"
              >
                {category.name}
              </option>
            ))}
          </Select>
        </Inputcontainer>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Inputcontainer
            label="Price (₹)"
            required
            error={errors?.price}
            isDark={isDark}
          >
            <Input
              id="price"
              type="number"
              placeholder="e.g. 24999"
              {...register("price", { required: "Price is required" })}
            />
          </Inputcontainer>

          <Inputcontainer
            label="Discount (₹)"
            error={errors?.discount}
            isDark={isDark}
          >
            <Input
              id="discount"
              type="number"
              placeholder="e.g. 1000"
              {...register("discount")}
            />
          </Inputcontainer>
        </div>

        {/* Color Variants & Per-Color Stock Repeater */}
        <div className="w-full p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Color Variants & Stock
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Total Stock: {totalCalculatedQuantity} units
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {colorVariants.map((variant, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Color name (e.g. Natural Titanium, Black)"
                    value={variant.name}
                    onChange={(e) =>
                      handleColorChange(idx, "name", e.target.value)
                    }
                  />
                </div>
                <div className="w-28">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={variant.quantity}
                    onChange={(e) =>
                      handleColorChange(idx, "quantity", e.target.value)
                    }
                  />
                </div>
                {colorVariants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Remove color variant"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddColor}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1 transition cursor-pointer"
          >
            <Plus size={14} /> Add Another Color Variant
          </button>
        </div>

        {/* Official Warranty Dropdown */}
        <Inputcontainer label="Official Warranty" isDark={isDark}>
          <Select isDark={isDark} {...register("warranty")}>
            {STANDARD_WARRANTY_OPTIONS.map((w) => (
              <option
                key={w}
                value={w}
                className="bg-slate-900 text-white py-2"
              >
                {w}
              </option>
            ))}
          </Select>
        </Inputcontainer>

        {/* Flipkart / Amazon-Style Detailed Specifications */}
        <Inputcontainer
          label="Technical Specifications (Flipkart / Amazon Standard)"
          isDark={isDark}
        >
          <textarea
            id="specifications"
            rows={5}
            placeholder="• RAM & Storage: 8 GB RAM | 256 GB ROM&#10;• Processor: Snapdragon 8 Gen 3&#10;• Display: 6.67 inch 120Hz AMOLED&#10;• Rear Camera: 200MP + 8MP + 2MP&#10;• Front Camera: 16MP&#10;• Battery: 5000 mAh with 67W Turbo Charge&#10;• In The Box: Handset, Charger, Cable, Case"
            {...register("specifications")}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-500 bg-slate-950/60 border border-slate-700/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 transition-all leading-relaxed"
          />
        </Inputcontainer>

        <Inputcontainer label="Product Overview Description" isDark={isDark}>
          <textarea
            id="description"
            rows={3}
            placeholder="Product technical overview, camera details, and highlights..."
            {...register("description")}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-500 bg-slate-950/60 border border-slate-700/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 transition-all resize-none"
          />
        </Inputcontainer>

        {/* Multi-Image Gallery & Cloudinary Uploader */}
        <Inputcontainer
          label="Product Images & Multi-Angle Photos"
          isDark={isDark}
        >
          <div className="w-full p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <input
                type="file"
                id="product-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="product-image-upload"
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition shadow-md shadow-cyan-500/20"
              >
                {isUploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UploadIcon size={16} />
                )}
                {isUploading
                  ? "Uploading..."
                  : imageUrl
                    ? "Upload Another Angle"
                    : "Upload Product Image"}
              </label>

              {imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition"
                >
                  <X size={14} /> Clear All Photos
                </button>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 font-medium">{uploadError}</p>
            )}

            {/* Gallery Thumbnails */}
            {images.length > 0 ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Angle Gallery ({images.length} Photos):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImageUrl(img);
                        setValue("imageUrl", img);
                      }}
                      className={cn(
                        "relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                        imageUrl === img
                          ? "border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                          : "border-slate-800 hover:border-slate-600 opacity-70",
                      )}
                    >
                      <img
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {imageUrl === img && (
                        <span className="absolute bottom-0 inset-x-0 bg-cyan-500 text-slate-950 font-bold text-[9px] text-center py-0.5">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-lg bg-slate-900">
                <img
                  src={imageUrl}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <ImageIcon size={14} /> No images generated or uploaded yet
              </div>
            )}
          </div>
        </Inputcontainer>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <Button
            type="button"
            name="Cancel"
            variant="ghost"
            handler={() => router.back()}
          />
          <Button
            type="submit"
            name="Create Product"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting || categories.length === 0}
            icon={<Check size={16} />}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}

export default addProduct;
