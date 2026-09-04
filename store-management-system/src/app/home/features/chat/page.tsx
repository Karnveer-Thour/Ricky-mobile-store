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
  Search,
  Phone,
  Mail,
  CreditCard,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Zap,
  ExternalLink,
} from "lucide-react";
import { UPI_SPLIT_PAY_URL, CHECKOUT_RETRY_URL } from "@/constants";
import { customerService } from "@/services/customer.service";

interface CustomerChat {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar: string;
  lastMessage: string;
  lender?: string;
  totalOrders?: number;
  totalSpent?: number;
  urgency: "high" | "medium" | "low";
  messages: {
    sender: "user" | "support" | "system";
    text: string;
    time: string;
  }[];
}

const CANNED_REPLIES = [
  {
    label: "Send UPI Split Link",
    text: `Here is your customized UPI Split Link to complete the order payment: ${UPI_SPLIT_PAY_URL}`,
    icon: <Zap size={13} className="text-yellow-400" />,
  },
  {
    label: "Verify Bajaj Finserv EMI",
    text: "I have initiated the Bajaj Cardless 0% EMI authorization on your registered mobile number. Please check your SMS for the OTP.",
    icon: <CreditCard size={13} className="text-cyan-400" />,
  },
  {
    label: "Home Credit Pre-Approval",
    text: "Your Home Credit pre-approved limit of ₹1,20,000 has been matched for this order. Down payment required is ₹0.",
    icon: <CreditCard size={13} className="text-emerald-400" />,
  },
  {
    label: "Retry Checkout Link",
    text: `Please use this secure link to retry your transaction directly: ${CHECKOUT_RETRY_URL}`,
    icon: <ExternalLink size={13} className="text-blue-400" />,
  },
];

export default function ChatWorkspacePage() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [chats, setChats] = useState<CustomerChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
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
              phone: c.phone || "+91 98765 43210",
              email: c.email || `customer${idx + 1}@gmail.com`,
              avatar:
                c.imageURL ||
                c.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name || `Cust${idx}`)}`,
              lastMessage:
                idx === 0
                  ? "Hello! Need assistance with Bajaj Finserv 6-month EMI options."
                  : idx === 1
                    ? "Is the iPhone 16 Pro Max ready for dispatch?"
                    : "Payment query for recent order #BK-9021.",
              totalOrders: (idx % 4) + 1,
              totalSpent: 45000 + idx * 25000,
              urgency: idx === 0 ? "high" : idx === 1 ? "medium" : "low",
              messages: [
                {
                  sender: "user",
                  text:
                    idx === 0
                      ? "Hello Ricky Store! I want to buy iPhone 16 Pro on Bajaj Finserv EMI. Can you check my cardless eligibility?"
                      : "Hi! Can you confirm tracking status for my recent order?",
                  time: "10:14 AM",
                },
              ],
            }),
          );
          setChats(loadedChats);
          setActiveChatId(loadedChats[0].id);
        } else {
          // Fallback mock customer chats
          const fallbackChats: CustomerChat[] = [
            {
              id: "cust-1",
              name: "Karanveer Thour",
              phone: "+91 98765 12345",
              email: "karan@rickymobile.com",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
              lastMessage: "Need help with Bajaj Finserv cardless EMI verification",
              totalOrders: 3,
              totalSpent: 128999,
              urgency: "high",
              messages: [
                {
                  sender: "user",
                  text: "Hello! I am trying to purchase the Galaxy S24 Ultra with Bajaj 0% EMI. What is the required down payment?",
                  time: "11:20 AM",
                },
              ],
            },
            {
              id: "cust-2",
              name: "Rohit Sharma",
              phone: "+91 98111 22334",
              email: "rohit@gmail.com",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
              lastMessage: "Is OnePlus 12 256GB in stock today?",
              totalOrders: 1,
              totalSpent: 64999,
              urgency: "medium",
              messages: [
                {
                  sender: "user",
                  text: "Hi! Is OnePlus 12 Silky Black ready for instant delivery?",
                  time: "11:05 AM",
                },
              ],
            },
          ];
          setChats(fallbackChats);
          setActiveChatId("cust-1");
        }
      } catch (err) {
        console.error("Failed to load customer chats:", err);
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

    // Simulate realistic customer reply after 2.5 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChats((prev) =>
          prev.map((c) => {
            if (c.id === activeChat.id) {
              return {
                ...c,
                lastMessage: "Thank you for the quick support! Proceeding now.",
                messages: [
                  ...c.messages,
                  {
                    sender: "user",
                    text: "Thank you! I received the link and authorization code. Proceeding with the checkout right away.",
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ],
              };
            }
            return c;
          }),
        );
      }, 2000);
    }, 1200);
  };

  const filteredChats = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)),
  );

  return (
    <div className="w-[95%] mx-auto mt-6 px-2 h-[82vh] flex flex-col space-y-4">
      {/* Header */}
      <div
        className={`pb-3 flex items-center justify-between shrink-0 border-b ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-purple-500/20">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1
              className={`text-2xl font-extrabold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Customer Support &amp; EMI Recovery Hub
            </h1>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Live resolution for Bajaj Cardless EMI, UPI Split payments and order inquiries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? isDark
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                  : "bg-purple-50 border-purple-200 text-purple-700"
                : isDark
                  ? "bg-slate-800 border-slate-700 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundEnabled ? "Audio Chime On" : "Muted"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 grid grid-cols-[280px_1fr] gap-4 overflow-hidden rounded-2xl">
          {/* Sidebar skeleton */}
          <div
            className={`rounded-2xl p-4 space-y-3 flex flex-col border ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className={`h-8 w-full animate-pulse rounded-xl ${isDark ? "bg-slate-800/60" : "bg-slate-100"}`} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2" style={{ opacity: 1 - i * 0.12 }}>
                <div className={`h-10 w-10 shrink-0 animate-pulse rounded-full ${isDark ? "bg-slate-700/50" : "bg-slate-200"}`} />
                <div className="flex-1 space-y-1.5">
                  <div className={`h-2.5 w-full animate-pulse rounded ${isDark ? "bg-slate-700/40" : "bg-slate-200"}`} />
                  <div className={`h-2 w-3/4 animate-pulse rounded ${isDark ? "bg-slate-700/30" : "bg-slate-200"}`} />
                </div>
              </div>
            ))}
          </div>
          {/* Chat area skeleton */}
          <div
            className={`rounded-2xl border flex flex-col p-4 gap-3 ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className={`h-4 w-40 animate-pulse rounded ${isDark ? "bg-slate-700/40" : "bg-slate-200"}`} />
            <div className="flex-1 space-y-4 pt-2">
              {[false, true, false, true, false].map((right, i) => (
                <div key={i} className={`flex ${right ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`h-10 animate-pulse rounded-2xl ${isDark ? "bg-slate-800/60" : "bg-slate-100"}`}
                    style={{ width: `${right ? 160 : 220}px` }}
                  />
                </div>
              ))}
            </div>
            <div className={`h-11 w-full animate-pulse rounded-xl ${isDark ? "bg-slate-800/50" : "bg-slate-100"}`} />
          </div>
        </div>
      ) : chats.length === 0 ? (
        <div
          className={`flex-1 border rounded-2xl flex flex-col items-center justify-center p-8 text-center ${
            isDark
              ? "border-slate-800 bg-slate-900/40"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <Users size={48} className="text-slate-400 mb-3 opacity-40" />
          <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
            No customer conversations
          </h3>
          <p className={`text-xs mt-1 max-w-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Customer inquiries and financing requests will appear here in real time.
          </p>
        </div>
      ) : (
        <div
          className={`flex-1 border rounded-2xl overflow-hidden shadow-2xl flex transition-colors ${
            isDark
              ? "border-slate-800 bg-slate-900/60 backdrop-blur-xl"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          {/* Left Panel: Customer Conversations */}
          <div
            className={`w-80 border-r flex flex-col shrink-0 transition-colors ${
              isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50/70"
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
                <Search size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
                <input
                  type="text"
                  placeholder="Filter customer or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent outline-none w-full ${
                    isDark ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>

            <div
              className={`flex-1 overflow-y-auto divide-y ${
                isDark ? "divide-slate-800/60" : "divide-slate-200/70"
              }`}
            >
              {filteredChats.map((c) => {
                const isActive = c.id === activeChat?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-cyan-500/10 border-l-4 border-cyan-400"
                          : "bg-cyan-50/90 border-l-4 border-cyan-600"
                        : isDark
                          ? "hover:bg-slate-800/40"
                          : "hover:bg-slate-100/70"
                    }`}
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover bg-slate-200 mt-0.5 shrink-0 border border-slate-200/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-bold truncate ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {c.name}
                        </p>
                        {c.urgency === "high" && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${
                              isDark
                                ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            EMI Urgent
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {c.lastMessage}
                      </p>
                      <span
                        className={`text-[10px] block mt-1 ${
                          isDark ? "text-slate-500" : "text-slate-400 font-medium"
                        }`}
                      >
                        {c.phone}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Panel: Active Chat Thread */}
          {activeChat && (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Thread Header */}
              <div
                className={`p-3.5 border-b flex items-center justify-between ${
                  isDark
                    ? "border-slate-800 bg-slate-900/80"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-9 h-9 rounded-full object-cover bg-slate-200"
                  />
                  <div>
                    <h3
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {activeChat.name}
                    </h3>
                    <p
                      className={`text-xs flex items-center gap-1 font-medium ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          isDark ? "bg-emerald-400" : "bg-emerald-600"
                        }`}
                      />
                      Customer Online · Connected via Store Portal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-lg border font-medium ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {activeChat.phone}
                  </span>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className={`flex-1 overflow-y-auto p-4 space-y-3 ${
                  isDark ? "bg-slate-950/30" : "bg-slate-50/50"
                }`}
              >
                {activeChat.messages.map((m, idx) => {
                  const isSupport = m.sender === "support";
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isSupport ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isSupport
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-br-none shadow-cyan-600/10"
                            : isDark
                              ? "bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none"
                              : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1 font-medium">
                        <Clock size={10} />
                        {m.time} {isSupport && "· Sent by Agent"}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className={`flex items-center gap-2 text-xs py-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-medium ml-1">Customer is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Responses Bar */}
              <div
                className={`px-3 py-2 border-t flex items-center gap-2 overflow-x-auto ${
                  isDark
                    ? "bg-slate-950/60 border-slate-800/80"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Quick Actions:
                </span>
                {CANNED_REPLIES.map((canned, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(canned.text)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                      isDark
                        ? "bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300"
                        : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs"
                    }`}
                  >
                    {canned.icon}
                    <span>{canned.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div
                className={`p-3 border-t flex items-center gap-2 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/90"
                    : "border-slate-200 bg-white"
                }`}
              >
                <input
                  type="text"
                  placeholder="Type your response or paste payment link..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-xs outline-none transition-colors border ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600 focus:bg-white"
                  }`}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Right Panel: Customer Profile & Financing Summary */}
          {activeChat && (
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
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
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
                    className={`font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
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
          )}
        </div>
      )}
    </div>
  );
}
