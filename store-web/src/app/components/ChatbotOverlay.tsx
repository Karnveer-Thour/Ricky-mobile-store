import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";

interface ChatbotOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice: number;
  productName: string;
  onApproval: (lender: "bajaj" | "homecredit", limit: number, tenure: number) => void;
  lender: "bajaj" | "homecredit";
}

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
}

export default function ChatbotOverlay({
  isOpen,
  onClose,
  productPrice,
  productName,
  onApproval,
  lender,
}: ChatbotOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<"phone" | "otp" | "approved" | "denied">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: `Hi there! I can help check your pre-approved limit for the ${productName} with ${
            lender === "bajaj" ? "Bajaj Finserv" : "Home Credit"
          }.`,
        },
        {
          id: 2,
          sender: "bot",
          text: "To get started, please share your 10-digit mobile number.",
        },
      ]);
      setStep("phone");
      setPhone("");
      setOtp("");
      setOtpAttempts(0);
      setInputValue("");
      setSelectedTenure(null);
    }
  }, [isOpen, productName, lender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { id: prev.length + 1, sender: "user", text: userMsg }]);
    setInputValue("");

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (step === "phone") {
        // Simple 10 digit check
        if (/^\d{10}$/.test(userMsg)) {
          setPhone(userMsg);
          setStep("otp");
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "bot",
              text: `Great! We've sent a 4-digit verification code to +91 ******${userMsg.slice(-4)}. Please enter the OTP below.`,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "bot",
              text: "Hmm, that doesn't look like a valid 10-digit number. Please check and try again.",
            },
          ]);
        }
      } else if (step === "otp") {
        if (userMsg === "1234") {
          setStep("approved");
          const approvedLimit = Math.round(productPrice * 1.2);
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "bot",
              text: `Congratulations! 🎉 Your cardless EMI profile has been approved.`,
            },
            {
              id: prev.length + 2,
              sender: "bot",
              text: `Approved Limit: ₹${approvedLimit.toLocaleString("en-IN")}. Please select your preferred repayment plan below to proceed:`,
            },
          ]);
        } else {
          const nextAttempts = otpAttempts + 1;
          setOtpAttempts(nextAttempts);
          if (nextAttempts >= 3) {
            setStep("denied");
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                sender: "bot",
                text: "Incorrect OTP entered 3 times. For security, this check has been locked.",
              },
              {
                id: prev.length + 2,
                sender: "bot",
                text: "Please click 'Contact support' below to manually verify and resolve.",
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                sender: "bot",
                text: `Incorrect OTP. You have ${3 - nextAttempts} attempts remaining. (Hint: enter 1234)`,
              },
            ]);
          }
        }
      }
    }, 1000);
  };

  const handleConfirmPlan = () => {
    if (!selectedTenure) return;
    const approvedLimit = Math.round(productPrice * 1.2);
    onApproval(lender, approvedLimit, selectedTenure);
  };

  const approvedLimit = Math.round(productPrice * 1.2);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0e0e1c] border-t border-white/10 rounded-t-[var(--radius-ricky-lg)] flex flex-col h-[68vh] shadow-[var(--shadow-ricky-lg)] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-ricky-accent-green-light)] animate-pulse" />
            <span className="text-sm font-semibold text-white">EMI Eligibility Bot</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: "none" }}>
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
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar / Tenure Selector */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          {step === "approved" ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {/* 3 Months Card */}
                <button
                  onClick={() => setSelectedTenure(3)}
                  className={`flex-1 min-w-[120px] p-3 rounded-xl border transition-all text-left ${
                    selectedTenure === 3
                      ? "border-[#00cfff] bg-[#00cfff]/5 text-white"
                      : "border-white/10 bg-white/4 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-bold text-white">3 Months</p>
                  <p className="text-sm font-black mt-1 text-[#00cfff]">
                    ₹{Math.round(productPrice / 3).toLocaleString("en-IN")}/mo
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">0% Interest</p>
                </button>

                {/* 6 Months Card */}
                <button
                  onClick={() => setSelectedTenure(6)}
                  className={`flex-1 min-w-[120px] p-3 rounded-xl border transition-all text-left ${
                    selectedTenure === 6
                      ? "border-[#00cfff] bg-[#00cfff]/5 text-white"
                      : "border-white/10 bg-white/4 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-bold text-white">6 Months</p>
                  <p className="text-sm font-black mt-1 text-[#00cfff]">
                    ₹{Math.round(productPrice / 6).toLocaleString("en-IN")}/mo
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">0% Interest</p>
                </button>

                {/* 12 Months Card */}
                <button
                  onClick={() => setSelectedTenure(12)}
                  className={`flex-1 min-w-[120px] p-3 rounded-xl border transition-all text-left ${
                    selectedTenure === 12
                      ? "border-[#00cfff] bg-[#00cfff]/5 text-white"
                      : "border-white/10 bg-white/4 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-bold text-white">12 Months</p>
                  <p className="text-sm font-black mt-1 text-[#00cfff]">
                    ₹{Math.round((productPrice * 1.12) / 12).toLocaleString("en-IN")}/mo
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">12% Interest</p>
                </button>
              </div>

              <button
                disabled={!selectedTenure}
                onClick={handleConfirmPlan}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all text-center ${
                  selectedTenure
                    ? "bg-[#00cfff] text-[#07070f] shadow-lg cursor-pointer"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {selectedTenure ? `Confirm ₹${Math.round(selectedTenure === 3 ? productPrice / 3 : selectedTenure === 6 ? productPrice / 6 : (productPrice * 1.12) / 12).toLocaleString("en-IN")}/mo Plan` : "Select a repayment plan"}
              </button>
            </div>
          ) : step === "denied" ? (
            <a
              href="/chat"
              className="w-full py-2.5 bg-[#ff2d55] text-white text-center font-semibold rounded-xl text-sm hover:bg-[#ff2d55]/90 transition-all"
            >
              Contact support
            </a>
          ) : (
            <div className="flex gap-2">
              <input
                type={step === "phone" ? "tel" : "text"}
                pattern={step === "phone" ? "[0-9]*" : undefined}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={step === "phone" ? "Enter mobile number..." : "Enter 4-digit OTP (e.g. 1234)..."}
                className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/40 transition-all"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-[var(--color-ricky-accent-blue)] text-white flex items-center justify-center hover:bg-[#1D4ED8] transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
