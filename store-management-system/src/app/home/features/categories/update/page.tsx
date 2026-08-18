"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { categoryService } from "@/services/category.service";
import { Edit3, Check, X } from "lucide-react";

function updateCategory() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [categoryId, setCategoryId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("categoryData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCategoryId(parsed._id || parsed.id || "");
          setValue("name", parsed.name || "");
          setValue("description", parsed.description || "");
        } catch (e) {
          console.warn("Failed to parse categoryData from localStorage", e);
        }
      }
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    if (!categoryId) {
      setSubmitError("No category ID selected for update.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: data.name,
      description: data.description,
    };

    const res = await categoryService.updateCategory(categoryId, payload);
    setIsSubmitting(false);

    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("categoryData");
      }
      router.back();
    } else {
      setSubmitError(
        res.message || "Failed to update category. Please try again.",
      );
    }
  };

  return (
    <BlurredPopupLayout
      title="Edit Category"
      subtitle="Modify category name and description"
      icon={<Edit3 size={20} />}
      isDark={isDark}
      maxWidth="max-w-lg"
    >
      {submitError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <X size={14} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form
        id="update-category-form"
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
            placeholder="Enter category name"
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
            className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-500 bg-slate-950/60 border border-slate-700/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 transition-all resize-none"
          />
        </Inputcontainer>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <Button
            type="button"
            name="Cancel"
            variant="ghost"
            handler={() => router.back()}
          />
          <Button
            type="submit"
            name="Save Changes"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={<Check size={16} />}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}

export default updateCategory;
