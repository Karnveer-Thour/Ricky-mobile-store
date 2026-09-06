import React from "react";

interface ChatSkeletonLoaderProps {
  isDark: boolean;
}

export default function ChatSkeletonLoader({
  isDark,
}: ChatSkeletonLoaderProps) {
  return (
    <div className="flex-1 grid grid-cols-[280px_1fr] gap-4 overflow-hidden rounded-2xl">
      {/* Sidebar skeleton */}
      <div
        className={`rounded-2xl p-4 space-y-3 flex flex-col border ${
          isDark
            ? "bg-slate-900/60 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div
          className={`h-8 w-full animate-pulse rounded-xl ${
            isDark ? "bg-slate-800/60" : "bg-slate-100"
          }`}
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2"
            style={{ opacity: 1 - i * 0.12 }}
          >
            <div
              className={`h-10 w-10 shrink-0 animate-pulse rounded-full ${
                isDark ? "bg-slate-700/50" : "bg-slate-200"
              }`}
            />
            <div className="flex-1 space-y-1.5">
              <div
                className={`h-2.5 w-full animate-pulse rounded ${
                  isDark ? "bg-slate-700/40" : "bg-slate-200"
                }`}
              />
              <div
                className={`h-2 w-3/4 animate-pulse rounded ${
                  isDark ? "bg-slate-700/30" : "bg-slate-200"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Chat area skeleton */}
      <div
        className={`rounded-2xl border flex flex-col p-4 gap-3 ${
          isDark
            ? "bg-slate-900/60 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div
          className={`h-4 w-40 animate-pulse rounded ${
            isDark ? "bg-slate-700/40" : "bg-slate-200"
          }`}
        />
        <div className="flex-1 space-y-4 pt-2">
          {[false, true, false, true, false].map((right, i) => (
            <div
              key={i}
              className={`flex ${right ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`h-10 animate-pulse rounded-2xl ${
                  isDark ? "bg-slate-800/60" : "bg-slate-100"
                }`}
                style={{ width: `${right ? 160 : 220}px` }}
              />
            </div>
          ))}
        </div>
        <div
          className={`h-11 w-full animate-pulse rounded-xl ${
            isDark ? "bg-slate-800/50" : "bg-slate-100"
          }`}
        />
      </div>
    </div>
  );
}
