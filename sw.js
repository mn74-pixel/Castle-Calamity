const CACHE_NAME = "slingtoon-web-0.7.0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=0.7.0",
  "./manifest.webmanifest?v=0.7.0",
  "./src/main.js?v=0.7.0",
  "./src/game.js?v=0.7.0",
  "./src/render.js?v=0.7.0",
  "./src/audio.js?v=0.7.0",
  "./src/face-studio.js?v=0.7.0",
  "./assets/logo_slingtoon.svg",
  "./assets/stage_morning_mayhem.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  const url = new URL(event.request.url);
  const updateSensitive =
    event.request.destination === "script" ||
    event.request.destination === "style" ||
    url.pathname.endsWith(".webmanifest");

  if (updateSensitive) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
