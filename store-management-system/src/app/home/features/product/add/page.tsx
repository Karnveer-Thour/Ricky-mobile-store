"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import Select from "@/components/select";
import { UploadIcon, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { uploadService, productService, categoryService } from "@/services";

function addProduct() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
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
    } else {
      setUploadError(res.message || "Failed to upload image to Cloudinary");
    }
  };

  const onSubmit = async (data: any) => {
    if (!data.categoryId) {
      setSubmitError("Please select a valid category from the list.");
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
      quantiy: Number(data.quantity) || 10,
    };

    const res = await productService.createProduct(payload);
    setIsSubmitting(false);

    if (res.ok) {
      router.back();
    } else {
      setSubmitError(res.message || "Failed to create product. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <p className="text-2xl font-bold mt-5">Add Product</p>
      {submitError && (
        <p className="text-sm text-red-500 font-semibold mt-2">{submitError}</p>
      )}
      <form id="add-product-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-3">
        <Inputcontainer type={"Name"} error={errors?.name} isDark={isDark}>
          <Input
            id="Name"
            placeholder="Enter product's name"
            {...register("name", { required: true })}
            className={`border-2 ${isDark ? "border-white text-white" : "border-gray-500"} font-bold`}
          />
        </Inputcontainer>
        <Inputcontainer
          type={"Category"}
          error={errors?.categoryId}
          isDark={isDark}
        >
          <Select
            className={`w-full mt-1.5 border-2`}
            isDark={isDark}
            {...register("categoryId", { required: true })}
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : categories.length === 0
                  ? "No categories found — please create one first"
                  : "Select Category"}
            </option>
            {categories.map((category) => (
              <option key={category.id || category._id} value={category.id || category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Inputcontainer>
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

        {/* Cloudinary Image File Upload Picker */}
        <Inputcontainer type={"Product Image (Cloudinary)"} isDark={isDark}>
          <div className="w-full flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="product-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="product-image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer transition"
              >
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <UploadIcon size={18} />}
                {isUploading ? "Uploading to Cloudinary..." : "Choose File & Upload"}
              </label>
              {imageUrl && (
                <span className="text-xs text-green-500 font-semibold truncate max-w-[250px]">
                  Uploaded: {imageUrl}
                </span>
              )}
            </div>

            {uploadError && <p className="text-xs text-red-500 font-medium">{uploadError}</p>}

            {imageUrl && (
              <div className="relative w-24 h-24 mt-2 rounded-md overflow-hidden border-2 border-blue-500">
                <img src={imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </Inputcontainer>
      </form>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={() => router.back()} />
        <Button
          name={isSubmitting ? "Submitting..." : "Submit"}
          handler={handleSubmit(onSubmit)}
          disabled={isSubmitting || categories.length === 0}
        />
      </div>
    </BlurredPopupLayout>
  );
}

export default addProduct;
