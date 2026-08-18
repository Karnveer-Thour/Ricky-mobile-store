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
  id: string | number;
  name: string;
  price: number;
  discount: number;
  description: string;
  quantity: number;
  warranty: string;
  specifications: string;
  categoryId: string | number;
  colors: Color[];
  reviews: Review[];
  image: string;
  badge: string | null;
}

export const CATEGORIES: { id: string | number; name: string }[] = [];

export const PRODUCTS: Product[] = [];

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

export const MOCK_ORDERS: MockOrder[] = [];

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

export const CHAT_INIT: ChatMessage[] = [];

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
