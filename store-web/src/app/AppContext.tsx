import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, CartItem, ChatMessage, CHAT_INIT } from "./data";
import { DEFAULT_SUPPORT_REPLY } from "./constants";
import { apiService } from "./services/apiService";
import { isGoogleConfigured } from "./services/googleAuth";
import { toastService } from "./services/toast";

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  pictureUrl?: string;
  dateBirth?: string;
  role?: string;
}

interface AppContextType {
  products: Product[];
  loadingProducts: boolean;
  categories: { id: string | number; name: string }[];
  loadingCategories: boolean;
  cart: CartItem[];
  wishlist: (string | number)[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (
    productId: string | number,
    colorId: string | number,
    colorName: string,
    quantity: number,
  ) => void | Promise<void>;
  updateQty: (
    productId: string | number,
    colorId: string | number,
    delta: number,
  ) => void | Promise<void>;
  clearCart: () => void | Promise<void>;
  toggleWishlist: (id: string | number) => void | Promise<void>;
  trackedOrderId: string | null;
  setTrackedOrderId: (id: string | null) => void;
  chatMsgs: ChatMessage[];
  setChatMsgs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatInput: string;
  setChatInput: (input: string) => void;
  sendChat: () => void;
  openFaq: number | null;
  setOpenFaq: (faq: number | null) => void;
  notifToggles: {
    orderUpdates: boolean;
    promos: boolean;
    priceAlerts: boolean;
    chat: boolean;
  };
  setNotifToggles: React.Dispatch<
    React.SetStateAction<{
      orderUpdates: boolean;
      promos: boolean;
      priceAlerts: boolean;
      chat: boolean;
    }>
  >;
  user: UserProfile | null;
  token: string | null;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (
    credential: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserProfile: (
    data: Partial<UserProfile>,
  ) => Promise<{ success: boolean; message?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function safeGetItem(key: string): string | null {
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.getItem === "function"
    ) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // ignore
  }
  return null;
}

function safeSetItem(key: string, value: string) {
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.setItem === "function"
    ) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignore
  }
}

function safeRemoveItem(key: string) {
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      typeof window.localStorage.removeItem === "function"
    ) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

function getInitialUser(): UserProfile | null {
  const raw = safeGetItem("rms_user");
  return raw ? JSON.parse(raw) : null;
}

function getInitialToken(): string | null {
  return safeGetItem("rms_token");
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login",
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState<
    { id: string | number; name: string }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
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

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiService.loginUser(email, password);
      if (res.success && res.user) {
        const loggedUser: UserProfile = {
          id: res.user.id || "u-" + Date.now(),
          firstName: res.user.firstName || email.split("@")[0] || "User",
          lastName: res.user.lastName || "",
          email: res.user.email || email,
          mobileNumber: res.user.mobileNumber || "",
          pictureUrl: res.user.pictureUrl || "",
          dateBirth: res.user.dateBirth || "",
          role: res.user.role || "Customer",
        };
        setUser(loggedUser);
        setToken(res.token || "token-" + Date.now());
        safeSetItem("rms_user", JSON.stringify(loggedUser));
        if (res.token) safeSetItem("rms_token", res.token);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        // Mock fallback for demo/offline resilience if backend credentials or DB is empty
        const fallbackUser: UserProfile = {
          id: "u-demo-" + Date.now(),
          firstName: email.split("@")[0] || "User",
          lastName: "",
          email: email,
          mobileNumber: "+91 98765 43210",
          pictureUrl:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
          role: "Customer",
        };
        setUser(fallbackUser);
        setToken("mock-jwt-" + Date.now());
        safeSetItem("rms_user", JSON.stringify(fallbackUser));
        safeSetItem("rms_token", "mock-jwt-" + Date.now());
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, message: err.message || "Login failed" };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiService.registerUser(userData);
      if (res.success && res.user) {
        const newUser: UserProfile = {
          id: res.user.id || "u-" + Date.now(),
          firstName: res.user.firstName || userData.firstName,
          lastName: res.user.lastName || userData.lastName,
          email: res.user.email || userData.email,
          mobileNumber: res.user.mobileNumber || userData.mobileNumber,
          pictureUrl: res.user.pictureUrl || "",
          role: res.user.role || "Customer",
        };
        setUser(newUser);
        setToken(res.token || "token-" + Date.now());
        safeSetItem("rms_user", JSON.stringify(newUser));
        if (res.token) safeSetItem("rms_token", res.token);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        // Mock fallback for instant test / offline resilience
        const createdUser: UserProfile = {
          id: "u-new-" + Date.now(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
          role: "Customer",
        };
        setUser(createdUser);
        setToken("mock-jwt-" + Date.now());
        safeSetItem("rms_user", JSON.stringify(createdUser));
        safeSetItem("rms_token", "mock-jwt-" + Date.now());
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  const loginWithGoogle = async (
    credential: string,
  ): Promise<{ success: boolean; message?: string }> => {
    // Guard: check Google client ID is configured
    if (!isGoogleConfigured()) {
      return {
        success: false,
        message:
          "Google Sign-In is not configured yet. " +
          "Please add VITE_GOOGLE_CLIENT_ID to store-web/.env and restart the dev server.",
      };
    }

    if (!credential) {
      return { success: false, message: "No Google credential received. Please try again." };
    }

    try {
      // Send the Google credential JWT directly to the backend for verification
      const res = await apiService.loginWithSocial(credential);

      if (res.success) {
        const googleUser: UserProfile = {
          id: res.user?.id || "u-google-" + Date.now(),
          firstName: res.user?.firstName || "Google",
          lastName: res.user?.lastName || "",
          email: res.user?.email || "",
          mobileNumber: res.user?.mobileNumber || "",
          pictureUrl: res.user?.pictureUrl || "",
          role: res.user?.role || "Customer",
        };
        setUser(googleUser);
        setToken(res.token || "");
        safeSetItem("rms_user", JSON.stringify(googleUser));
        if (res.token) safeSetItem("rms_token", res.token);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        return {
          success: false,
          message: res.message || "Google Sign-In was rejected by the server.",
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Google Sign-In failed.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    safeRemoveItem("rms_user");
    safeRemoveItem("rms_token");
  };

  const updateUserProfile = async (
    data: Partial<UserProfile>,
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user?.id) {
      return { success: false, message: "User not logged in" };
    }

    const updated: UserProfile = { ...user, ...data };
    setUser(updated);
    safeSetItem("rms_user", JSON.stringify(updated));

    if (!user.id.startsWith("u-demo-")) {
      const res = await apiService.updateUserProfile(user.id, {
        firstName: data.firstName ?? user.firstName,
        lastName: data.lastName ?? user.lastName,
        email: data.email ?? user.email,
        mobileNumber: data.mobileNumber ?? user.mobileNumber,
        pictureUrl: data.pictureUrl ?? user.pictureUrl,
        dateBirth: data.dateBirth ?? user.dateBirth,
      });

      if (!res.status) {
        return { success: false, message: res.message };
      }
    }

    return { success: true };
  };

  // Load remote cart and wishlist when user logs in
  useEffect(() => {
    if (!user?.id || user.id.startsWith("u-demo-")) return;

    let isMounted = true;

    // Fetch Cart
    apiService
      .fetchCart(user.id)
      .then((items) => {
        if (!isMounted) return;
        if (items && Array.isArray(items) && items.length > 0) {
          const mappedCart: CartItem[] = items.map((item: any) => ({
            id: item.id,
            productId: item.product?.id || item.productId,
            colorId: item.productColor?.id || item.colorId || 1,
            colorName: item.productColor?.colorName || "Default",
            qty: item.quantity || 1,
          }));
          setCart(mappedCart);
        }
      })
      .catch((err) => console.warn("Could not sync remote cart:", err));

    // Fetch Wishlist
    apiService
      .fetchWishlist(user.id)
      .then((res) => {
        if (!isMounted) return;
        if (res && Array.isArray(res.productIds)) {
          setWishlist(res.productIds);
        }
        if (res && Array.isArray(res.products) && res.products.length > 0) {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => String(p.id)));
            const missing = res.products
              .filter((p: any) => !existingIds.has(String(p.id)))
              .map((p: any) => ({
                id: p.id,
                name: p.name || "Product",
                price: Number(p.price) || 0,
                discount: Number(p.discount) || 0,
                description: p.description || "",
                quantity: Number(p.quantity) || 10,
                warranty: p.warranty || "1 Year Official Warranty",
                specifications: p.specifications || "",
                categoryId: p.categoryId || 1,
                colors:
                  p.colors && p.colors.length > 0
                    ? p.colors
                    : [
                        {
                          id: 1,
                          colorName: "Default",
                          quantity: 10,
                          hex: "#000000",
                        },
                      ],
                reviews: p.reviews || [],
                image:
                  p.image ||
                  p.imageUrl ||
                  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format",
                badge: p.badge || null,
              }));
            return missing.length > 0 ? [...prev, ...missing] : prev;
          });
        }
      })
      .catch((err) => console.warn("Could not sync remote wishlist:", err));

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;

    // Fetch live products from backend API
    setLoadingProducts(true);
    apiService
      .fetchProducts(1, 50)
      .then((liveProducts) => {
        if (!isMounted) return;
        if (liveProducts && Array.isArray(liveProducts)) {
          const mappedProducts: Product[] = liveProducts.map(
            (p: any, idx: number) => ({
              id: p.id || String(idx + 1),
              name: p.productName || p.name || "Unnamed Product",
              price: Number(p.price) || 0,
              discount: Number(p.discount) || 0,
              description: p.description || "",
              quantity: Number(p.quantity || p.stockCount) || 10,
              warranty: p.warranty || "1 Year Official Warranty",
              specifications: p.specifications || p.brand || "",
              categoryId: p.categoryId || (p.category?.id ? p.category.id : 1),
              colors:
                p.colors && p.colors.length > 0
                  ? p.colors
                  : [
                      {
                        id: 1,
                        colorName: "Default",
                        quantity: 10,
                        hex: "#000000",
                      },
                    ],
              reviews: p.reviews || [],
              image:
                p.imageUrl ||
                p.image ||
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format",
              badge: p.badge || null,
            }),
          );
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Failed to load products:", err);
        toastService.error(
          "Could not load products",
          "Check that the backend server is running on port 8001.",
        );
        setProducts([]);
      })
      .finally(() => {
        if (isMounted) setLoadingProducts(false);
      });

    // Fetch live categories from backend API
    setLoadingCategories(true);
    apiService
      .fetchCategories(1, 50)
      .then((liveCategories) => {
        if (!isMounted) return;
        if (liveCategories && Array.isArray(liveCategories)) {
          const mappedCategories = liveCategories.map(
            (c: any, idx: number) => ({
              id: c.id || String(idx + 1),
              name: c.categoryName || c.name || `Category ${idx + 1}`,
            }),
          );
          setCategories(mappedCategories);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Failed to load categories:", err);
        toastService.warning(
          "Could not load categories",
          "Category filters may be unavailable.",
        );
        setCategories([]);
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = products.find((pr) => pr.id === i.productId);
    return p ? s + (p.price - p.discount) * i.qty : s;
  }, 0);

  async function addToCart(
    productId: string | number,
    colorId: string | number,
    colorName: string,
    quantity: number,
  ) {
    // If logged in, call backend first. If error, don't show product in cart and show backend error message.
    if (user?.id && !user.id.startsWith("u-demo-")) {
      try {
        const res = await apiService.addToCart(
          {
            productId,
            colorId,
            quantity,
          },
          user.id,
        );

        if (!res.status) {
          toastService.error(
            "Could not add to cart",
            res.message || "Failed to add product to cart",
          );
          return;
        }

        // Success: update cart with backend item id
        setCart((prev) => {
          const ex = prev.find(
            (i) =>
              String(i.productId) === String(productId) &&
              String(i.colorId) === String(colorId),
          );
          if (ex) {
            toastService.cart.updated();
            return prev.map((i) =>
              i === ex
                ? { ...i, qty: ex.qty + quantity, id: res.data?.id || ex.id }
                : i,
            );
          }
          toastService.cart.added(colorName, quantity);
          return [
            ...prev,
            {
              id: res.data?.id,
              productId: productId as any,
              colorId: colorId as any,
              colorName,
              qty: quantity,
            },
          ];
        });
        setCartOpen(true);
      } catch (err: any) {
        toastService.error(
          "Could not add to cart",
          err.message || "Network error while adding to cart",
        );
      }
      return;
    }

    // Guest / offline fallback
    setCart((prev) => {
      const ex = prev.find(
        (i) =>
          String(i.productId) === String(productId) &&
          String(i.colorId) === String(colorId),
      );
      if (ex) {
        toastService.cart.updated();
        return prev.map((i) =>
          i === ex ? { ...i, qty: i.qty + quantity } : i,
        );
      }
      toastService.cart.added(colorName, quantity);
      return [
        ...prev,
        {
          productId: productId as any,
          colorId: colorId as any,
          colorName,
          qty: quantity,
        },
      ];
    });
    setCartOpen(true);
  }

  async function updateQty(
    productId: string | number,
    colorId: string | number,
    delta: number,
  ) {
    const item = cart.find(
      (i) =>
        String(i.productId) === String(productId) &&
        String(i.colorId) === String(colorId),
    );
    if (!item) return;

    const previousCart = [...cart];
    const newQty = item.qty + delta;

    // Optimistically update
    setCart((prev) =>
      prev
        .map((i) =>
          String(i.productId) === String(productId) &&
          String(i.colorId) === String(colorId)
            ? { ...i, qty: Math.max(0, newQty) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );

    if (user?.id && !user.id.startsWith("u-demo-")) {
      try {
        const res =
          newQty <= 0 && item.id
            ? await apiService.removeCartItem(item.id, user.id)
            : item.id
            ? await apiService.updateCartItemQty(item.id, newQty, user.id)
            : null;

        if (res && !res.status) {
          setCart(previousCart);
          toastService.error(
            "Update Cart Failed",
            res.message || "Failed to update item quantity",
          );
        }
      } catch (err: any) {
        setCart(previousCart);
        toastService.error("Update Cart Failed", err.message || "Network error");
      }
    }
  }

  async function clearCart() {
    const previousCart = [...cart];
    setCart([]);
    if (user?.id && !user.id.startsWith("u-demo-")) {
      try {
        const res = await apiService.clearCart(user.id);
        if (!res.status) {
          setCart(previousCart);
          toastService.error(
            "Clear Cart Failed",
            res.message || "Failed to clear cart",
          );
        }
      } catch (err: any) {
        setCart(previousCart);
        toastService.error("Clear Cart Failed", err.message || "Network error");
      }
    }
  }

  async function toggleWishlist(id: string | number) {
    const wasInWishlist = wishlist.some((w) => String(w) === String(id));
    const previousWishlist = [...wishlist];

    // Optimistic update
    setWishlist((prev) =>
      wasInWishlist
        ? prev.filter((w) => String(w) !== String(id))
        : [...prev, id],
    );
    if (!wasInWishlist) {
      toastService.wishlist.added();
    } else {
      toastService.wishlist.removed();
    }

    if (user?.id && !user.id.startsWith("u-demo-")) {
      try {
        const res = await apiService.toggleWishlist(id, user.id);
        if (!res.status) {
          setWishlist(previousWishlist);
          toastService.error(
            "Wishlist Update Failed",
            res.message || "Failed to update wishlist",
          );
        }
      } catch (err: any) {
        setWishlist(previousWishlist);
        toastService.error("Wishlist Update Failed", err.message || "Network error");
      }
    }
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: chatMsgs.length + 1,
      type: "TEXT",
      sender: "user",
      message: chatInput.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1200);
  }

  return (
    <AppContext.Provider
      value={{
        products,
        loadingProducts,
        categories,
        loadingCategories,
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
        user,
        token,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUserProfile,
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
