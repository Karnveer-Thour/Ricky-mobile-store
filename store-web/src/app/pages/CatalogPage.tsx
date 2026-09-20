import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../AppContext";
import SEOHead from "../components/seo/SEOHead";
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
      <SEOHead
        title="Khanna's #1 Mobile Phone Shop & 0% Bajaj EMI"
        description="Buy Apple iPhone, Samsung Galaxy, OnePlus & Vivo with 0% Bajaj Finserv EMI in Khanna (141401). Same-day delivery, certified repairs, and genuine warranty."
        canonicalUrl="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Ricky Mobile Store",
          url: "https://rickymobilestore.in/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://rickymobilestore.in/?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
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
