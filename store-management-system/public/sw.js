// Ricky Mobile Store CMS - Service Worker (rms-cms-v3)
const CACHE_NAME = "rms-cms-cache-v3";
const STATIC_ASSETS = [
  "/favicon.ico",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only handle same-origin GET requests. Never intercept cross-origin calls (e.g. backend at localhost:8001)
  if (url.origin !== self.location.origin || request.method !== "GET") {
    return;
  }

  // 2. Never intercept Next.js internals, HMR, RSC data, or API routes
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1" ||
    url.protocol.startsWith("chrome-extension")
  ) {
    return;
  }

  // 3. Only intercept static precached assets (icons, manifest, static media)
  const isStaticAsset =
    STATIC_ASSETS.includes(url.pathname) ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff2?|ttf|json)$/i.test(url.pathname);

  if (!isStaticAsset) {
    // Let Next.js handle all page navigation, routes, and streaming directly
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch(() => {
          return new Response("", { status: 408, statusText: "Request Timeout" });
        });
    })
  );
});
