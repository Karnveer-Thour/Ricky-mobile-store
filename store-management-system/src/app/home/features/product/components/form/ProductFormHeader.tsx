import React from "react";
import { Sparkles, X, Info } from "lucide-react";

interface ProductFormHeaderProps {
  aiSuccessMessage: string;
  onDismissAiMessage: () => void;
  categoryName?: string;
  hasVariants?: boolean;
}

export default function ProductFormHeader({
  aiSuccessMessage,
  onDismissAiMessage,
  categoryName,
  hasVariants,
}: ProductFormHeaderProps) {
  if (!aiSuccessMessage && !categoryName) return null;

  return (
    <div className="space-y-3 mb-2">
      {categoryName && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Info size={14} className="text-[#00cfff]" />
            <span>
              Category: <strong className="text-white">{categoryName}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {hasVariants
              ? "⚡ Multi-Spec Variant Matrix Enabled"
              : "📦 Standard Single SKU"}
          </span>
        </div>
      )}

      {aiSuccessMessage && (
        <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <span>{aiSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={onDismissAiMessage}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss AI notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
