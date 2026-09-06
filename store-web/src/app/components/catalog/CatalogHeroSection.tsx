import React from "react";
import {
  Zap,
  MessageCircle,
  Truck,
  Shield,
  CreditCard,
  CheckCircle2,
  BadgePercent,
  ChevronRight,
} from "lucide-react";
import { fmt } from "../../data";
import DeliveryChecker from "../DeliveryChecker";

interface CatalogHeroSectionProps {
  featuredProduct: any;
  onExploreClick: () => void;
  onProductClick: (productName: string) => void;
}

export default function CatalogHeroSection({
  featuredProduct,
  onExploreClick,
  onProductClick,
}: CatalogHeroSectionProps) {
  return (
    <>
      {/* Hero Section with Local Khanna & Punjab SEO Badges */}
      <section className="relative overflow-hidden pt-12 pb-14 px-4 sm:px-6">
        <div className="absolute -top-10 left-1/3 w-[500px] h-[300px] bg-[#00cfff]/6 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#8b5cf6]/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00cfff]/10 border border-[#00cfff]/25 rounded-full text-xs text-[#00cfff] mb-5 font-mono">
              <Zap size={11} fill="currentColor" />
              <span>📍 KHANNA &amp; LUDHIANA'S #1 SMARTPHONE DESTINATION</span>
            </div>
            <h1
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-none tracking-widest mb-4"
            >
              RICKY MOBILE
              <br />
              <span className="text-[#00cfff]">STORE</span>
              <br />
              KHANNA
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
              Authorized showroom for Apple iPhone, Samsung Galaxy, OnePlus, and
              Vivo. Serving Khanna (141401), Ludhiana district &amp; Punjab with
              genuine manufacturer warranties, 0% Bajaj Finserv EMI, certified
              repairs, and same-day delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-wider cursor-pointer shadow-lg shadow-[#00cfff]/20"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                EXPLORE CATALOG
              </button>
              <a
                href="https://wa.me/919876543210?text=Hi%20Ricky%20Mobile%20Store%20Khanna,%20I%20want%20to%20inquire%20about%20a%20phone"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-semibold rounded-2xl transition-all text-sm flex items-center gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp Store
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/5">
              {[
                { Icon: Truck, label: "2-Hour Khanna Delivery (141401)" },
                { Icon: Shield, label: "100% Brand Warranty" },
                { Icon: CreditCard, label: "0% Bajaj EMI (No Card Needed)" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-gray-300 text-xs font-medium"
                >
                  <Icon size={14} className="text-[#00cfff]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Device Showcase */}
          <div className="relative hidden md:flex items-center justify-center">
            <div className="relative w-84 h-84">
              <div className="absolute inset-0 rounded-full border border-[#00cfff]/10 animate-pulse" />
              <div className="absolute inset-6 rounded-full border border-[#00cfff]/5 bg-[#00cfff]/3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={
                    featuredProduct?.image ||
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format"
                  }
                  alt={featuredProduct?.name || "Featured Smartphone Khanna"}
                  className="w-60 h-60 object-cover rounded-3xl shadow-2xl shadow-[#00cfff]/15 hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() =>
                    featuredProduct && onProductClick(featuredProduct.name)
                  }
                />
              </div>
              {featuredProduct && (
                <div className="absolute top-2 right-0 px-3.5 py-2 bg-[#0e0e1c]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
                  <p className="text-xs text-[#00cfff] font-bold font-mono">
                    {fmt(featuredProduct.price - featuredProduct.discount)}
                  </p>
                  <p className="text-[10px] text-gray-300 truncate max-w-[130px]">
                    {featuredProduct.name}
                  </p>
                </div>
              )}
              <div className="absolute bottom-4 left-0 flex items-center gap-2 px-3 py-2 bg-[#0e0e1c]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <p className="text-[10px] text-gray-300">
                  In Stock · G.T. Road Khanna Showroom
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hyperlocal Pincode Delivery Checker Hero Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <DeliveryChecker
          showTitle={true}
          className="border-[#00cfff]/20 shadow-lg shadow-black/40"
        />
      </div>

      {/* Authorized Brands Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="p-4 bg-white/2 rounded-2xl border border-white/5 flex items-center justify-between gap-4 flex-wrap text-center">
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase text-left">
            OFFICIAL PARTNER BRANDS IN KHANNA:
          </span>
          <div className="flex items-center gap-6 flex-wrap justify-center text-xs font-bold text-gray-300">
            <span className="hover:text-white transition-colors">
              🍎 Apple Authorized
            </span>
            <span className="hover:text-white transition-colors">
              🌌 Samsung Galaxy
            </span>
            <span className="hover:text-white transition-colors">
              ⚡ OnePlus Flagship
            </span>
            <span className="hover:text-white transition-colors">
              📸 Vivo Pro Series
            </span>
            <span className="hover:text-white transition-colors">
              🔥 Xiaomi &amp; Redmi
            </span>
            <span className="hover:text-white transition-colors">
              💎 Oppo Reno Series
            </span>
          </div>
        </div>
      </div>

      {/* Promo banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2">
        <div
          onClick={onExploreClick}
          className="flex items-center gap-3 px-5 py-3.5 bg-[#ff2d55]/8 border border-[#ff2d55]/20 rounded-2xl cursor-pointer hover:bg-[#ff2d55]/12 transition-all"
        >
          <BadgePercent size={18} className="text-[#ff2d55] shrink-0" />
          <p className="text-sm text-white">
            <span className="font-bold text-[#ff2d55]">
              FESTIVE STORE PRICING
            </span>{" "}
            <span className="text-gray-400">
              — Zero down payment on Bajaj Finserv &amp; Home Credit EMI.
              Instant ₹3,000 old phone exchange bonus!
            </span>
          </p>
          <ChevronRight size={15} className="text-gray-500 ml-auto shrink-0" />
        </div>
      </div>
    </>
  );
}
