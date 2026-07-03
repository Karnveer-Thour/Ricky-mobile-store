import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { PRODUCTS, CartItem, ChatMessage, CHAT_INIT } from "./data";

interface AppContextType {
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
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
