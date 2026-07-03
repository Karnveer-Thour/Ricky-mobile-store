import { useNavigate } from "react-router";
import { ArrowLeft, Users, Shield, Award, Globe, Heart, Zap } from "lucide-react";
import { PRODUCTS, pct } from "../data";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
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
          ABOUT US
        </h1>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl mb-10">
        <img
          src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&h=500&fit=crop&auto=format"
          alt="Ricky Mobile Store"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <p
            className="text-xs text-[#00cfff] font-bold tracking-widest mb-2"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            FOUNDED 2018 · BENGALURU, INDIA
          </p>
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-5xl font-extrabold text-white tracking-widest leading-none"
          >
            YOUR TRUSTED
            <br />
            MOBILE PARTNER
          </h2>
        </div>
      </div>

      {/* Story */}
      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        <div>
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-3xl font-extrabold text-white tracking-widest mb-4"
          >
            OUR STORY
          </h2>
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>
              Ricky Mobile Store was born in a small shop on MG Road, Bengaluru in 2018. Founder Ricky Sharma noticed
              that customers were being sold overpriced, grey-market phones without proper warranty — and decided to do
              something about it.
            </p>
            <p>
              We started with a simple promise: sell only genuine, brand-authorised phones at fair prices, with full
              warranty and honest after-sales support. That promise still drives everything we do.
            </p>
            <p>
              Today we serve over 50,000 customers across Karnataka, with same-day delivery in Bengaluru and nationwide
              shipping. Every phone we sell is authenticated, every warranty honoured, every customer respected.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "50K+",  label: "Happy Customers",  Icon: Users },
            { value: "100%",  label: "Genuine Products",  Icon: Shield },
            { value: "₹0",    label: "Hidden Charges",    Icon: Award },
            { value: "6+",    label: "Years in Business", Icon: Globe },
          ].map(({ value, label, Icon }) => (
            <div
              key={label}
              className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl text-center hover:border-[#00cfff]/15 transition-all"
            >
              <Icon size={20} className="text-[#00cfff] mx-auto mb-3" />
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-3xl font-extrabold text-white">
                {value}
              </p>
              <p className="text-xs text-gray-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-3xl font-extrabold text-white tracking-widest mb-6"
        >
          OUR VALUES
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              Icon: Shield,
              title: "Authenticity First",
              desc: "Every product sourced directly from brand-authorised distributors. No fakes, no refurbs, no compromises.",
            },
            {
              Icon: Heart,
              title: "Customer Obsessed",
              desc: "Your satisfaction is not a metric. It is the only thing that matters. 7-day returns, no questions asked.",
            },
            {
              Icon: Zap,
              title: "Speed & Reliability",
              desc: "Same-day dispatch for orders before 2 PM. Real-time tracking. Delivery you can actually plan around.",
            },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-[#00cfff]/12 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[#00cfff]/8 border border-[#00cfff]/12 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#00cfff]" />
              </div>
              <h4 className="font-bold text-white text-sm mb-2">{title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-12">
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-3xl font-extrabold text-white tracking-widest mb-6"
        >
          THE TEAM
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              name: "Ricky Sharma",
              role: "Founder & CEO",
              img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
            },
            {
              name: "Priya Nair",
              role: "Head of Operations",
              img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
            },
            {
              name: "Arjun Mehta",
              role: "Product Manager",
              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
            },
            {
              name: "Sneha Kulkarni",
              role: "Customer Experience",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format",
            },
          ].map(({ name, role, img }) => (
            <div
              key={name}
              className="bg-[#0e0e1c] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#00cfff]/15 transition-all"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-gray-600 mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-[#0e0e1c] border border-white/5 rounded-3xl text-center">
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest mb-3"
        >
          READY TO SHOP?
        </h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Join 50,000+ customers who trust Ricky Mobile Store for genuine phones, fair prices, and real support.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            BROWSE PHONES
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="px-6 py-3 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-sm"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
