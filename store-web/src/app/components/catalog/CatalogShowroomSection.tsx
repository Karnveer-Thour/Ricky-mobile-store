import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Store,
  CheckCircle2,
  ExternalLink,
  Star,
} from "lucide-react";

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"
          }
        />
      ))}
    </div>
  );
}

const LOCAL_REVIEWS = [
  {
    name: "Harpreet Singh",
    location: "Khanna, G.T. Road (141401)",
    rating: 5,
    comment:
      "Ordered iPhone 16 online at 2 PM and had it delivered to my doorstep in Khanna by 3:45 PM. Zero cost Bajaj EMI was processed in 5 minutes. Best mobile shop in Punjab!",
  },
  {
    name: "Aman Sharma",
    location: "Ludhiana District",
    rating: 5,
    comment:
      "Great service! Got genuine Samsung Galaxy S25 with official warranty card. Ricky bhai and his team even transferred all my photos and WhatsApp chats for free.",
  },
  {
    name: "Gurpreet Kaur",
    location: "Mandi Gobindgarh (147301)",
    rating: 5,
    comment:
      "Replaced my cracked OnePlus display in under 40 minutes at the Khanna showroom. Genuine OEM screen with 6-month warranty. Very reasonable rates.",
  },
];

export default function CatalogShowroomSection() {
  return (
    <>
      {/* Showroom Visit & Direct Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-gradient-to-br from-[#0e0e1c] to-[#121226] border border-white/8 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00cfff]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00cfff]/10 border border-[#00cfff]/20 rounded-full text-[11px] text-[#00cfff] font-mono mb-4">
                VISIT US IN PERSON
              </div>
              <h3
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-4xl font-extrabold text-white tracking-wider mb-4"
              >
                EXPERIENCE OUR SHOWROOM ON G.T. ROAD, KHANNA
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Looking to test phone cameras, check screen refresh rates, or
                get immediate cash for your old phone? Walk in to our showroom
                today. We are conveniently situated near the main Khanna bus
                stand.
              </p>

              <div className="space-y-3 text-xs text-gray-300 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="text-[#00cfff] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-white block">
                      Ricky Mobile Store
                    </strong>
                    <span>
                      G.T. Road, Near Bus Stand, Khanna, District Ludhiana,
                      Punjab - 141401
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#00cfff] shrink-0" />
                  <span>
                    Monday to Saturday: 10:00 AM – 9:00 PM · Sunday: 11:00 AM –
                    7:00 PM
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#00cfff] shrink-0" />
                  <a
                    href="tel:+919876543210"
                    className="hover:text-white font-mono font-semibold"
                  >
                    +91 98765 43210 (Direct Store Helpline)
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=30.7046,76.2219"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="px-6 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl hover:bg-[#00cfff]/90 transition-all text-xs tracking-wider flex items-center gap-2 shadow-md shadow-[#00cfff]/20"
                >
                  <MapPin size={14} /> GET DIRECTIONS ON GOOGLE MAPS
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Ricky%20Mobile%20Store%20Khanna,%20please%20send%20your%20current%20stock%20and%20offers"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 font-semibold rounded-xl transition-all text-xs flex items-center gap-2"
                >
                  <MessageCircle size={14} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Simulated Live Showroom Map Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#07070f] p-6 text-center flex flex-col items-center justify-center min-h-[260px]">
              <div className="w-12 h-12 rounded-2xl bg-[#00cfff]/10 border border-[#00cfff]/20 flex items-center justify-center text-[#00cfff] mb-4">
                <Store size={24} />
              </div>
              <h4 className="font-bold text-white text-base mb-1">
                Ricky Mobile Store Khanna
              </h4>
              <p className="text-xs text-gray-400 mb-4 max-w-xs">
                District Ludhiana, Punjab · Pin: 141401 · Landmark: G.T. Road
                Bus Stand
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full font-semibold mb-5">
                <CheckCircle2 size={13} /> STORE OPEN TODAY UNTIL 9:00 PM
              </div>
              <a
                href="https://maps.google.com/?q=30.7046,76.2219"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#00cfff] hover:underline flex items-center gap-1 font-mono"
              >
                <span>View Coordinates: 30.7046° N, 76.2219° E</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Local Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/4">
        <div className="text-center mb-8">
          <span className="text-xs text-[#00cfff] font-mono uppercase tracking-widest block mb-1">
            LOCAL VERIFIED BUYERS
          </span>
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-3xl font-extrabold text-white tracking-widest"
          >
            TRUSTED BY THOUSANDS IN KHANNA & LUDHIANA
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {LOCAL_REVIEWS.map((rev) => (
            <div
              key={rev.name}
              className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <StarRow rating={rev.rating} size={13} />
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Verified Local Purchase
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#00cfff]/20 text-[#00cfff] flex items-center justify-center font-bold text-xs">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{rev.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {rev.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
