"use client";
import React from "react";
import { Cpu } from "lucide-react";
import cn from "classnames";

interface ProductTechSpecsCardProps {
  specLines: string[];
  isDark?: boolean;
}

export default function ProductTechSpecsCard({
  specLines,
  isDark = false,
}: ProductTechSpecsCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl border space-y-3",
        isDark
          ? "bg-slate-950/40 border-slate-800"
          : "bg-slate-50 border-slate-200",
      )}
    >
      <div className="flex items-center gap-2">
        <Cpu size={16} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
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
  );
}
