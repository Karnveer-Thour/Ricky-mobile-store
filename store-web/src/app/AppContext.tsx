import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRODUCTS, CATEGORIES, Product, CartItem, ChatMessage, CHAT_INIT } from "./data";
import { DEFAULT_SUPPORT_REPLY } from "./constants";
import { apiService } from "./services/apiService";

interface AppContextType {
  products: Product[];
  categories: { id: number; name: string }[];
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
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(CATEGORIES);
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

  useEffect(() => {
    // Fetch live products from backend API
    apiService.fetchProducts(1, 50).then((liveProducts) => {
      if (liveProducts && liveProducts.length > 0) {
        const mappedProducts: Product[] = liveProducts.map((p: any, idx: number) => ({
          id: p.id || idx + 1,
          name: p.productName || p.name || 'Unnamed Product',
          price: Number(p.price) || 0,
          discount: Number(p.discount) || 0,
          description: p.description || '',
          quantity: Number(p.quantity || p.stockCount) || 10,
          warranty: p.warranty || '1 Year Official Warranty',
          specifications: p.specifications || p.brand || '',
          categoryId: Number(p.categoryId) || 1,
          colors: p.colors && p.colors.length > 0 ? p.colors : [{ id: 1, colorName: 'Default', quantity: 10, hex: '#000000' }],
          reviews: p.reviews || [],
          image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format',
          badge: p.badge || null,
        }));
        setProducts(mappedProducts);
      }
    });

    // Fetch live categories from backend API
    apiService.fetchCategories(1, 50).then((liveCategories) => {
      if (liveCategories && liveCategories.length > 0) {
        const mappedCategories = liveCategories.map((c: any, idx: number) => ({
          id: c.id || idx + 1,
          name: c.categoryName || c.name || `Category ${idx + 1}`,
        }));
        setCategories(mappedCategories);
      }
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = products.find((pr) => pr.id === i.productId);
    return p ? s + (p.price - p.discount) * i.qty : s;
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
          message: DEFAULT_SUPPORT_REPLY,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  }

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
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
