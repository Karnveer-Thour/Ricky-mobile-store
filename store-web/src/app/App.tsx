import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart, Heart, Search, Menu, X, Star,
  Truck, Shield, Zap, User, Package, CreditCard,
  ArrowLeft, Plus, Minus, Check, MapPin,
  Smartphone, Home, Briefcase, Clock, XCircle,
  CheckCircle2, ChevronRight, BadgePercent,
  Camera, Mail, Phone, Calendar, Edit3, LogOut,
  Bell, Lock, Trash2, MessageCircle, Send,
  HelpCircle, Tag, RotateCcw, AlertCircle,
  Users, Award, Globe, ChevronDown
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 1, name: "Smartphones" },
  { id: 2, name: "Accessories" },
  { id: 3, name: "Tablets" },
  { id: 4, name: "Wearables" },
  { id: 5, name: "Audio" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 134900,
    discount: 5000,
    description:
      "The most advanced iPhone ever. Titanium design meets A17 Pro silicon. ProRes video, Action button, and a 48MP camera system that redefines mobile photography.",
    quantity: 50,
    warranty: "1 Year Apple Warranty",
    specifications:
      "Display:6.7\" Super Retina XDR OLED 120Hz ProMotion|Chip:A17 Pro (3nm)|RAM:8GB|Camera:48MP Main + 12MP UW + 12MP 5x Telephoto|Battery:4422mAh|Storage:256GB|OS:iOS 17",
    categoryId: 1,
    colors: [
      { id: 1, colorName: "Natural Titanium", quantity: 20, hex: "#9E9E9E" },
      { id: 2, colorName: "Black Titanium", quantity: 15, hex: "#2C2C2E" },
      { id: 3, colorName: "White Titanium", quantity: 15, hex: "#EAE8E3" },
      { id: 4, colorName: "Blue Titanium", quantity: 10, hex: "#4A6E9A" },
    ],
    reviews: [
      { id: 1, title: "Incredible camera!", description: "The 48MP camera with 5x zoom is stunning. Night mode captures details I never expected from a phone.", user: "Arjun M.", rating: 5 },
      { id: 2, title: "Best iPhone yet", description: "Titanium body feels incredibly premium. Battery lasts all day even with heavy use.", user: "Priya S.", rating: 5 },
      { id: 3, title: "Worth every rupee", description: "ProMotion display and A17 Pro performance are flawless. Gaming at 120Hz is buttery smooth.", user: "Karan V.", rating: 4 },
    ],
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&auto=format",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 129999,
    discount: 10000,
    description:
      "The ultimate Android powerhouse. Built-in S Pen, 200MP camera with AI-powered zoom, and the raw performance of Snapdragon 8 Gen 3.",
    quantity: 35,
    warranty: "1 Year Samsung Warranty",
    specifications:
      "Display:6.8\" Dynamic AMOLED 2X 120Hz|Chip:Snapdragon 8 Gen 3|RAM:12GB|Camera:200MP Main + 12MP UW + 50MP Tele x2 + 10MP Tele x10|Battery:5000mAh|Storage:256GB",
    categoryId: 1,
    colors: [
      { id: 5, colorName: "Titanium Black", quantity: 15, hex: "#1A1A1A" },
      { id: 6, colorName: "Titanium Gray", quantity: 10, hex: "#6B6B6B" },
      { id: 7, colorName: "Titanium Violet", quantity: 10, hex: "#4A3F6B" },
    ],
    reviews: [
      { id: 4, title: "S Pen is a game changer", description: "I use the S Pen daily for note-taking and sketches. Galaxy AI features are genuinely useful.", user: "Rahul D.", rating: 5 },
      { id: 5, title: "200MP speaks for itself", description: "Zooming at 200MP is surreal. The 100x Space Zoom actually works in good lighting.", user: "Meera P.", rating: 4 },
    ],
    image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&h=800&fit=crop&auto=format",
    badge: "New",
  },
  {
    id: 3,
    name: "OnePlus 12",
    price: 64999,
    discount: 5000,
    description:
      "The flagship killer returns. Hasselblad-tuned triple cameras, 100W SUPERVOOC charging, and Snapdragon 8 Gen 3 at a price that makes flagships nervous.",
    quantity: 60,
    warranty: "1 Year OnePlus Warranty",
    specifications:
      "Display:6.82\" LTPO AMOLED 1-120Hz|Chip:Snapdragon 8 Gen 3|RAM:12GB|Camera:50MP Hasselblad + 48MP UW + 64MP Periscope|Battery:5400mAh|Storage:256GB",
    categoryId: 1,
    colors: [
      { id: 8, colorName: "Silky Black", quantity: 30, hex: "#0D0D0D" },
      { id: 9, colorName: "Flowy Emerald", quantity: 30, hex: "#1F5C44" },
    ],
    reviews: [],
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&h=800&fit=crop&auto=format",
    badge: "Hot Deal",
  },
  {
    id: 4,
    name: "Google Pixel 8 Pro",
    price: 106999,
    discount: 8000,
    description:
      "AI-first flagship built around Google Tensor G3. Computational photography that redefines the camera phone, with 7 years of OS updates guaranteed.",
    quantity: 25,
    warranty: "3 Years Google Warranty",
    specifications:
      "Display:6.7\" LTPO OLED 1-120Hz|Chip:Tensor G3|RAM:12GB|Camera:50MP Main + 48MP UW + 48MP Telephoto|Battery:5050mAh|Storage:128GB",
    categoryId: 1,
    colors: [
      { id: 10, colorName: "Obsidian", quantity: 10, hex: "#1A1A1A" },
      { id: 11, colorName: "Porcelain", quantity: 8, hex: "#E8E0D8" },
      { id: 12, colorName: "Bay", quantity: 7, hex: "#7BA4B8" },
    ],
    reviews: [
      { id: 6, title: "AI features are insane", description: "Magic Eraser and Best Take alone justify the purchase. Thermometer sensor is surprisingly useful too.", user: "Sneha K.", rating: 5 },
    ],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&auto=format",
    badge: null,
  },
  {
    id: 5,
    name: "Nothing Phone (2)",
    price: 44999,
    discount: 3000,
    description:
      "Design-forward transparency with the iconic Glyph Interface. Clean Android, zero bloatware, and a personality unlike anything else on the market.",
    quantity: 70,
    warranty: "1 Year Nothing Warranty",
    specifications:
      "Display:6.7\" LTPO OLED 1-120Hz|Chip:Snapdragon 8+ Gen 1|RAM:12GB|Camera:50MP Main + 50MP Ultra Wide|Battery:4700mAh|Storage:256GB",
    categoryId: 1,
    colors: [
      { id: 13, colorName: "White", quantity: 40, hex: "#E8E8E8" },
      { id: 14, colorName: "Dark", quantity: 30, hex: "#1C1C1C" },
    ],
    reviews: [],
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop&auto=format",
    badge: null,
  },
  {
    id: 6,
    name: "Xiaomi 14 Ultra",
    price: 99999,
    discount: 7000,
    description:
      "Leica-engineered quad camera system. Optical periscope zoom, 90W HyperCharge wireless, and an under-display fingerprint sensor that feels like magic.",
    quantity: 40,
    warranty: "1 Year Xiaomi Warranty",
    specifications:
      "Display:6.73\" LTPO AMOLED 1-120Hz|Chip:Snapdragon 8 Gen 3|RAM:16GB|Camera:50MP Leica Main + 50MP UW + 50MP Periscope + 50MP Tele|Battery:5000mAh|Storage:512GB",
    categoryId: 1,
    colors: [
      { id: 15, colorName: "Ceramic Black", quantity: 20, hex: "#111111" },
      { id: 16, colorName: "Ceramic White", quantity: 20, hex: "#F0F0F0" },
    ],
    reviews: [],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format",
    badge: "Premium",
  },
];

const DELIVERY_ADDRESSES = [
  {
    id: 1, label: "HOME" as const, name: "Ricky Sharma", mobile: "+91 98765 43210",
    address: "24, MG Road, Koramangala, Bengaluru, Karnataka — 560034", isDefault: true,
  },
  {
    id: 2, label: "WORK" as const, name: "Ricky Sharma", mobile: "+91 98765 43210",
    address: "Floor 5, Brigade Gateway, Rajajinagar, Bengaluru, Karnataka — 560055", isDefault: false,
  },
];

const MOCK_ORDERS = [
  {
    id: "RMS-2024-0312", status: "DELIVERED" as const,
    items: [{ name: "iPhone 15 Pro Max", color: "Black Titanium", qty: 1, price: 129900 }],
    total: 129900, date: "15 Mar 2024", payment: "UPI",
  },
  {
    id: "RMS-2024-0328", status: "SHIPPED" as const,
    items: [{ name: "OnePlus 12", color: "Silky Black", qty: 1, price: 59999 }],
    total: 59999, date: "28 Mar 2024", payment: "CARD",
  },
  {
    id: "RMS-2024-0401", status: "PENDING" as const,
    items: [{ name: "Samsung Galaxy S24 Ultra", color: "Titanium Black", qty: 1, price: 119999 }],
    total: 119999, date: "1 Apr 2024", payment: "EMI BAJAJ",
  },
];

const FAQS = [
  { q: "How do I track my order?", a: "Go to My Orders and click 'Track Order' on any placed order. You'll see real-time updates including dispatch, in-transit, and delivery milestones." },
  { q: "What is the return policy?", a: "We offer a 7-day hassle-free return policy. The product must be unused, in original packaging, with all accessories included. Our team will pick up from your doorstep for free." },
  { q: "Are all products genuine?", a: "Yes. Every product sold at Ricky Mobile Store is sourced directly from brand-authorised distributors with full manufacturer warranty. We do not sell refurbished or grey-market units." },
  { q: "How does EMI work?", a: "Select EMI at checkout and choose your plan (Bajaj Finserv or Home Credit). No-cost EMI means you pay only the product price, split across months — we absorb the interest." },
  { q: "When will my order be delivered?", a: "Orders placed before 2 PM are dispatched the same day. Standard delivery takes 2–4 business days. Same-day delivery is available in Bengaluru for select pincodes." },
  { q: "Can I change my delivery address after ordering?", a: "You can update the address within 1 hour of placing the order by contacting support via chat. Once the order is shipped, changes are not possible." },
  { q: "Is my payment information secure?", a: "Absolutely. All payments are processed through PCI-DSS compliant gateways. We never store card details on our servers." },
  { q: "How do I claim warranty?", a: "Visit the brand's authorised service centre with your invoice and original packaging. Alternatively, contact us via chat and we'll guide you through the brand's warranty process." },
];

const CHAT_INIT = [
  { id: 1, type: "TEXT" as const, sender: "support", message: "Hi Ricky! Welcome to Ricky Mobile Store support. How can I help you today?", time: "10:02 AM" },
  { id: 2, type: "TEXT" as const, sender: "user", message: "Hi! I ordered a Samsung Galaxy S24 Ultra last week but haven't received a tracking update.", time: "10:04 AM" },
  { id: 3, type: "TEXT" as const, sender: "support", message: "I can see your order RMS-2024-0328. It was dispatched yesterday and is currently in transit to Bengaluru. Expected delivery is tomorrow by 6 PM.", time: "10:05 AM" },
  { id: 4, type: "PAYMENT_REQUEST" as const, sender: "support", message: "Outstanding balance for extended warranty add-on.", amount: 1999, time: "10:06 AM" },
  { id: 5, type: "TEXT" as const, sender: "user", message: "Thanks! I'll think about the warranty. Is there anything else I should know?", time: "10:08 AM" },
  { id: 6, type: "PAYMENT_SUCCESS" as const, sender: "system", message: "Payment of ₹1,999 received successfully.", amount: 1999, time: "10:09 AM" },
  { id: 7, type: "TEXT" as const, sender: "support", message: "Great choice! Your extended warranty is now active for 3 years. You'll receive a confirmation email shortly. Is there anything else I can help with?", time: "10:10 AM" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
const pct = (price: number, disc: number) => Math.round((disc / price) * 100);

const STATUS_CFG = {
  PENDING:   { label: "Pending",   color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", Icon: Clock },
  SHIPPED:   { label: "Shipped",   color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20",     Icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20",   Icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20",       Icon: XCircle },
};

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Page = "home" | "product" | "checkout" | "orders" | "profile" | "wishlist" | "track-order" | "chat" | "offers" | "faq" | "about";
interface CartItem { productId: number; colorId: number; colorName: string; qty: number; }

// ─── STAR ROW ─────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
      ))}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catFilter, setCatFilter] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selColorId, setSelColorId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [payMethod, setPayMethod] = useState("UPI");
  const [selAddrId, setSelAddrId] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [chatMsgs, setChatMsgs] = useState(CHAT_INIT);
  const [chatInput, setChatInput] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [notifToggles, setNotifToggles] = useState({ orderUpdates: true, promos: true, priceAlerts: false, chat: true });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sp = selectedProductId ? PRODUCTS.find((p) => p.id === selectedProductId)! : null;
  const selColor = sp ? (sp.colors.find((c) => c.id === selColorId) ?? sp.colors[0]) : null;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find((pr) => pr.id === i.productId)!;
    return s + (p.price - p.discount) * i.qty;
  }, 0);
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const filtered = PRODUCTS.filter((p) => {
    const mc = catFilter === null || p.categoryId === catFilter;
    const ms = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  function openProduct(id: number) {
    const p = PRODUCTS.find((pr) => pr.id === id)!;
    setSelectedProductId(id);
    setSelColorId(p.colors[0].id);
    setQty(1);
    setActiveTab("specs");
    setPage("product");
    window.scrollTo(0, 0);
  }

  function addToCart(productId: number, colorId: number, colorName: string, quantity: number) {
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === productId && i.colorId === colorId);
      if (ex) return prev.map((i) => i === ex ? { ...i, qty: i.qty + quantity } : i);
      return [...prev, { productId, colorId, colorName, qty: quantity }];
    });
    setCartOpen(true);
  }

  function updateQty(productId: number, colorId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => i.productId === productId && i.colorId === colorId ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter((i) => i.qty > 0)
    );
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);
  }

  function openTrackOrder(orderId: string) {
    setTrackedOrderId(orderId);
    setPage("track-order");
    window.scrollTo(0, 0);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const newMsg = { id: chatMsgs.length + 1, type: "TEXT" as const, sender: "user", message: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setChatMsgs((prev) => [...prev, newMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMsgs((prev) => [...prev, { id: prev.length + 1, type: "TEXT" as const, sender: "support", message: "Thanks for your message! Our team will get back to you shortly. Typical response time is under 5 minutes.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  }

  function placeOrder() {
    setCart([]);
    setOrderPlaced(true);
    setCheckoutStep(1);
    setTimeout(() => { setOrderPlaced(false); setPage("orders"); }, 2200);
  }

  // ── NAVBAR ──────────────────────────────────────────────────────────────────

  const navbar = (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#07070f]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <button
          onClick={() => { setPage("home"); setSelectedProductId(null); }}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#00cfff] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Smartphone size={15} className="text-[#07070f]" />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-xl font-extrabold tracking-widest text-white">
            RICKY<span className="text-[#00cfff]">.</span>
          </span>
        </button>

        <div className="flex-1 relative max-w-sm mx-auto hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage("home"); }}
            placeholder="Search phones, brands..."
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setPage("wishlist")}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ff2d55] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#00cfff] rounded-full text-[9px] font-bold text-[#07070f] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setPage("orders")}
            className="hidden sm:flex p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Package size={19} />
          </button>

          <button
            onClick={() => setPage("profile")}
            className="hidden sm:flex items-center gap-2 ml-1 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-sm text-gray-400 hover:border-[#00cfff]/30 hover:text-white transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-[#00cfff] flex items-center justify-center">
              <User size={11} className="text-[#07070f]" />
            </div>
            <span>Ricky</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2.5 text-gray-500 hover:text-white transition-all"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden bg-[#0e0e1c] border-t border-white/5 px-4 py-3 flex flex-col gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage("home"); setMenuOpen(false); }}
              placeholder="Search phones..."
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
          <button
            onClick={() => { setPage("orders"); setMenuOpen(false); }}
            className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-all"
          >
            <Package size={15} /> My Orders
          </button>
          <button
            onClick={() => { setPage("profile"); setMenuOpen(false); }}
            className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-all"
          >
            <User size={15} /> Profile
          </button>
        </div>
      )}
    </header>
  );

  // ── CART DRAWER ─────────────────────────────────────────────────────────────

  const cartDrawer = (
    <>
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-[#0e0e1c] border-l border-white/6 flex flex-col transition-transform duration-300 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-2xl font-extrabold text-white tracking-widest">
            YOUR CART
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center">
              <ShoppingCart size={28} className="text-gray-700" />
            </div>
            <p className="text-gray-600 text-sm">Your cart is empty.<br />Find something you love.</p>
            <button
              onClick={() => setCartOpen(false)}
              className="px-5 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all tracking-wide"
            >
              Browse Phones
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
              {cart.map((item) => {
                const p = PRODUCTS.find((pr) => pr.id === item.productId)!;
                const ep = p.price - p.discount;
                return (
                  <div key={`${item.productId}-${item.colorId}`} className="flex gap-3 p-4 bg-white/3 rounded-2xl border border-white/5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-snug truncate">{p.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.colorName}</p>
                      <p className="text-sm text-[#00cfff] mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.productId, item.colorId, -1)}
                          className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-white hover:bg-white/12 transition-all"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm text-white w-4 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.colorId, 1)}
                          className="w-6 h-6 rounded-lg bg-white/6 flex items-center justify-center text-white hover:bg-white/12 transition-all"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {fmt(ep * item.qty)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-5 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-white">{fmt(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(cartTotal)}</span>
              </div>
              <button
                onClick={() => { setCartOpen(false); setPage("checkout"); setCheckoutStep(1); }}
                className="w-full py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  // ── HOME PAGE ───────────────────────────────────────────────────────────────

  const homePage = (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 px-4">
        <div className="absolute -top-10 left-1/3 w-[500px] h-[300px] bg-[#00cfff]/6 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#8b5cf6]/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00cfff]/8 border border-[#00cfff]/15 rounded-full text-xs text-[#00cfff] mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Zap size={10} fill="currentColor" />
              NEW ARRIVALS — SUMMER 2024
            </div>
            <h1
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-none tracking-widest mb-5"
            >
              NEXT-GEN<br />
              <span className="text-[#00cfff]">MOBILE</span><br />
              STORE
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
              Flagship smartphones, exclusive deals, and same-day delivery. Every phone you want, at prices that make sense.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                SHOP NOW
              </button>
              <button
                onClick={() => setPage("offers")}
                className="px-6 py-3 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-sm"
              >
                View Offers
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { Icon: Truck, label: "Free Delivery" },
                { Icon: Shield, label: "Genuine Products" },
                { Icon: CreditCard, label: "Easy EMI" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-gray-600 text-xs">
                  <Icon size={13} className="text-[#00cfff]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full border border-[#00cfff]/8" />
              <div className="absolute inset-6 rounded-full border border-[#00cfff]/5 bg-[#00cfff]/3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format"
                  alt="Featured iPhone 15 Pro Max"
                  className="w-56 h-56 object-cover rounded-3xl shadow-2xl shadow-[#00cfff]/10 hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => openProduct(1)}
                />
              </div>
              <div className="absolute top-4 right-0 px-3 py-1.5 bg-[#0e0e1c] border border-white/10 rounded-xl shadow-xl">
                <p className="text-xs text-[#00cfff] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(129900)}</p>
                <p className="text-[10px] text-gray-600">iPhone 15 Pro Max</p>
              </div>
              <div className="absolute bottom-6 left-0 flex items-center gap-2 px-3 py-2 bg-[#0e0e1c] border border-white/10 rounded-xl shadow-xl">
                <CheckCircle2 size={13} className="text-green-400" />
                <p className="text-[10px] text-gray-400">In Stock · Ships today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-[#ff2d55]/8 border border-[#ff2d55]/20 rounded-2xl">
          <BadgePercent size={16} className="text-[#ff2d55] shrink-0" />
          <p className="text-sm text-white">
            <span className="font-bold text-[#ff2d55]">SALE ON NOW</span>{" "}
            <span className="text-gray-400">— Up to {pct(PRODUCTS[1].price, PRODUCTS[1].discount)}% off Samsung S24 Ultra. Limited stock.</span>
          </p>
          <ChevronRight size={14} className="text-gray-600 ml-auto shrink-0" />
        </div>
      </div>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setCatFilter(null)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${catFilter === null ? "bg-[#00cfff] text-[#07070f]" : "bg-white/4 border border-white/8 text-gray-500 hover:text-white hover:border-white/15"}`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${catFilter === c.id ? "bg-[#00cfff] text-[#07070f]" : "bg-white/4 border border-white/8 text-gray-500 hover:text-white hover:border-white/15"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-end justify-between mb-6">
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-3xl font-extrabold text-white tracking-widest"
          >
            {search ? `"${search}"` : "FEATURED PHONES"}
          </h2>
          <span className="text-xs text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{filtered.length} products</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <Smartphone size={44} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => {
              const ep = product.price - product.discount;
              const avgR = product.reviews.length
                ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
                : 0;
              return (
                <div
                  key={product.id}
                  className="group bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden hover:border-[#00cfff]/15 hover:shadow-lg hover:shadow-[#00cfff]/4 transition-all duration-300"
                >
                  <div
                    className="relative aspect-square overflow-hidden bg-[#141425] cursor-pointer"
                    onClick={() => openProduct(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.badge && (
                        <span className="px-2.5 py-1 bg-[#ff2d55] text-white text-xs font-bold rounded-lg leading-none">
                          {product.badge}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="px-2.5 py-1 bg-[#00cfff] text-[#07070f] text-xs font-bold rounded-lg leading-none">
                          -{pct(product.price, product.discount)}%
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                      <Heart
                        size={15}
                        className={wishlist.includes(product.id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-white"}
                      />
                    </button>
                  </div>

                  <div className="p-4 cursor-pointer" onClick={() => openProduct(product.id)}>
                    <div className="flex gap-1.5 mb-3">
                      {product.colors.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          title={c.colorName}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-[10px] text-gray-700 self-center">+{product.colors.length - 4}</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-white text-[15px] leading-snug">{product.name}</h3>

                    {avgR > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <StarRow rating={avgR} size={11} />
                        <span className="text-[10px] text-gray-700">({product.reviews.length})</span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                      <span
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {fmt(ep)}
                      </span>
                      {product.discount > 0 && (
                        <span
                          className="text-xs text-gray-700 line-through"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {fmt(product.price)}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-700 mt-1 flex items-center gap-1">
                      <Shield size={9} className="text-[#00cfff]" />
                      {product.warranty}
                    </p>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => addToCart(product.id, product.colors[0].id, product.colors[0].colorName, 1)}
                      className="w-full py-2.5 bg-white/4 border border-white/8 text-white font-semibold rounded-xl text-sm hover:bg-[#00cfff] hover:text-[#07070f] hover:border-[#00cfff] transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Ricky */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/4">
        <h2
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-3xl font-extrabold text-white tracking-widest mb-8 text-center"
        >
          WHY RICKY STORE?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Truck,       title: "Free Delivery",  desc: "Free shipping on all orders above ₹5,000. Same-day delivery in Bengaluru." },
            { Icon: Shield,      title: "100% Genuine",   desc: "Every product is brand-verified and comes with full manufacturer warranty." },
            { Icon: CreditCard,  title: "Flexible EMI",   desc: "0% EMI up to 24 months via Bajaj Finserv, Home Credit, HDFC, and more." },
            { Icon: MapPin,      title: "Easy Returns",   desc: "7-day hassle-free returns. Our team picks it up from your doorstep." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-[#00cfff]/12 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#00cfff]/8 border border-[#00cfff]/12 flex items-center justify-center mb-4">
                <Icon size={17} className="text-[#00cfff]" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1.5">{title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-12 mt-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-[#00cfff] flex items-center justify-center">
                <Smartphone size={13} className="text-[#07070f]" />
              </div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-lg font-extrabold text-white tracking-widest">
                RICKY<span className="text-[#00cfff]">.</span>
              </span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">Your trusted destination for premium smartphones. Authentic products, guaranteed delivery.</p>
          </div>
          {[
            { title: "SHOP",    links: [
              { label: "Smartphones",  action: () => { setCatFilter(1); setPage("home"); } },
              { label: "Accessories",  action: () => { setCatFilter(2); setPage("home"); } },
              { label: "Tablets",      action: () => { setCatFilter(3); setPage("home"); } },
              { label: "Wearables",    action: () => { setCatFilter(4); setPage("home"); } },
              { label: "Offers",       action: () => setPage("offers") },
            ]},
            { title: "SUPPORT", links: [
              { label: "Track Order",      action: () => setPage("orders") },
              { label: "Return Policy",    action: () => setPage("faq") },
              { label: "Warranty Claims",  action: () => setPage("chat") },
              { label: "Contact Us",       action: () => setPage("chat") },
              { label: "FAQs",             action: () => setPage("faq") },
            ]},
            { title: "COMPANY", links: [
              { label: "About Ricky",    action: () => setPage("about") },
              { label: "Careers",        action: () => setPage("about") },
              { label: "Privacy Policy", action: () => setPage("faq") },
              { label: "Terms of Use",   action: () => setPage("faq") },
            ]},
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-[10px] text-gray-700 tracking-widest mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, action }) => (
                  <li key={label}>
                    <button onClick={action} className="text-sm text-gray-600 hover:text-[#00cfff] transition-colors">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/4 flex flex-wrap justify-between items-center gap-3 text-xs text-gray-800">
          <p>© 2024 Ricky Mobile Store. All rights reserved.</p>
          <p style={{ fontFamily: "'DM Mono', monospace" }}>Made with precision in India</p>
        </div>
      </footer>
    </>
  );

  // ── PRODUCT DETAIL ──────────────────────────────────────────────────────────

  const productPage = sp && selColor ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <button
        onClick={() => setPage("home")}
        className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-8 text-sm"
      >
        <ArrowLeft size={15} />
        Back to Store
      </button>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="md:sticky md:top-24 self-start">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#0e0e1c] border border-white/5 relative group">
            <img
              src={sp.image}
              alt={sp.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            {sp.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-[#ff2d55] text-white text-xs font-bold rounded-xl">{sp.badge}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-5xl font-extrabold text-white tracking-widest leading-none mb-3"
          >
            {sp.name}
          </h1>

          {sp.reviews.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <StarRow rating={Math.round(sp.reviews.reduce((s, r) => s + r.rating, 0) / sp.reviews.length)} size={14} />
              <span className="text-sm text-gray-600">
                {(sp.reviews.reduce((s, r) => s + r.rating, 0) / sp.reviews.length).toFixed(1)} ({sp.reviews.length} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
              {fmt(sp.price - sp.discount)}
            </span>
            {sp.discount > 0 && (
              <>
                <span className="text-lg text-gray-700 line-through" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {fmt(sp.price)}
                </span>
                <span className="px-2.5 py-0.5 bg-green-500/12 border border-green-500/20 text-green-400 text-xs font-bold rounded-lg">
                  Save {fmt(sp.discount)}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-700 mb-5 flex items-center gap-1.5">
            <Shield size={10} className="text-[#00cfff]" />
            {sp.warranty}
          </p>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">{sp.description}</p>

          {/* Color picker */}
          <div className="mb-6">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              Color — <span className="text-white">{selColor.colorName}</span>
            </p>
            <div className="flex gap-3">
              {sp.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelColorId(c.id)}
                  title={c.colorName}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${c.id === selColorId ? "border-[#00cfff] scale-110 shadow-md shadow-[#00cfff]/20" : "border-white/15 hover:border-white/30"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="text-[11px] text-gray-700 mt-2">{selColor.quantity} units available</p>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-xs text-gray-600 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Qty</p>
            <div className="inline-flex items-center bg-white/4 border border-white/8 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/8 transition-all"
              >
                <Minus size={13} />
              </button>
              <span
                className="text-white w-8 text-center text-sm border-x border-white/8"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(selColor.quantity, qty + 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/8 transition-all"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => addToCart(sp.id, selColorId!, selColor.colorName, qty)}
              className="flex-1 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              ADD TO CART
            </button>
            <button
              onClick={() => toggleWishlist(sp.id)}
              className="w-14 flex items-center justify-center border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
            >
              <Heart size={17} className={wishlist.includes(sp.id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-gray-500"} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/6 mb-5">
            <div className="flex gap-0">
              {(["specs", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === tab ? "border-[#00cfff] text-[#00cfff]" : "border-transparent text-gray-600 hover:text-gray-300"}`}
                >
                  {tab === "reviews" ? `Reviews (${sp.reviews.length})` : "Specifications"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "specs" && (
            <div>
              {sp.specifications.split("|").map((spec, i) => {
                const ci = spec.indexOf(":");
                const key = spec.slice(0, ci).trim();
                const val = spec.slice(ci + 1).trim();
                return (
                  <div key={i} className="flex gap-6 py-3 border-b border-white/4">
                    <span className="text-xs text-gray-700 w-24 shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{key}</span>
                    <span className="text-xs text-gray-400">{val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              {sp.reviews.length === 0 ? (
                <p className="text-gray-700 text-sm py-4">No reviews yet. Be the first to review!</p>
              ) : sp.reviews.map((r) => (
                <div key={r.id} className="p-4 bg-white/3 rounded-2xl border border-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{r.title}</p>
                      <p className="text-xs text-gray-700 mt-0.5">{r.user}</p>
                    </div>
                    <StarRow rating={r.rating} size={11} />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* EMI teaser */}
          <div className="mt-6 p-4 bg-[#8b5cf6]/6 border border-[#8b5cf6]/15 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard size={13} className="text-[#8b5cf6]" />
              <p className="text-xs font-bold text-[#8b5cf6] tracking-wide">EASY EMI AVAILABLE</p>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Starting from{" "}
              <span className="text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
                {fmt(Math.round((sp.price - sp.discount) / 12))}/mo
              </span>{" "}
              — 0% interest via Bajaj Finserv &amp; Home Credit. No cost EMI on select cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // ── CHECKOUT ────────────────────────────────────────────────────────────────

  const checkoutPage = (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <button
        onClick={() => setPage("home")}
        className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-8 text-sm"
      >
        <ArrowLeft size={15} /> Continue Shopping
      </button>

      {orderPlaced ? (
        <div className="text-center py-28 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-500/12 border border-green-500/25 flex items-center justify-center mb-6">
            <Check size={36} className="text-green-400" />
          </div>
          <h2
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-5xl font-extrabold text-white tracking-widest mb-3"
          >
            ORDER PLACED!
          </h2>
          <p className="text-gray-600 text-sm">Redirecting to your orders…</p>
        </div>
      ) : (
        <>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-4xl font-extrabold text-white tracking-widest mb-8"
          >
            CHECKOUT
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {["Delivery", "Payment", "Confirm"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => { if (i + 1 < checkoutStep) setCheckoutStep(i + 1); }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${checkoutStep > i + 1 ? "bg-green-500 text-white cursor-pointer" : checkoutStep === i + 1 ? "bg-[#00cfff] text-[#07070f]" : "bg-white/6 text-gray-700"}`}
                >
                  {checkoutStep > i + 1 ? <Check size={12} /> : i + 1}
                </button>
                <span className={`text-sm font-medium hidden sm:block ${checkoutStep === i + 1 ? "text-white" : "text-gray-700"}`}>{s}</span>
                {i < 2 && <div className="w-8 sm:w-12 h-px bg-white/8" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              {/* Step 1 */}
              {checkoutStep === 1 && (
                <div>
                  <h2
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-2xl font-extrabold text-white tracking-widest mb-5"
                  >
                    DELIVERY ADDRESS
                  </h2>
                  <div className="space-y-3 mb-6">
                    {DELIVERY_ADDRESSES.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${selAddrId === addr.id ? "border-[#00cfff]/30 bg-[#00cfff]/4" : "border-white/6 bg-white/2 hover:border-white/12"}`}
                      >
                        <input
                          type="radio"
                          name="addr"
                          checked={selAddrId === addr.id}
                          onChange={() => setSelAddrId(addr.id)}
                          className="mt-1 accent-[#00cfff]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {addr.label === "HOME" ? <Home size={11} className="text-[#00cfff]" /> : <Briefcase size={11} className="text-[#00cfff]" />}
                            <span className="text-xs text-[#00cfff] tracking-wider" style={{ fontFamily: "'DM Mono', monospace" }}>{addr.label}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-md">Default</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white">{addr.name}</p>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{addr.address}</p>
                          <p className="text-xs text-gray-700 mt-0.5">{addr.mobile}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="w-full py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {checkoutStep === 2 && (
                <div>
                  <h2
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-2xl font-extrabold text-white tracking-widest mb-5"
                  >
                    PAYMENT METHOD
                  </h2>
                  <div className="space-y-2.5 mb-6">
                    {[
                      { id: "UPI",              label: "UPI",                  desc: "Google Pay, PhonePe, Paytm — instant transfer" },
                      { id: "CARD",             label: "Credit / Debit Card",  desc: "Visa, Mastercard, RuPay — all banks" },
                      { id: "NETBANKING",       label: "Net Banking",           desc: "50+ banks supported" },
                      { id: "EMI_BAJAJ",        label: "Bajaj Finserv EMI",    desc: "0% EMI, up to 24 months — pre-approved" },
                      { id: "EMI_HOMECREDIT",   label: "Home Credit EMI",      desc: "Flexible plans starting at ₹999/mo" },
                    ].map((pm) => (
                      <label
                        key={pm.id}
                        className={`flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${payMethod === pm.id ? "border-[#00cfff]/30 bg-[#00cfff]/4" : "border-white/6 bg-white/2 hover:border-white/12"}`}
                      >
                        <input
                          type="radio"
                          name="pay"
                          checked={payMethod === pm.id}
                          onChange={() => setPayMethod(pm.id)}
                          className="mt-0.5 accent-[#00cfff]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white">{pm.label}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {payMethod.startsWith("EMI") && (
                    <div className="p-4 bg-[#8b5cf6]/6 border border-[#8b5cf6]/15 rounded-2xl mb-6">
                      <p className="text-xs font-bold text-[#8b5cf6] tracking-wide mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>EMI BREAKDOWN</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        {[
                          ["Provider",        payMethod === "EMI_BAJAJ" ? "Bajaj Finserv" : "Home Credit"],
                          ["Tenure",          "12 months"],
                          ["Interest Rate",   "0% p.a."],
                          ["Monthly EMI",     fmt(Math.round(cartTotal / 12))],
                          ["Processing Fee",  fmt(499)],
                          ["Down Payment",    fmt(0)],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2">
                            <span className="text-gray-700">{k}</span>
                            <span className="text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="px-5 py-3.5 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCheckoutStep(3)}
                      className="flex-1 py-3.5 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      REVIEW ORDER
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {checkoutStep === 3 && (
                <div>
                  <h2
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    className="text-2xl font-extrabold text-white tracking-widest mb-5"
                  >
                    REVIEW ORDER
                  </h2>
                  <div className="space-y-3 mb-5">
                    {cart.map((item) => {
                      const p = PRODUCTS.find((pr) => pr.id === item.productId)!;
                      const ep = p.price - p.discount;
                      return (
                        <div key={`${item.productId}-${item.colorId}`} className="flex gap-4 p-4 bg-white/3 rounded-2xl border border-white/5">
                          <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{item.colorName} · Qty {item.qty}</p>
                            <p className="text-sm text-[#00cfff] mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep * item.qty)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-white/3 rounded-2xl border border-white/5 mb-5 text-sm space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Payment Method</span>
                      <span className="text-white font-semibold">{payMethod.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="text-green-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5 text-base">
                      <span>Total</span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(cartTotal)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="px-5 py-3.5 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={placeOrder}
                      className="flex-1 py-3.5 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-400 transition-all text-sm tracking-widest"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      PLACE ORDER
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div>
              <div className="sticky top-24 p-5 bg-[#0e0e1c] border border-white/6 rounded-3xl">
                <h3
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-lg font-extrabold text-white tracking-widest mb-4"
                >
                  ORDER SUMMARY
                </h3>
                <div className="space-y-2.5 mb-4">
                  {cart.map((item) => {
                    const p = PRODUCTS.find((pr) => pr.id === item.productId)!;
                    return (
                      <div key={`${item.productId}-${item.colorId}`} className="flex justify-between gap-2 text-xs">
                        <span className="text-gray-600 truncate">{p.name} ×{item.qty}</span>
                        <span className="text-white shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>
                          {fmt((p.price - p.discount) * item.qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // ── ORDERS PAGE ─────────────────────────────────────────────────────────────

  const ordersPage = (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setPage("home")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          MY ORDERS
        </h1>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => {
          const cfg = STATUS_CFG[order.status];
          const Icon = cfg.Icon;
          return (
            <div
              key={order.id}
              className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <p className="text-xs text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{order.id}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.color} shrink-0`}>
                  <Icon size={12} />
                  <span className="text-xs font-bold">{cfg.label}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-400 truncate">
                      {item.name}{" "}
                      <span className="text-gray-700 text-xs">({item.color}) ×{item.qty}</span>
                    </span>
                    <span className="text-white shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {fmt(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <p className="text-xs text-gray-700">
                  via <span className="text-gray-500 font-semibold">{order.payment}</span>
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openTrackOrder(order.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 text-xs text-gray-400 hover:text-[#00cfff] hover:border-[#00cfff]/25 transition-all font-semibold"
                  >
                    <Truck size={12} /> Track
                  </button>
                  <p className="font-bold text-white text-lg" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {fmt(order.total)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── PROFILE PAGE ────────────────────────────────────────────────────────────

  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<"info" | "addresses" | "wishlist" | "settings">("info");
  const [profileData, setProfileData] = useState({
    firstName: "Ricky",
    lastName: "Sharma",
    email: "ricky.sharma@gmail.com",
    mobileNumber: "+91 98765 43210",
    dateBirth: "1995-07-14",
    role: "USER",
    pictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
  });

  const profilePage = (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setPage("home")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          MY PROFILE
        </h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Avatar card */}
          <div className="p-5 bg-[#0e0e1c] border border-white/5 rounded-3xl mb-4 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5">
                <img
                  src={profileData.pictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#00cfff] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#00cfff]/20">
                <Camera size={12} className="text-[#07070f]" />
              </button>
            </div>
            <p className="font-semibold text-white text-sm">{profileData.firstName} {profileData.lastName}</p>
            <p className="text-xs text-gray-600 mt-0.5">{profileData.email}</p>
            <span className="mt-2 px-2.5 py-0.5 bg-[#00cfff]/10 border border-[#00cfff]/20 text-[#00cfff] text-[10px] font-bold rounded-full tracking-wide" style={{ fontFamily: "'DM Mono', monospace" }}>
              {profileData.role}
            </span>
          </div>

          {/* Nav tabs */}
          <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden">
            {(
              [
                { id: "info",      label: "Personal Info",  Icon: User },
                { id: "addresses", label: "Addresses",      Icon: MapPin },
                { id: "wishlist",  label: "Wishlist",       Icon: Heart },
                { id: "settings",  label: "Settings",       Icon: Bell },
              ] as { id: "info" | "addresses" | "wishlist" | "settings"; label: string; Icon: typeof User }[]
            ).map(({ id, label, Icon }, i, arr) => (
              <button
                key={id}
                onClick={() => setProfileTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all ${profileTab === id ? "bg-[#00cfff]/8 text-[#00cfff] border-l-2 border-[#00cfff]" : "text-gray-500 hover:text-white hover:bg-white/3 border-l-2 border-transparent"} ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
              >
                <Icon size={15} />
                {label}
                {id === "wishlist" && wishlist.length > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#ff2d55] text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat support */}
          <button
            onClick={() => setPage("chat")}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-white/8 text-gray-500 text-sm rounded-2xl hover:border-[#00cfff]/25 hover:text-[#00cfff] transition-all"
          >
            <MessageCircle size={14} />
            Support Chat
          </button>

          {/* Logout */}
          <button className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-white/8 text-gray-600 text-sm rounded-2xl hover:border-[#ff2d55]/30 hover:text-[#ff2d55] transition-all">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">

          {/* ── Personal Info ── */}
          {profileTab === "info" && (
            <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-2xl font-extrabold text-white tracking-widest"
                >
                  PERSONAL INFO
                </h2>
                <button
                  onClick={() => setEditingField(editingField ? null : "all")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-sm text-gray-400 hover:text-[#00cfff] hover:border-[#00cfff]/30 transition-all"
                >
                  <Edit3 size={13} />
                  {editingField ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name",    key: "firstName",    Icon: User,     value: profileData.firstName },
                  { label: "Last Name",     key: "lastName",     Icon: User,     value: profileData.lastName },
                  { label: "Email Address", key: "email",        Icon: Mail,     value: profileData.email },
                  { label: "Mobile Number", key: "mobileNumber", Icon: Phone,    value: profileData.mobileNumber },
                  { label: "Date of Birth", key: "dateBirth",    Icon: Calendar, value: profileData.dateBirth },
                  { label: "Role",          key: "role",         Icon: Shield,   value: profileData.role },
                ].map(({ label, key, Icon, value }) => (
                  <div key={key} className="group">
                    <label className="block text-[10px] text-gray-700 mb-1.5 tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {label.toUpperCase()}
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/3 border border-white/5 rounded-xl focus-within:border-[#00cfff]/30 transition-all">
                      <Icon size={14} className="text-gray-700 shrink-0" />
                      {editingField && key !== "role" ? (
                        <input
                          type={key === "dateBirth" ? "date" : "text"}
                          value={value}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                        />
                      ) : (
                        <span className="text-sm text-white">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {editingField && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditingField(null)}
                    className="flex-1 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    SAVE CHANGES
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="px-5 py-3 border border-white/8 text-gray-500 rounded-xl hover:bg-white/4 transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Addresses ── */}
          {profileTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  className="text-2xl font-extrabold text-white tracking-widest"
                >
                  SAVED ADDRESSES
                </h2>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00cfff]/10 border border-[#00cfff]/20 text-[#00cfff] text-sm font-semibold hover:bg-[#00cfff]/15 transition-all">
                  <Plus size={13} />
                  Add New
                </button>
              </div>

              <div className="space-y-4">
                {DELIVERY_ADDRESSES.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00cfff]/8 border border-[#00cfff]/12 flex items-center justify-center shrink-0 mt-0.5">
                          {addr.label === "HOME" ? <Home size={16} className="text-[#00cfff]" /> : <Briefcase size={16} className="text-[#00cfff]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[#00cfff] font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>{addr.label}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-md">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white">{addr.name}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.address}</p>
                          <p className="text-xs text-gray-700 mt-0.5">{addr.mobile}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-[#00cfff] hover:border-[#00cfff]/20 transition-all">
                          <Edit3 size={13} />
                        </button>
                        <button className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-[#ff2d55] hover:border-[#ff2d55]/20 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new address placeholder */}
                <button className="w-full p-5 bg-white/2 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-gray-700 hover:border-[#00cfff]/20 hover:text-[#00cfff] transition-all">
                  <Plus size={16} />
                  <span className="text-sm font-medium">Add a new delivery address</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Wishlist ── */}
          {profileTab === "wishlist" && (
            <div>
              <h2
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-2xl font-extrabold text-white tracking-widest mb-5"
              >
                MY WISHLIST
                <span className="ml-3 text-base text-gray-700 font-normal" style={{ fontFamily: "'DM Mono', monospace" }}>
                  ({wishlistedProducts.length} items)
                </span>
              </h2>

              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#0e0e1c] border border-white/5 rounded-3xl">
                  <Heart size={40} className="mx-auto mb-4 text-gray-800" />
                  <p className="text-gray-600 text-sm">Your wishlist is empty.</p>
                  <button
                    onClick={() => setPage("home")}
                    className="mt-4 px-5 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all"
                  >
                    Browse Phones
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((product) => {
                    const ep = product.price - product.discount;
                    return (
                      <div
                        key={product.id}
                        className="group bg-[#0e0e1c] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00cfff]/15 transition-all"
                      >
                        <div
                          className="relative h-44 overflow-hidden bg-[#141425] cursor-pointer"
                          onClick={() => openProduct(product.id)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                          >
                            <Heart size={14} className="text-[#ff2d55] fill-[#ff2d55]" />
                          </button>
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="text-base font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep)}</span>
                            {product.discount > 0 && (
                              <span className="text-xs text-gray-700 line-through" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(product.price)}</span>
                            )}
                          </div>
                          <button
                            onClick={() => addToCart(product.id, product.colors[0].id, product.colors[0].colorName, 1)}
                            className="w-full mt-3 py-2 bg-white/4 border border-white/8 text-white text-sm font-semibold rounded-xl hover:bg-[#00cfff] hover:text-[#07070f] hover:border-[#00cfff] transition-all"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Settings ── */}
          {profileTab === "settings" && (
            <div className="space-y-4">
              <h2
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                className="text-2xl font-extrabold text-white tracking-widest mb-5"
              >
                ACCOUNT SETTINGS
              </h2>

              {/* Notifications */}
              <div className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl">
                <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                  <Bell size={15} className="text-[#00cfff]" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  {(
                    [
                      { key: "orderUpdates" as const, label: "Order Updates",      desc: "Shipping and delivery notifications" },
                      { key: "promos"       as const, label: "Promotional Offers", desc: "Deals, discounts and new arrivals" },
                      { key: "priceAlerts"  as const, label: "Price Drop Alerts",  desc: "When wishlisted items go on sale" },
                      { key: "chat"         as const, label: "Chat Messages",      desc: "Support and payment chat alerts" },
                    ]
                  ).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-white font-medium">{label}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifToggles((p) => ({ ...p, [key]: !p[key] }))}
                        className={`relative w-11 h-6 rounded-full transition-all shrink-0 ${notifToggles[key] ? "bg-[#00cfff]" : "bg-white/10"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifToggles[key] ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl">
                <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                  <Lock size={15} className="text-[#00cfff]" />
                  Security
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Change Password",      desc: "Update your account password" },
                    { label: "Two-Factor Authentication", desc: "Add extra security to your account" },
                    { label: "Active Sessions",      desc: "Manage devices signed into your account" },
                  ].map(({ label, desc }) => (
                    <button
                      key={label}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-white/3 border border-white/5 rounded-xl hover:border-[#00cfff]/20 hover:bg-white/5 transition-all text-left"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">{label}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                      </div>
                      <ChevronRight size={15} className="text-gray-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="p-5 bg-[#ff2d55]/4 border border-[#ff2d55]/12 rounded-2xl">
                <h3 className="font-semibold text-[#ff2d55] text-sm mb-3 flex items-center gap-2">
                  <Trash2 size={15} />
                  Danger Zone
                </h3>
                <p className="text-xs text-gray-600 mb-4">Once you delete your account, there is no going back. All your orders, wishlists and data will be permanently removed.</p>
                <button className="px-4 py-2 border border-[#ff2d55]/30 text-[#ff2d55] text-sm font-semibold rounded-xl hover:bg-[#ff2d55]/8 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── WISHLIST PAGE ────────────────────────────────────────────────────────────

  const wishlistPage = (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage("home")} className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-4xl font-extrabold text-white tracking-widest">WISHLIST</h1>
          <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{wishlistedProducts.length} saved items</p>
        </div>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-28 flex flex-col items-center bg-[#0e0e1c] border border-white/5 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mb-5">
            <Heart size={30} className="text-gray-700" />
          </div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-3xl font-extrabold text-white tracking-widest mb-2">YOUR WISHLIST IS EMPTY</h2>
          <p className="text-gray-600 text-sm mb-6">Save phones you love by tapping the heart icon on any product.</p>
          <button onClick={() => setPage("home")} className="px-6 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            BROWSE PHONES
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlistedProducts.map((product) => {
              const ep = product.price - product.discount;
              return (
                <div key={product.id} className="group bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden hover:border-[#00cfff]/15 hover:shadow-lg hover:shadow-[#00cfff]/4 transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-[#141425] cursor-pointer" onClick={() => openProduct(product.id)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#00cfff] text-[#07070f] text-xs font-bold rounded-lg">-{pct(product.price, product.discount)}%</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                      <Heart size={15} className="text-[#ff2d55] fill-[#ff2d55]" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm leading-snug truncate">{product.name}</h3>
                    <div className="flex gap-1.5 mt-2 mb-3">
                      {product.colors.slice(0, 4).map((c) => (
                        <div key={c.id} title={c.colorName} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep)}</span>
                      {product.discount > 0 && <span className="text-xs text-gray-700 line-through" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(product.price)}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product.id, product.colors[0].id, product.colors[0].colorName, 1)}
                        className="flex-1 py-2 bg-[#00cfff] text-[#07070f] text-xs font-bold rounded-xl hover:bg-[#00cfff]/90 transition-all"
                      >
                        Add to Cart
                      </button>
                      <button onClick={() => openProduct(product.id)} className="px-3 py-2 border border-white/8 text-gray-500 text-xs rounded-xl hover:text-white hover:border-white/15 transition-all">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => { wishlistedProducts.forEach((p) => addToCart(p.id, p.colors[0].id, p.colors[0].colorName, 1)); }}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-sm"
            >
              <ShoppingCart size={15} />
              Add All to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ── TRACK ORDER PAGE ─────────────────────────────────────────────────────────

  const trackedOrder = MOCK_ORDERS.find((o) => o.id === trackedOrderId) ?? MOCK_ORDERS[0];
  const trackSteps = [
    { label: "Order Placed",   desc: "Your order has been confirmed",          done: true,  Icon: CheckCircle2 },
    { label: "Processing",     desc: "Items packed and ready for dispatch",     done: true,  Icon: Package },
    { label: "Shipped",        desc: "Order picked up by delivery partner",     done: trackedOrder.status === "SHIPPED" || trackedOrder.status === "DELIVERED", Icon: Truck },
    { label: "Delivered",      desc: "Package delivered to your address",       done: trackedOrder.status === "DELIVERED", Icon: Home },
  ];
  const activeStep = trackSteps.filter((s) => s.done).length - 1;

  const trackOrderPage = (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage("orders")} className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-4xl font-extrabold text-white tracking-widest">TRACK ORDER</h1>
          <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{trackedOrder.id}</p>
        </div>
      </div>

      {/* Status banner */}
      {(() => {
        const cfg = STATUS_CFG[trackedOrder.status];
        const Icon = cfg.Icon;
        return (
          <div className={`flex items-center gap-4 p-5 rounded-2xl border mb-6 ${cfg.bg} ${cfg.color}`}>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Icon size={22} />
            </div>
            <div>
              <p className="font-extrabold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cfg.label.toUpperCase()}</p>
              <p className="text-sm opacity-80">
                {trackedOrder.status === "DELIVERED" && "Delivered on " + trackedOrder.date}
                {trackedOrder.status === "SHIPPED" && "Estimated delivery by tomorrow, 6 PM"}
                {trackedOrder.status === "PENDING" && "Estimated dispatch within 24 hours"}
                {trackedOrder.status === "CANCELLED" && "Order was cancelled on " + trackedOrder.date}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Timeline */}
      <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6 mb-6">
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-xl font-extrabold text-white tracking-widest mb-6">DELIVERY TIMELINE</h2>
        <div className="space-y-0">
          {trackSteps.map((step, i) => {
            const Icon = step.Icon;
            const isActive = i === activeStep;
            return (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${step.done ? (isActive ? "bg-[#00cfff] shadow-md shadow-[#00cfff]/30" : "bg-green-500/20 border border-green-500/30") : "bg-white/4 border border-white/8"}`}>
                    <Icon size={16} className={step.done ? (isActive ? "text-[#07070f]" : "text-green-400") : "text-gray-700"} />
                  </div>
                  {i < trackSteps.length - 1 && (
                    <div className={`w-0.5 h-10 my-1 rounded-full ${step.done ? "bg-green-500/30" : "bg-white/6"}`} />
                  )}
                </div>
                <div className="pb-8 pt-1.5 flex-1">
                  <p className={`text-sm font-semibold ${step.done ? (isActive ? "text-[#00cfff]" : "text-white") : "text-gray-700"}`}>{step.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{step.desc}</p>
                  {step.done && (
                    <p className="text-[10px] text-gray-700 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{trackedOrder.date} · {["09:12 AM", "10:45 AM", "02:30 PM", "06:18 PM"][i]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order items */}
      <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6 mb-6">
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-xl font-extrabold text-white tracking-widest mb-4">ORDER ITEMS</h2>
        <div className="space-y-3">
          {trackedOrder.items.map((item, i) => {
            const product = PRODUCTS.find((p) => p.name === item.name);
            return (
              <div key={i} className="flex gap-4 p-4 bg-white/3 rounded-2xl border border-white/5">
                {product && <img src={product.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.color} · Qty {item.qty}</p>
                  <p className="text-sm text-[#00cfff] mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(item.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total paid</span>
          <span className="font-bold text-white text-lg" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(trackedOrder.total)}</span>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6">
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-xl font-extrabold text-white tracking-widest mb-4">DELIVERY ADDRESS</h2>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00cfff]/8 border border-[#00cfff]/12 flex items-center justify-center shrink-0">
            <Home size={16} className="text-[#00cfff]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Ricky Sharma</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">24, MG Road, Koramangala, Bengaluru, Karnataka — 560034</p>
            <p className="text-xs text-gray-700 mt-0.5">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── CHAT PAGE ────────────────────────────────────────────────────────────────

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const chatPage = (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-6 flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <button onClick={() => setPage("home")} className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-10 h-10 rounded-xl bg-[#00cfff]/15 border border-[#00cfff]/20 flex items-center justify-center">
            <MessageCircle size={18} className="text-[#00cfff]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#07070f]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Ricky Support</p>
            <p className="text-xs text-green-400">Online · Avg reply &lt; 5 min</p>
          </div>
        </div>
        <button onClick={() => setPage("faq")} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 text-xs text-gray-500 hover:text-white hover:border-white/15 transition-all">
          <HelpCircle size={13} /> FAQs
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4" style={{ scrollbarWidth: "none" }}>
        {chatMsgs.map((msg) => {
          const isUser = msg.sender === "user";
          const isSystem = msg.sender === "system";

          if (msg.type === "PAYMENT_REQUEST") {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-xs w-full p-4 bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={14} className="text-[#8b5cf6]" />
                    <span className="text-xs font-bold text-[#8b5cf6] tracking-wide">PAYMENT REQUEST</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{msg.message}</p>
                  <p className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(msg.amount!)}</p>
                  <button className="w-full py-2 bg-[#8b5cf6] text-white text-xs font-bold rounded-xl hover:bg-[#8b5cf6]/90 transition-all">Pay Now</button>
                  <p className="text-[10px] text-gray-700 mt-2 text-right" style={{ fontFamily: "'DM Mono', monospace" }}>{msg.time}</p>
                </div>
              </div>
            );
          }

          if (msg.type === "PAYMENT_SUCCESS" || isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <CheckCircle2 size={13} className="text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">{msg.message}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-[#00cfff]/15 flex items-center justify-center shrink-0 mr-2 mt-auto mb-1">
                  <MessageCircle size={13} className="text-[#00cfff]" />
                </div>
              )}
              <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl ${isUser ? "bg-[#00cfff] text-[#07070f] rounded-tr-sm" : "bg-[#141425] border border-white/5 text-white rounded-tl-sm"}`}>
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p className={`text-[10px] mt-1 text-right ${isUser ? "text-[#07070f]/60" : "text-gray-700"}`} style={{ fontFamily: "'DM Mono', monospace" }}>{msg.time}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex gap-3 pt-3 border-t border-white/5">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
          placeholder="Type a message..."
          className="flex-1 bg-white/4 border border-white/8 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00cfff]/40 transition-all"
        />
        <button
          onClick={sendChat}
          className="w-12 h-12 rounded-2xl bg-[#00cfff] flex items-center justify-center hover:bg-[#00cfff]/90 transition-all shrink-0 disabled:opacity-40"
          disabled={!chatInput.trim()}
        >
          <Send size={16} className="text-[#07070f]" />
        </button>
      </div>
    </div>
  );

  // ── OFFERS PAGE ──────────────────────────────────────────────────────────────

  const dealProducts = PRODUCTS.filter((p) => p.discount > 0).sort((a, b) => pct(b.price, b.discount) - pct(a.price, a.discount));

  const offersPage = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage("home")} className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-4xl font-extrabold text-white tracking-widest">OFFERS & DEALS</h1>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff2d55]/15 via-[#8b5cf6]/10 to-[#00cfff]/10 border border-white/8 p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff2d55]/8 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff2d55]/15 border border-[#ff2d55]/25 rounded-full text-xs text-[#ff2d55] font-bold mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
            <Tag size={10} /> LIMITED TIME DEALS
          </div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-5xl font-extrabold text-white tracking-widest mb-2">SAVE UP TO {Math.max(...PRODUCTS.map((p) => pct(p.price, p.discount)))}%</h2>
          <p className="text-gray-400 text-sm max-w-md">Handpicked deals on flagship phones. All orders include free delivery, full warranty, and our 7-day return guarantee.</p>
        </div>
      </div>

      {/* Deal categories */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { Icon: Zap,       title: "Flash Sales",  desc: "Lightning deals updated every 24h", color: "text-yellow-400", bg: "bg-yellow-400/8 border-yellow-400/15" },
          { Icon: Tag,       title: "Best Prices",  desc: "Guaranteed lowest price on flagships", color: "text-[#00cfff]", bg: "bg-[#00cfff]/8 border-[#00cfff]/15" },
          { Icon: RotateCcw, title: "Cashback",     desc: "Up to ₹3,000 cashback on UPI payments", color: "text-green-400", bg: "bg-green-400/8 border-green-400/15" },
        ].map(({ Icon, title, desc, color, bg }) => (
          <div key={title} className={`flex items-start gap-4 p-5 rounded-2xl border ${bg}`}>
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className={`text-sm font-bold ${color}`}>{title}</p>
              <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-2xl font-extrabold text-white tracking-widest mb-5">
        ALL DEALS <span className="text-gray-700 text-base font-normal" style={{ fontFamily: "'DM Mono', monospace" }}>({dealProducts.length} offers)</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealProducts.map((product) => {
          const ep = product.price - product.discount;
          return (
            <div key={product.id} className="group bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff2d55]/15 hover:shadow-lg hover:shadow-[#ff2d55]/4 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-[#141425] cursor-pointer" onClick={() => openProduct(product.id)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-3 py-1.5 bg-[#ff2d55] text-white text-sm font-extrabold rounded-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>-{pct(product.price, product.discount)}% OFF</span>
                  {product.badge && <span className="px-2.5 py-1 bg-[#00cfff] text-[#07070f] text-xs font-bold rounded-lg">{product.badge}</span>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all">
                  <Heart size={15} className={wishlist.includes(product.id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-white"} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-[15px] leading-snug mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(ep)}</span>
                  <span className="text-sm text-gray-700 line-through" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(product.price)}</span>
                </div>
                <p className="text-xs text-green-400 font-semibold mb-3">You save {fmt(product.discount)}</p>
                <button
                  onClick={() => addToCart(product.id, product.colors[0].id, product.colors[0].colorName, 1)}
                  className="w-full py-2.5 bg-[#ff2d55] text-white font-bold rounded-xl text-sm hover:bg-[#ff2d55]/90 transition-all"
                >
                  Grab Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── FAQ PAGE ─────────────────────────────────────────────────────────────────

  const faqPage = (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage("home")} className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-4xl font-extrabold text-white tracking-widest">FAQs</h1>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Common questions about orders, delivery, returns, and payments. Can't find your answer?{" "}
        <button onClick={() => setPage("chat")} className="text-[#00cfff] underline hover:no-underline">Chat with us</button>.
      </p>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className={`bg-[#0e0e1c] border rounded-2xl overflow-hidden transition-all ${openFaq === i ? "border-[#00cfff]/20" : "border-white/5"}`}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/2 transition-all"
            >
              <div className="flex items-start gap-3">
                <HelpCircle size={15} className="text-[#00cfff] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-white">{faq.q}</span>
              </div>
              <ChevronDown size={15} className={`text-gray-600 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
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
          onClick={() => setPage("chat")}
          className="px-5 py-2.5 bg-[#00cfff] text-[#07070f] font-bold rounded-xl text-sm hover:bg-[#00cfff]/90 transition-all shrink-0"
        >
          Start Chat
        </button>
      </div>
    </div>
  );

  // ── ABOUT PAGE ───────────────────────────────────────────────────────────────

  const aboutPage = (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage("home")} className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all">
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-4xl font-extrabold text-white tracking-widest">ABOUT US</h1>
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
          <p className="text-xs text-[#00cfff] font-bold tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>FOUNDED 2018 · BENGALURU, INDIA</p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-5xl font-extrabold text-white tracking-widest leading-none">YOUR TRUSTED<br />MOBILE PARTNER</h2>
        </div>
      </div>

      {/* Story */}
      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-3xl font-extrabold text-white tracking-widest mb-4">OUR STORY</h2>
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>Ricky Mobile Store was born in a small shop on MG Road, Bengaluru in 2018. Founder Ricky Sharma noticed that customers were being sold overpriced, grey-market phones without proper warranty — and decided to do something about it.</p>
            <p>We started with a simple promise: sell only genuine, brand-authorised phones at fair prices, with full warranty and honest after-sales support. That promise still drives everything we do.</p>
            <p>Today we serve over 50,000 customers across Karnataka, with same-day delivery in Bengaluru and nationwide shipping. Every phone we sell is authenticated, every warranty honoured, every customer respected.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "50K+",  label: "Happy Customers",   Icon: Users },
            { value: "100%",  label: "Genuine Products",   Icon: Shield },
            { value: "₹0",    label: "Hidden Charges",     Icon: Award },
            { value: "6+",    label: "Years in Business",  Icon: Globe },
          ].map(({ value, label, Icon }) => (
            <div key={label} className="p-5 bg-[#0e0e1c] border border-white/5 rounded-2xl text-center hover:border-[#00cfff]/15 transition-all">
              <Icon size={20} className="text-[#00cfff] mx-auto mb-3" />
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-gray-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-3xl font-extrabold text-white tracking-widest mb-6">OUR VALUES</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { Icon: Shield,    title: "Authenticity First",  desc: "Every product sourced directly from brand-authorised distributors. No fakes, no refurbs, no compromises." },
            { Icon: Heart,     title: "Customer Obsessed",   desc: "Your satisfaction is not a metric. It is the only thing that matters. 7-day returns, no questions asked." },
            { Icon: Zap,       title: "Speed & Reliability", desc: "Same-day dispatch for orders before 2 PM. Real-time tracking. Delivery you can actually plan around." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="p-6 bg-[#0e0e1c] border border-white/5 rounded-2xl hover:border-[#00cfff]/12 transition-all">
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
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-3xl font-extrabold text-white tracking-widest mb-6">THE TEAM</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Ricky Sharma",    role: "Founder & CEO",        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format" },
            { name: "Priya Nair",      role: "Head of Operations",   img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format" },
            { name: "Arjun Mehta",     role: "Product Manager",      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format" },
            { name: "Sneha Kulkarni",  role: "Customer Experience",  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format" },
          ].map(({ name, role, img }) => (
            <div key={name} className="bg-[#0e0e1c] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#00cfff]/15 transition-all">
              <div className="aspect-square overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif" }} className="text-4xl font-extrabold text-white tracking-widest mb-3">READY TO SHOP?</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Join 50,000+ customers who trust Ricky Mobile Store for genuine phones, fair prices, and real support.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setPage("home")} className="px-6 py-3 bg-[#00cfff] text-[#07070f] font-extrabold rounded-2xl hover:bg-[#00cfff]/90 transition-all text-sm tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            BROWSE PHONES
          </button>
          <button onClick={() => setPage("chat")} className="px-6 py-3 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all text-sm">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );

  // ── ROOT ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {navbar}
      {cartDrawer}
      {page === "home"        && homePage}
      {page === "product"     && productPage}
      {page === "checkout"    && checkoutPage}
      {page === "orders"      && ordersPage}
      {page === "profile"     && profilePage}
      {page === "wishlist"    && wishlistPage}
      {page === "track-order" && trackOrderPage}
      {page === "chat"        && chatPage}
      {page === "offers"      && offersPage}
      {page === "faq"         && faqPage}
      {page === "about"       && aboutPage}
    </div>
  );
}
