import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import {
  CatalogHeroSection,
  CatalogProductGrid,
  CatalogTrustSection,
  CatalogShowroomSection,
} from "../components/catalog";

export default function CatalogPage() {
  const navigate = useNavigate();
  const {
    products,
    loadingProducts,
    categories,
    wishlist,
    toggleWishlist,
    addToCart,
  } = useApp();
  const [catFilter, setCatFilter] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const mc = catFilter === null || String(p.categoryId) === String(catFilter);
    const ms =
      search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const featuredProduct = products.length > 0 ? products[0] : null;

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleProductClick = (productName: string) => {
    navigate(`/product/${encodeURIComponent(productName)}`);
  };

  return (
    <div className="pt-20">
      <CatalogHeroSection
        featuredProduct={featuredProduct}
        onExploreClick={scrollToProducts}
        onProductClick={handleProductClick}
      />

      <CatalogProductGrid
        products={products}
        filtered={filtered}
        categories={categories}
        catFilter={catFilter}
        setCatFilter={setCatFilter}
        search={search}
        setSearch={setSearch}
        loadingProducts={loadingProducts}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onProductClick={handleProductClick}
      />

      <CatalogTrustSection />

      <CatalogShowroomSection />
    </div>
  );
}
