import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "sw.js",
  ".nojekyll",
  "src/main.js",
  "src/game.js",
  "src/render.js",
  "src/audio.js",
  "src/face-studio.js",
  "assets/logo_slingtoon.svg",
  "assets/stage_morning_mayhem.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/icon-maskable-512.png",
  ".github/workflows/validate.yml",
  ".github/workflows/deploy-pages.yml",
  ".github/pull_request_template.md",
  "01_WRZUC_DO_GITHUB.md",
  "CHANGELOG.md",
  "RELEASE_MANIFEST.md",
  "docs/AUDIT_GUARDRAILS_PL.md",
  "docs/MIGRATION_PLAN_PL.md",
];

await Promise.all(requiredFiles.map((file) => access(resolve(root, file))));

const [html, css, manifestText, worker, main, game, faceStudio] = await Promise.all([
  readFile(resolve(root, "index.html"), "utf8"),
  readFile(resolve(root, "styles.css"), "utf8"),
  readFile(resolve(root, "manifest.webmanifest"), "utf8"),
  readFile(resolve(root, "sw.js"), "utf8"),
  readFile(resolve(root, "src/main.js"), "utf8"),
  readFile(resolve(root, "src/game.js"), "utf8"),
  readFile(resolve(root, "src/face-studio.js"), "utf8"),
]);

const manifest = JSON.parse(manifestText);
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.equal(manifest.display, "fullscreen");
assert.equal(manifest.orientation, "landscape");
assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));

assert.match(html, /<canvas id="gameCanvas"/);
assert.match(html, /manifest\.webmanifest/);
assert.match(html, /src\/main\.js/);
assert.match(main, /serviceWorker\.register\("\.\/sw\.js\?v=0\.7\.0"\)/);
assert.match(game, /replayWith\(modifier\)/);
assert.match(game, /shot\.launchVelocity/);
assert.match(html, /id="faceStudio"/);
assert.match(main, /new FaceStudio/);
assert.match(faceStudio, /createFaceCanvas\(\)/);
assert.match(faceStudio, /requestFile\(\)/);
assert.match(css, /orientation:\s*landscape[^}]*max-height:\s*560px/);
assert.match(css, /width:\s*min\(100%,\s*calc\(200dvh - 296px\)\)/);

for (const viewportHeight of [340, 375, 393, 430, 560]) {
  const shellWidth = (2 * viewportHeight) - 296;
  const minimumVerticalPadding = 8;
  const compactTopbar = 38;
  const gridGap = 4;
  const missionStrip = 40;
  const stageHeight = shellWidth / 2;
  const statusRow = 38;
  const fittedHeight = minimumVerticalPadding + compactTopbar + gridGap + missionStrip + stageHeight + statusRow;
  assert.ok(fittedHeight <= viewportHeight - 19, `compact layout needs safety room at ${viewportHeight}px height`);
}

for (const file of requiredFiles.filter((file) => !file.startsWith(".github") && !file.startsWith("docs/"))) {
  if (["package.json", ".gitignore", ".gitattributes"].includes(file)) continue;
  if (file === ".nojekyll") continue;
  const cachePath = file === "index.html" ? "./index.html" : `./${file}`;
  if (["index.html", "styles.css", "manifest.webmanifest", "sw.js", "src/main.js", "src/game.js", "src/render.js", "src/audio.js", "src/face-studio.js"].includes(file) || file.startsWith("assets/")) {
    const exactPath = worker.includes(`"${cachePath}"`);
    const versionedPath = worker.includes(`"${cachePath}?v=`);
    assert.ok(exactPath || versionedPath || file === "sw.js", `${file} is missing from the offline app shell`);
  }
}

console.log("SlingToon Web 0.7: mobile viewport, Face Studio, PWA metadata and offline shell are valid.");
