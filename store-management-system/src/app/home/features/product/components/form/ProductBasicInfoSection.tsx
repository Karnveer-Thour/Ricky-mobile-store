import React from "react";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import Select from "@/components/select";
import { Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ProductBasicInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isDark: boolean;
  categories: any[];
  loadingCategories: boolean;
  isGeneratingAI: boolean;
  isAuditing: boolean;
  onAIGenerate: () => void;
  onAIAudit: () => void;
}

export default function ProductBasicInfoSection({
  register,
  errors,
  isDark,
  categories,
  loadingCategories,
  isGeneratingAI,
  isAuditing,
  onAIGenerate,
  onAIAudit,
}: ProductBasicInfoSectionProps) {
  return (
    <div className="space-y-4">
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
              onClick={onAIGenerate}
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
              onClick={onAIAudit}
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
    </div>
  );
}
