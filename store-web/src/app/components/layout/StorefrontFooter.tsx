import React from "react";
import { Link } from "react-router";
import { Smartphone, MapPin, Phone, MessageCircle } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "EMI & LOANS",
    links: [
      { label: "✅ Bajaj Finserv Authorized", to: "/offers" },
      { label: "🏠 Home Credit Partner Store", to: "/offers" },
      { label: "💳 No Cost Credit Card EMI", to: "/offers" },
      { label: "📱 Instant Phone Exchange", to: "/chat" },
    ],
  },
  {
    title: "CUSTOMER CARE",
    links: [
      { label: "Track Your Order", to: "/orders" },
      { label: "Pincode Delivery Check", to: "/" },
      { label: "Return & Warranty Policy", to: "/faq" },
      { label: "Screen & Battery Repair", to: "/chat" },
      { label: "Store FAQs", to: "/faq" },
    ],
  },
  {
    title: "STORE INFO",
    links: [
      { label: "About Ricky Mobile Store", to: "/about" },
      { label: "Khanna Showroom Visit", to: "/about" },
      { label: "Privacy Policy", to: "/faq" },
      { label: "Terms of Service", to: "/faq" },
    ],
  },
];

export default function StorefrontFooter() {
  return (
    <footer
      className="border-t border-white/5 px-4 sm:px-6 py-12 mt-8 bg-[#0e0e1c]/40"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#00cfff] flex items-center justify-center">
              <Smartphone size={16} className="text-[#07070f]" />
            </div>
            <span
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-xl font-extrabold text-white tracking-widest"
            >
              RICKY MOBILE STORE<span className="text-[#00cfff]">.</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Khanna & Ludhiana district's #1 trusted destination for flagship
            smartphones, genuine brand warranties, certified screen/battery
            repair, and 0% interest Bajaj Finserv EMI.
          </p>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#00cfff] shrink-0 mt-0.5" />
              <span>
                G.T. Road, Near Bus Stand, Khanna, District Ludhiana, Punjab -
                141401
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#00cfff] shrink-0" />
              <a
                href="tel:+919876543210"
                className="hover:text-white transition-colors"
              >
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#25D366] shrink-0" />
              <a
                href="https://wa.me/919876543210?text=Hello%20Ricky%20Mobile%20Store%20Khanna,%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noreferrer"
                className="text-[#25D366] hover:underline"
              >
                WhatsApp Store Support (+91 98765 43210)
              </a>
            </div>
            <div className="text-[11px] text-gray-500 font-mono pt-1">
              ⏰ Mon–Sat: 10:00 AM – 9:00 PM | Sun: 11:00 AM – 7:00 PM
            </div>
          </div>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4
              className="text-[10px] text-gray-400 tracking-widest mb-4 font-bold"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {section.title}
            </h4>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-xs text-gray-500 hover:text-[#00cfff] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-3 text-xs text-gray-500">
        <p>
          © 2026 Ricky Mobile Store. Serving Khanna (141401), Ludhiana & Punjab
          with Pride.
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace" }}>
          Hyperlocal Delivery & Repair Certified
        </p>
      </div>
    </footer>
  );
}
