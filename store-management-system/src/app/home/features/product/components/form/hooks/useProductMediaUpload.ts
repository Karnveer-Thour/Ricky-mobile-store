import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { uploadService } from "@/services";

export function useProductMediaUpload(setValue: UseFormSetValue<any>) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

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

  return {
    imageUrl,
    setImageUrl,
    images,
    setImages,
    isUploading,
    uploadError,
    handleImageChange,
    handleRemoveImage,
  };
}
