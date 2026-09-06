"use client";
import React, { useState } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import Button from "@/components/Button";
import { Eye, Palette, Edit3 } from "lucide-react";
import cn from "classnames";
import ProductImageGallery from "./viewModal/ProductImageGallery";
import ProductCoreInfoCard from "./viewModal/ProductCoreInfoCard";
import ProductTechSpecsCard from "./viewModal/ProductTechSpecsCard";
import ProductVariantsCard from "./viewModal/ProductVariantsCard";

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
  isDark = false,
}: ProductViewModalProps) {
  const primaryImage = product?.imageUrl || product?.image || "";
  let initialImageList: string[] = [];
  if (Array.isArray(product?.images) && product.images.length > 0) {
    initialImageList = product.images;
  } else if (primaryImage) {
    initialImageList = [primaryImage];
  }

  const [activeImage, setActiveImage] = useState<string>(
    primaryImage || initialImageList[0] || "",
  );

  if (!product) return null;

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const sellingPrice = Math.max(0, price - discount);
  const stock = Number(product.quantity ?? product.stockCount ?? 0);
  const status =
    stock === 0 ? "Out of Stock" : stock <= 3 ? "Low Stock" : "In Stock";

  const colors = product.colors || product.productColors || [];
  const variants = Array.isArray(product.variants) ? product.variants : [];

  let imageList: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    imageList = product.images;
  } else if (primaryImage) {
    imageList = [primaryImage];
  }

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

  const specText = product.specifications || "";
  const specLines = specText
    .split("\n")
    .map((s: string) => s.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  const productName = product.name || product.productName || "Product";

  return (
    <BlurredPopupLayout
      title="Product Inspection & Specifications"
      subtitle={`SKU: ${sku} • Live database record`}
      icon={<Eye size={20} />}
      isDark={isDark}
      maxWidth="max-w-3xl"
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Main Product Card */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 p-3.5 sm:p-4 rounded-2xl border transition-colors",
            isDark
              ? "bg-slate-950/40 border-slate-800/80"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <ProductImageGallery
            imageList={imageList}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            categoryName={categoryName}
            productName={productName}
            isDark={isDark}
          />

          <div className="sm:col-span-7">
            <ProductCoreInfoCard
              sku={sku}
              name={productName}
              price={price}
              discount={discount}
              sellingPrice={sellingPrice}
              stock={stock}
              status={status}
              warranty={product.warranty}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Technical Specifications */}
        <ProductTechSpecsCard specLines={specLines} isDark={isDark} />

        {/* Hardware Variants Breakdown or Color Variants Fallback */}
        {variants.length > 0 ? (
          <ProductVariantsCard variants={variants} isDark={isDark} />
        ) : (
          <div
            className={cn(
              "p-3.5 rounded-2xl border space-y-2",
              isDark
                ? "bg-slate-950/40 border-slate-800"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div className="flex items-center gap-2">
              <Palette
                size={15}
                className={isDark ? "text-cyan-400" : "text-cyan-600"}
              />
              <h4
                className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isDark ? "text-slate-200" : "text-slate-800",
                )}
              >
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
                          : isDark
                            ? "bg-slate-900 text-slate-200 border-slate-700/80"
                            : "bg-white text-slate-800 border-slate-200 shadow-2xs",
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isDark ? "bg-cyan-400" : "bg-cyan-600",
                        )}
                      />
                      <span>{c.name || c.colorName}</span>
                      <span
                        className={cn(
                          "font-mono font-bold",
                          isDark ? "text-cyan-400" : "text-cyan-700",
                        )}
                      >
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
        )}

        {/* Product Overview Description */}
        <div
          className={cn(
            "p-3.5 rounded-2xl border space-y-1.5",
            isDark
              ? "bg-slate-950/40 border-slate-800"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              isDark ? "text-slate-400" : "text-slate-500",
            )}
          >
            Overview & Feature Highlights
          </p>
          <p
            className={cn(
              "text-xs leading-relaxed",
              isDark ? "text-slate-300" : "text-slate-700",
            )}
          >
            {product.description ||
              `${productName} flagship device with high-performance processing and long-lasting battery life.`}
          </p>
        </div>

        {/* Modal Actions */}
        <div
          className={cn(
            "flex items-center justify-between pt-3 border-t",
            isDark ? "border-slate-800/80" : "border-slate-100",
          )}
        >
          <Button
            type="button"
            name="Close"
            variant="ghost"
            isDark={isDark}
            handler={onClose}
          />
          {onEdit && (
            <Button
              type="button"
              name="Edit Product"
              variant="primary"
              isDark={isDark}
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
