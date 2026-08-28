import { GameMode, GamePhase, Modifier, Personality, WORLD } from "./game.js";

const PALETTE = Object.freeze({
  ink: "#19142d",
  cream: "#fff5d9",
  creamDim: "#eadfca",
  violet: "#7c63e7",
  violetBright: "#a28bff",
  coral: "#ff6078",
  coralDark: "#d83e67",
  gold: "#ffd35f",
  mint: "#5ce1bd",
  teal: "#2cae9d",
  skin: "#f4b783",
  skinShadow: "#d98868",
  white: "#fffdf4",
});

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const lerp = (a, b, amount) => a + (b - a) * amount;

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, Math.abs(width) * 0.5, Math.abs(height) * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function strokeFill(ctx, fill, stroke = PALETTE.ink, width = 5) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

export class GameRenderer {
  constructor(canvas, model) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    this.model = model;
    this.background = null;
    this.faceImage = null;
    this.particles = [];
    this.callouts = [];
    this.trail = [];
    this.lastTrailPoint = null;
    this.shake = 0;
    this.clockWobble = 0;
    this.successPulse = 0;
    this.fanAngle = 0;
    this.time = 0;
  }

  async load() {
    this.background = await loadImage("assets/stage_morning_mayhem.svg");
  }

  setFaceImage(image) {
    this.faceImage = image;
  }

  handleGameEvent(event) {
    if (event.type === "reset" || event.type === "mode") {
      this.particles.length = 0;
      this.callouts.length = 0;
      this.trail.length = 0;
      this.lastTrailPoint = null;
      this.successPulse = 0;
    }

    if (event.type === "launch" || event.type === "what-if") {
      this.trail.length = 0;
      this.lastTrailPoint = null;
      this.spawnDust(event.position?.x ?? this.model.avatarPosition.x, event.position?.y ?? this.model.avatarPosition.y, 10);
    }

    if (event.type === "impact") {
      const intensity = clamp(event.speed / 620, 0.25, 1);
      this.shake = Math.max(this.shake, 4 + intensity * 11);
      this.clockWobble = event.x > 1010 ? 1 : this.clockWobble;
      this.spawnImpact(event.x, event.y, 12 + Math.round(intensity * 16));
      this.callouts.push({
        x: event.x,
        y: event.y - 24,
        text: event.surface === "trampoline" ? "BOI-O-O-ING!" : event.surface === "crate" ? "KLOINK!" : "BAM!",
        age: 0,
        life: 0.72,
        angle: (Math.random() - 0.5) * 0.18,
      });
    }

    if (event.type === "success") {
      this.shake = 15;
      this.clockWobble = 1.6;
      this.successPulse = 1;
      this.spawnConfetti(event.position.x, event.position.y, 64);
      this.callouts.push({ x: 1115, y: 386, text: "SNOOZE!", age: 0, life: 1.6, angle: -0.08 });
    }

    if (event.type === "failure") {
      this.callouts.push({ x: event.position.x, y: event.position.y - 52, text: "FLOP!", age: 0, life: 1.05, angle: 0.07 });
    }
  }

  update(deltaSeconds) {
    const dt = Math.min(deltaSeconds, 1 / 30);
    this.time += dt;
    this.fanAngle += dt * (this.model.modifier === Modifier.STRONGER_FAN ? 15 : 7.5);
    this.shake = Math.max(0, this.shake - dt * 42);
    this.clockWobble = Math.max(0, this.clockWobble - dt * 3.1);
    this.successPulse = Math.max(0, this.successPulse - dt * 0.7);

    if (this.model.phase === GamePhase.FLYING) {
      const point = this.model.avatarPosition;
      if (!this.lastTrailPoint || Math.hypot(point.x - this.lastTrailPoint.x, point.y - this.lastTrailPoint.y) > 14) {
        this.trail.push({ x: point.x, y: point.y, age: 0 });
        this.lastTrailPoint = { x: point.x, y: point.y };
      }
    }

    for (const point of this.trail) point.age += dt;
    this.trail = this.trail.filter((point) => point.age < 0.75);

    for (const particle of this.particles) {
      particle.age += dt;
      particle.velocity.y += particle.gravity * dt;
      particle.x += particle.velocity.x * dt;
      particle.y += particle.velocity.y * dt;
      particle.rotation += particle.spin * dt;
    }
    this.particles = this.particles.filter((particle) => particle.age < particle.life);

    for (const callout of this.callouts) callout.age += dt;
    this.callouts = this.callouts.filter((callout) => callout.age < callout.life);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    ctx.save();

    if (this.shake > 0) {
      const x = (Math.random() - 0.5) * this.shake;
      const y = (Math.random() - 0.5) * this.shake * 0.72;
      ctx.translate(x, y);
    }

    this.drawBackground(ctx);
    this.drawModifierAtmosphere(ctx);
    this.drawSpeedTrail(ctx);
    this.drawSlingBack(ctx);
    this.drawTrajectory(ctx);
    this.drawPhysicalObjects(ctx);
    this.drawAvatarShadow(ctx);
    this.drawAvatar(ctx);
    this.drawSlingFront(ctx);
    this.drawParticles(ctx);
    this.drawCallouts(ctx);
    this.drawWorldHints(ctx);
    ctx.restore();

    this.drawVignette(ctx);
  }

  drawBackground(ctx) {
    if (this.background) {
      ctx.drawImage(this.background, 0, 0, WORLD.width, WORLD.height);
      return;
    }
    const gradient = ctx.createLinearGradient(0, 0, WORLD.width, WORLD.height);
    gradient.addColorStop(0, "#41346c");
    gradient.addColorStop(0.55, "#765e9f");
    gradient.addColorStop(1, "#a96e91");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  }

  drawModifierAtmosphere(ctx) {
    const modifier = this.model.modifier;
    if (modifier === Modifier.NONE) return;

    ctx.save();
    if (modifier === Modifier.LOW_GRAVITY) {
      const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
      gradient.addColorStop(0, "rgba(75, 89, 222, 0.28)");
      gradient.addColorStop(1, "rgba(105, 245, 225, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      ctx.globalAlpha = 0.43;
      ctx.fillStyle = PALETTE.cream;
      for (let index = 0; index < 24; index += 1) {
        const x = (index * 167 + 43) % WORLD.width;
        const y = (index * 89 + this.time * 22) % 430;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + (index % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (modifier === Modifier.STRONGER_FAN) {
      ctx.fillStyle = "rgba(92, 225, 189, 0.075)";
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    } else if (modifier === Modifier.SUPER_BOUNCY) {
      ctx.fillStyle = "rgba(255, 96, 120, 0.075)";
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    } else if (modifier === Modifier.GIANT_HEAD) {
      ctx.fillStyle = "rgba(255, 211, 95, 0.07)";
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    }
    ctx.restore();
  }

  drawPhysicalObjects(ctx) {
    this.drawCrate(ctx);
    this.drawTrampoline(ctx);
    this.drawFan(ctx);
    this.drawWall(ctx);
    this.drawAlarmClock(ctx);
  }

  drawCrate(ctx) {
    const box = this.model.crateBounds;
    ctx.save();
    ctx.shadowColor = "rgba(18, 11, 29, 0.35)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 7;
    roundedRect(ctx, box.x, box.y, box.width, box.height, 11);
    const wood = ctx.createLinearGradient(box.x, box.y, box.x + box.width, box.y + box.height);
    wood.addColorStop(0, "#f0a35c");
    wood.addColorStop(1, "#a65050");
    strokeFill(ctx, wood, PALETTE.ink, 6);
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(87, 40, 49, 0.60)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(box.x + 14, box.y + 16);
    ctx.lineTo(box.x + box.width - 14, box.y + box.height - 16);
    ctx.moveTo(box.x + box.width - 14, box.y + 16);
    ctx.lineTo(box.x + 14, box.y + box.height - 16);
    ctx.stroke();
    ctx.translate(box.x + box.width * 0.5, box.y + box.height * 0.5);
    ctx.rotate(-0.07);
    roundedRect(ctx, -38, -15, 76, 30, 7);
    ctx.fillStyle = PALETTE.cream;
    ctx.fill();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "900 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FRAGILE", 0, -4);
    ctx.font = "900 9px system-ui, sans-serif";
    ctx.fillText("EGO", 0, 8);
    ctx.restore();
  }

  drawTrampoline(ctx) {
    const box = this.model.trampolineBounds;
    const pulse = this.model.movingTrampoline ? 1 + Math.sin(this.time * 10) * 0.06 : 1;
    ctx.save();
    ctx.translate(box.x + box.width * 0.5, box.y + 12);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = "rgba(17, 10, 28, 0.46)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.ellipse(0, 7, 78, 20, 0, 0, Math.PI * 2);
    strokeFill(ctx, PALETTE.coral, PALETTE.ink, 6);
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.ellipse(0, 4, 61, 12, 0, 0, Math.PI * 2);
    strokeFill(ctx, PALETTE.mint, PALETTE.ink, 4);
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-54, 20);
    ctx.lineTo(-65, 55);
    ctx.moveTo(54, 20);
    ctx.lineTo(65, 55);
    ctx.stroke();
    if (this.model.mode === GameMode.ONE_MOVE && !this.model.moveUsed) {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = PALETTE.gold;
      roundedRect(ctx, -59, -53, 118, 26, 13);
      ctx.fill();
      ctx.fillStyle = PALETTE.ink;
      ctx.font = "900 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("← PRZESUŃ RAZ →", 0, -40);
    }
    ctx.restore();
  }

  drawFan(ctx) {
    const fan = this.model.fanBounds;
    const cx = fan.x + fan.width * 0.5;
    const cy = fan.y + 111;
    const turbo = this.model.modifier === Modifier.STRONGER_FAN;

    ctx.save();
    ctx.lineCap = "round";
    const airAlpha = turbo ? 0.60 : 0.28;
    for (let index = 0; index < 6; index += 1) {
      const phase = (this.time * (turbo ? 250 : 115) + index * 71) % 370;
      const y = cy - 56 - phase;
      ctx.strokeStyle = `rgba(92, 225, 189, ${airAlpha * (1 - phase / 430)})`;
      ctx.lineWidth = turbo ? 8 : 5;
      ctx.beginPath();
      ctx.moveTo(cx - 69 + (index % 2) * 24, y + 58);
      ctx.bezierCurveTo(cx - 93, y + 30, cx + 77, y + 15, cx + 50, y - 5);
      ctx.stroke();
    }

    ctx.shadowColor = "rgba(17, 10, 28, 0.45)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    strokeFill(ctx, "#5f5387", PALETTE.ink, 7);
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.arc(cx, cy, 59, 0, Math.PI * 2);
    ctx.fillStyle = "#282043";
    ctx.fill();

    ctx.translate(cx, cy);
    ctx.rotate(this.fanAngle);
    for (let blade = 0; blade < 4; blade += 1) {
      ctx.rotate(Math.PI * 0.5);
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.bezierCurveTo(18, -51, 52, -58, 52, -28);
      ctx.bezierCurveTo(51, -4, 21, 9, 0, 8);
      strokeFill(ctx, turbo ? PALETTE.gold : PALETTE.mint, PALETTE.ink, 4);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    strokeFill(ctx, PALETTE.coral, PALETTE.ink, 4);
    ctx.rotate(-this.fanAngle);
    ctx.translate(-cx, -cy);

    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 77);
    ctx.lineTo(cx, fan.y + fan.height - 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, fan.y + fan.height - 18, 65, 16, 0, 0, Math.PI * 2);
    strokeFill(ctx, "#493b70", PALETTE.ink, 6);

    roundedRect(ctx, cx - 67, fan.y + fan.height - 4, 134, 29, 14);
    ctx.fillStyle = turbo ? PALETTE.gold : "#2d2449";
    ctx.fill();
    ctx.fillStyle = turbo ? PALETTE.ink : PALETTE.cream;
    ctx.font = "900 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(turbo ? "TURBO 2×" : "FAN OF BAD IDEAS", cx, fan.y + fan.height + 10);
    ctx.restore();
  }

  drawWall(ctx) {
    const wall = this.model.wallBounds;
    ctx.save();
    ctx.shadowColor = "rgba(17, 10, 28, 0.38)";
    ctx.shadowBlur = 13;
    ctx.shadowOffsetX = 5;
    roundedRect(ctx, wall.x, wall.y, wall.width, wall.height, 8);
    strokeFill(ctx, "#43345f", PALETTE.ink, 5);
    ctx.shadowColor = "transparent";
    ctx.translate(wall.x + wall.width * 0.5, wall.y + wall.height * 0.5);
    ctx.rotate(-Math.PI * 0.5);
    roundedRect(ctx, -64, -14, 128, 28, 10);
    ctx.fillStyle = PALETTE.cream;
    ctx.fill();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "900 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NOT A WALL", 0, 0);
    ctx.restore();
  }

  drawAlarmClock(ctx) {
    const centre = this.model.goalCentre;
    const wobble = Math.sin(this.time * 26) * (0.025 + this.clockWobble * 0.11);
    const pulse = 1 + Math.sin(this.time * 5) * 0.015 + this.successPulse * 0.08;
    ctx.save();
    ctx.translate(centre.x, centre.y);
    ctx.rotate(wobble);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = "rgba(17, 10, 28, 0.52)";
    ctx.shadowBlur = 19;
    ctx.shadowOffsetY = 10;

    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-44, -48);
    ctx.lineTo(-62, -68);
    ctx.moveTo(44, -48);
    ctx.lineTo(62, -68);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-65, -71, 15, Math.PI * 0.1, Math.PI * 1.55);
    ctx.arc(65, -71, 15, Math.PI * 1.45, Math.PI * 0.9);
    ctx.stroke();

    roundedRect(ctx, -66, -52, 132, 104, 27);
    const body = ctx.createLinearGradient(-60, -52, 58, 52);
    body.addColorStop(0, PALETTE.coral);
    body.addColorStop(1, "#df3d73");
    strokeFill(ctx, body, PALETTE.ink, 8);
    ctx.shadowColor = "transparent";
    roundedRect(ctx, -49, -32, 98, 51, 13);
    ctx.fillStyle = "#211a36";
    ctx.fill();
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = PALETTE.gold;
    ctx.font = "900 28px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.model.phase === GamePhase.SUCCEEDED ? "Z Z Z" : "7:03", 0, -7);
    roundedRect(ctx, -38, 27, 76, 19, 9);
    ctx.fillStyle = PALETTE.gold;
    ctx.fill();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "900 10px system-ui, sans-serif";
    ctx.fillText(this.model.phase === GamePhase.SUCCEEDED ? "SILENCE" : "SNOOZE", 0, 36);
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-37, 50);
    ctx.lineTo(-48, 66);
    ctx.moveTo(37, 50);
    ctx.lineTo(48, 66);
    ctx.stroke();

    if (this.model.phase !== GamePhase.SUCCEEDED) {
      ctx.fillStyle = PALETTE.cream;
      ctx.font = "900 12px system-ui, sans-serif";
      ctx.fillText("HIT ME", 0, 79);
    }
    ctx.restore();
  }

  drawSlingBack(ctx) {
    const avatar = this.model.avatarPosition;
    const aiming = this.model.phase === GamePhase.AIMING;
    ctx.save();
    ctx.lineCap = "round";
    if (aiming) {
      ctx.strokeStyle = "#2b1833";
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(154, 442);
      ctx.lineTo(avatar.x, avatar.y);
      ctx.stroke();
      ctx.strokeStyle = PALETTE.coral;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(131, 551);
    ctx.lineTo(150, 446);
    ctx.lineTo(168, 405);
    ctx.moveTo(150, 446);
    ctx.lineTo(121, 415);
    ctx.stroke();
    ctx.strokeStyle = "#b86647";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();
  }

  drawSlingFront(ctx) {
    if (this.model.phase !== GamePhase.AIMING) return;
    const avatar = this.model.avatarPosition;
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2b1833";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(169, 409);
    ctx.lineTo(avatar.x, avatar.y);
    ctx.stroke();
    ctx.strokeStyle = PALETTE.coral;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  }

  drawTrajectory(ctx) {
    const points = this.model.predictedTrajectory(22);
    if (points.length === 0) return;
    ctx.save();
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      if (point.x < 0 || point.x > WORLD.width || point.y < 0 || point.y > WORLD.height) continue;
      const t = index / points.length;
      ctx.globalAlpha = 0.88 - t * 0.63;
      ctx.fillStyle = index % 4 === 0 ? PALETTE.gold : PALETTE.cream;
      ctx.beginPath();
      ctx.arc(point.x, point.y, Math.max(2.5, 6.5 - t * 3.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawAvatarShadow(ctx) {
    const avatar = this.model.avatarPosition;
    const distance = Math.max(0, WORLD.groundY - avatar.y);
    const scale = clamp(1 - distance / 700, 0.28, 1);
    ctx.save();
    ctx.globalAlpha = 0.28 * scale;
    ctx.fillStyle = "#130d25";
    ctx.beginPath();
    ctx.ellipse(avatar.x, WORLD.groundY + 4, 46 * scale, 11 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawAvatar(ctx) {
    const model = this.model;
    const position = model.avatarPosition;
    const speed = Math.hypot(model.avatarVelocity.x, model.avatarVelocity.y);
    const baseScale = model.avatarRadius / 35;
    const motionStretch = model.phase === GamePhase.FLYING ? clamp(speed / 1350, 0, 0.18) : 0;
    const impactSquash = model.impactFlash > 0 ? Math.sin((model.impactFlash / 0.2) * Math.PI) * 0.19 : 0;
    const stretchX = 1 + motionStretch - impactSquash;
    const stretchY = 1 - motionStretch * 0.55 + impactSquash;
    const idleBob = model.phase === GamePhase.READY ? Math.sin(this.time * 3.4) * 2.1 : 0;

    ctx.save();
    ctx.translate(position.x, position.y + idleBob);
    ctx.rotate(model.phase === GamePhase.FLYING ? model.rotation : Math.sin(this.time * 2.1) * 0.018);
    ctx.scale(baseScale * stretchX, baseScale * stretchY);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    this.drawPersonalityBack(ctx, model.personality);
    this.drawLimbs(ctx, model.personality, model.phase);
    this.drawBody(ctx, model.personality);
    this.drawHead(ctx, model.expression, model.personality);
    this.drawPersonalityFront(ctx, model.personality);
    ctx.restore();

    if (model.speechText && (model.phase === GamePhase.AIMING || model.phase === GamePhase.FLYING)) {
      this.drawSpeechBubble(ctx, position.x, position.y - model.avatarRadius - 39, model.speechText);
    }
  }

  drawPersonalityBack(ctx, personality) {
    if (personality === Personality.DRAMA_QUEEN) {
      ctx.beginPath();
      ctx.moveTo(-25, 16);
      ctx.bezierCurveTo(-58, 30, -63, 66, -27, 72);
      ctx.bezierCurveTo(-10, 54, 5, 34, 17, 20);
      strokeFill(ctx, PALETTE.coral, PALETTE.ink, 5);
    }
    if (personality === Personality.ZEN) {
      ctx.beginPath();
      ctx.arc(0, -46, 12, 0, Math.PI * 2);
      strokeFill(ctx, "#382344", PALETTE.ink, 4);
    }
  }

  drawLimbs(ctx, personality, phase) {
    const flying = phase === GamePhase.FLYING;
    const panic = personality === Personality.PANIC && flying;
    const armLift = panic ? -27 : flying ? -14 : 5;
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(-20, 14);
    ctx.quadraticCurveTo(-40, armLift, -49, panic ? -30 : 25);
    ctx.moveTo(20, 14);
    ctx.quadraticCurveTo(42, armLift + 4, 50, panic ? -24 : 27);
    ctx.moveTo(-13, 48);
    ctx.quadraticCurveTo(-23, 64, -30, 76);
    ctx.moveTo(13, 48);
    ctx.quadraticCurveTo(24, 64, 32, 76);
    ctx.stroke();

    ctx.fillStyle = PALETTE.cream;
    for (const [x, y] of [[-49, panic ? -30 : 25], [50, panic ? -24 : 27]]) {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      strokeFill(ctx, PALETTE.cream, PALETTE.ink, 4);
    }

    ctx.save();
    ctx.translate(-32, 77);
    ctx.rotate(-0.14);
    roundedRect(ctx, -15, -7, 30, 15, 7);
    strokeFill(ctx, PALETTE.gold, PALETTE.ink, 4);
    ctx.restore();
    ctx.save();
    ctx.translate(34, 77);
    ctx.rotate(0.14);
    roundedRect(ctx, -15, -7, 30, 15, 7);
    strokeFill(ctx, PALETTE.gold, PALETTE.ink, 4);
    ctx.restore();
  }

  drawBody(ctx, personality) {
    const colors = {
      [Personality.DRAMA_QUEEN]: [PALETTE.violet, "#5a3fbd"],
      [Personality.TOUGH_GUY]: ["#3a425e", "#202a42"],
      [Personality.PANIC]: [PALETTE.mint, PALETTE.teal],
      [Personality.ZEN]: ["#f0d98a", "#d49c5f"],
    }[personality];
    const gradient = ctx.createLinearGradient(-25, 3, 27, 58);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    roundedRect(ctx, -27, 3, 54, 57, 20);
    strokeFill(ctx, gradient, PALETTE.ink, 6);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    roundedRect(ctx, -15, 11, 12, 37, 6);
    ctx.fill();

    ctx.fillStyle = personality === Personality.TOUGH_GUY ? PALETTE.coral : PALETTE.ink;
    ctx.font = "900 21px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(personality === Personality.DRAMA_QUEEN ? "★" : personality === Personality.TOUGH_GUY ? "T" : personality === Personality.PANIC ? "!" : "○", 1, 32);
  }

  drawHead(ctx, expression, personality) {
    ctx.save();
    ctx.translate(0, -16);
    ctx.shadowColor = "rgba(18, 11, 29, 0.32)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    strokeFill(ctx, PALETTE.skin, PALETTE.ink, 6);
    ctx.shadowColor = "transparent";

    if (this.faceImage) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.clip();
      this.drawImageCover(ctx, this.faceImage, -30, -30, 60, 60);
      const photoLight = ctx.createLinearGradient(-24, -28, 26, 30);
      photoLight.addColorStop(0, "rgba(255,255,255,0.12)");
      photoLight.addColorStop(0.55, "rgba(255,255,255,0)");
      photoLight.addColorStop(1, "rgba(28,15,40,0.12)");
      ctx.fillStyle = photoLight;
      ctx.fillRect(-31, -31, 62, 62);
      ctx.restore();
      ctx.strokeStyle = "rgba(255, 245, 217, 0.76)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const shade = ctx.createLinearGradient(-26, -20, 28, 27);
      shade.addColorStop(0, "rgba(255,255,255,0.20)");
      shade.addColorStop(1, "rgba(143,64,73,0.18)");
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(0, 0, 29, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.faceImage) this.drawPhotoReaction(ctx, expression);
    else this.drawExpression(ctx, expression);

    if (personality === Personality.PANIC) {
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-11, -33);
      ctx.quadraticCurveTo(-17, -53, -4, -46);
      ctx.moveTo(0, -35);
      ctx.quadraticCurveTo(7, -55, 12, -42);
      ctx.moveTo(12, -31);
      ctx.quadraticCurveTo(25, -46, 23, -31);
      ctx.stroke();
    }

    if (personality === Personality.TOUGH_GUY) {
      ctx.strokeStyle = PALETTE.coral;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, -1, 34, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.fillStyle = PALETTE.coral;
      ctx.beginPath();
      ctx.moveTo(29, -19);
      ctx.lineTo(46, -8);
      ctx.lineTo(28, -2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawExpression(ctx, expression) {
    ctx.strokeStyle = PALETTE.ink;
    ctx.fillStyle = PALETTE.ink;
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";

    const shocked = expression === "panic" || expression === "impact";
    const victory = expression === "victory";
    const defeat = expression === "defeat";
    const suspicious = expression === "suspicious";
    const nervous = expression === "nervous" || expression === "airborne";

    if (victory) {
      ctx.beginPath();
      ctx.arc(-12, -4, 7, Math.PI * 0.12, Math.PI * 0.88);
      ctx.arc(12, -4, 7, Math.PI * 0.12, Math.PI * 0.88);
      ctx.stroke();
    } else if (shocked) {
      for (const x of [-12, 12]) {
        ctx.fillStyle = PALETTE.white;
        ctx.beginPath();
        ctx.ellipse(x, -4, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = PALETTE.ink;
        ctx.beginPath();
        ctx.arc(x, -3, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (suspicious) {
      ctx.beginPath();
      ctx.moveTo(-20, -8);
      ctx.lineTo(-5, -5);
      ctx.moveTo(5, -4);
      ctx.lineTo(20, -9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-12, 0, 2.8, 0, Math.PI * 2);
      ctx.arc(12, 0, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(-12, -3, nervous ? 4 : 3, 0, Math.PI * 2);
      ctx.arc(12, -3, nervous ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    if (victory) {
      ctx.arc(0, 6, 13, 0.08 * Math.PI, 0.92 * Math.PI);
    } else if (shocked) {
      ctx.ellipse(0, 14, 7, 10, 0, 0, Math.PI * 2);
    } else if (defeat || nervous) {
      ctx.arc(0, 21, 10, 1.15 * Math.PI, 1.85 * Math.PI);
    } else if (suspicious) {
      ctx.moveTo(-8, 13);
      ctx.lineTo(9, 11);
    } else {
      ctx.arc(0, 7, 9, 0.16 * Math.PI, 0.84 * Math.PI);
    }
    ctx.stroke();
  }

  drawPhotoReaction(ctx, expression) {
    const shocked = expression === "panic" || expression === "impact";
    const victory = expression === "victory";
    const defeat = expression === "defeat";
    const nervous = expression === "nervous" || expression === "airborne";

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 4;

    if (shocked || nervous) {
      ctx.fillStyle = shocked ? PALETTE.violetBright : "#87e7f5";
      ctx.beginPath();
      ctx.moveTo(27, -28);
      ctx.quadraticCurveTo(41, -14, 30, -6);
      ctx.quadraticCurveTo(18, -12, 27, -28);
      ctx.fill();
      ctx.stroke();
    }

    if (shocked) {
      ctx.strokeStyle = PALETTE.gold;
      ctx.lineWidth = 4.5;
      for (const [x1, y1, x2, y2] of [[-38, -26, -48, -35], [-42, 1, -55, 2], [37, 9, 50, 15]]) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (victory) {
      ctx.fillStyle = PALETTE.gold;
      for (const [x, y, radius] of [[-31, -27, 8], [32, -19, 6]]) {
        ctx.beginPath();
        for (let point = 0; point < 8; point += 1) {
          const r = point % 2 === 0 ? radius : radius * 0.42;
          const angle = -Math.PI / 2 + (point * Math.PI) / 4;
          const px = x + Math.cos(angle) * r;
          const py = y + Math.sin(angle) * r;
          if (point === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (defeat) {
      ctx.strokeStyle = PALETTE.coral;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-24, 32);
      ctx.quadraticCurveTo(-12, 39, 0, 32);
      ctx.quadraticCurveTo(13, 25, 25, 33);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawPersonalityFront(ctx, personality) {
    if (personality === Personality.DRAMA_QUEEN) {
      ctx.fillStyle = PALETTE.gold;
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 === 0 ? 12 : 5;
        const angle = -Math.PI * 0.5 + (point * Math.PI) / 5;
        const x = 24 + Math.cos(angle) * radius;
        const y = -40 + Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    if (personality === Personality.ZEN) {
      ctx.strokeStyle = PALETTE.coral;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-28, -25);
      ctx.quadraticCurveTo(0, -17, 28, -25);
      ctx.stroke();
    }
  }

  drawSpeechBubble(ctx, anchorX, anchorY, text) {
    const width = clamp(text.length * 8.2 + 34, 125, 260);
    const x = clamp(anchorX - width * 0.5, 12, WORLD.width - width - 12);
    const y = clamp(anchorY - 36, 18, WORLD.height - 95);
    ctx.save();
    ctx.shadowColor = "rgba(15,10,27,0.30)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    roundedRect(ctx, x, y, width, 39, 16);
    ctx.fillStyle = PALETTE.cream;
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    const pointerX = clamp(anchorX, x + 24, x + width - 24);
    ctx.moveTo(pointerX - 9, y + 36);
    ctx.lineTo(pointerX, y + 50);
    ctx.lineTo(pointerX + 8, y + 36);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "900 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width * 0.5, y + 20);
    ctx.restore();
  }

  drawSpeedTrail(ctx) {
    if (this.trail.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    for (let index = 1; index < this.trail.length; index += 1) {
      const previous = this.trail[index - 1];
      const point = this.trail[index];
      const alpha = clamp(1 - point.age / 0.75, 0, 1) * 0.48;
      ctx.strokeStyle = `rgba(255, 245, 217, ${alpha})`;
      ctx.lineWidth = 13 * alpha + 1;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 211, 95, ${alpha * 0.7})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.restore();
  }

  spawnDust(x, y, count) {
    for (let index = 0; index < count; index += 1) {
      this.particles.push({
        kind: "circle",
        x: x + (Math.random() - 0.5) * 28,
        y: y + (Math.random() - 0.5) * 20,
        velocity: { x: -70 - Math.random() * 90, y: -25 + (Math.random() - 0.5) * 80 },
        gravity: 50,
        size: 4 + Math.random() * 7,
        color: PALETTE.cream,
        age: 0,
        life: 0.38 + Math.random() * 0.24,
        rotation: 0,
        spin: 0,
      });
    }
  }

  spawnImpact(x, y, count) {
    const colors = [PALETTE.gold, PALETTE.coral, PALETTE.cream, PALETTE.mint];
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 340;
      this.particles.push({
        kind: index % 3 === 0 ? "spark" : "circle",
        x,
        y,
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        gravity: 520,
        size: 4 + Math.random() * 9,
        color: colors[index % colors.length],
        age: 0,
        life: 0.35 + Math.random() * 0.52,
        rotation: angle,
        spin: (Math.random() - 0.5) * 14,
      });
    }
  }

  spawnConfetti(x, y, count) {
    const colors = [PALETTE.gold, PALETTE.coral, PALETTE.mint, PALETTE.violetBright, PALETTE.cream];
    for (let index = 0; index < count; index += 1) {
      const angle = -Math.PI * (0.15 + Math.random() * 0.7);
      const speed = 170 + Math.random() * 460;
      this.particles.push({
        kind: "confetti",
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 35,
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        gravity: 430,
        size: 6 + Math.random() * 8,
        color: colors[index % colors.length],
        age: 0,
        life: 1.2 + Math.random() * 1.3,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 12,
      });
    }
  }

  drawParticles(ctx) {
    ctx.save();
    for (const particle of this.particles) {
      const alpha = clamp(1 - particle.age / particle.life, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      if (particle.kind === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.kind === "spark") {
        ctx.beginPath();
        ctx.moveTo(-particle.size * 1.7, -2);
        ctx.lineTo(particle.size * 1.7, 0);
        ctx.lineTo(-particle.size * 1.7, 2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-particle.size * 0.5, -particle.size * 0.8, particle.size, particle.size * 1.6);
        ctx.strokeRect(-particle.size * 0.5, -particle.size * 0.8, particle.size, particle.size * 1.6);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  drawCallouts(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const callout of this.callouts) {
      const progress = callout.age / callout.life;
      const scale = progress < 0.18 ? lerp(0.55, 1.14, progress / 0.18) : lerp(1.14, 0.92, (progress - 0.18) / 0.82);
      ctx.save();
      ctx.translate(callout.x, callout.y - progress * 27);
      ctx.rotate(callout.angle);
      ctx.scale(scale, scale);
      ctx.globalAlpha = clamp(1 - Math.max(0, progress - 0.67) / 0.33, 0, 1);
      ctx.font = "900 33px Impact, system-ui, sans-serif";
      ctx.lineJoin = "round";
      ctx.lineWidth = 9;
      ctx.strokeStyle = PALETTE.ink;
      ctx.strokeText(callout.text, 0, 0);
      ctx.fillStyle = callout.text === "FLOP!" ? PALETTE.coral : PALETTE.gold;
      ctx.fillText(callout.text, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  drawWorldHints(ctx) {
    if (this.model.phase !== GamePhase.READY) return;
    ctx.save();
    const pulse = 0.72 + Math.sin(this.time * 4) * 0.18;
    ctx.globalAlpha = pulse;
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 4;
    ctx.setLineDash([9, 8]);
    ctx.beginPath();
    ctx.arc(WORLD.anchor.x, WORLD.anchor.y, this.model.avatarRadius + 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = PALETTE.cream;
    roundedRect(ctx, 94, 349, 158, 32, 14);
    ctx.fill();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "900 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.model.canAim() ? "ZŁAP · NACIĄGNIJ · PUŚĆ" : "NAJPIERW ONE MOVE", 173, 365);
    ctx.restore();
  }

  drawVignette(ctx) {
    const gradient = ctx.createRadialGradient(640, 300, 210, 640, 300, 760);
    gradient.addColorStop(0, "rgba(15, 10, 28, 0)");
    gradient.addColorStop(0.73, "rgba(15, 10, 28, 0.03)");
    gradient.addColorStop(1, "rgba(15, 10, 28, 0.28)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  }

  drawImageCover(ctx, image, x, y, width, height) {
    const imageRatio = image.width / image.height;
    const targetRatio = width / height;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.width;
    let sourceHeight = image.height;
    if (imageRatio > targetRatio) {
      sourceWidth = image.height * targetRatio;
      sourceX = (image.width - sourceWidth) * 0.5;
    } else {
      sourceHeight = image.width / targetRatio;
      sourceY = (image.height - sourceHeight) * 0.5;
    }
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }
}
