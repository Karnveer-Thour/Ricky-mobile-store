import React from "react";
import { Send } from "lucide-react";

interface ChatInputBarProps {
  step: "phone" | "otp" | "approved" | "denied";
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
}

export default function ChatInputBar({
  step,
  inputValue,
  onInputChange,
  onSend,
}: ChatInputBarProps) {
  if (step === "denied") {
    return (
      <a
        href="/chat"
        className="w-full py-2.5 bg-[#ff2d55] text-white text-center font-semibold rounded-xl text-sm hover:bg-[#ff2d55]/90 transition-all"
      >
        Contact support
      </a>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type={step === "phone" ? "tel" : "text"}
        pattern={step === "phone" ? "[0-9]*" : undefined}
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder={
          step === "phone"
            ? "Enter mobile number..."
            : "Enter 4-digit OTP (e.g. 1234)..."
        }
        className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/40 transition-all"
      />
      <button
        type="button"
        onClick={onSend}
        className="w-10 h-10 rounded-xl bg-[var(--color-ricky-accent-blue)] text-white flex items-center justify-center hover:bg-[#1D4ED8] transition-all cursor-pointer shrink-0"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
