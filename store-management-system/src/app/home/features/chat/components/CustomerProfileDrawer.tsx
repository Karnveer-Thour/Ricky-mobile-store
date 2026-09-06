import React from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { CustomerChat } from "./types";

interface CustomerProfileDrawerProps {
  activeChat: CustomerChat;
  isDark: boolean;
}

export default function CustomerProfileDrawer({
  activeChat,
  isDark,
}: CustomerProfileDrawerProps) {
  return (
    <div
      className={`w-72 border-l p-4 space-y-4 hidden xl:flex flex-col shrink-0 ${
        isDark
          ? "border-slate-800 bg-slate-950/50"
          : "border-slate-200 bg-slate-50/70"
      }`}
    >
      <span
        className={`text-xs font-bold uppercase tracking-wider ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Customer Intelligence
      </span>

      <div
        className={`p-3 rounded-xl border text-center space-y-2 ${
          isDark
            ? "bg-slate-900/80 border-slate-800"
            : "bg-white border-slate-200 shadow-2xs"
        }`}
      >
        <Image
          src={activeChat.avatar}
          alt={activeChat.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full mx-auto border-2 border-cyan-500/40 bg-slate-200"
        />
        <div>
          <h4
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {activeChat.name}
          </h4>
          <p
            className={`text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {activeChat.email}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark
              ? "bg-slate-900 border-white/5"
              : "bg-white border-slate-200 shadow-2xs"
          }`}
        >
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>
            Lifetime Orders:
          </span>
          <span
            className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {activeChat.totalOrders} Orders
          </span>
        </div>
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isDark
              ? "bg-slate-900 border-white/5"
              : "bg-white border-slate-200 shadow-2xs"
          }`}
        >
          <span className={isDark ? "text-slate-400" : "text-slate-500"}>
            Total Purchase:
          </span>
          <span
            className={`font-bold ${
              isDark ? "text-cyan-300" : "text-cyan-700"
            }`}
          >
            ₹{activeChat.totalSpent?.toLocaleString("en-IN")}
          </span>
        </div>
        <div
          className={`p-2.5 rounded-xl border ${
            isDark
              ? "bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/30"
              : "bg-cyan-50/80 border-cyan-200 shadow-2xs"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 font-bold mb-1 ${
              isDark ? "text-cyan-400" : "text-cyan-800"
            }`}
          >
            <Sparkles size={13} />
            <span>Financing Eligibility</span>
          </div>
          <p
            className={`text-[11px] ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Pre-approved for ₹1,50,000 on Bajaj Finserv Cardless 0% EMI scheme.
          </p>
        </div>
      </div>
    </div>
  );
}
