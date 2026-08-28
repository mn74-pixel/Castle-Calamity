export const WORLD = Object.freeze({
  width: 1280,
  height: 640,
  groundY: 586,
  anchor: Object.freeze({ x: 173, y: 455 }),
});

export const GameMode = Object.freeze({
  QUICK: "quickSling",
  ONE_MOVE: "oneMoveChallenge",
});

export const GamePhase = Object.freeze({
  READY: "ready",
  AIMING: "aiming",
  FLYING: "flying",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
});

export const Modifier = Object.freeze({
  NONE: "none",
  STRONGER_FAN: "strongerFan",
  LOW_GRAVITY: "lowGravity",
  SUPER_BOUNCY: "superBouncy",
  GIANT_HEAD: "giantHead",
});

export const Personality = Object.freeze({
  DRAMA_QUEEN: "dramaQueen",
  TOUGH_GUY: "toughGuy",
  PANIC: "panic",
  ZEN: "zen",
});

const BASE_RADIUS = 35;
const MAX_PULL = 132;
const MIN_LAUNCH_SPEED = 85;
const LAUNCH_MULTIPLIER = 6.15;
const MODIFIERS = [
  Modifier.STRONGER_FAN,
  Modifier.LOW_GRAVITY,
  Modifier.SUPER_BOUNCY,
  Modifier.GIANT_HEAD,
];

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const copyPoint = (point) => ({ x: point.x, y: point.y });
const length = (vector) => Math.hypot(vector.x, vector.y);
const distanceSquared = (a, b) => {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return x * x + y * y;
};

export class GameModel {
  constructor(onEvent = () => {}) {
    this.onEvent = onEvent;
    this.mode = GameMode.QUICK;
    this.phase = GamePhase.READY;
    this.modifier = Modifier.NONE;
    this.personality = Personality.DRAMA_QUEEN;
    this.previousShot = null;
    this.attempts = 0;
    this.resetLevel(true);
  }

  emit(type, detail = {}) {
    this.onEvent({ type, ...detail });
  }

  setMode(mode) {
    if (!Object.values(GameMode).includes(mode)) return;
    this.mode = mode;
    this.resetLevel(true);
    this.emit("mode", { mode });
  }

  setPersonality(personality) {
    if (!Object.values(Personality).includes(personality)) return;
    this.personality = personality;
    this.emit("personality", { personality });
  }

  resetLevel(resetAttempts = false) {
    this.phase = GamePhase.READY;
    this.modifier = Modifier.NONE;
    this.avatarPosition = copyPoint(WORLD.anchor);
    this.avatarVelocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.trampolineX = 575;
    this.trampolineGrabOffset = 0;
    this.movingTrampoline = false;
    this.moveUsed = false;
    this.impactFlash = 0;
    this.flightTime = 0;

    if (resetAttempts) {
      this.attempts = 0;
      this.previousShot = null;
    }

    this.emit("reset", { resetAttempts });
  }

  canAim() {
    const correctPhase = this.phase === GamePhase.READY || this.phase === GamePhase.AIMING;
    return correctPhase && (this.mode === GameMode.QUICK || this.moveUsed);
  }

  beginSling(point) {
    if (!this.canAim()) return false;
    const grabRadius = this.avatarRadius + 34;
    if (distanceSquared(point, this.avatarPosition) > grabRadius * grabRadius) return false;

    this.phase = GamePhase.AIMING;
    this.dragSling(point);
    this.emit("aim-start");
    return true;
  }

  dragSling(point) {
    if (this.phase !== GamePhase.AIMING) return;
    this.avatarPosition = this.clampedSlingPoint(point);
    const direction = {
      x: WORLD.anchor.x - this.avatarPosition.x,
      y: WORLD.anchor.y - this.avatarPosition.y,
    };
    this.rotation = Math.atan2(direction.y, direction.x);
  }

  releaseSling() {
    if (this.phase !== GamePhase.AIMING) return false;

    const pull = {
      x: WORLD.anchor.x - this.avatarPosition.x,
      y: WORLD.anchor.y - this.avatarPosition.y,
    };
    const launchVelocity = {
      x: pull.x * LAUNCH_MULTIPLIER,
      y: pull.y * LAUNCH_MULTIPLIER,
    };

    if (length(launchVelocity) < MIN_LAUNCH_SPEED) {
      this.phase = GamePhase.READY;
      this.avatarPosition = copyPoint(WORLD.anchor);
      this.rotation = 0;
      this.emit("cancel-shot");
      return false;
    }

    this.previousShot = {
      launchVelocity: copyPoint(launchVelocity),
      launchPosition: copyPoint(this.avatarPosition),
      trampolineX: this.trampolineX,
    };
    this.startFlight(launchVelocity, true, this.avatarPosition);
    return true;
  }

  beginTrampolineMove(point) {
    if (this.mode !== GameMode.ONE_MOVE || this.phase !== GamePhase.READY || this.moveUsed) return false;
    const bounds = this.trampolineBounds;
    const hitArea = {
      x: bounds.x - 24,
      y: bounds.y - 28,
      width: bounds.width + 48,
      height: bounds.height + 56,
    };
    if (!this.rectContains(hitArea, point)) return false;

    this.movingTrampoline = true;
    this.trampolineGrabOffset = point.x - this.trampolineX;
    this.emit("move-start");
    return true;
  }

  dragTrampoline(point) {
    if (!this.movingTrampoline) return;
    this.trampolineX = clamp(point.x - this.trampolineGrabOffset, 340, 660);
  }

  endTrampolineMove() {
    if (!this.movingTrampoline) return false;
    this.movingTrampoline = false;
    this.moveUsed = true;
    this.emit("move-complete", { trampolineX: this.trampolineX });
    return true;
  }

  startFlight(velocity, countsAsNewAttempt, startPosition = this.avatarPosition) {
    this.phase = GamePhase.FLYING;
    this.modifier = Modifier.NONE;
    this.avatarPosition = copyPoint(startPosition);
    this.avatarVelocity = copyPoint(velocity);
    this.rotation = Math.atan2(velocity.y, velocity.x);
    this.flightTime = 0;
    this.impactFlash = 0;
    this.movingTrampoline = false;

    if (countsAsNewAttempt) this.attempts += 1;
    this.emit("launch", {
      position: copyPoint(this.avatarPosition),
      velocity: copyPoint(this.avatarVelocity),
      replay: !countsAsNewAttempt,
    });
  }

  replayWith(modifier) {
    if (this.phase !== GamePhase.FAILED || !this.previousShot || modifier === Modifier.NONE) return false;

    const shot = this.previousShot;
    this.modifier = modifier;
    this.phase = GamePhase.FLYING;
    this.avatarPosition = copyPoint(shot.launchPosition);
    this.avatarVelocity = copyPoint(shot.launchVelocity);
    this.trampolineX = shot.trampolineX;
    this.rotation = Math.atan2(this.avatarVelocity.y, this.avatarVelocity.x);
    this.flightTime = 0;
    this.impactFlash = 0;
    this.movingTrampoline = false;
    this.moveUsed = this.mode === GameMode.ONE_MOVE;
    this.attempts += 1;
    this.emit("what-if", { modifier, velocity: copyPoint(this.avatarVelocity) });
    return true;
  }

  update(deltaSeconds) {
    const dt = clamp(deltaSeconds, 0, 1 / 30);
    this.impactFlash = Math.max(0, this.impactFlash - dt);
    if (this.phase !== GamePhase.FLYING) return;

    this.flightTime += dt;
    this.avatarVelocity.y += 725 * this.gravityScale * dt;

    const fan = this.fanBounds;
    const fanInfluence = {
      x: fan.x - 125,
      y: fan.y - 70,
      width: fan.width + 250,
      height: fan.height + 95,
    };
    if (this.rectContains(fanInfluence, this.avatarPosition)) {
      const closeness = 1 - clamp(Math.abs(this.avatarPosition.x - (fan.x + fan.width * 0.5)) / 215, 0, 1);
      this.avatarVelocity.y -= (530 + 250 * closeness) * this.fanScale * dt;
      this.avatarVelocity.x += 92 * this.fanScale * dt;
    }

    const drag = Math.pow(0.9982, dt * 60);
    this.avatarVelocity.x *= drag;
    this.avatarVelocity.y *= drag;
    this.avatarPosition.x += this.avatarVelocity.x * dt;
    this.avatarPosition.y += this.avatarVelocity.y * dt;
    this.rotation = Math.atan2(this.avatarVelocity.y, this.avatarVelocity.x) + Math.PI * 0.04;

    this.resolveWorldCollisions();

    const goalDistance = this.avatarRadius + this.goalRadius;
    if (
      distanceSquared(this.avatarPosition, this.goalCentre) <= goalDistance * goalDistance &&
      Math.abs(this.avatarVelocity.x) < 900 &&
      Math.abs(this.avatarVelocity.y) < 1000
    ) {
      this.finishAttempt(true);
      return;
    }

    const outOfWorld =
      this.avatarPosition.x < -145 ||
      this.avatarPosition.x > WORLD.width + 145 ||
      this.avatarPosition.y > WORLD.height + 145;

    if (outOfWorld || this.flightTime > 8.5) {
      this.finishAttempt(false);
      return;
    }

    if (
      this.flightTime > 2 &&
      this.avatarPosition.y + this.avatarRadius >= WORLD.groundY - 1 &&
      length(this.avatarVelocity) < 42
    ) {
      this.finishAttempt(false);
    }
  }

  finishAttempt(success) {
    this.phase = success ? GamePhase.SUCCEEDED : GamePhase.FAILED;
    this.avatarVelocity = { x: 0, y: 0 };
    this.movingTrampoline = false;
    this.emit(success ? "success" : "failure", {
      position: copyPoint(this.avatarPosition),
      attempt: this.attempts,
    });
  }

  resolveWorldCollisions() {
    const radius = this.avatarRadius;

    if (this.avatarPosition.y + radius > WORLD.groundY) {
      this.avatarPosition.y = WORLD.groundY - radius;
      if (this.avatarVelocity.y > 0) {
        const speed = Math.abs(this.avatarVelocity.y);
        this.avatarVelocity.y = -speed * 0.52 * this.bounceScale;
        this.avatarVelocity.x *= 0.83;
        if (Math.abs(this.avatarVelocity.y) < 31) this.avatarVelocity.y = 0;
        this.triggerImpact(speed, this.avatarPosition.x, WORLD.groundY);
      }
    }

    const trampoline = this.trampolineBounds;
    const withinTrampoline =
      this.avatarPosition.x + radius >= trampoline.x &&
      this.avatarPosition.x - radius <= trampoline.x + trampoline.width;
    const hittingFromAbove =
      this.avatarPosition.y + radius >= trampoline.y &&
      this.avatarPosition.y - radius < trampoline.y &&
      this.avatarVelocity.y > 0;

    if (withinTrampoline && hittingFromAbove) {
      const speed = Math.abs(this.avatarVelocity.y);
      this.avatarPosition.y = trampoline.y - radius;
      this.avatarVelocity.y = -Math.max(545, speed * 1.08) * this.bounceScale;
      this.avatarVelocity.x += 172;
      this.triggerImpact(Math.max(speed, 480), this.avatarPosition.x, trampoline.y, "trampoline");
    }

    this.collideCircleWithRect(this.crateBounds, 0.66 * this.bounceScale, true, "crate");
    this.collideCircleWithRect(this.wallBounds, 0.72 * this.bounceScale, false, "wall");
  }

  collideCircleWithRect(obstacle, restitution, addForwardKick, surface) {
    const radius = this.avatarRadius;
    const closestX = clamp(this.avatarPosition.x, obstacle.x, obstacle.x + obstacle.width);
    const closestY = clamp(this.avatarPosition.y, obstacle.y, obstacle.y + obstacle.height);
    let difference = {
      x: this.avatarPosition.x - closestX,
      y: this.avatarPosition.y - closestY,
    };
    let distanceSq = difference.x * difference.x + difference.y * difference.y;
    if (distanceSq >= radius * radius) return false;

    if (distanceSq < 0.0001) {
      const penetrations = [
        { value: Math.abs(this.avatarPosition.x - obstacle.x), normal: { x: -1, y: 0 } },
        { value: Math.abs(obstacle.x + obstacle.width - this.avatarPosition.x), normal: { x: 1, y: 0 } },
        { value: Math.abs(this.avatarPosition.y - obstacle.y), normal: { x: 0, y: -1 } },
        { value: Math.abs(obstacle.y + obstacle.height - this.avatarPosition.y), normal: { x: 0, y: 1 } },
      ].sort((a, b) => a.value - b.value);
      difference = penetrations[0].normal;
      distanceSq = 1;
    }

    const distance = Math.sqrt(distanceSq);
    const normal = { x: difference.x / distance, y: difference.y / distance };
    const penetration = radius - distance;
    this.avatarPosition.x += normal.x * (penetration + 0.5);
    this.avatarPosition.y += normal.y * (penetration + 0.5);

    const dot = this.avatarVelocity.x * normal.x + this.avatarVelocity.y * normal.y;
    const impactSpeed = Math.abs(dot);
    if (dot < 0) {
      this.avatarVelocity.x -= (1 + restitution) * dot * normal.x;
      this.avatarVelocity.y -= (1 + restitution) * dot * normal.y;
    }
    if (addForwardKick) this.avatarVelocity.x += 118;
    this.triggerImpact(Math.max(impactSpeed, 180), this.avatarPosition.x, this.avatarPosition.y, surface);
    return true;
  }

  triggerImpact(speed, x, y, surface = "ground") {
    this.impactFlash = 0.2;
    this.emit("impact", { speed, x, y, surface });
  }

  predictedTrajectory(numberOfDots = 20) {
    if (this.phase !== GamePhase.AIMING || numberOfDots <= 0) return [];
    const points = [];
    const position = copyPoint(this.avatarPosition);
    const velocity = {
      x: (WORLD.anchor.x - this.avatarPosition.x) * LAUNCH_MULTIPLIER,
      y: (WORLD.anchor.y - this.avatarPosition.y) * LAUNCH_MULTIPLIER,
    };
    const step = 0.09;

    for (let index = 0; index < numberOfDots; index += 1) {
      velocity.y += 725 * step;
      position.x += velocity.x * step;
      position.y += velocity.y * step;
      points.push(copyPoint(position));
    }
    return points;
  }

  clampedSlingPoint(point) {
    const offset = { x: point.x - WORLD.anchor.x, y: point.y - WORLD.anchor.y };
    const offsetLength = length(offset);
    if (offsetLength > MAX_PULL && offsetLength > Number.EPSILON) {
      offset.x *= MAX_PULL / offsetLength;
      offset.y *= MAX_PULL / offsetLength;
    }
    offset.x = Math.min(offset.x, 48);
    return { x: WORLD.anchor.x + offset.x, y: WORLD.anchor.y + offset.y };
  }

  rectContains(rect, point) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  get avatarRadius() {
    return BASE_RADIUS * (this.modifier === Modifier.GIANT_HEAD ? 1.42 : 1);
  }

  get trampolineBounds() {
    return { x: this.trampolineX, y: 515, width: 156, height: 25 };
  }

  get fanBounds() {
    return { x: 720, y: 245, width: 165, height: 310 };
  }

  get crateBounds() {
    return { x: 452, y: 442, width: 94, height: 144 };
  }

  get wallBounds() {
    return { x: 952, y: 427, width: 34, height: 159 };
  }

  get goalCentre() {
    return { x: 1127, y: 486 };
  }

  get goalRadius() {
    return 56;
  }

  get gravityScale() {
    return this.modifier === Modifier.LOW_GRAVITY ? 0.43 : 1;
  }

  get bounceScale() {
    return this.modifier === Modifier.SUPER_BOUNCY ? 1.43 : 1;
  }

  get fanScale() {
    return this.modifier === Modifier.STRONGER_FAN ? 2 : 1;
  }

  get suggestedModifier() {
    return MODIFIERS[Math.max(0, this.attempts - 1) % MODIFIERS.length];
  }

  get expression() {
    if (this.impactFlash > 0) return "impact";
    if (this.phase === GamePhase.SUCCEEDED) return "victory";
    if (this.phase === GamePhase.FAILED) return this.personality === Personality.TOUGH_GUY ? "suspicious" : "defeat";
    if (this.phase === GamePhase.AIMING) return this.personality === Personality.ZEN ? "neutral" : "nervous";
    if (this.phase === GamePhase.FLYING) {
      if (this.personality === Personality.DRAMA_QUEEN) return this.flightTime > 0.75 ? "panic" : "airborne";
      if (this.personality === Personality.TOUGH_GUY) return "suspicious";
      if (this.personality === Personality.PANIC) return "panic";
      return "neutral";
    }
    return this.personality === Personality.PANIC ? "nervous" : "neutral";
  }

  get statusText() {
    if (this.mode === GameMode.ONE_MOVE && this.phase === GamePhase.READY && !this.moveUsed) {
      return "ONE MOVE: przesuń trampolinę raz. Potem ucisz budzik.";
    }
    return {
      [GamePhase.READY]: "Złap bohatera. Budzik sam się nie uciszy.",
      [GamePhase.AIMING]: "Naciągnij. Godność odzyskamy później.",
      [GamePhase.FLYING]: "SLING → BANG → SNOOZE → AGAIN",
      [GamePhase.SUCCEEDED]: "SNOOZE! Poranek oficjalnie przełożony.",
      [GamePhase.FAILED]: "Budzik 1 : Ty 0. Fizyka prosi o rewanż.",
    }[this.phase];
  }

  get speechText() {
    const lines = {
      [GamePhase.SUCCEEDED]: {
        [Personality.DRAMA_QUEEN]: "NATURALNY TALENT DO SPANIA!",
        [Personality.TOUGH_GUY]: "SNOOZE ZNEUTRALIZOWANY.",
        [Personality.PANIC]: "ŻYJĘ! I MOGĘ SPAĆ?!",
        [Personality.ZEN]: "PORANEK MOŻE POCZEKAĆ.",
      },
      [GamePhase.FAILED]: {
        [Personality.DRAMA_QUEEN]: "BUDZIK ZNISZCZYŁ MI KARIERĘ!",
        [Personality.TOUGH_GUY]: "SPRAWDZAŁEM PODŁOGĘ.",
        [Personality.PANIC]: "WIEDZIAŁEM, ŻE RANO JEST ŹLE!",
        [Personality.ZEN]: "BUDZIK TEŻ POTRZEBUJE CZASU.",
      },
      [GamePhase.FLYING]: {
        [Personality.DRAMA_QUEEN]: "TO NIE BYŁO W UMOWIE!",
        [Personality.TOUGH_GUY]: "PEŁNA KONTROLA.",
        [Personality.PANIC]: "JA JUŻ ŻAŁUJĘ!",
        [Personality.ZEN]: "GRAWITACJA MA UCZUCIA.",
      },
      [GamePhase.AIMING]: {
        [Personality.DRAMA_QUEEN]: "TYLKO NIE W TWARZ!",
        [Personality.TOUGH_GUY]: "MOCNIEJ.",
        [Personality.PANIC]: "MOŻEMY TO OMÓWIĆ?",
        [Personality.ZEN]: "JESTEM PROCĄ.",
      },
    };
    return lines[this.phase]?.[this.personality] ?? "";
  }
}

export function modifierName(modifier) {
  return {
    [Modifier.STRONGER_FAN]: "WENTYLATOR 2×?",
    [Modifier.LOW_GRAVITY]: "LOW GRAVITY?",
    [Modifier.SUPER_BOUNCY]: "SUPER BOUNCY?",
    [Modifier.GIANT_HEAD]: "GIANT HEAD?",
    [Modifier.NONE]: "BEZ ZMIAN",
  }[modifier];
}
