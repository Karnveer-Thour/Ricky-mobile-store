import { useState, useEffect, useRef } from "react";
import ChatHeader from "./chat/ChatHeader";
import ChatMessageList, { ChatMessage } from "./chat/ChatMessageList";
import ChatTenureSelector from "./chat/ChatTenureSelector";
import ChatInputBar from "./chat/ChatInputBar";

interface ChatbotOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice: number;
  productName: string;
  onApproval: (
    lender: "bajaj" | "homecredit",
    limit: number,
    tenure: number,
  ) => void;
  lender: "bajaj" | "homecredit";
}

export default function ChatbotOverlay({
  isOpen,
  onClose,
  productPrice,
  productName,
  onApproval,
  lender,
}: ChatbotOverlayProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<"phone" | "otp" | "approved" | "denied">(
    "phone",
  );
  const [phone, setPhone] = useState("");
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
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: userMsg },
    ]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (step === "phone") {
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
          const limit = Math.round(productPrice * 1.2);
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "bot",
              text: "Congratulations! 🎉 Your cardless EMI profile has been approved.",
            },
            {
              id: prev.length + 2,
              sender: "bot",
              text: `Approved Limit: ₹${limit.toLocaleString("en-IN")}. Please select your preferred repayment plan below:`,
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
    const limit = Math.round(productPrice * 1.2);
    onApproval(lender, limit, selectedTenure);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0e0e1c] border-t border-white/10 rounded-t-[var(--radius-ricky-lg)] flex flex-col h-[68vh] shadow-[var(--shadow-ricky-lg)] animate-slide-up">
        <ChatHeader onClose={onClose} />

        <ChatMessageList
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />

        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          {step === "approved" ? (
            <ChatTenureSelector
              productPrice={productPrice}
              selectedTenure={selectedTenure}
              onSelectTenure={setSelectedTenure}
              onConfirmPlan={handleConfirmPlan}
            />
          ) : (
            <ChatInputBar
              step={step}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
            />
          )}
        </div>
      </div>
    </div>
  );
}
