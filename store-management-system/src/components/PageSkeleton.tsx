"use client";

import React from "react";

function shimmer() {
  return "animate-pulse bg-slate-800/60 rounded-lg";
}

function Row({ w = "w-full", h = "h-3" }: { w?: string; h?: string }) {
  return <div className={`${shimmer()} ${w} ${h}`} />;
}

function TableSkeleton() {
  return (
    <div className="w-full space-y-3 px-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <Row w="w-48" h="h-8" />
        <Row w="w-32" h="h-8" />
      </div>
      {/* Table Head */}
      <div className="flex gap-4 py-3 px-4 rounded-xl bg-slate-800/40">
        {["w-32", "w-48", "w-24", "w-16"].map((w, i) => (
          <Row key={i} w={w} h="h-3" />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 items-center py-3 px-4 rounded-xl bg-slate-800/20"
          style={{ opacity: 1 - i * 0.08 }}
        >
          <div className={`${shimmer()} w-9 h-9 rounded-xl`} />
          <Row w="w-40" h="h-3" />
          <Row w="w-24" h="h-3" />
          <Row w="w-20" h="h-3" />
          <Row w="w-16" h="h-3" />
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-2 w-full">
      {/* Header */}
      <Row w="w-64" h="h-8" />

      {/* Count Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-slate-800/40 space-y-3 border border-white/5"
          >
            <div className={`${shimmer()} w-10 h-10 rounded-xl`} />
            <Row w="w-16" h="h-6" />
            <Row w="w-24" h="h-3" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-800/40 border border-white/5 p-5 space-y-3"
          >
            <Row w="w-36" h="h-5" />
            <div className={`${shimmer()} w-full h-48 rounded-xl`} />
          </div>
        ))}
      </div>

      {/* Bottom Chart */}
      <div className="rounded-2xl bg-slate-800/40 border border-white/5 p-5 space-y-3">
        <Row w="w-48" h="h-5" />
        <div className={`${shimmer()} w-full h-40 rounded-xl`} />
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6 px-2 w-full max-w-4xl">
      {/* Profile Hero */}
      <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-800/40 border border-white/5">
        <div className={`${shimmer()} w-24 h-24 rounded-full shrink-0`} />
        <div className="space-y-2 flex-1">
          <Row w="w-48" h="h-6" />
          <Row w="w-36" h="h-4" />
          <Row w="w-56" h="h-3" />
        </div>
        <Row w="w-32" h="h-9" />
      </div>

      {/* Tab strip */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Row key={i} w="w-28" h="h-8" />
        ))}
      </div>

      {/* Form fields */}
      <div className="p-6 rounded-3xl bg-slate-800/40 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Row w="w-24" h="h-3" />
            <Row w="w-full" h="h-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex gap-4 h-[75vh] px-2">
      {/* Sidebar */}
      <div className="w-72 shrink-0 rounded-2xl bg-slate-800/40 border border-white/5 p-4 space-y-3">
        <Row w="w-full" h="h-9" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center p-2">
            <div className={`${shimmer()} w-10 h-10 rounded-full shrink-0`} />
            <div className="flex-1 space-y-1.5">
              <Row w="w-full" h="h-3" />
              <Row w="w-3/4" h="h-2.5" />
            </div>
          </div>
        ))}
      </div>
      {/* Chat Area */}
      <div className="flex-1 rounded-2xl bg-slate-800/40 border border-white/5 p-4 flex flex-col gap-3">
        <Row w="w-48" h="h-5" />
        <div className="flex-1 space-y-4 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`${shimmer()} rounded-2xl h-10 ${i % 2 === 0 ? "w-56" : "w-40"}`}
              />
            </div>
          ))}
        </div>
        <Row w="w-full" h="h-11" />
      </div>
    </div>
  );
}

type SkeletonVariant = "table" | "dashboard" | "form" | "chat";

export default function PageSkeleton({
  variant = "table",
}: {
  variant?: SkeletonVariant;
}) {
  return (
    <div className="w-full flex flex-col space-y-6 animate-in fade-in duration-150">
      {/* Topbar skeleton */}
      <div className="w-full h-14 bg-slate-900/80 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
        <Row w="w-48" h="h-4" />
        <div className="flex gap-3">
          <div className={`${shimmer()} w-8 h-8 rounded-xl`} />
          <div className={`${shimmer()} w-8 h-8 rounded-xl`} />
          <div className={`${shimmer()} w-8 h-8 rounded-full`} />
        </div>
      </div>

      {/* Page content skeleton */}
      <div className="w-[95%] mx-auto">
        {variant === "dashboard" && <DashboardSkeleton />}
        {variant === "table" && <TableSkeleton />}
        {variant === "form" && <FormSkeleton />}
        {variant === "chat" && <ChatSkeleton />}
      </div>
    </div>
  );
}
