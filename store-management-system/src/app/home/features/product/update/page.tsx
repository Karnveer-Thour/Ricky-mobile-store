"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import Select from "@/components/select";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { productService, categoryService } from "@/services";

function updateProduct() {
  const router = useRouter();
  const [productId, setProductId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    setLoadingCategories(true);
    categoryService
      .fetchCategories(1, 100)
      .then((cats) => {
        setCategories(cats || []);
      })
      .catch((err) => {
        console.warn("Failed to load categories:", err);
        setCategories([]);
      })
      .finally(() => {
        setLoadingCategories(false);
      });

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("productData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProductId(parsed._id || parsed.id || "");
          setValue("name", parsed.productName || parsed.name || "");
          setValue("categoryId", parsed.categoryId || parsed.category?.id || parsed.category?._id || parsed.category || "");
          setValue("price", parsed.price || "");
          setValue("discount", parsed.discount || "");
        } catch (e) {
          console.warn("Failed to parse productData from localStorage", e);
        }
      }
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    if (!productId) {
      setSubmitError("No product ID selected for update.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: data.name,
      categoryId: data.categoryId,
      price: String(data.price),
      discount: data.discount ? String(data.discount) : "0",
    };

    const res = await productService.updateProduct(productId, payload);
    setIsSubmitting(false);

    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("productData");
      }
      router.back();
    } else {
      setSubmitError(res.message || "Failed to update product. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Update Product</p>
      {submitError && (
        <p className="text-sm text-red-500 font-semibold mt-2">{submitError}</p>
      )}
      <form id="update-product-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-3">
        <Inputcontainer type={"Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="Name"
            placeholder="Enter product's name"
            {...register("name", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <div className="flex items-center justify-between w-full bg-transparent">
          <Inputcontainer
            type={"Category"}
            error={errors?.categoryId}
            isDark={isDark}
          >
            <Select
              className={`w-full border-2`}
              isDark={isDark}
              {...register("categoryId", { required: true })}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : categories.length === 0
                    ? "No categories available"
                    : "Select Category"}
              </option>
              {categories.map((category) => (
                <option key={category.id || category._id} value={category.id || category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Inputcontainer>
        </div>
        <Inputcontainer type={"Price"} error={errors?.price} isDark={isDark}>
          <Input
            id="Price"
            type="number"
            placeholder="Enter product's price"
            {...register("price", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Discount"}
          error={errors?.discount}
          isDark={isDark}
        >
          <Input
            id="discount"
            type="number"
            placeholder="Enter product's discount"
            {...register("discount")}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button
          name={isSubmitting ? "Updating..." : "Submit"}
          handler={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </div>
    </BlurredPopupLayout>
  );
}

export default updateProduct;
