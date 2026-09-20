"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import { Users } from "lucide-react";
import { customerService } from "@/services/customer.service";
import {
  CustomerChat,
  CANNED_REPLIES,
  ChatHeaderBar,
  ChatSkeletonLoader,
  ChatSidebarList,
  ChatMessageThread,
  ChatInputBar,
  CustomerProfileDrawer,
} from "./components";

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
              phone: c.phone || c.mobileNumber || "",
              email: c.email || "",
              avatar:
                c.imageURL ||
                c.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name || `Cust${idx}`)}`,
              lastMessage: "No recent messages",
              totalOrders: c.totalOrders || 0,
              totalSpent: c.totalSpent || 0,
              urgency: "low",
              messages: [],
            }),
          );
          setChats(loadedChats);
          setActiveChatId(loadedChats[0]?.id || "");
        } else {
          setChats([]);
          setActiveChatId("");
        }
      } catch (err) {
        console.error("Failed to load customer chats:", err);
        setChats([]);
        setActiveChatId("");
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
      <ChatHeaderBar
        isDark={isDark}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {loading ? (
        <ChatSkeletonLoader isDark={isDark} />
      ) : chats.length === 0 ? (
        <div
          className={`flex-1 border rounded-2xl flex flex-col items-center justify-center p-8 text-center ${
            isDark
              ? "border-slate-800 bg-slate-900/40"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <Users size={48} className="text-slate-400 mb-3 opacity-40" />
          <h3
            className={`text-base font-semibold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            No customer conversations
          </h3>
          <p
            className={`text-xs mt-1 max-w-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Customer inquiries and financing requests will appear here in real
            time.
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
          {/* Left Panel: Customer Conversations List */}
          <ChatSidebarList
            chats={chats}
            filteredChats={filteredChats}
            activeChatId={activeChatId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectChat={setActiveChatId}
            isDark={isDark}
          />

          {/* Center Chat Viewport & Message Input */}
          {activeChat && (
            <div className="flex-1 flex flex-col min-w-0">
              <ChatMessageThread
                activeChat={activeChat}
                isDark={isDark}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
              />

              <ChatInputBar
                inputText={inputText}
                onInputChange={setInputText}
                onSend={handleSend}
                cannedReplies={CANNED_REPLIES}
                isDark={isDark}
              />
            </div>
          )}

          {/* Right Panel: Customer Intelligence & Financing Profile */}
          {activeChat && (
            <CustomerProfileDrawer activeChat={activeChat} isDark={isDark} />
          )}
        </div>
      )}
    </div>
  );
}
