import React from "react";
import Button from "@/components/Button";
import { Check, X } from "lucide-react";

interface ProductFormActionsProps {
  submitLabel: string;
  submitError?: string;
  isSubmitting: boolean;
  disabled?: boolean;
  onCancel: () => void;
}

export default function ProductFormActions({
  submitLabel,
  submitError,
  isSubmitting,
  disabled,
  onCancel,
}: ProductFormActionsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-800/80">
      {submitError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
          <X size={14} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          name="Cancel"
          variant="ghost"
          handler={onCancel}
        />
        <Button
          type="submit"
          name={submitLabel}
          variant="primary"
          loading={isSubmitting}
          disabled={disabled || isSubmitting}
          icon={<Check size={16} />}
        />
      </div>
    </div>
  );
}
