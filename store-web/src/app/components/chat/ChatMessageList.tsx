import React, { RefObject } from "react";

export interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  text: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef:
    | React.RefObject<HTMLDivElement>
    | React.RefObject<HTMLDivElement | null>
    | any;
}

export default function ChatMessageList({
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessageListProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-4"
      style={{ scrollbarWidth: "none" }}
    >
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-[var(--radius-ricky-md)] px-4 py-2.5 text-sm ${
              m.sender === "user"
                ? "bg-[var(--color-ricky-accent-blue)] text-white"
                : "bg-[var(--color-ricky-primary-700)] text-white"
            }`}
          >
            {m.text}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-[var(--color-ricky-primary-700)] rounded-[var(--radius-ricky-md)] px-4 py-3 flex gap-1">
            <div
              className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
