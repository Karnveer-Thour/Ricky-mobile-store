import React from "react";
import { Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import { CustomerChat } from "./types";

interface ChatMessageThreadProps {
  activeChat: CustomerChat;
  isDark: boolean;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessageThread({
  activeChat,
  isDark,
  isTyping,
  messagesEndRef,
}: ChatMessageThreadProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Active Chat Header */}
      <div
        className={`p-3.5 border-b flex items-center justify-between shrink-0 ${
          isDark
            ? "border-slate-800 bg-slate-950/20"
            : "border-slate-200 bg-slate-50/50"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={activeChat.avatar}
            alt={activeChat.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border border-slate-700/50 object-cover bg-slate-200"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-bold truncate ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {activeChat.name}
              </h3>
              {activeChat.lender && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {activeChat.lender} EMI
                </span>
              )}
            </div>
            <div
              className={`flex items-center gap-3 text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {activeChat.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={11} /> {activeChat.phone}
                </span>
              )}
              {activeChat.email && (
                <span className="hidden sm:flex items-center gap-1">
                  <Mail size={11} /> {activeChat.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● Online
          </span>
        </div>
      </div>

      {/* Message History Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeChat.messages.map((m, i) => {
          const isSupport = m.sender === "support";
          return (
            <div
              key={i}
              className={`flex flex-col ${
                isSupport ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isSupport
                    ? isDark
                      ? "bg-cyan-600 text-white rounded-br-none"
                      : "bg-cyan-600 text-white rounded-br-none"
                    : isDark
                      ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                      : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                }`}
              >
                {m.text}
              </div>
              <span
                className={`text-[10px] mt-1 flex items-center gap-1 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <Clock size={10} />
                {m.time} {isSupport && "· Sent by Agent"}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div
            className={`flex items-center gap-2 text-xs py-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium ml-1">
              Customer is typing...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
