import React from "react";
import { Zap, CreditCard, ExternalLink } from "lucide-react";
import { UPI_SPLIT_PAY_URL, CHECKOUT_RETRY_URL } from "@/constants";

export interface ChatMessage {
  sender: "user" | "support" | "system";
  text: string;
  time: string;
}

export interface CustomerChat {
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
  messages: ChatMessage[];
}

export interface CannedReply {
  label: string;
  text: string;
  icon: React.ReactNode;
}

export const CANNED_REPLIES: CannedReply[] = [
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
