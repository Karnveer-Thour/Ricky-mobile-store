import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import AuthModal from "./AuthModal";
import StorefrontHeader from "./layout/StorefrontHeader";
import StorefrontFooter from "./layout/StorefrontFooter";
import CartDrawer from "./layout/CartDrawer";

export default function Layout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-[#e8ebf0] selection:bg-[#00cfff] selection:text-[#07070f] flex flex-col font-sans">
      <StorefrontHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
      />

      <main className="flex-grow">
        <Outlet />
      </main>

      <StorefrontFooter />
      <CartDrawer />
      <AuthModal />
    </div>
  );
}
