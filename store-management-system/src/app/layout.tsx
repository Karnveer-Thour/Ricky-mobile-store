if (typeof window === "undefined" && typeof globalThis !== "undefined") {
  const storageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
  try {
    Object.defineProperty(globalThis, "localStorage", {
      value: storageMock,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      value: storageMock,
      configurable: true,
      writable: true,
    });
  } catch {
    // ignore
  }
}

import type { Metadata, Viewport } from "next";
import React, { Suspense } from "react";
import "@/styles/globals.css";
import Providers from "@/store/providers";
import Alert from "@/components/alert";
import GlobalConfirmModal from "@/components/modal/globalConfirmModal";
import NavigationProgress from "@/components/NavigationProgress";

export const viewport: Viewport = {
  themeColor: "#07070f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Ricky Mobile Store CMS",
    default: "Ricky Mobile Store — Management System & Admin Portal",
  },
  description:
    "Secure administrative portal for Ricky Mobile Store inventory, order fulfillment, product catalog, customer management, and analytics.",
  applicationName: "Ricky Mobile Store CMS",
  authors: [{ name: "Ricky Mobile Store", url: "https://rickymobilestore.in" }],
  keywords: [
    "Ricky Mobile Store Admin",
    "Store Management System",
    "Mobile Inventory Khanna",
    "Order Management Portal",
    "Admin Dashboard",
  ],
  creator: "Ricky Mobile Store",
  publisher: "Ricky Mobile Store",
  metadataBase: new URL("https://admin.rickymobilestore.in"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://admin.rickymobilestore.in",
    siteName: "Ricky Mobile Store CMS",
    title: "Ricky Mobile Store — Management System & Admin Portal",
    description:
      "Official administrative portal for Ricky Mobile Store Khanna & Ludhiana.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Ricky Mobile Store CMS Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ricky Mobile Store CMS",
    description: "Official administrative portal for Ricky Mobile Store.",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {/* Global top progress bar — must be in Suspense because it reads useSearchParams */}
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <Alert />
          <GlobalConfirmModal />
          {children}
        </Providers>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('[PWA] CMS SW registration error:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

