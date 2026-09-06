import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}

interface ImportResultsSummaryProps {
  importResult: ImportResult;
}

export default function ImportResultsSummary({
  importResult,
}: ImportResultsSummaryProps) {
  return (
    <div className="space-y-3">
      <div
        className={`p-4 rounded-2xl border ${
          importResult.errorCount === 0
            ? "bg-emerald-500/10 border-emerald-500/20"
            : importResult.successCount > 0
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-rose-500/10 border-rose-500/20"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {importResult.errorCount === 0 ? (
            <CheckCircle2 size={20} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={20} className="text-amber-400" />
          )}
          <h4 className="text-sm font-bold text-white">
            Import Results Summary
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2 text-center">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400">Total Rows</p>
            <p className="text-base font-bold text-white">
              {importResult.totalRows}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 font-semibold">Imported</p>
            <p className="text-base font-bold text-emerald-300">
              {importResult.successCount}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-rose-400 font-semibold">Errors</p>
            <p className="text-base font-bold text-rose-300">
              {importResult.errorCount}
            </p>
          </div>
        </div>

        {importResult.errors.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 max-h-32 overflow-y-auto space-y-1">
            <p className="text-[11px] font-bold text-rose-400">
              Details & Warnings:
            </p>
            {importResult.errors.map((err, idx) => (
              <p key={idx} className="text-[11px] text-slate-300 font-mono">
                &bull; {err}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
