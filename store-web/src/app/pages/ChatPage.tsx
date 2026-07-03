import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { ArrowLeft, Send } from "lucide-react";

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatMsgs, chatInput, setChatInput, sendChat } = useApp();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 h-[85vh] flex flex-col">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          LIVE SUPPORT
        </h1>
      </div>

      <div className="flex-1 bg-[#0e0e1c] border border-white/5 rounded-3xl p-6 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ scrollbarWidth: "none" }}>
          {chatMsgs.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-[var(--radius-ricky-md)] px-4 py-2.5 text-sm ${
                  m.sender === "user"
                    ? "bg-[var(--color-ricky-accent-blue)] text-white"
                    : m.sender === "system"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-[var(--color-ricky-primary-700)] text-white"
                }`}
              >
                {m.message}
                {m.type === "PAYMENT_REQUEST" && m.amount && (
                  <div className="mt-3 p-3 bg-black/20 rounded-xl flex items-center justify-between gap-4">
                    <span className="font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>
                      ₹{m.amount.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => alert("Payment verified successfully!")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold"
                    >
                      Pay Now
                    </button>
                  </div>
                )}
                <span className="block text-[9px] text-gray-600 mt-1 text-right">{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 shrink-0">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            placeholder="Type your message..."
            className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00cfff]/40"
          />
          <button
            onClick={sendChat}
            className="w-10 h-10 rounded-xl bg-[#00cfff] text-[#07070f] flex items-center justify-center hover:bg-[#00cfff]/90 transition-all"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
