"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ExternalLink, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface MessagePreviewItem {
  id: string;
  senderName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  tag?: string;
}

interface MessagesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export default function MessagesPopover({
  isOpen,
  onClose,
  isDark = true,
  unreadCount,
  setUnreadCount,
}: MessagesPopoverProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<MessagePreviewItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenThread = (item: MessagePreviewItem) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, unread: false } : m)),
    );
    const unreadRemaining = messages.filter(
      (m) => m.id !== item.id && m.unread,
    ).length;
    setUnreadCount(unreadRemaining);
    router.push("/home/features/chat");
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-end pr-20 pt-16">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/20" onClick={onClose} />

        {/* Flyout Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`relative z-10 w-88 rounded-2xl overflow-hidden shadow-2xl border ${
            isDark
              ? "bg-slate-900/98 backdrop-blur-xl border-slate-700/90 shadow-cyan-950/60 text-slate-100"
              : "bg-white border-slate-200 shadow-slate-400/40 text-slate-800"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold">Support Conversations</h3>
            </div>
            <button
              onClick={() => {
                router.push("/home/features/chat");
                onClose();
              }}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Open Hub <ExternalLink size={12} />
            </button>
          </div>

          {/* Conversation Previews */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 p-1">
            {messages.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenThread(item)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                  item.unread
                    ? isDark
                      ? "bg-cyan-500/5 hover:bg-cyan-500/10"
                      : "bg-cyan-50 hover:bg-cyan-100/60"
                    : "hover:bg-white/5 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={item.avatar}
                  alt={item.senderName}
                  className="w-9 h-9 rounded-full object-cover bg-slate-800 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold truncate text-slate-100">
                      {item.senderName}
                    </p>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.lastMessage}
                  </p>
                  {item.tag && (
                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(0,207,255,0.8)]" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Direct Jump */}
          <div
            onClick={() => {
              router.push("/home/features/chat");
              onClose();
            }}
            className="p-3 bg-slate-950/60 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <span>View all live customer chats</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}

