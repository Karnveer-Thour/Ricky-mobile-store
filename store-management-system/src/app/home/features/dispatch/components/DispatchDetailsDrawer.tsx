import React from "react";
import { MapPin } from "lucide-react";
import { DispatchCard } from "./types";

interface DispatchDetailsDrawerProps {
  card: DispatchCard;
  isDark: boolean;
  onClose: () => void;
}

export default function DispatchDetailsDrawer({
  card,
  isDark,
  onClose,
}: DispatchDetailsDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md h-screen p-6 shadow-2xl flex flex-col justify-between transition-colors ${
          isDark
            ? "bg-slate-900 border-l border-slate-800 text-white"
            : "bg-white border-l border-slate-200 text-slate-800"
        }`}
      >
        <div>
          <div
            className={`flex items-center justify-between border-b pb-4 mb-6 ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              Order Details
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{card.customer}</h3>
              <p className="text-sm text-gray-500">{card.phone}</p>
            </div>

            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                Items
              </p>
              <p className="text-sm font-semibold">{card.items}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block">
                  Payment Method
                </span>
                <span className="text-sm font-bold">{card.payment}</span>
              </div>
              {card.lender && (
                <div>
                  <span className="text-xs text-gray-500 block">
                    Lender Provider
                  </span>
                  <span className="text-sm font-bold">{card.lender}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-xs text-gray-500 block mb-1">
                Landmark Affiliation
              </span>
              <p className="text-sm flex items-center gap-1">
                <MapPin size={14} className="text-red-400" /> {card.landmark}
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-gray-500 block mb-1">
                Current Status
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {card.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
