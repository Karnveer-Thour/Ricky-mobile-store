import React from "react";
import { Search, Phone } from "lucide-react";
import Image from "next/image";
import { CustomerChat } from "./types";

interface ChatSidebarListProps {
  chats: CustomerChat[];
  filteredChats: CustomerChat[];
  activeChatId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectChat: (id: string) => void;
  isDark: boolean;
}

export default function ChatSidebarList({
  chats,
  filteredChats,
  activeChatId,
  searchQuery,
  onSearchChange,
  onSelectChat,
  isDark,
}: ChatSidebarListProps) {
  return (
    <div
      className={`w-80 border-r flex flex-col shrink-0 transition-colors ${
        isDark
          ? "border-slate-800 bg-slate-950/40"
          : "border-slate-200 bg-slate-50/70"
      }`}
    >
      <div
        className={`p-3 border-b space-y-2 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Active Chats ({chats.length})
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDark
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            Live Sync
          </span>
        </div>

        {/* Search filter */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200 shadow-2xs"
          }`}
        >
          <Search
            size={14}
            className={isDark ? "text-slate-500" : "text-slate-400"}
          />
          <input
            type="text"
            placeholder="Filter customer or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`bg-transparent outline-none w-full ${
              isDark
                ? "text-white placeholder-slate-500"
                : "text-slate-800 placeholder-slate-400"
            }`}
          />
        </div>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredChats.map((chat) => {
          const isActive = chat.id === activeChatId;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-3 flex items-start gap-3 cursor-pointer transition-all ${
                isActive
                  ? isDark
                    ? "bg-slate-800/80 border-l-4 border-cyan-400"
                    : "bg-white border-l-4 border-cyan-500 shadow-xs"
                  : isDark
                    ? "hover:bg-slate-900/60 text-slate-300"
                    : "hover:bg-slate-100/80 text-slate-700"
              }`}
            >
              <div className="relative">
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700/50 bg-slate-200"
                />
                {chat.urgency === "high" && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-bold truncate ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-slate-950"
                        : isDark
                          ? "text-slate-200"
                          : "text-slate-800"
                    }`}
                  >
                    {chat.name}
                  </h4>
                  {chat.urgency === "high" ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      Urgent
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {chat.messages[chat.messages.length - 1]?.time || "Now"}
                    </span>
                  )}
                </div>

                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isActive
                      ? isDark
                        ? "text-cyan-300 font-medium"
                        : "text-cyan-700 font-medium"
                      : isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                  }`}
                >
                  {chat.lastMessage}
                </p>

                <div className="flex items-center gap-2 mt-1.5">
                  {chat.lender && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {chat.lender}
                    </span>
                  )}
                  {chat.phone && (
                    <span
                      className={`text-[10px] flex items-center gap-1 ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      <Phone size={10} />
                      {chat.phone.slice(-5)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
