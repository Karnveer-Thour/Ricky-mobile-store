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
  Layers,
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
  isDark = false,
}: ProductViewModalProps) {
  if (!product) return null;

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const sellingPrice = Math.max(0, price - discount);
  const stock = Number(product.quantity ?? product.stockCount ?? 0);

  const status =
    stock === 0 ? "Out of Stock" : stock <= 3 ? "Low Stock" : "In Stock";

  const colors = product.colors || product.productColors || [];
  const variants = (product.variants && Array.isArray(product.variants)) ? product.variants : [];
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
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Main Product Card */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 rounded-2xl border transition-colors",
            isDark
              ? "bg-slate-950/40 border-slate-800/80"
              : "bg-slate-50 border-slate-200",
          )}
        >
          {/* Multi-Image Gallery */}
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
                <img
                  src={activeImage}
                  alt={product.name || product.productName}
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

            {/* Thumbnail switcher if multiple images available */}
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
              <p
                className={cn(
                  "text-xs font-mono font-bold uppercase tracking-wider",
                  isDark ? "text-cyan-400/80" : "text-cyan-700",
                )}
              >
                {sku}
              </p>
              <h2
                className={cn(
                  "text-xl font-extrabold leading-tight mt-0.5",
                  isDark ? "text-white" : "text-slate-900",
                )}
              >
                {product.name || product.productName}
              </h2>
            </div>

            {/* Financial Summary */}
            <div
              className={cn(
                "grid grid-cols-3 gap-2 p-2.5 rounded-xl border",
                isDark
                  ? "bg-slate-900/70 border-slate-800"
                  : "bg-white border-slate-200 shadow-2xs",
              )}
            >
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  MRP
                </p>
                <p
                  className={cn(
                    "text-xs font-semibold",
                    isDark ? "text-slate-300" : "text-slate-700",
                  )}
                >
                  ₹{price.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p
                  className={cn(
                    "text-[10px] uppercase font-bold",
                    isDark ? "text-emerald-400" : "text-emerald-600",
                  )}
                >
                  Discount
                </p>
                <p
                  className={cn(
                    "text-xs font-semibold",
                    isDark ? "text-emerald-400" : "text-emerald-600",
                  )}
                >
                  -₹{discount.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p
                  className={cn(
                    "text-[10px] uppercase font-bold",
                    isDark ? "text-cyan-400" : "text-cyan-700",
                  )}
                >
                  Net Selling
                </p>
                <p
                  className={cn(
                    "text-sm font-extrabold",
                    isDark ? "text-cyan-300" : "text-cyan-700",
                  )}
                >
                  ₹{sellingPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Stock Level & Status */}
            <div
              className={cn(
                "flex items-center justify-between p-2.5 rounded-xl border",
                isDark
                  ? "bg-slate-900/50 border-slate-800"
                  : "bg-white border-slate-200 shadow-2xs",
              )}
            >
              <div className="flex items-center gap-2">
                <Package size={16} className="text-slate-400" />
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      isDark ? "text-white" : "text-slate-900",
                    )}
                  >
                    {stock} Units in Inventory
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                  status === "In Stock"
                    ? isDark
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : status === "Low Stock"
                      ? isDark
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                      : isDark
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-rose-50 text-rose-700 border-rose-200",
                )}
              >
                {status}
              </span>
            </div>

            {/* Warranty */}
            <div
              className={cn(
                "flex items-center gap-2 text-xs p-2.5 rounded-xl border",
                isDark
                  ? "bg-slate-900/50 border-slate-800 text-slate-300"
                  : "bg-white border-slate-200 text-slate-700 shadow-2xs",
              )}
            >
              <Shield
                size={16}
                className={cn(
                  "shrink-0",
                  isDark ? "text-cyan-400" : "text-cyan-600",
                )}
              />
              <span>
                {product.warranty || "1 Year Official Brand Warranty"}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Specifications Sheet */}
        <div
          className={cn(
            "p-4 rounded-2xl border space-y-3",
            isDark
              ? "bg-slate-950/40 border-slate-800"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <div className="flex items-center gap-2">
            <Cpu
              size={16}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
            <h4
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isDark ? "text-slate-200" : "text-slate-800",
              )}
            >
              Key Technical Specifications
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
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col justify-center",
                      isDark
                        ? "bg-slate-900/60 border-slate-800"
                        : "bg-white border-slate-200 shadow-2xs",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wide",
                        isDark ? "text-cyan-400/90" : "text-cyan-700",
                      )}
                    >
                      {title}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium mt-0.5 leading-snug",
                        isDark ? "text-slate-200" : "text-slate-800",
                      )}
                    >
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

        {/* Structured Hardware Variants Breakdown */}
        {variants.length > 0 ? (
          <div
            className={cn(
              "p-3.5 rounded-2xl border space-y-2.5",
              isDark
                ? "bg-slate-950/40 border-slate-800"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers
                  size={15}
                  className={isDark ? "text-cyan-400" : "text-cyan-600"}
                />
                <h4
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isDark ? "text-slate-200" : "text-slate-800",
                  )}
                >
                  Hardware Variants (RAM / Storage / Color)
                </h4>
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-md",
                  isDark
                    ? "bg-slate-900 text-cyan-400 border border-slate-800"
                    : "bg-cyan-50 text-cyan-700 border border-cyan-100",
                )}
              >
                {variants.length} Config{variants.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider border-b",
                      isDark
                        ? "bg-slate-900/80 border-slate-800 text-slate-400"
                        : "bg-slate-100/70 border-slate-200 text-slate-600",
                    )}
                  >
                    <th className="py-2 px-3">RAM</th>
                    <th className="py-2 px-3">Storage</th>
                    <th className="py-2 px-3">Color</th>
                    <th className="py-2 px-3 text-right">Stock Qty</th>
                  </tr>
                </thead>
                <tbody
                  className={cn(
                    "divide-y text-xs",
                    isDark
                      ? "divide-slate-800/60 bg-slate-900/30"
                      : "divide-slate-200/70 bg-white",
                  )}
                >
                  {variants.map((v: any, idx: number) => {
                    const vQty = Number(v.quantity) || 0;
                    return (
                      <tr
                        key={idx}
                        className={cn(
                          "transition-colors",
                          vQty === 0 && "opacity-60",
                          isDark
                            ? "hover:bg-slate-800/30"
                            : "hover:bg-slate-50/80",
                        )}
                      >
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {v.ram || "—"}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {v.storage || "—"}
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            {v.color || "Standard"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span
                            className={cn(
                              "font-mono font-bold px-2 py-0.5 rounded-md text-[11px]",
                              vQty === 0
                                ? "bg-rose-500/10 text-rose-400"
                                : isDark
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-emerald-50 text-emerald-700",
                            )}
                          >
                            {vQty} {vQty === 1 ? "unit" : "units"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Color Variants Breakdown Fallback */
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
              `${product.name || product.productName} flagship device with high-performance processing and long-lasting battery life.`}
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
