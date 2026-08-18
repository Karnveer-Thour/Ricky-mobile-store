"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import {
  Send,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  MessageSquare,
  Users,
} from "lucide-react";
import { UPI_SPLIT_PAY_URL, CHECKOUT_RETRY_URL } from "@/constants";
import { customerService } from "@/services/customer.service";

interface CustomerChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lender?: string;
  failedAmount?: number;
  urgency: "high" | "medium" | "low";
  messages: {
    sender: "user" | "support" | "system";
    text: string;
    time: string;
  }[];
}

const CANNED_REPLIES = [
  "Send UPI Split Link",
  "Verify Bajaj Card",
  "Retry Checkout Link",
];

export default function ChatWorkspacePage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [chats, setChats] = useState<CustomerChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCustomerChats() {
      try {
        setLoading(true);
        const customers = await customerService.fetchCustomers(1, 20);
        if (Array.isArray(customers) && customers.length > 0) {
          const loadedChats: CustomerChat[] = customers.map(
            (c: any, idx: number) => ({
              id: String(c.id || c._id || idx + 1),
              name: c.name || c.email || `Customer #${idx + 1}`,
              avatar:
                c.imageURL ||
                c.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name || "Customer")}`,
              lastMessage: "Inquiry regarding order & warranty support",
              urgency: idx === 0 ? "high" : "low",
              messages: [
                {
                  sender: "user",
                  text: `Hello! I have a question about my account and recent orders.`,
                  time: "10:00 AM",
                },
              ],
            }),
          );
          setChats(loadedChats);
          setActiveChatId(loadedChats[0].id);
        } else {
          setChats([]);
        }
      } catch (err) {
        console.error("Failed to load customer chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    }
    loadCustomerChats();
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (activeChat?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages]);

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
    if (!text.trim() || !activeChat) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Append support message
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMessage: text,
            messages: [
              ...c.messages,
              { sender: "support", text, time: timeString },
            ],
          };
        }
        return c;
      }),
    );

    if (!textToSend) setInputText("");
  };

  const handleCannedClick = (reply: string) => {
    let text = "";
    if (reply === "Send UPI Split Link") {
      text = `Here is your customized UPI Split Link to complete the transaction: ${UPI_SPLIT_PAY_URL}`;
    } else if (reply === "Verify Bajaj Card") {
      text =
        "I've triggered a manual verification link to your mobile number to authorize the Bajaj cardless limit.";
    } else {
      text = `Please use this link to retry your checkout directly: ${CHECKOUT_RETRY_URL}`;
    }
    handleSend(text);
  };

  return (
    <div className="w-[95%] mx-auto mt-8 px-4 h-[80vh] flex flex-col space-y-4">
      {/* Header */}
      <div className="border-b border-gray-700 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h1
            className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
          >
            Support Recovery Chat
          </h1>
          <p className="text-xs text-gray-400">
            Real-time resolution for live registered customers
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">Loading customer threads...</p>
        </div>
      ) : chats.length === 0 ? (
        <div
          className={`flex-1 border rounded-2xl flex flex-col items-center justify-center text-center p-8 ${isDark ? "border-gray-800 bg-gray-900/40" : "border-gray-200 bg-white"}`}
        >
          <Users size={48} className="text-gray-500 mb-3 opacity-40" />
          <h3
            className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
          >
            No customer chats available
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            Customer inquiries will appear here when registered customers
            initiate support requests.
          </p>
        </div>
      ) : (
        <div
          className={`flex-1 border rounded-2xl overflow-hidden shadow-lg flex ${isDark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white"}`}
        >
          {/* Left Panel: Conversation List */}
          <div
            className={`w-80 border-r flex flex-col ${isDark ? "border-gray-800 bg-gray-900/30" : "border-gray-200 bg-gray-50"}`}
          >
            <div className="p-3 border-b border-gray-700/50">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Customers ({chats.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-800/40">
              {chats.map((c) => {
                const isActive = c.id === activeChat?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isActive
                        ? isDark
                          ? "bg-gray-800/80 border-l-4 border-[#00cfff]"
                          : "bg-blue-50 border-l-4 border-blue-500"
                        : isDark
                          ? "hover:bg-gray-800/40"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover bg-gray-700 mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-800"}`}
                        >
                          {c.name}
                        </p>
                        {c.urgency === "high" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {c.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Chat Thread */}
          {activeChat && (
            <div className="flex-1 flex flex-col">
              {/* Thread Header */}
              <div
                className={`p-3.5 border-b flex items-center justify-between ${isDark ? "border-gray-800 bg-gray-900/80" : "border-gray-200 bg-gray-100/50"}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-8 h-8 rounded-full object-cover bg-gray-700"
                  />
                  <div>
                    <h3
                      className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                    >
                      {activeChat.name}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Customer Support Ticket
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeChat.messages.map((m, idx) => {
                  const isUser = m.sender === "user";
                  const isSupport = m.sender === "support";
                  const isSystem = m.sender === "system";

                  if (isSystem) {
                    return (
                      <div key={idx} className="flex justify-center my-2">
                        <span className="text-xs px-3 py-1.5 rounded-xl border bg-yellow-500/10 border-yellow-500/20 text-yellow-300 flex items-center gap-1.5">
                          <AlertTriangle size={12} /> {m.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isSupport ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          isSupport
                            ? "bg-[#00cfff] text-black font-medium rounded-br-none"
                            : isDark
                              ? "bg-gray-800 text-white rounded-bl-none"
                              : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 px-1">
                        {m.time}
                      </span>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="text-[11px] text-gray-500 italic flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    Customer is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Canned Quick Actions */}
              <div
                className={`px-4 py-2 border-t flex gap-2 flex-wrap ${isDark ? "border-gray-800 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}
              >
                <span className="text-[11px] text-gray-500 font-semibold self-center mr-1">
                  Quick Actions:
                </span>
                {CANNED_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleCannedClick(reply)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isDark
                        ? "border-gray-700 text-gray-300 hover:border-[#00cfff] hover:text-[#00cfff]"
                        : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500"
                    }`}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div
                className={`p-3 border-t flex gap-2 items-center ${isDark ? "border-gray-800 bg-gray-900/80" : "border-gray-200 bg-white"}`}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a response to the customer..."
                  className={`flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none transition-all ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:border-[#00cfff]"
                      : "bg-gray-100 border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2.5 bg-[#00cfff] text-black rounded-xl hover:bg-[#00cfff]/90 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
