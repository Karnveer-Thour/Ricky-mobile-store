import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { AppProvider } from "./AppContext";
import Layout from "./components/Layout";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import ChatPage from "./pages/ChatPage";
import OffersPage from "./pages/OffersPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* ─── Global Sonner Toaster ─────────────────────────────────────────
          Positioned top-right, styled to match the dark /  neon design.
          richColors gives automatic colour coding per toast type.     ──── */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            background: "#0e0e1c",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,207,255,0.06)",
          },
          classNames: {
            title: "font-semibold text-white",
            description: "text-gray-400 text-xs mt-0.5",
            actionButton: "bg-[#00cfff] text-[#07070f] font-bold text-xs rounded-lg",
            cancelButton: "bg-white/10 text-gray-300 text-xs rounded-lg",
          },
        }}
      />
    </AppProvider>
  );
}
