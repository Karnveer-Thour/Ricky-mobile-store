import React from "react";
import Inputcontainer from "@/components/Inputcontainer";
import {
  UploadIcon,
  Loader2,
  X,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import NextImage from "next/image";
import cn from "classnames";

interface ProductMediaSectionProps {
  isDark: boolean;
  imageUrl: string;
  images: string[];
  isUploading: boolean;
  uploadError: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSelectPrimaryImage: (img: string) => void;
}

export default function ProductMediaSection({
  isDark,
  imageUrl,
  images,
  isUploading,
  uploadError,
  onImageChange,
  onRemoveImage,
  onSelectPrimaryImage,
}: ProductMediaSectionProps) {
  return (
    <Inputcontainer label="Product Images & Multi-Angle Photos" isDark={isDark}>
      <div className="w-full p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <input
            type="file"
            id="product-image-upload"
            accept="image/*"
            onChange={onImageChange}
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
              onClick={onRemoveImage}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition cursor-pointer"
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
                  onClick={() => onSelectPrimaryImage(img)}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
                    imageUrl === img
                      ? "border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                      : "border-slate-800 hover:border-slate-600 opacity-70",
                  )}
                >
                  <NextImage
                    src={img}
                    alt={`Angle ${idx + 1}`}
                    width={80}
                    height={80}
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
            <NextImage
              src={imageUrl}
              alt="Product Preview"
              width={112}
              height={112}
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
  );
}
