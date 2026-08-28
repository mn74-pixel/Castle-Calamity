import { GameModel, GameMode, GamePhase, modifierName } from "./game.js?v=0.7.0";
import { GameRenderer } from "./render.js?v=0.7.0";
import { GameAudio } from "./audio.js?v=0.7.0";
import { FaceStudio } from "./face-studio.js?v=0.7.0";

const $ = (selector) => document.querySelector(selector);

const elements = {
  canvas: $("#gameCanvas"),
  loading: $("#loadingPanel"),
  quickMode: $("#quickMode"),
  oneMoveMode: $("#oneMoveMode"),
  personality: $("#personality"),
  faceButton: $("#faceButton"),
  faceInput: $("#faceInput"),
  soundButton: $("#soundButton"),
  modeBadge: $("#modeBadge"),
  shotBadge: $("#shotBadge"),
  resultPanel: $("#resultPanel"),
  resultTag: $("#resultTag"),
  resultTitle: $("#resultTitle"),
  resultSpeech: $("#resultSpeech"),
  whatIfButton: $("#whatIfButton"),
  againButton: $("#againButton"),
  restartButton: $("#restartButton"),
  instructionIcon: $("#instructionIcon"),
  instructionTitle: $("#instructionTitle"),
  statusText: $("#statusText"),
  faceStudio: $("#faceStudio"),
  faceBackdrop: $("#faceBackdrop"),
  faceCanvas: $("#faceCanvas"),
  faceCancel: $("#faceCancel"),
  faceConfirm: $("#faceConfirm"),
  faceRemove: $("#faceRemove"),
  faceReplace: $("#faceReplace"),
  faceRotate: $("#faceRotate"),
  faceZoom: $("#faceZoom"),
  faceStatus: $("#faceStatus"),
  toast: $("#toast"),
};

const audio = new GameAudio();
const model = new GameModel();
const renderer = new GameRenderer(elements.canvas, model);

let activePointer = null;
let interaction = null;
let lastFrame = performance.now();
let resultTimer = null;
let toastTimer = null;

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle("is-error", isError);
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, isError ? 5200 : 2800);
}

function setFaceButton(hasFace) {
  elements.faceButton.classList.toggle("has-face", hasFace);
  elements.faceButton.textContent = hasFace ? "✓" : "☺";
  elements.faceButton.title = hasFace ? "Edytuj lub zmień twarz" : "Dodaj twarz lokalnie";
  elements.faceButton.setAttribute("aria-label", hasFace ? "Edytuj lub zmień twarz" : "Dodaj twarz lokalnie");
}

const faceStudio = new FaceStudio(
  {
    root: elements.faceStudio,
    backdrop: elements.faceBackdrop,
    canvas: elements.faceCanvas,
    cancel: elements.faceCancel,
    confirm: elements.faceConfirm,
    input: elements.faceInput,
    remove: elements.faceRemove,
    replace: elements.faceReplace,
    rotate: elements.faceRotate,
    status: elements.faceStatus,
    zoom: elements.faceZoom,
  },
  {
    onApply: (faceCanvas) => {
      renderer.setFaceImage(faceCanvas);
      setFaceButton(true);
      showToast("Twarz gotowa — teraz naprawdę lecisz Ty.");
    },
    onRemove: () => {
      renderer.setFaceImage(null);
      setFaceButton(false);
      showToast("Twarz usunięta z tej sesji.");
    },
    onError: (message) => showToast(message, true),
  },
);

model.onEvent = (event) => {
  renderer.handleGameEvent(event);
  audio.handleGameEvent(event);

  if (["reset", "mode", "launch", "what-if"].includes(event.type)) hideResult();
  if (event.type === "success" || event.type === "failure") {
    clearTimeout(resultTimer);
    resultTimer = window.setTimeout(() => {
      if (model.phase === GamePhase.SUCCEEDED || model.phase === GamePhase.FAILED) showResult();
    }, 520);
  }
  updateUi();
};

function pointFromPointer(event) {
  const rect = elements.canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * elements.canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * elements.canvas.height,
  };
}

function beginPointer(event) {
  event.preventDefault();
  audio.unlock().catch(() => {});
  if (activePointer !== null || model.phase === GamePhase.FLYING) return;

  const point = pointFromPointer(event);
  if (model.beginTrampolineMove(point)) interaction = "trampoline";
  else if (model.beginSling(point)) interaction = "sling";
  else return;

  activePointer = event.pointerId;
  elements.canvas.setPointerCapture(event.pointerId);
  elements.canvas.classList.add("is-dragging");
  updateUi();
}

function movePointer(event) {
  if (event.pointerId !== activePointer) return;
  event.preventDefault();
  const point = pointFromPointer(event);
  if (interaction === "trampoline") model.dragTrampoline(point);
  if (interaction === "sling") model.dragSling(point);
}

function endPointer(event) {
  if (event.pointerId !== activePointer) return;
  event.preventDefault();
  if (interaction === "trampoline") model.endTrampolineMove();
  if (interaction === "sling") model.releaseSling();
  if (elements.canvas.hasPointerCapture(event.pointerId)) elements.canvas.releasePointerCapture(event.pointerId);
  activePointer = null;
  interaction = null;
  elements.canvas.classList.remove("is-dragging");
  updateUi();
}

function cancelPointer(event) {
  if (event.pointerId !== activePointer) return;
  if (interaction === "trampoline") model.endTrampolineMove();
  if (interaction === "sling" && model.phase === GamePhase.AIMING) {
    model.resetLevel(false);
  }
  activePointer = null;
  interaction = null;
  elements.canvas.classList.remove("is-dragging");
  updateUi();
}

function setMode(mode) {
  if (model.mode === mode) return;
  model.setMode(mode);
}

function showResult() {
  const success = model.phase === GamePhase.SUCCEEDED;
  elements.resultPanel.hidden = false;
  elements.resultPanel.classList.toggle("is-success", success);
  elements.resultPanel.classList.toggle("is-failure", !success);
  elements.resultTag.textContent = success ? "SNOOZE!" : "FLOP!";
  elements.resultTitle.textContent = success ? "Poranek oficjalnie przełożony." : "Budzik nadal rządzi sypialnią.";
  elements.resultSpeech.textContent = model.speechText;
  elements.whatIfButton.hidden = success || !model.previousShot;
  elements.whatIfButton.textContent = `WHAT IF? · ${modifierName(model.suggestedModifier)}`;
}

function hideResult() {
  clearTimeout(resultTimer);
  elements.resultPanel.hidden = true;
}

function instructionForState() {
  if (model.mode === GameMode.ONE_MOVE && model.phase === GamePhase.READY && !model.moveUsed) {
    return { icon: "↔", title: "Przesuń trampolinę dokładnie raz" };
  }
  if (model.phase === GamePhase.AIMING) return { icon: "◎", title: "Wybierz kierunek i puść" };
  if (model.phase === GamePhase.FLYING) return { icon: "⚡", title: "Teraz fizyka robi swoje" };
  if (model.phase === GamePhase.SUCCEEDED) return { icon: "★", title: "Sukces — ale styl też się liczy" };
  if (model.phase === GamePhase.FAILED) return { icon: "↻", title: "Powtórz albo zmień fizykę" };
  return { icon: "☝", title: "Złap bohatera i pociągnij" };
}

function updateUi() {
  const quick = model.mode === GameMode.QUICK;
  elements.quickMode.classList.toggle("pill--active", quick);
  elements.oneMoveMode.classList.toggle("pill--active", !quick);
  elements.quickMode.setAttribute("aria-pressed", String(quick));
  elements.oneMoveMode.setAttribute("aria-pressed", String(!quick));

  elements.modeBadge.textContent = quick ? "⚡ QUICK SLING" : "◇ ONE MOVE";
  elements.modeBadge.classList.toggle("mission-badge--violet", quick);
  elements.modeBadge.classList.toggle("mission-badge--coral", !quick);
  const preparing = model.phase === GamePhase.READY || model.phase === GamePhase.AIMING;
  elements.shotBadge.textContent = `SHOT ${Math.max(1, model.attempts + (preparing ? 1 : 0))}`;

  const instruction = instructionForState();
  elements.instructionIcon.textContent = instruction.icon;
  elements.instructionTitle.textContent = instruction.title;
  elements.statusText.textContent = model.statusText;

  const controlsEnabled = model.phase !== GamePhase.FLYING && model.phase !== GamePhase.AIMING;
  elements.quickMode.disabled = !controlsEnabled;
  elements.oneMoveMode.disabled = !controlsEnabled;
  elements.personality.disabled = !controlsEnabled;
  elements.faceButton.disabled = !controlsEnabled;
}

function frame(now) {
  const deltaSeconds = Math.min((now - lastFrame) / 1000, 1 / 20);
  lastFrame = now;
  model.update(deltaSeconds);
  renderer.update(deltaSeconds);
  renderer.render();
  requestAnimationFrame(frame);
}

elements.canvas.addEventListener("pointerdown", beginPointer);
elements.canvas.addEventListener("pointermove", movePointer);
elements.canvas.addEventListener("pointerup", endPointer);
elements.canvas.addEventListener("pointercancel", cancelPointer);
elements.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

elements.quickMode.addEventListener("click", () => setMode(GameMode.QUICK));
elements.oneMoveMode.addEventListener("click", () => setMode(GameMode.ONE_MOVE));
elements.personality.addEventListener("change", (event) => {
  model.setPersonality(event.target.value);
  updateUi();
});
elements.faceButton.addEventListener("click", () => faceStudio.openEditor());
elements.faceInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    await faceStudio.openFile(file);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Nie udało się otworzyć zdjęcia.", true);
  } finally {
    event.target.value = "";
  }
});
elements.soundButton.addEventListener("click", () => {
  const muted = audio.toggleMuted();
  elements.soundButton.textContent = muted ? "×" : "♪";
  elements.soundButton.setAttribute("aria-pressed", String(muted));
  elements.soundButton.title = muted ? "Włącz dźwięk" : "Wycisz dźwięk";
});
elements.restartButton.addEventListener("click", () => model.resetLevel(true));
elements.againButton.addEventListener("click", () => model.resetLevel(false));
elements.whatIfButton.addEventListener("click", () => {
  const modifier = model.suggestedModifier;
  hideResult();
  model.replayWith(modifier);
});

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js?v=0.7.0").catch(() => {}));
}

renderer
  .load()
  .catch(() => {})
  .finally(() => {
    elements.loading.classList.add("is-hidden");
    updateUi();
    requestAnimationFrame(frame);
  });
