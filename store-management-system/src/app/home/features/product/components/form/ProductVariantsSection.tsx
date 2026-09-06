import React from "react";
import Input from "@/components/Input";
import { Sliders, Palette, Package, Plus, Trash2 } from "lucide-react";

export interface ColorVariant {
  name: string;
  quantity: number;
}

export interface ProductVariantItem {
  ram: string;
  storage: string;
  color: string;
  quantity: number;
}

interface ProductVariantsSectionProps {
  isDark?: boolean;
  categoryHasVariants: boolean;
  categoryHasColors: boolean;
  selectedCategory?: any;
  totalCalculatedQuantity: number;
  productVariants: ProductVariantItem[];
  colorVariants: ColorVariant[];
  directQuantity: number;
  onAddPresetVariant: (ram: string, storage: string) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onVariantChange: (
    index: number,
    field: keyof ProductVariantItem,
    value: any,
  ) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onColorChange: (
    index: number,
    field: "name" | "quantity",
    value: any,
  ) => void;
  onDirectQuantityChange: (qty: number) => void;
}

export default function ProductVariantsSection({
  categoryHasVariants,
  categoryHasColors,
  selectedCategory,
  totalCalculatedQuantity,
  productVariants,
  colorVariants,
  directQuantity,
  onAddPresetVariant,
  onAddVariant,
  onRemoveVariant,
  onVariantChange,
  onAddColor,
  onRemoveColor,
  onColorChange,
  onDirectQuantityChange,
}: ProductVariantsSectionProps) {
  if (categoryHasVariants) {
    return (
      <div className="w-full p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Product Variants {categoryHasColors ? "& Colors" : ""} Matrix
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Total Stock: {totalCalculatedQuantity} units
          </span>
        </div>

        {/* Quick Preset Chips */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400">
            Quick-Add RAM / Storage Combinations:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { ram: "6 GB", storage: "128 GB" },
              { ram: "8 GB", storage: "128 GB" },
              { ram: "8 GB", storage: "256 GB" },
              { ram: "12 GB", storage: "256 GB" },
              { ram: "12 GB", storage: "512 GB" },
              { ram: "16 GB", storage: "512 GB" },
              { ram: "16 GB", storage: "1 TB" },
            ].map((tier) => (
              <button
                key={`${tier.ram}-${tier.storage}`}
                type="button"
                onClick={() => onAddPresetVariant(tier.ram, tier.storage)}
                className="px-2 py-0.5 rounded-lg text-xs font-mono bg-slate-950/90 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition cursor-pointer"
              >
                + {tier.ram} | {tier.storage}
              </button>
            ))}
          </div>
        </div>

        {/* Variant Rows Header */}
        <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 px-1">
          <div className="col-span-3">RAM</div>
          <div className="col-span-3">Storage</div>
          {categoryHasColors ? (
            <>
              <div className="col-span-3">Color</div>
              <div className="col-span-2">Quantity</div>
            </>
          ) : (
            <div className="col-span-5">Quantity</div>
          )}
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Variant Rows Repeater */}
        <div className="space-y-2">
          {productVariants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-3">
                <Input
                  placeholder="e.g. 8 GB"
                  value={v.ram}
                  onChange={(e) => onVariantChange(idx, "ram", e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="e.g. 256 GB"
                  value={v.storage}
                  onChange={(e) =>
                    onVariantChange(idx, "storage", e.target.value)
                  }
                />
              </div>
              {categoryHasColors ? (
                <>
                  <div className="col-span-3">
                    <Input
                      placeholder="e.g. Black"
                      value={v.color}
                      onChange={(e) =>
                        onVariantChange(idx, "color", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={v.quantity}
                      onChange={(e) =>
                        onVariantChange(idx, "quantity", e.target.value)
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-5">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={v.quantity}
                    onChange={(e) =>
                      onVariantChange(idx, "quantity", e.target.value)
                    }
                  />
                </div>
              )}
              <div className="col-span-1 flex justify-center">
                {productVariants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveVariant(idx)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    title="Remove variant"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddVariant}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1 transition cursor-pointer"
        >
          <Plus size={14} /> Add Custom Variant Row
        </button>
      </div>
    );
  }

  if (categoryHasColors) {
    return (
      <div className="w-full p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Color Variants & Stock
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Total Stock: {totalCalculatedQuantity} units
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {colorVariants.map((variant, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Color name (e.g. Natural Titanium, Black)"
                  value={variant.name}
                  onChange={(e) => onColorChange(idx, "name", e.target.value)}
                />
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={variant.quantity}
                  onChange={(e) =>
                    onColorChange(idx, "quantity", e.target.value)
                  }
                />
              </div>
              {colorVariants.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveColor(idx)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  title="Remove color variant"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddColor}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1 transition cursor-pointer"
        >
          <Plus size={14} /> Add Another Color Variant
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Total Inventory Stock Units
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Single Stock Mode (No Colors)
        </span>
      </div>
      <p className="text-xs text-slate-400">
        Products in{" "}
        <span className="font-semibold text-cyan-400">
          {selectedCategory?.name || "this category"}
        </span>{" "}
        do not require color variants. Specify the total quantity available in
        inventory:
      </p>
      <div className="max-w-xs pt-1">
        <Input
          type="number"
          min={0}
          placeholder="e.g. 50"
          value={directQuantity}
          onChange={(e) =>
            onDirectQuantityChange(Math.max(0, parseInt(e.target.value) || 0))
          }
        />
      </div>
    </div>
  );
}
