"use client";
import React, { useState } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import Button from "@/components/Button";
import {
  Eye,
  Shield,
  Palette,
  Package,
  Edit3,
  Cpu,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import cn from "classnames";

interface ProductViewModalProps {
  product: any | null;
  onClose: () => void;
  onEdit?: (product: any) => void;
  isDark?: boolean;
}

export default function ProductViewModal({
  product,
  onClose,
  onEdit,
  isDark = true,
}: ProductViewModalProps) {
  if (!product) return null;

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const sellingPrice = Math.max(0, price - discount);
  const stock = Number(product.quantity ?? product.stockCount ?? 0);

  const status =
    stock === 0 ? "Out of Stock" : stock <= 3 ? "Low Stock" : "In Stock";

  const colors = product.colors || product.productColors || [];
  const primaryImage = product.imageUrl || product.image || "";

  // Multi-image list extraction
  let imageList: string[] = [];
  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    imageList = product.images;
  } else if (primaryImage) {
    imageList = [primaryImage];
  }

  const [activeImage, setActiveImage] = useState<string>(
    primaryImage || imageList[0] || "",
  );

  const categoryName =
    product.category?.name ||
    product.categoryName ||
    (typeof product.category === "string" ? product.category : "") ||
    "Smartphones";

  const sku =
    product.sku ||
    `RMS-${(product.name || product.productName || "PROD").slice(0, 3).toUpperCase()}-${String(
      product.id || "001",
    ).slice(-3)}`;

  // Parse specifications bullet points
  const specText = product.specifications || "";
  const specLines = specText
    .split("\n")
    .map((s: string) => s.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  return (
    <BlurredPopupLayout
      title="Product Inspection & Specifications"
      subtitle={`SKU: ${sku} • Live database record`}
      icon={<Eye size={20} />}
      isDark={isDark}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Main Product Card */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
          {/* Multi-Image Gallery */}
          <div className="sm:col-span-5 flex flex-col items-center gap-3">
            <div className="relative w-full aspect-square max-w-[240px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name || product.productName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <ImageIcon size={32} />
                  <span className="text-xs">No image uploaded</span>
                </div>
              )}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
                {categoryName}
              </span>
            </div>

            {/* Thumbnail switcher if multiple images available */}
            {imageList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-[240px] pb-1">
                {imageList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={cn(
                      "w-11 h-11 rounded-xl overflow-hidden border-2 transition shrink-0",
                      activeImage === imgUrl
                        ? "border-cyan-400 shadow-md shadow-cyan-400/20 scale-105"
                        : "border-slate-800 hover:border-slate-700 opacity-70",
                    )}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="sm:col-span-7 space-y-3">
            <div>
              <p className="text-xs font-mono text-cyan-400/80 font-bold uppercase tracking-wider">
                {sku}
              </p>
              <h2 className="text-xl font-extrabold text-white leading-tight mt-0.5">
                {product.name || product.productName}
              </h2>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  MRP
                </p>
                <p className="text-xs font-semibold text-slate-300">
                  ₹{price.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-400">
                  Discount
                </p>
                <p className="text-xs font-semibold text-emerald-400">
                  -₹{discount.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-cyan-400">
                  Net Selling
                </p>
                <p className="text-sm font-extrabold text-cyan-300">
                  ₹{sellingPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Stock Level & Status */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {stock} Units in Inventory
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                  status === "In Stock"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : status === "Low Stock"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20",
                )}
              >
                {status}
              </span>
            </div>

            {/* Warranty */}
            <div className="flex items-center gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <Shield size={16} className="text-cyan-400 shrink-0" />
              <span>
                {product.warranty || "1 Year Official Brand Warranty"}
              </span>
            </div>
          </div>
        </div>

        {/* Flipkart-Style Detailed Specifications Sheet */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Key Technical Specifications (Flipkart / Amazon Standard)
            </h4>
          </div>

          {specLines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {specLines.map((line: string, idx: number) => {
                const parts = line.split(":");
                const title = parts[0]?.trim();
                const value = parts.slice(1).join(":").trim();

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center"
                  >
                    <span className="text-[10px] uppercase font-bold text-cyan-400/90 tracking-wide">
                      {title}
                    </span>
                    <span className="text-xs text-slate-200 font-medium mt-0.5 leading-snug">
                      {value || title}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Standard hardware specifications not loaded yet.
            </p>
          )}
        </div>

        {/* Color Variants Breakdown */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Color Variants & Quantities
            </h4>
          </div>
          {colors.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {colors.map((c: any, idx: number) => {
                const cQty = Number(c.quantity) || 0;
                return (
                  <span
                    key={idx}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-xl font-medium border flex items-center gap-1.5",
                      cQty === 0
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20 line-through opacity-70"
                        : "bg-slate-900 text-slate-200 border-slate-700/80",
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{c.name || c.colorName}</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      ({cQty})
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Default standard variant ({stock} units)
            </p>
          )}
        </div>

        {/* Product Overview Description */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overview & Feature Highlights
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {product.description ||
              `${product.name || product.productName} flagship device with high-performance processing and long-lasting battery life.`}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            name="Close"
            variant="ghost"
            handler={onClose}
          />
          {onEdit && (
            <Button
              type="button"
              name="Edit Product"
              variant="primary"
              icon={<Edit3 size={15} />}
              handler={() => {
                onClose();
                onEdit(product);
              }}
            />
          )}
        </div>
      </div>
    </BlurredPopupLayout>
  );
}
