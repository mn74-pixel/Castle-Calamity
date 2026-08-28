const PREVIEW_SIZE = 640;
const CROP_RADIUS = 248;
const OUTPUT_SIZE = 512;
const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export function isLikelyImageFile(file) {
  if (!file) return false;
  if (file.type?.startsWith("image/")) return true;
  return /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i.test(file.name ?? "");
}

export function rotatedDimensions(width, height, quarterTurns = 0) {
  const normalizedTurns = ((quarterTurns % 4) + 4) % 4;
  return normalizedTurns % 2 === 0 ? { width, height } : { width: height, height: width };
}

export function cropTransform(imageWidth, imageHeight, quarterTurns, zoom, offsetX, offsetY) {
  const dimensions = rotatedDimensions(imageWidth, imageHeight, quarterTurns);
  const baseScale = Math.max((CROP_RADIUS * 2) / dimensions.width, (CROP_RADIUS * 2) / dimensions.height);
  const safeZoom = clamp(Number(zoom) || MIN_ZOOM, MIN_ZOOM, MAX_ZOOM);
  const scale = baseScale * safeZoom;
  const maxOffsetX = Math.max(0, (dimensions.width * scale) / 2 - CROP_RADIUS);
  const maxOffsetY = Math.max(0, (dimensions.height * scale) / 2 - CROP_RADIUS);
  return {
    scale,
    zoom: safeZoom,
    offsetX: maxOffsetX === 0 ? 0 : clamp(Number(offsetX) || 0, -maxOffsetX, maxOffsetX),
    offsetY: maxOffsetY === 0 ? 0 : clamp(Number(offsetY) || 0, -maxOffsetY, maxOffsetY),
    maxOffsetX,
    maxOffsetY,
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku."));
    reader.readAsDataURL(file);
  });
}

function imageFromSource(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Ten format zdjęcia nie jest obsługiwany przez przeglądarkę."));
    image.src = source;
  });
}

function imageFromFile(file) {
  const objectUrl = URL.createObjectURL(file);
  return imageFromSource(objectUrl).finally(() => URL.revokeObjectURL(objectUrl));
}

async function decodeImage(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Safari supports some camera formats only through HTMLImageElement.
    }
  }
  try {
    return await imageFromFile(file);
  } catch {
    // Data URLs are slower, but remain a useful fallback for older mobile Safari builds.
    return imageFromSource(await fileToDataUrl(file));
  }
}

function imageSize(image) {
  return {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

function pointerPosition(canvas, event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
  };
}

function pointerDistance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

export class FaceStudio {
  constructor(elements, callbacks = {}) {
    this.elements = elements;
    this.onApply = callbacks.onApply ?? (() => {});
    this.onRemove = callbacks.onRemove ?? (() => {});
    this.onError = callbacks.onError ?? (() => {});
    this.sourceImage = null;
    this.quarterTurns = 0;
    this.zoom = MIN_ZOOM;
    this.offsetX = 0;
    this.offsetY = 0;
    this.hasAppliedFace = false;
    this.snapshot = null;
    this.pointers = new Map();
    this.lastDragPoint = null;
    this.pinchStartDistance = 0;
    this.pinchStartZoom = MIN_ZOOM;
    this.bindEvents();
    this.renderEmpty();
  }

  bindEvents() {
    const { canvas, backdrop, cancel, confirm, rotate, remove, replace, zoom } = this.elements;
    canvas.addEventListener("pointerdown", (event) => this.pointerDown(event));
    canvas.addEventListener("pointermove", (event) => this.pointerMove(event));
    canvas.addEventListener("pointerup", (event) => this.pointerUp(event));
    canvas.addEventListener("pointercancel", (event) => this.pointerUp(event));
    canvas.addEventListener("wheel", (event) => this.wheel(event), { passive: false });
    zoom.addEventListener("input", () => {
      this.zoom = Number(zoom.value);
      this.clampTransform();
      this.render();
    });
    rotate.addEventListener("click", () => {
      this.quarterTurns = (this.quarterTurns + 1) % 4;
      this.clampTransform();
      this.render();
    });
    replace.addEventListener("click", () => this.requestFile());
    confirm.addEventListener("click", () => this.apply());
    remove.addEventListener("click", () => this.remove());
    cancel.addEventListener("click", () => this.cancel());
    backdrop.addEventListener("click", () => this.cancel());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.elements.root.hidden) this.cancel();
    });
  }

  openEditor() {
    this.beginSession();
    this.show();
    this.setBusy(false, this.sourceImage
      ? "Przesuń zdjęcie palcem. Twarz powinna wypełnić koło."
      : "Wybierz zdjęcie, a potem ustaw twarz w żółtym kole.");
  }

  requestFile() {
    // Reset before opening so choosing the same photo twice still fires `change` on iOS.
    this.elements.input.value = "";
    this.elements.input.click();
  }

  async openFile(file) {
    if (!isLikelyImageFile(file)) throw new Error("Wybierz zdjęcie w formacie JPG, PNG, WebP lub HEIC.");
    if (file.size > MAX_FILE_SIZE) throw new Error("Zdjęcie jest za duże. Wybierz plik mniejszy niż 30 MB.");

    this.beginSession();
    this.show();
    this.setBusy(true, "Wczytuję zdjęcie…");
    try {
      const image = await decodeImage(file);
      const { width, height } = imageSize(image);
      if (!width || !height) throw new Error("Zdjęcie nie ma prawidłowych wymiarów.");
      if (this.sourceImage && this.sourceImage !== this.snapshot?.sourceImage && typeof this.sourceImage.close === "function") {
        this.sourceImage.close();
      }
      this.sourceImage = image;
      this.quarterTurns = 0;
      this.zoom = MIN_ZOOM;
      this.offsetX = 0;
      this.offsetY = height > width ? -28 : 0;
      this.clampTransform();
      this.elements.zoom.value = String(this.zoom);
      this.elements.remove.hidden = !this.hasAppliedFace;
      this.updateReplaceLabel();
      this.setBusy(false, "Przesuń zdjęcie palcem. Twarz powinna wypełnić koło.");
      this.render();
    } catch (error) {
      this.restoreSnapshot();
      const message = error instanceof Error ? error.message : "Nie udało się otworzyć zdjęcia.";
      this.setBusy(false, message);
      this.updateReplaceLabel();
      this.render();
      throw error;
    }
  }

  beginSession() {
    if (this.snapshot) return;
    this.snapshot = {
      sourceImage: this.sourceImage,
      quarterTurns: this.quarterTurns,
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    };
  }

  show() {
    this.elements.root.hidden = false;
    document.body.classList.add("face-studio-open");
    this.elements.remove.hidden = !this.hasAppliedFace;
    this.elements.confirm.disabled = !this.sourceImage;
    this.updateReplaceLabel();
    requestAnimationFrame(() => {
      try {
        this.elements.cancel.focus({ preventScroll: true });
      } catch {
        this.elements.cancel.focus();
      }
    });
    this.render();
  }

  updateReplaceLabel() {
    this.elements.replace.textContent = this.sourceImage ? "▣ Inne zdjęcie" : "▣ Wybierz zdjęcie";
  }

  hide() {
    this.elements.root.hidden = true;
    document.body.classList.remove("face-studio-open");
    this.pointers.clear();
    this.lastDragPoint = null;
  }

  cancel() {
    this.restoreSnapshot();
    this.snapshot = null;
    this.hide();
  }

  restoreSnapshot() {
    if (!this.snapshot) return;
    if (this.sourceImage && this.sourceImage !== this.snapshot.sourceImage && typeof this.sourceImage.close === "function") {
      this.sourceImage.close();
    }
    Object.assign(this, this.snapshot);
    this.elements.zoom.value = String(this.zoom);
  }

  apply() {
    if (!this.sourceImage) return;
    const face = this.createFaceCanvas();
    if (this.snapshot?.sourceImage && this.snapshot.sourceImage !== this.sourceImage && typeof this.snapshot.sourceImage.close === "function") {
      this.snapshot.sourceImage.close();
    }
    this.hasAppliedFace = true;
    this.snapshot = null;
    this.onApply(face);
    this.hide();
  }

  remove() {
    if (this.sourceImage && typeof this.sourceImage.close === "function") this.sourceImage.close();
    this.sourceImage = null;
    this.hasAppliedFace = false;
    this.snapshot = null;
    this.zoom = MIN_ZOOM;
    this.offsetX = 0;
    this.offsetY = 0;
    this.quarterTurns = 0;
    this.onRemove();
    this.hide();
  }

  setBusy(isBusy, message) {
    const editingUnavailable = isBusy || !this.sourceImage;
    this.elements.root.classList.toggle("is-loading", isBusy);
    this.elements.status.textContent = message;
    this.elements.confirm.disabled = editingUnavailable;
    this.elements.rotate.disabled = editingUnavailable;
    this.elements.replace.disabled = isBusy;
    this.elements.zoom.disabled = editingUnavailable;
  }

  clampTransform() {
    if (!this.sourceImage) return;
    const { width, height } = imageSize(this.sourceImage);
    const transform = cropTransform(width, height, this.quarterTurns, this.zoom, this.offsetX, this.offsetY);
    this.zoom = transform.zoom;
    this.offsetX = transform.offsetX;
    this.offsetY = transform.offsetY;
    this.elements.zoom.value = String(this.zoom);
  }

  pointerDown(event) {
    if (!this.sourceImage || this.elements.root.classList.contains("is-loading")) return;
    event.preventDefault();
    this.elements.canvas.setPointerCapture(event.pointerId);
    const point = pointerPosition(this.elements.canvas, event);
    this.pointers.set(event.pointerId, point);
    if (this.pointers.size === 1) this.lastDragPoint = point;
    if (this.pointers.size === 2) {
      const [first, second] = [...this.pointers.values()];
      this.pinchStartDistance = pointerDistance(first, second);
      this.pinchStartZoom = this.zoom;
      this.lastDragPoint = null;
    }
  }

  pointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;
    event.preventDefault();
    const point = pointerPosition(this.elements.canvas, event);
    this.pointers.set(event.pointerId, point);

    if (this.pointers.size === 1 && this.lastDragPoint) {
      this.offsetX += point.x - this.lastDragPoint.x;
      this.offsetY += point.y - this.lastDragPoint.y;
      this.lastDragPoint = point;
    } else if (this.pointers.size >= 2) {
      const [first, second] = [...this.pointers.values()];
      const distance = pointerDistance(first, second);
      if (this.pinchStartDistance > 0) this.zoom = this.pinchStartZoom * (distance / this.pinchStartDistance);
    }
    this.clampTransform();
    this.render();
  }

  pointerUp(event) {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.delete(event.pointerId);
    if (this.elements.canvas.hasPointerCapture(event.pointerId)) this.elements.canvas.releasePointerCapture(event.pointerId);
    if (this.pointers.size === 1) this.lastDragPoint = [...this.pointers.values()][0];
    else this.lastDragPoint = null;
  }

  wheel(event) {
    if (!this.sourceImage) return;
    event.preventDefault();
    this.zoom *= Math.exp(-event.deltaY * 0.0015);
    this.clampTransform();
    this.render();
  }

  drawPhoto(ctx, factor = 1) {
    const { width, height } = imageSize(this.sourceImage);
    const { scale, offsetX, offsetY } = cropTransform(
      width,
      height,
      this.quarterTurns,
      this.zoom,
      this.offsetX,
      this.offsetY,
    );
    ctx.save();
    ctx.translate((PREVIEW_SIZE / 2 + offsetX) * factor, (PREVIEW_SIZE / 2 + offsetY) * factor);
    ctx.rotate((this.quarterTurns * Math.PI) / 2);
    ctx.scale(scale * factor, scale * factor);
    ctx.drawImage(this.sourceImage, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  renderEmpty() {
    const ctx = this.elements.canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    gradient.addColorStop(0, "#46366e");
    gradient.addColorStop(1, "#231a3b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    if (!this.sourceImage) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 211, 95, 0.92)";
      ctx.font = "900 112px system-ui, sans-serif";
      ctx.fillText("☺", PREVIEW_SIZE / 2, PREVIEW_SIZE / 2 + 18);
      ctx.fillStyle = "rgba(255, 245, 217, 0.72)";
      ctx.font = "900 22px system-ui, sans-serif";
      ctx.fillText("WYBIERZ ZDJĘCIE", PREVIEW_SIZE / 2, PREVIEW_SIZE / 2 + 82);
      ctx.restore();
    }
  }

  render() {
    const canvas = this.elements.canvas;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    this.renderEmpty();
    if (this.sourceImage) this.drawPhoto(ctx);

    ctx.save();
    ctx.fillStyle = "rgba(18, 12, 31, 0.67)";
    ctx.beginPath();
    ctx.rect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    ctx.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, CROP_RADIUS, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    ctx.strokeStyle = "#ffd35f";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, CROP_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.56)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, CROP_RADIUS - 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  createFaceCanvas() {
    const output = document.createElement("canvas");
    output.width = OUTPUT_SIZE;
    output.height = OUTPUT_SIZE;
    const ctx = output.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#f4b783";
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    const factor = OUTPUT_SIZE / (CROP_RADIUS * 2);
    ctx.save();
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
    ctx.translate(-PREVIEW_SIZE / 2 * factor, -PREVIEW_SIZE / 2 * factor);
    this.drawPhoto(ctx, factor);
    ctx.restore();
    return output;
  }
}
