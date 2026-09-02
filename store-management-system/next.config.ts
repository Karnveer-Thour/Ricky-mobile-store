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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
