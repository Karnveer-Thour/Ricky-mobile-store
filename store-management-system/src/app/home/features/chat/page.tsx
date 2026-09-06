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
              lastMessage:
                "Need help with Bajaj Finserv cardless EMI verification",
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
