import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { FAQS } from "../data";
import { ArrowLeft, HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

export default function FaqPage() {
  const navigate = useNavigate();
  const { openFaq, setOpenFaq } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
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
          FAQs
        </h1>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Common questions about orders, delivery, returns, and payments. Can't find your answer?{" "}
        <button onClick={() => navigate("/chat")} className="text-[#00cfff] underline hover:no-underline">Chat with us</button>.
      </p>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`bg-[#0e0e1c] border rounded-2xl overflow-hidden transition-all ${
              openFaq === i ? "border-[#00cfff]/20" : "border-white/5"
            }`}
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/2 transition-all"
            >
              <div className="flex items-start gap-3">
                <HelpCircle size={15} className="text-[#00cfff] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-white">{faq.q}</span>
              </div>
              <ChevronDown
                size={15}
                className={`text-gray-600 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
              />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-5 pt-1 border-t border-white/5">
                <p className="text-sm text-gray-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-10 p-6 bg-[#0e0e1c] border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="w-14 h-14 rounded-2xl bg-[#00cfff]/8 border border-[#00cfff]/12 flex items-center justify-center shrink-0">
          <MessageCircle size={22} className="text-[#00cfff]" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white mb-1">Still have questions?</p>
          <p className="text-xs text-gray-600">Our support team is online and ready to help. Average response time is under 5 minutes.</p>
        </div>
        <button
          onClick={() => navigate("/chat")}
          className="px-5 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all shrink-0"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}
