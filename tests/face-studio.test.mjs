import test from "node:test";
import assert from "node:assert/strict";

import { FaceStudio, cropTransform, isLikelyImageFile, rotatedDimensions } from "../src/face-studio.js";

function classListMock() {
  const values = new Set();
  return {
    add: (...names) => names.forEach((name) => values.add(name)),
    remove: (...names) => names.forEach((name) => values.delete(name)),
    contains: (name) => values.has(name),
    toggle: (name, force) => {
      if (force === true) values.add(name);
      else if (force === false) values.delete(name);
      else if (values.has(name)) values.delete(name);
      else values.add(name);
    },
  };
}

function elementMock(overrides = {}) {
  return {
    addEventListener() {},
    classList: classListMock(),
    click() {},
    disabled: false,
    focus() {},
    hidden: false,
    textContent: "",
    value: "",
    ...overrides,
  };
}

function canvasMock() {
  const gradient = { addColorStop() {} };
  const context = new Proxy({ createLinearGradient: () => gradient }, {
    get(target, property) {
      if (property in target) return target[property];
      return () => {};
    },
  });
  return elementMock({
    getContext: () => context,
    hasPointerCapture: () => false,
    height: 640,
    setPointerCapture() {},
    width: 640,
  });
}

test("accepts camera image types and common image extensions", () => {
  assert.equal(isLikelyImageFile({ type: "image/jpeg", name: "selfie" }), true);
  assert.equal(isLikelyImageFile({ type: "", name: "IMG_1001.HEIC" }), true);
  assert.equal(isLikelyImageFile({ type: "application/pdf", name: "notes.pdf" }), false);
});

test("swaps dimensions after a quarter turn", () => {
  assert.deepEqual(rotatedDimensions(1200, 800, 0), { width: 1200, height: 800 });
  assert.deepEqual(rotatedDimensions(1200, 800, 1), { width: 800, height: 1200 });
  assert.deepEqual(rotatedDimensions(1200, 800, 3), { width: 800, height: 1200 });
});

test("cover scale never leaves an empty edge inside the circular crop", () => {
  const transform = cropTransform(1200, 800, 0, 1, 999, -999);
  assert.equal(transform.scale, 0.62);
  assert.equal(transform.maxOffsetX, 124);
  assert.equal(transform.maxOffsetY, 0);
  assert.equal(transform.offsetX, 124);
  assert.equal(transform.offsetY, 0);
});

test("zoom is clamped and creates room for manual face positioning", () => {
  const transform = cropTransform(1000, 1000, 0, 99, 9999, 9999);
  assert.equal(transform.zoom, 4);
  assert.ok(transform.maxOffsetX > 700);
  assert.equal(transform.offsetX, transform.maxOffsetX);
  assert.equal(transform.offsetY, transform.maxOffsetY);
});

test("Face Studio opens before the iOS photo picker and can reselect the same file", () => {
  const previousDocument = globalThis.document;
  const previousAnimationFrame = globalThis.requestAnimationFrame;
  let inputClicks = 0;

  globalThis.document = {
    addEventListener() {},
    body: { classList: classListMock() },
  };
  globalThis.requestAnimationFrame = (callback) => {
    callback();
    return 1;
  };

  try {
    const input = elementMock({ click: () => { inputClicks += 1; }, value: "previous-photo" });
    const root = elementMock({ hidden: true });
    const replace = elementMock();
    const confirm = elementMock();
    const studio = new FaceStudio({
      root,
      backdrop: elementMock(),
      canvas: canvasMock(),
      cancel: elementMock(),
      confirm,
      input,
      remove: elementMock(),
      replace,
      rotate: elementMock(),
      status: elementMock(),
      zoom: elementMock({ value: "1" }),
    });

    studio.openEditor();
    assert.equal(root.hidden, false);
    assert.equal(inputClicks, 0);
    assert.match(replace.textContent, /Wybierz zdjęcie/);
    assert.equal(confirm.disabled, true);

    studio.requestFile();
    assert.equal(input.value, "");
    assert.equal(inputClicks, 1);
  } finally {
    globalThis.document = previousDocument;
    globalThis.requestAnimationFrame = previousAnimationFrame;
  }
});
