"use client";
import React, { useState } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import ToggleButton from "@/components/togglebutton";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { categoryService } from "@/services/category.service";
import { FolderPlus, Check, X, Palette, Sliders } from "lucide-react";
import cn from "classnames";

function addCategory() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hasColors, setHasColors] = useState<boolean>(true);
  const [hasVariants, setHasVariants] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: data.name,
      description: data.description || "",
      hasColors,
      hasVariants,
    };

    const res = await categoryService.createCategory(payload);
    setIsSubmitting(false);

    if (res.ok) {
      router.back();
    } else {
      setSubmitError(
        res.message || "Failed to create category. Please try again.",
      );
    }
  };

  return (
    <BlurredPopupLayout
      title="Add New Category"
      subtitle="Organize your store inventory and define variant capabilities"
      icon={<FolderPlus size={20} />}
      isDark={isDark}
      maxWidth="max-w-lg"
      onClose={() => router.back()}
    >
      {submitError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <X size={14} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form
        id="add-category-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Inputcontainer
          label="Category Name"
          required
          error={errors?.name}
          isDark={isDark}
        >
          <Input
            id="name"
            placeholder="e.g. Flagship Smartphones, Tablets, Audio Accessories"
            {...register("name", { required: "Category name is required" })}
          />
        </Inputcontainer>

        <Inputcontainer
          label="Description (Optional)"
          error={errors?.description}
          isDark={isDark}
        >
          <textarea
            id="description"
            rows={3}
            placeholder="Brief description of this product classification..."
            {...register("description")}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl text-sm transition-all resize-none border focus:outline-none focus:ring-1",
              isDark
                ? "bg-slate-950/60 border-slate-700/60 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/25"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/25",
            )}
          />
        </Inputcontainer>

        {/* Variant & Color Capability Options */}
        <div
          className={cn(
            "p-4 rounded-2xl border space-y-3.5",
            isDark
              ? "bg-slate-950/40 border-slate-800"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              isDark ? "text-cyan-400" : "text-cyan-700",
            )}
          >
            Inventory & Variant Capabilities
          </p>

          {/* Color Variants Toggle */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Palette size={15} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                <span
                  className={cn(
                    "text-xs font-bold",
                    isDark ? "text-white" : "text-slate-900",
                  )}
                >
                  Enable Color Variants
                </span>
              </div>
              <p
                className={cn(
                  "text-[11px] leading-relaxed",
                  isDark ? "text-slate-400" : "text-slate-500",
                )}
              >
                Products in this category come in different colors with separate stock counts (e.g. Mobiles, Smartwatches). Turn off for Cables or Chargers.
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <ToggleButton
                active={hasColors}
                handler={(val) => setHasColors(val)}
                activeLabel="Enabled"
                inactiveLabel="Disabled"
                isDark={isDark}
              />
            </div>
          </div>

          {/* Storage / Spec Variants Toggle */}
          <div className="flex items-start justify-between gap-3 pt-2 border-t border-slate-700/30">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Sliders size={15} className={isDark ? "text-blue-400" : "text-blue-600"} />
                <span
                  className={cn(
                    "text-xs font-bold",
                    isDark ? "text-white" : "text-slate-900",
                  )}
                >
                  Enable Storage / Spec Variants
                </span>
              </div>
              <p
                className={cn(
                  "text-[11px] leading-relaxed",
                  isDark ? "text-slate-400" : "text-slate-500",
                )}
              >
                Allows configuring RAM/Storage tiers (e.g. 8GB/128GB, 12GB/256GB).
              </p>
            </div>
            <div className="shrink-0 pt-0.5">
              <ToggleButton
                active={hasVariants}
                handler={(val) => setHasVariants(val)}
                activeLabel="Enabled"
                inactiveLabel="Disabled"
                isDark={isDark}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-end gap-3 pt-4 border-t",
            isDark ? "border-slate-800/80" : "border-slate-100",
          )}
        >
          <Button
            type="button"
            name="Cancel"
            variant="ghost"
            isDark={isDark}
            handler={() => router.back()}
          />
          <Button
            type="submit"
            name="Create Category"
            variant="primary"
            isDark={isDark}
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={<Check size={16} />}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}

export default addCategory;
