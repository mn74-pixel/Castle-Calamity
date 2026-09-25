const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const base = "http://localhost/";
const handlers = {};
const stores = new Map();
let online = true;

class FakeResponse {
  constructor(body, status = 200) {
    this.body = body;
    this.status = status;
    this.ok = status >= 200 && status < 300;
    this.headers = { get: (name) => name.toLowerCase() === "content-type" ? "text/html; charset=utf-8" : null };
  }
  clone() { return new FakeResponse(this.body, this.status); }
  async text() { return Buffer.isBuffer(this.body) ? this.body.toString("utf8") : String(this.body); }
}
class FakeRequest {
  constructor(url, mode = "same-origin") { this.url = new URL(url, base).href; this.method = "GET"; this.mode = mode; }
}
function keyOf(input, ignoreSearch) {
  const u = new URL(typeof input === "string" ? input : input.url, base);
  if (ignoreSearch) u.search = "";
  return u.href;
}
function localResponse(input) {
  if (!online) return Promise.reject(new Error("offline"));
  const u = new URL(typeof input === "string" ? input : input.url, base);
  let rel = decodeURIComponent(u.pathname.replace(/^\//, "")) || "index.html";
  const file = path.join(root, rel);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return Promise.resolve(new FakeResponse("missing", 404));
  return Promise.resolve(new FakeResponse(fs.readFileSync(file)));
}
const caches = {
  async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      async addAll(items) {
        for (const item of items) {
          const response = await localResponse(item);
          if (!response.ok) throw new Error(`cache miss: ${item}`);
          store.set(keyOf(item, false), response.clone());
        }
      },
      async put(request, response) { store.set(keyOf(request, false), response.clone()); }
    };
  },
  async match(request, options = {}) {
    const wanted = keyOf(request, !!options.ignoreSearch);
    for (const store of stores.values()) {
      for (const [key, value] of store) {
        if (keyOf(key, !!options.ignoreSearch) === wanted) return value.clone();
      }
    }
    return undefined;
  },
  async keys() { return [...stores.keys()]; },
  async delete(name) { return stores.delete(name); }
};
const sandbox = {
  URL, Promise, caches, fetch: localResponse,
  self: {
    location: { origin: "http://localhost" },
    clients: { claim: async () => {} },
    skipWaiting: async () => {},
    addEventListener(type, handler) { handlers[type] = handler; }
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "sw.js"), "utf8"), sandbox, { filename: "sw.js" });

function eventFor(extra = {}) {
  let pending = Promise.resolve();
  return Object.assign({
    waitUntil(promise) { pending = Promise.resolve(promise); },
    respondWith(promise) { this.response = Promise.resolve(promise); },
    done() { return pending; }
  }, extra);
}
function check(ok, message) { if (!ok) throw new Error(message); console.log("OK", message); }

(async () => {
  check(typeof handlers.install === "function" && typeof handlers.fetch === "function", "service worker rejestruje install i fetch");
  const install = eventFor(); handlers.install(install); await install.done();
  check(stores.has("castle-calamity-v7.4.0") && stores.get("castle-calamity-v7.4.0").size === 13, "app shell v7.4.0 zapisuje komplet 13 zasobów");

  stores.set("castle-calamity-v4.8", new Map());
  const activate = eventFor(); handlers.activate(activate); await activate.done();
  check(!stores.has("castle-calamity-v4.8"), "aktywacja usuwa wyłącznie stary cache");

  online = false;
  const nav = eventFor({ request: new FakeRequest("/?source=pwa", "navigate") });
  handlers.fetch(nav); const navResponse = await nav.response;
  check(navResponse && navResponse.ok, "nawigacja uruchamia grę offline z index.html");

  const asset = eventFor({ request: new FakeRequest("/content/i18n.js") });
  handlers.fetch(asset); const assetResponse = await asset.response; await asset.done();
  check(assetResponse && assetResponse.ok, "skrypty kampanii są dostępne offline");

  let missingRejected = false;
  const missing = eventFor({ request: new FakeRequest("/content/not-found.js") });
  handlers.fetch(missing);
  try { await missing.response; } catch (_) { missingRejected = true; }
  check(missingRejected, "brakujący skrypt nie jest błędnie zastępowany dokumentem HTML");

  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  check(manifest.id === "./" && manifest.display === "fullscreen" && manifest.display_override.includes("fullscreen") && manifest.display_override.includes("standalone") && manifest.orientation === "landscape", "manifest uruchamia PWA poziomo na pełnym ekranie z awaryjnym trybem standalone");
  for (const icon of manifest.icons) check(fs.existsSync(path.join(root, icon.src)), `ikona istnieje: ${icon.src}`);
  console.log("PWA V7.4.0 COMPLETE");
})().catch((error) => { console.error(error); process.exitCode = 1; });

