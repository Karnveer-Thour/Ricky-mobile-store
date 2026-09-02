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

import type { Metadata } from "next";
import React, { Suspense } from "react";
import "@/styles/globals.css";
import Providers from "@/store/providers";
import Alert from "@/components/alert";
import GlobalConfirmModal from "@/components/modal/globalConfirmModal";
import NavigationProgress from "@/components/NavigationProgress";

export const metadata: Metadata = {
  title: "Ricky Mobile Store — Management System",
  description: "Ricky Mobile Store Management System",
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
      </body>
    </html>
  );
}
