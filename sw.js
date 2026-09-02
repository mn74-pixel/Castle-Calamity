/* Castle Calamity PWA v6.1.7 — odporne działanie offline.
   Dokument HTML: network-first z powrotem do cache.
   Zasoby gry: cache-first i aktualizacja pamięci w tle. */
const CACHE = "castle-calamity-v6.1.7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./content/gags.js",
  "./content/i18n.js",
  "./content/eras.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-192.png",
  "./assets/icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(primeAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function isValidHTML(response) {
  if (!response || !response.ok) return false;
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (type && !type.includes("text/html")) return false;
  const beginning = (await response.clone().text()).trimStart().slice(0, 32).toLowerCase();
  return beginning.startsWith("<!doctype html") || beginning.startsWith("<html");
}

async function primeAppShell() {
  const cache = await caches.open(CACHE);
  for (const url of APP_SHELL) {
    const response = await fetch(url, { cache: "reload" });
    if (url.endsWith("index.html") && !(await isValidHTML(response))) {
      throw new Error("Castle Calamity: odrzucono uszkodzony index.html");
    }
    if (!response.ok) throw new Error(`Castle Calamity: nie udało się pobrać ${url}`);
    await cache.put(url, response);
  }
}

function remember(request, response) {
  if (!response || !response.ok || new URL(request.url).origin !== self.location.origin) return response;
  const copy = response.clone();
  caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (!(await isValidHTML(response))) throw new Error("invalid-html");
          return remember(request, response);
        })
        .catch(() => caches.match(request, { ignoreSearch: true })
          .then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) {
        event.waitUntil(fetch(request).then((response) => remember(request, response)).catch(() => {}));
        return cached;
      }
      return fetch(request).then((response) => remember(request, response));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
