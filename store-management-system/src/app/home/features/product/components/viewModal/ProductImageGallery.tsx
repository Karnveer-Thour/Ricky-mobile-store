"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import cn from "classnames";

interface ProductImageGalleryProps {
  imageList: string[];
  activeImage: string;
  setActiveImage: (url: string) => void;
  categoryName: string;
  productName: string;
  isDark?: boolean;
}

export default function ProductImageGallery({
  imageList,
  activeImage,
  setActiveImage,
  categoryName,
  productName,
  isDark = false,
}: ProductImageGalleryProps) {
  return (
    <div className="sm:col-span-5 flex flex-col items-center gap-3">
      <div
        className={cn(
          "relative w-full aspect-square max-w-[240px] rounded-2xl overflow-hidden border shadow-sm group transition-colors",
          isDark
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white",
        )}
      >
        {activeImage ? (
          <NextImage
            src={activeImage}
            alt={productName}
            width={240}
            height={240}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <ImageIcon size={32} />
            <span className="text-xs">No image uploaded</span>
          </div>
        )}
        <span
          className={cn(
            "absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border backdrop-blur-md",
            isDark
              ? "bg-slate-900/80 text-cyan-400 border-cyan-500/20"
              : "bg-white/90 text-cyan-700 border-cyan-200 shadow-xs",
          )}
        >
          {categoryName}
        </span>
      </div>

      {imageList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto max-w-[240px] pb-1">
          {imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(imgUrl)}
              className={cn(
                "w-11 h-11 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer",
                activeImage === imgUrl
                  ? "border-cyan-500 shadow-sm scale-105"
                  : isDark
                    ? "border-slate-800 hover:border-slate-700 opacity-70"
                    : "border-slate-200 hover:border-slate-300 opacity-70",
              )}
            >
              <NextImage
                src={imgUrl}
                alt={`Angle ${idx + 1}`}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
