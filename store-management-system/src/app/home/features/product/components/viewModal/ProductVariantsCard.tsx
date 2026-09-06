"use client";
import React from "react";
import { Layers } from "lucide-react";
import cn from "classnames";

interface ProductVariantsCardProps {
  variants: any[];
  isDark?: boolean;
}

export default function ProductVariantsCard({
  variants,
  isDark = false,
}: ProductVariantsCardProps) {
  if (!variants || variants.length === 0) return null;

  return (
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
                    isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50/80",
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
  );
}
