"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Truck,
  Package,
  Check,
  Trash2,
  Volume2,
  VolumeX,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  category: "sales" | "emi" | "stock" | "dispatch" | "system";
  time: string;
  unread: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: "notif-1",
    title: "Bajaj Finserv EMI Approved",
    message: "Customer Ricky (Order #BK-9082) approved for ₹89,999 @ 6-Mo EMI.",
    category: "emi",
    time: "2 mins ago",
    unread: true,
    actionUrl: "/home/features/sales",
  },
  {
    id: "notif-2",
    title: "WhatsApp Flash Sale Uploaded",
    message: "iPhone 16 Pro Max 256GB Desert Titanium recorded in VIP Group.",
    category: "sales",
    time: "15 mins ago",
    unread: true,
    actionUrl: "/home/features/whatsapp",
  },
  {
    id: "notif-3",
    title: "Low Inventory Alert",
    message: "Samsung Galaxy S24 Ultra stock fell below minimum threshold (2 left).",
    category: "stock",
    time: "1 hour ago",
    unread: true,
    actionUrl: "/home/features/inventory",
  },
  {
    id: "notif-4",
    title: "Dispatch Out for Delivery",
    message: "Rider Amit is en route for Order #9812 with live GPS tracking active.",
    category: "dispatch",
    time: "3 hours ago",
    unread: false,
    actionUrl: "/home/features/dispatch",
  },
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  isDark = true,
  unreadCount,
  setUnreadCount,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<StoreNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [activeTab, setActiveTab] = useState<
    "all" | "sales" | "emi" | "stock" | "dispatch"
  >("all");
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleRequestPush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushEnabled(true);
        new Notification("Ricky Mobile Store Alerts Enabled", {
          body: "You will now receive real-time push alerts for flash sales, EMI approvals and low stock.",
          icon: "/favicon.ico",
        });
      } else {
        setPushEnabled(false);
      }
    } catch (err) {
      console.error("Notification permission error:", err);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleItemClick = (item: StoreNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
    );
    const unreadRemaining = notifications.filter(
      (n) => n.id !== item.id && n.unread,
    ).length;
    setUnreadCount(unreadRemaining);
    if (item.actionUrl) {
      router.push(item.actionUrl);
      onClose();
    }
  };

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emi":
        return <CreditCard size={15} className="text-yellow-400" />;
      case "sales":
        return <CheckCircle size={15} className="text-emerald-400" />;
      case "stock":
        return <Package size={15} className="text-rose-400" />;
      case "dispatch":
        return <Truck size={15} className="text-cyan-400" />;
      default:
        return <Bell size={15} className="text-blue-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end pr-8 pt-16">
        {/* Backdrop */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Flyout Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`relative w-96 rounded-2xl overflow-hidden shadow-2xl border ${
            isDark
              ? "bg-slate-900/95 backdrop-blur-xl border-slate-700/80 shadow-cyan-950/40 text-slate-100"
              : "bg-white border-slate-200 shadow-slate-300/50 text-slate-800"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold">Store Notification Center</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                <Check size={15} />
              </button>
              <button
                onClick={handleClearAll}
                title="Clear all"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Web Push Toggle Banner */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pushEnabled ? (
                <Volume2 size={14} className="text-emerald-400" />
              ) : (
                <VolumeX size={14} className="text-amber-400" />
              )}
              <span className="text-xs font-semibold text-slate-300">
                {pushEnabled ? "Push Alerts Active" : "Enable Push Notifications"}
              </span>
            </div>
            {!pushEnabled && (
              <button
                onClick={handleRequestPush}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Enable
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto text-[11px] font-bold">
            {(["all", "sales", "emi", "stock", "dispatch"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors shrink-0 ${
                    activeTab === tab
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 p-1">
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">No notifications</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                    item.unread
                      ? isDark
                        ? "bg-cyan-500/5 hover:bg-cyan-500/10"
                        : "bg-cyan-50 hover:bg-cyan-100/60"
                      : "hover:bg-white/5 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold truncate text-slate-100">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(0,207,255,0.8)]" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-950/60 border-t border-white/5 text-center">
            <span className="text-[11px] text-slate-400">
              Live updates linked with NestJS Gateway
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
