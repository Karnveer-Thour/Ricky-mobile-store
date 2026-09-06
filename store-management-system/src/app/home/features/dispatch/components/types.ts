export interface DispatchCard {
  id: string;
  customer: string;
  phone: string;
  payment: string;
  lender?: string;
  installment?: number;
  landmark: string;
  items: string;
  status:
    | "pending_override"
    | "ready_to_pack"
    | "out_for_delivery"
    | "delivered"
    | "returned";
}

export type ColumnStatus = DispatchCard["status"];

export const STATUS_ORDER: ColumnStatus[] = [
  "pending_override",
  "ready_to_pack",
  "out_for_delivery",
  "delivered",
  "returned",
];

export interface ColumnDefinition {
  status: ColumnStatus;
  label: string;
  darkColor: string;
  lightColor: string;
  accent: string;
}

export const COLUMNS: ColumnDefinition[] = [
  {
    status: "pending_override",
    label: "Pending Overrides",
    darkColor: "text-rose-400",
    lightColor: "text-rose-700 font-bold",
    accent:
      "border-rose-400/60 bg-rose-500/10 shadow-[0_0_16px_rgba(244,63,94,0.25)]",
  },
  {
    status: "ready_to_pack",
    label: "Ready to Pack",
    darkColor: "text-amber-400",
    lightColor: "text-amber-700 font-bold",
    accent:
      "border-amber-400/60 bg-amber-500/10 shadow-[0_0_16px_rgba(245,158,11,0.25)]",
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    darkColor: "text-blue-400",
    lightColor: "text-blue-700 font-bold",
    accent:
      "border-blue-400/60 bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.25)]",
  },
  {
    status: "delivered",
    label: "Delivered",
    darkColor: "text-emerald-400",
    lightColor: "text-emerald-700 font-bold",
    accent:
      "border-emerald-400/60 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.25)]",
  },
  {
    status: "returned",
    label: "Returned",
    darkColor: "text-purple-400",
    lightColor: "text-purple-700 font-bold",
    accent:
      "border-purple-400/60 bg-purple-500/10 shadow-[0_0_16px_rgba(168,85,247,0.25)]",
  },
];

export const INITIAL_DISPATCH_CARDS: DispatchCard[] = [
  {
    id: "RMS-89211",
    customer: "Gurpreet Singh",
    phone: "+91 98140 11223",
    payment: "Bajaj Finserv EMI",
    lender: "Bajaj Finance",
    installment: 6299,
    landmark: "Clock Tower Plaza, Ludhiana",
    items: "Apple iPhone 16 Pro Max 256GB Desert Titanium ×1",
    status: "pending_override",
  },
  {
    id: "RMS-89212",
    customer: "Simranjit Kaur",
    phone: "+91 98722 33445",
    payment: "HDFC Debit EMI",
    lender: "HDFC Bank",
    installment: 4199,
    landmark: "Near Model Town Park, Jalandhar",
    items: "Samsung Galaxy S24 Ultra 512GB Titanium Gray ×1",
    status: "pending_override",
  },
  {
    id: "RMS-89213",
    customer: "Harmanpreet Cheema",
    phone: "+91 98881 22334",
    payment: "Cash on Delivery",
    landmark: "Sector 17 Market Complex, Chandigarh",
    items: "OnePlus 12 16GB/512GB Flowy Emerald ×1",
    status: "pending_override",
  },
  {
    id: "RMS-89214",
    customer: "Rahul Verma",
    phone: "+91 99155 66778",
    payment: "Prepaid UPI",
    landmark: "Mall Road Commercial Block, Amritsar",
    items: "Vivo X100 Pro 512GB Asteroid Black ×1",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89215",
    customer: "Amritpal Dhillon",
    phone: "+91 97800 12345",
    payment: "Home Credit EMI",
    lender: "Home Credit",
    installment: 3499,
    landmark: "GT Road Hub, Phagwara",
    items: "Xiaomi 14 Ultra 512GB White ×1",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89216",
    customer: "Maninder Bains",
    phone: "+91 94172 99881",
    payment: "Credit Card Full",
    landmark: "Sarabha Nagar Market, Ludhiana",
    items: "Apple iPhone 15 128GB Blue ×1 + 20W Adapter",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89217",
    customer: "Pooja Sharma",
    phone: "+91 98765 88990",
    payment: "Prepaid UPI",
    landmark: "Civil Lines, Patiala",
    items: "Nothing Phone (2) 256GB Dark Gray ×1",
    status: "ready_to_pack",
  },
  {
    id: "RMS-89218",
    customer: "Vikramjeet Sandhu",
    phone: "+91 98150 44556",
    payment: "Cash on Delivery",
    landmark: "Ferozepur Road City Center, Ludhiana",
    items: "Google Pixel 8a 128GB Bay Blue ×1",
    status: "out_for_delivery",
  },
  {
    id: "RMS-89219",
    customer: "Jasleen Grewal",
    phone: "+91 98889 11223",
    payment: "Bajaj Finserv EMI",
    lender: "Bajaj Finance",
    installment: 5899,
    landmark: "Phase 7 Industrial Area, Mohali",
    items: "Samsung Galaxy Z Fold 6 256GB Silver Shadow ×1",
    status: "out_for_delivery",
  },
  {
    id: "RMS-89220",
    customer: "Arun Kumar",
    phone: "+91 98144 55667",
    payment: "Prepaid NetBanking",
    landmark: "BMC Chowk, Jalandhar",
    items: "Realme GT 6 256GB Fluid Silver ×1",
    status: "out_for_delivery",
  },
  {
    id: "RMS-89221",
    customer: "Navjot Singh",
    phone: "+91 99140 33445",
    payment: "Prepaid UPI",
    landmark: "Ranjit Avenue B-Block, Amritsar",
    items: "Apple iPhone 16 128GB Teal ×1",
    status: "delivered",
  },
  {
    id: "RMS-89222",
    customer: "Deepika Malhotra",
    phone: "+91 98721 99001",
    payment: "HDFC Credit Card",
    landmark: "South City Enclave, Ludhiana",
    items: "OnePlus Nord 4 256GB Mercurial Silver ×1",
    status: "delivered",
  },
  {
    id: "RMS-89223",
    customer: "Taranjit Gill",
    phone: "+91 98880 77889",
    payment: "Bajaj Finserv EMI",
    lender: "Bajaj Finance",
    installment: 4999,
    landmark: "Urban Estate Phase 2, Patiala",
    items: "iQOO 12 5G 256GB Legend White ×1",
    status: "delivered",
  },
  {
    id: "RMS-89224",
    customer: "Raman Deep",
    phone: "+91 95011 22334",
    payment: "Cash on Delivery",
    landmark: "Dugri Phase 1, Ludhiana",
    items: "Motorola Edge 50 Pro 256GB Black Beauty ×1",
    status: "returned",
  },
  {
    id: "RMS-89225",
    customer: "Sunil Joshi",
    phone: "+91 98788 44556",
    payment: "Cash on Delivery",
    landmark: "Court Road, Bathinda",
    items: "Samsung Galaxy A55 5G 128GB Awesome Iceblue ×1",
    status: "returned",
  },
];
