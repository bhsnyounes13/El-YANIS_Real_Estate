const CACHE_NAME = "elyanis-v1.0.0";
const STATIC_CACHE = "elyanis-static-v1.0.0";
const DYNAMIC_CACHE = "elyanis-dynamic-v1.0.0";
const IMAGE_CACHE = "elyanis-images-v1.0.0";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/yanis.jpg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const API_PATTERNS = [/\/api\//, /supabase\.co/];

// =======================
// INSTALL EVENT
// =======================
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error("[SW] Install cache error:", err)),
  );
});

// =======================
// ACTIVATE EVENT
// =======================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        console.log("[SW] Checking old caches...");

        const deletePromises = cacheNames
          .filter((name) => {
            const isOurCache = name.startsWith("elyanis-");
            const isCurrent =
              name === CACHE_NAME ||
              name === STATIC_CACHE ||
              name === DYNAMIC_CACHE ||
              name === IMAGE_CACHE;
            return isOurCache && !isCurrent;
          })
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          });

        return Promise.all(deletePromises);
      })
      .then(() => {
        console.log("[SW] Clients claiming control");
        return self.clients.claim();
      }),
  );
});

// =======================
// FETCH EVENT - Advanced Caching Strategies
// =======================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different resource types with appropriate strategies
  if (isStaticAsset(url.pathname)) {
    // Static assets: Cache First
    event.respondWith(cacheFirst(request));
  } else if (isImage(url.pathname)) {
    // Images: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  } else if (isAPIRequest(url)) {
    // API calls: Network First
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isHTMLRequest(request)) {
    // HTML pages: Network First with cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Default: Network First
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// =======================
// CACHE STRATEGIES
// =======================

// Cache First - For static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Cache-first fallback:", request.url);
    return caches.match("/offline.html");
  }
}

// Network First - For API and HTML
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network-first fallback for:", request.url);

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/offline.html");
    }

    return new Response("Offline", { status: 503 });
  }
}

// Stale While Revalidate - For images
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// =======================
// HELPER FUNCTIONS
// =======================

function isStaticAsset(pathname) {
  const staticExtensions = [
    ".js",
    ".css",
    ".woff",
    ".woff2",
    ".ttf",
    ".json",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
  ];
  return (
    staticExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.includes("/icons/") ||
    pathname.includes("/yanis.jpg")
  );
}

function isImage(pathname) {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"];
  return (
    imageExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.includes("images.pexels.com") ||
    pathname.includes("property-images")
  );
}

function isAPIRequest(url) {
  return url.href.includes("supabase.co") || url.pathname.startsWith("/api");
}

function isHTMLRequest(request) {
  return request.headers.get("accept")?.includes("text/html") || request.mode === "navigate";
}

// =======================
// BACKGROUND SYNC (Prepared for future)
// =======================
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag);

  if (event.tag === "sync-inquiries") {
    event.waitUntil(syncInquiries());
  }
});

async function syncInquiries() {
  // Placeholder for future sync functionality
  console.log("[SW] Syncing pending inquiries...");
}

// =======================
// PUSH NOTIFICATIONS (Prepared structure)
// =======================
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received");

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || "New notification from EL-YANIS",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
      actions: [
        { action: "open", title: "Open" },
        { action: "close", title: "Close" },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title || "EL-YANIS", options));
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.action);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      }),
    );
  }
});

console.log("[SW] Service Worker loaded successfully");
