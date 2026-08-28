import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import http from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error("Invalid path");
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(file)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
const address = server.address();
assert.ok(address && typeof address === "object");
const origin = `http://127.0.0.1:${address.port}`;

try {
  for (const path of ["/", "/src/main.js", "/src/game.js", "/src/face-studio.js", "/styles.css", "/manifest.webmanifest", "/assets/stage_morning_mayhem.svg"]) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 200, `${path} should be served`);
    assert.ok(Number(response.headers.get("content-length") ?? 1) >= 0);
    await response.arrayBuffer();
  }
  console.log("Static artifact HTTP smoke test: OK.");
} finally {
  await new Promise((resolveClose, rejectClose) => server.close((error) => (error ? rejectClose(error) : resolveClose())));
}
