import React from "react";
import { Store, Truck, CreditCard, Wrench, RefreshCw } from "lucide-react";

export default function CatalogTrustSection() {
  const trustFeatures = [
    {
      Icon: Store,
      title: "Physical Khanna Showroom",
      desc: "Visit our G.T. Road store for live phone demos, free screen protector fitting, and free data transfer from old phone.",
    },
    {
      Icon: Truck,
      title: "Same-Day Khanna Delivery",
      desc: "Express delivery within 2–3 hours for pincode 141401 & 141417. Next-day delivery across Ludhiana district.",
    },
    {
      Icon: CreditCard,
      title: "0% Bajaj & Home Credit EMI",
      desc: "Instant loan approval with zero down payment. No credit card required — approved with PAN & Aadhaar.",
    },
    {
      Icon: Wrench,
      title: "Certified Phone Repair",
      desc: "Fast screen replacement, battery upgrades, and motherboard repairs by certified technicians in under 45 mins.",
    },
    {
      Icon: RefreshCw,
      title: "Best Exchange Value",
      desc: "Guaranteed highest trade-in value for your old smartphone with on-the-spot cash or instant discount.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/4">
      <div className="text-center mb-10">
        <span className="text-xs text-[#00cfff] font-mono uppercase tracking-widest block mb-2">
          LOCAL PUNJAB ADVANTAGE
        </span>
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          WHY BUY FROM RICKY MOBILE STORE KHANNA?
        </h2>
        <p className="text-xs text-gray-400 max-w-lg mx-auto mt-2">
          We are not just an online store — we are Khanna's most trusted
          physical showroom on G.T. Road providing hands-on demos, on-the-spot
          repair, and zero-interest financing.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {trustFeatures.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-[#00cfff]/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#00cfff]/10 border border-[#00cfff]/20 flex items-center justify-center mb-3 text-[#00cfff]">
                <Icon size={18} />
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5">{title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
