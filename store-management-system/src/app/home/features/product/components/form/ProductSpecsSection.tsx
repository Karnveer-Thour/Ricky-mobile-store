import React from "react";
import Inputcontainer from "@/components/Inputcontainer";
import Select from "@/components/select";
import { UseFormRegister } from "react-hook-form";

export const STANDARD_WARRANTY_OPTIONS = [
  "1 Year Official Apple Brand Warranty",
  "1 Year Official Brand Warranty",
  "2 Years Extended Brand Warranty",
  "1 Year Samsung Care+ Brand Warranty",
  "6 Months Official Brand Warranty",
  "6 Months Official Accessories Warranty",
  "No Warranty / As-Is",
];

interface ProductSpecsSectionProps {
  register: UseFormRegister<any>;
  isDark: boolean;
}

export default function ProductSpecsSection({
  register,
  isDark,
}: ProductSpecsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Official Warranty Dropdown */}
      <Inputcontainer label="Official Warranty" isDark={isDark}>
        <Select isDark={isDark} {...register("warranty")}>
          {STANDARD_WARRANTY_OPTIONS.map((w) => (
            <option key={w} value={w} className="bg-slate-900 text-white py-2">
              {w}
            </option>
          ))}
        </Select>
      </Inputcontainer>

      {/* Flipkart / Amazon-Style Detailed Specifications */}
      <Inputcontainer
        label="Technical Specifications (Flipkart / Amazon Standard)"
        isDark={isDark}
      >
        <textarea
          id="specifications"
          rows={5}
          placeholder="• RAM & Storage: 8 GB RAM | 256 GB ROM&#10;• Processor: Snapdragon 8 Gen 3&#10;• Display: 6.67 inch 120Hz AMOLED&#10;• Rear Camera: 200MP + 8MP + 2MP&#10;• Front Camera: 16MP&#10;• Battery: 5000 mAh with 67W Turbo Charge&#10;• In The Box: Handset, Charger, Cable, Case"
          {...register("specifications")}
          className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-500 bg-slate-950/60 border border-slate-700/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 transition-all leading-relaxed"
        />
      </Inputcontainer>

      <Inputcontainer label="Product Overview Description" isDark={isDark}>
        <textarea
          id="description"
          rows={3}
          placeholder="Product technical overview, camera details, and highlights..."
          {...register("description")}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-500 bg-slate-950/60 border border-slate-700/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 transition-all resize-none"
        />
      </Inputcontainer>
    </div>
  );
}
