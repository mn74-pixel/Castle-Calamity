import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "dist");
const rootFiles = ["index.html", "styles.css", "manifest.webmanifest", "sw.js", ".nojekyll"];

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await Promise.all(rootFiles.map((file) => cp(resolve(root, file), resolve(destination, file))));
await Promise.all([
  cp(resolve(root, "src"), resolve(destination, "src"), { recursive: true }),
  cp(resolve(root, "assets"), resolve(destination, "assets"), { recursive: true }),
]);

console.log("Static GitHub Pages artifact created in dist/.");
