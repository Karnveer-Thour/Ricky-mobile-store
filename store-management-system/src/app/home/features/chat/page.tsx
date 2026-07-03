"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { Send, AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

interface CustomerChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lender?: string;
  failedAmount?: number;
  urgency: "high" | "medium" | "low";
  messages: { sender: "user" | "support" | "system"; text: string; time: string }[];
}

const INITIAL_CHATS: CustomerChat[] = [
  {
    id: "chat-aarav",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format",
    lastMessage: "Is there any alternative down payment link?",
    lender: "Bajaj Finserv",
    failedAmount: 134900,
    urgency: "high",
    messages: [
      { sender: "user", text: "I tried to purchase the iPhone 15 Pro Max using Bajaj Cardless EMI.", time: "11:30 AM" },
      { sender: "system", text: "⚠️ FinServ eligibility check failed: verification timeout (8s limit exceeded).", time: "11:31 AM" },
      { sender: "support", text: "Hi Aarav! I see your Bajaj transaction timed out. Let me help you verify.", time: "11:32 AM" },
      { sender: "user", text: "Thanks. Is there any alternative down payment link?", time: "11:34 AM" },
    ],
  },
  {
    id: "chat-harman",
    name: "Harman Singh",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&auto=format",
    lastMessage: "I received my order, thank you!",
    urgency: "low",
    messages: [
      { sender: "user", text: "Can I get standard invoice receipt PDF?", time: "昨天" },
      { sender: "support", text: "Here is your invoice receipt.", time: "昨天" },
      { sender: "user", text: "I received my order, thank you!", time: "昨天" },
    ],
  },
];

const CANNED_REPLIES = [
  "Send UPI Split Link",
  "Verify Bajaj Card",
  "Retry Checkout Link",
];

export default function ChatWorkspacePage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [chats, setChats] = useState<CustomerChat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState("chat-aarav");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  // Simulate customer typing indicator when support types
  useEffect(() => {
    if (inputText.length > 0 && !isTyping) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [inputText]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append support message
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: text,
            messages: [...c.messages, { sender: "support", text, time: timeString }],
          };
        }
        return c;
      })
    );

    if (!textToSend) setInputText("");
  };

  const handleCannedClick = (reply: string) => {
    let text = "";
    if (reply === "Send UPI Split Link") {
      text = "Here is your customized UPI Split Link to complete the transaction: https://upi.rickystore.in/pay/rms-split-pay";
    } else if (reply === "Verify Bajaj Card") {
      text = "I've triggered a manual verification link to your mobile number to authorize the Bajaj cardless limit.";
    } else {
      text = "Please use this link to retry your checkout directly: https://rickymobilestore.in/checkout?retry=true";
    }
    handleSend(text);
  };

  return (
    <div className="w-[95%] mx-auto mt-8 px-4 h-[80vh] flex flex-col space-y-4">
      {/* Header */}
      <div className="border-b border-gray-700 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}>
            Support Recovery Chat
          </h1>
          <p className="text-xs text-gray-500">
            Address failed cardless EMI checks and payment errors in under 5 minutes.
          </p>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-grow flex gap-4 min-h-0">
        {/* Column 1: Queue */}
        <div className={`w-80 rounded-2xl p-4 flex flex-col min-h-0 border ${
          isDark ? "bg-gray-800/30 border-gray-800" : "bg-gray-50 border-gray-200"
        }`}>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
            Conversation Queue
          </span>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: "none" }}>
            {chats.map((c) => {
              const isHigh = c.urgency === "high";
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`p-3 rounded-xl cursor-pointer border flex items-center gap-3 transition-all ${
                    activeChatId === c.id
                      ? isDark
                        ? "bg-[#00cfff]/10 border-[#00cfff] text-white"
                        : "bg-blue-50 border-blue-500 text-gray-900"
                      : isDark
                      ? "bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-400"
                      : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{c.name}</p>
                      {isHigh && (
                        <span className="w-2 h-2 rounded-full bg-[#ff2d55]" />
                      )}
                    </div>
                    <p className="text-xs truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Log Workspace */}
        <div className={`flex-1 rounded-2xl p-5 flex flex-col min-h-0 border ${
          isDark ? "bg-gray-800/30 border-gray-800" : "bg-gray-50 border-gray-200"
        }`}>
          {/* Messages Log */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2" style={{ scrollbarWidth: "none" }}>
            {activeChat.messages.map((m, idx) => {
              const isSupport = m.sender === "support";
              const isSys = m.sender === "system";

              return (
                <div
                  key={idx}
                  className={`flex ${isSys ? "justify-center" : isSupport ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                    isSys
                      ? "bg-[#D97706]/10 border border-[#D97706]/20 text-[#D97706] text-xs font-semibold"
                      : isSupport
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "bg-gray-950 text-white border border-gray-800"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}>
                    <p>{m.text}</p>
                    {!isSys && (
                      <span className="block text-[9px] text-gray-500 mt-1 text-right">{m.time}</span>
                    )}
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Canned replies bar */}
          <div className="py-3 border-t border-gray-700 flex flex-wrap gap-2 shrink-0">
            {CANNED_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleCannedClick(reply)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isDark
                    ? "bg-gray-900 border-gray-800 text-[#00cfff] hover:bg-gray-800 hover:border-gray-700"
                    : "bg-white border-gray-300 text-blue-600 hover:bg-gray-50"
                }`}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Chat input bar */}
          <div className="flex gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type message here..."
              className={`flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none ${
                isDark
                  ? "bg-gray-900 border-gray-800 text-white focus:border-[#00cfff]"
                  : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
              }`}
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Column 3: Customer Insights */}
        {activeChat.urgency === "high" && (
          <div className={`w-72 rounded-2xl p-5 border flex flex-col gap-4 shrink-0 ${
            isDark ? "bg-gray-800/30 border-gray-800" : "bg-gray-50 border-gray-200"
          }`}>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Customer Insights
            </span>

            <div className="text-center pb-2 border-b border-gray-700">
              <img src={activeChat.avatar} alt={activeChat.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2" />
              <h4 className="font-bold text-base">{activeChat.name}</h4>
              <p className="text-xs text-gray-500">Khanna, Punjab</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500 block">Failed Lender Check</span>
                <span className="font-bold text-red-400 flex items-center gap-1">
                  <ShieldAlert size={12} /> {activeChat.lender}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Attempted Amount</span>
                <span className="font-bold text-white">
                  ₹{activeChat.failedAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Eligibility Status</span>
                <span className="px-2 py-0.5 bg-[#D97706]/10 text-[#D97706] rounded font-bold">
                  TIMEOUT LIMIT
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <span className="text-xs text-gray-500 block mb-2">EMI recovery quick triggers</span>
              <button
                onClick={() => handleCannedClick("Send UPI Split Link")}
                className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                Send UPI Split
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
