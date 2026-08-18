"use client";
import React from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import Button from "@/components/Button";
import {
  Sparkles,
  Check,
  X,
  Shield,
  FileText,
  Image as ImageIcon,
  Palette,
  AlertCircle,
} from "lucide-react";
import {
  AIAuditResult,
  AIEnrichedProduct,
} from "@/services/aiProvider.service";

interface AiAuditModalProps {
  auditResult: AIAuditResult | null;
  productName: string;
  currentValues: {
    warranty?: string;
    description?: string;
    imageUrl?: string;
    colors?: Array<{ name: string; quantity: number }>;
  };
  onClose: () => void;
  onApply: (suggestions: Partial<AIEnrichedProduct>) => void;
  isDark?: boolean;
}

export default function AiAuditModal({
  auditResult,
  productName,
  currentValues,
  onClose,
  onApply,
  isDark = true,
}: AiAuditModalProps) {
  if (!auditResult || !auditResult.hasSuggestions) return null;

  const { suggestions, reasons, issuesFound } = auditResult;

  return (
    <BlurredPopupLayout
      title="AI Quality Audit & Recommendations"
      subtitle={`AI identified ${issuesFound} recommended improvement${issuesFound > 1 ? "s" : ""} for "${productName}"`}
      icon={<Sparkles size={20} className="text-cyan-400" />}
      isDark={isDark}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Rationale Notice */}
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300">
            <AlertCircle size={15} className="text-cyan-400 shrink-0" />
            <span>AI Review Summary:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pl-1">
            {reasons.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Side-by-side Field Comparisons */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {/* 1. Warranty Audit */}
          {suggestions.warranty && (
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Shield size={14} className="text-cyan-400" />
                <span>Official Warranty</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Current
                  </span>
                  <span className="text-slate-300 font-medium">
                    {currentValues.warranty || "No warranty selected"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <Check size={12} /> AI Recommended
                  </span>
                  <span className="text-emerald-300 font-bold">
                    {suggestions.warranty}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Description Audit */}
          {suggestions.description && (
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <FileText size={14} className="text-cyan-400" />
                <span>Product Description</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Current
                  </span>
                  <span className="text-slate-400 leading-relaxed text-[11px]">
                    {currentValues.description || "Brief / Empty description"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <Check size={12} /> AI Enhanced
                  </span>
                  <span className="text-emerald-200 leading-relaxed text-[11px]">
                    {suggestions.description}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Product Photo Audit */}
          {suggestions.imageUrl && (
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <ImageIcon size={14} className="text-cyan-400" />
                <span>Product Photo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs items-center">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                    {currentValues.imageUrl ? (
                      <img
                        src={currentValues.imageUrl}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Current Photo
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentValues.imageUrl ? "Existing Image" : "None"}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-emerald-500/30">
                    <img
                      src={suggestions.imageUrl}
                      alt="AI Suggested"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> AI Recommended Photo
                    </span>
                    <span className="text-xs text-emerald-300 font-semibold">
                      High-Res Device Mockup
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Colors Audit */}
          {suggestions.colors && suggestions.colors.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Palette size={14} className="text-cyan-400" />
                <span>Color Variants</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 mb-1.5">
                  <Check size={12} /> AI Recommended Official Colorways
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-900 text-emerald-300 border border-emerald-500/30"
                    >
                      {c.name} ({c.quantity})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            name="Keep My Values"
            variant="ghost"
            handler={onClose}
          />
          <Button
            type="button"
            name="Accept & Apply AI Corrections"
            variant="primary"
            icon={<Check size={16} />}
            handler={() => {
              onApply(suggestions);
              onClose();
            }}
          />
        </div>
      </div>
    </BlurredPopupLayout>
  );
}
