// Service Worker for HTML Entities Reference
// Strategy:
//  - Pre-cache the app shell on install
//  - Stale-while-revalidate for navigation requests (instant load + background update)
//  - Cache-first for other same-origin GET requests
//  - Bypass for cross-origin and non-GET requests

const CACHE_NAME = "html-entities-v1";
const APP_SHELL = [
  "./",
  "./html-entities-reference.html",
  "./manifest.json",
  "./html-entities.json",
  "./icon-16.png",
  "./icon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // addAll fails atomically if any request fails; we use individual puts
      // so a single missing asset doesn't break the whole install.
      Promise.all(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation: stale-while-revalidate
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("./html-entities-reference.html", {
          ignoreSearch: true,
        });
        const networkFetch = fetch(req)
          .then((response) => {
            if (response && response.ok) {
              cache.put("./html-entities-reference.html", response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })()
    );
    return;
  }

  // Other same-origin GET: cache-first, fallback to network (and cache it)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

// Allow the page to trigger an immediate update
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
