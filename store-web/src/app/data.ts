import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

export interface Color {
  id: number;
  colorName: string;
  quantity: number;
  hex: string;
}

export interface Review {
  id: number;
  title: string;
  description: string;
  user: string;
  rating: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  description: string;
  quantity: number;
  warranty: string;
  specifications: string;
  categoryId: number;
  colors: Color[];
  reviews: Review[];
  image: string;
  badge: string | null;
}

export const CATEGORIES = [
  { id: 1, name: "Smartphones" },
  { id: 2, name: "Accessories" },
  { id: 3, name: "Tablets" },
  { id: 4, name: "Wearables" },
  { id: 5, name: "Audio" },
];

export const PRODUCTS: Product[] = [
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

export const DELIVERY_ADDRESSES = [
  {
    id: 1, label: "HOME" as const, name: "Ricky Sharma", mobile: "+91 98765 43210",
    address: "24, MG Road, Koramangala, Bengaluru, Karnataka — 560034", isDefault: true,
  },
  {
    id: 2, label: "WORK" as const, name: "Ricky Sharma", mobile: "+91 98765 43210",
    address: "Floor 5, Brigade Gateway, Rajajinagar, Bengaluru, Karnataka — 560055", isDefault: false,
  },
];

export interface OrderItem {
  name: string;
  color: string;
  qty: number;
  price: number;
}

export interface MockOrder {
  id: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
  total: number;
  date: string;
  payment: string;
  lender?: string;
  tenureMonths?: number;
  monthlyInstallment?: number;
  landmark?: string;
  pin_code?: string;
}

export const MOCK_ORDERS: MockOrder[] = [
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

export const FAQS = [
  { q: "How do I track my order?", a: "Go to My Orders and click 'Track Order' on any placed order. You'll see real-time updates including dispatch, in-transit, and delivery milestones." },
  { q: "What is the return policy?", a: "We offer a 7-day hassle-free return policy. The product must be unused, in original packaging, with all accessories included. Our team will pick up from your doorstep for free." },
  { q: "Are all products genuine?", a: "Yes. Every product sold at Ricky Mobile Store is sourced directly from brand-authorised distributors with full manufacturer warranty. We do not sell refurbished or grey-market units." },
  { q: "How does EMI work?", a: "Select EMI at checkout and choose your plan (Bajaj Finserv or Home Credit). No-cost EMI means you pay only the product price, split across months — we absorb the interest." },
  { q: "When will my order be delivered?", a: "Orders placed before 2 PM are dispatched the same day. Standard delivery takes 2–4 business days. Same-day delivery is available in Bengaluru for select pincodes." },
  { q: "Can I change my delivery address after ordering?", a: "You can update the address within 1 hour of placing the order by contacting support via chat. Once the order is shipped, changes are not possible." },
  { q: "Is my payment information secure?", a: "Absolutely. All payments are processed through PCI-DSS compliant gateways. We never store card details on our servers." },
  { q: "How do I claim warranty?", a: "Visit the brand's authorised service centre with your invoice and original packaging. Alternatively, contact us via chat and we'll guide you through the brand's warranty process." },
];

export interface ChatMessage {
  id: number;
  type: "TEXT" | "PAYMENT_REQUEST" | "PAYMENT_SUCCESS";
  sender: "support" | "user" | "system";
  message: string;
  amount?: number;
  time: string;
}

export const CHAT_INIT: ChatMessage[] = [
  { id: 1, type: "TEXT" as const, sender: "support", message: "Hi Ricky! Welcome to Ricky Mobile Store support. How can I help you today?", time: "10:02 AM" },
  { id: 2, type: "TEXT" as const, sender: "user", message: "Hi! I ordered a Samsung Galaxy S24 Ultra last week but haven't received a tracking update.", time: "10:04 AM" },
  { id: 3, type: "TEXT" as const, sender: "support", message: "I can see your order RMS-2024-0328. It was dispatched yesterday and is currently in transit to Bengaluru. Expected delivery is tomorrow by 6 PM.", time: "10:05 AM" },
  { id: 4, type: "PAYMENT_REQUEST" as const, sender: "support", message: "Outstanding balance for extended warranty add-on.", amount: 1999, time: "10:06 AM" },
  { id: 5, type: "TEXT" as const, sender: "user", message: "Thanks! I'll think about the warranty. Is there anything else I should know?", time: "10:08 AM" },
  { id: 6, type: "PAYMENT_SUCCESS" as const, sender: "system", message: "Payment of ₹1,999 received successfully.", amount: 1999, time: "10:09 AM" },
  { id: 7, type: "TEXT" as const, sender: "support", message: "Great choice! Your extended warranty is now active for 3 years. You'll receive a confirmation email shortly. Is there anything else I can help with?", time: "10:10 AM" },
];

export const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
export const pct = (price: number, disc: number) => Math.round((disc / price) * 100);

export const STATUS_CFG = {
  PENDING:   { label: "Pending",   color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", Icon: Clock },
  SHIPPED:   { label: "Shipped",   color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20",     Icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20",   Icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20",       Icon: XCircle },
};

export interface CartItem {
  productId: number;
  colorId: number;
  colorName: string;
  qty: number;
}
