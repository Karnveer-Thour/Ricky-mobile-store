import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRODUCTS, Product, CartItem, ChatMessage, CHAT_INIT } from "./data";
import { apiService } from "./services/apiService";

interface AppContextType {
  productsList: Product[];
  cart: CartItem[];
  wishlist: number[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: number, colorId: number, colorName: string, quantity: number) => void;
  updateQty: (productId: number, colorId: number, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  trackedOrderId: string | null;
  setTrackedOrderId: (id: string | null) => void;
  chatMsgs: ChatMessage[];
  setChatMsgs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatInput: string;
  setChatInput: (input: string) => void;
  sendChat: () => void;
  openFaq: number | null;
  setOpenFaq: (faq: number | null) => void;
  notifToggles: { orderUpdates: boolean; promos: boolean; priceAlerts: boolean; chat: boolean };
  setNotifToggles: React.Dispatch<React.SetStateAction<{ orderUpdates: boolean; promos: boolean; priceAlerts: boolean; chat: boolean }>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    async function loadApiProducts() {
      const apiData = await apiService.fetchProducts();
      if (apiData && apiData.length > 0) {
        // Map backend products if available
        const mapped: Product[] = apiData.map((item: any, index: number) => ({
          id: item.id || index + 1,
          name: item.name || item.productName || 'Mobile Phone',
          tagline: item.description || 'Premium Smartphone',
          badge: item.badge || 'NEW',
          rating: item.rating || 4.8,
          reviewsCount: item.reviewsCount || 120,
          price: Number(item.price) || 49999,
          discount: Number(item.discount) || 5000,
          emiMonthly: Math.round((Number(item.price) || 49999) / 12),
          emiMonths: 12,
          stock: Number(item.stockCount || item.stock) || 15,
          image: item.imageUrl || PRODUCTS[index % PRODUCTS.length].image,
          category: item.category || 'Smartphones',
          brand: item.brand || 'Premium',
          specs: item.specs || { ram: '8 GB', storage: '256 GB', camera: '50 MP', battery: '5000 mAh' },
          colors: item.colors || PRODUCTS[0].colors,
        }));
        setProductsList(mapped);
      }
    }
    loadApiProducts();
  }, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>(CHAT_INIT);
  const [chatInput, setChatInput] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [notifToggles, setNotifToggles] = useState({
    orderUpdates: true,
    promos: true,
    priceAlerts: false,
    chat: true,
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find((pr) => pr.id === i.productId)!;
    return s + (p.price - p.discount) * i.qty;
  }, 0);

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

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: chatMsgs.length + 1,
      type: "TEXT",
      sender: "user",
      message: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMsgs((prev) => [...prev, newMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMsgs((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "TEXT",
          sender: "support",
          message: "Thanks for your message! Our team will get back to you shortly. Typical response time is under 5 minutes.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  }

  return (
    <AppContext.Provider
      value={{
        productsList,
        cart,
        wishlist,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        clearCart,
        toggleWishlist,
        trackedOrderId,
        setTrackedOrderId,
        chatMsgs,
        setChatMsgs,
        chatInput,
        setChatInput,
        sendChat,
        openFaq,
        setOpenFaq,
        notifToggles,
        setNotifToggles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
