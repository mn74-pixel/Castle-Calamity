const fs = require("fs");
const path = require("path");
const { createCanvas, Image } = require("@napi-rs/canvas");

const dir = __dirname;
const source = fs.readFileSync(path.join(dir, "icon-master.svg"));
const image = new Image();
image.src = source;

for (const size of [512, 192]) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, size, size);
  const png = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(dir, `icon-${size}.png`), png);
  fs.writeFileSync(path.join(dir, `icon-maskable-${size}.png`), png);
}

console.log("Rendered icon-192/512 and maskable variants from icon-master.svg");
