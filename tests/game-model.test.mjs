import assert from "node:assert/strict";
import test from "node:test";

import { GameModel, GameMode, GamePhase, Modifier, Personality, WORLD } from "../src/game.js";

function advance(model, frames) {
  for (let frame = 0; frame < frames && model.phase === GamePhase.FLYING; frame += 1) {
    model.update(1 / 60);
  }
  return { ...model.avatarPosition };
}

function finish(model) {
  advance(model, 900);
}

function startShot(model, pullPoint) {
  assert.equal(model.beginSling(model.avatarPosition), true);
  model.dragSling(pullPoint);
  assert.equal(model.releaseSling(), true);
}

function startKnownFailure(model) {
  const candidates = [
    { x: 70, y: 530 },
    { x: 45, y: 495 },
    { x: 155, y: 455 },
    { x: 171, y: 350 },
  ];
  for (const pull of candidates) {
    model.resetLevel(true);
    startShot(model, pull);
    finish(model);
    if (model.phase === GamePhase.FAILED) return pull;
  }
  throw new Error("Test fixture did not produce a failed shot");
}

test("Quick Sling stores launch position and velocity", () => {
  const model = new GameModel();
  startShot(model, { x: 70, y: 530 });
  assert.equal(model.phase, GamePhase.FLYING);
  assert.ok(model.previousShot);
  assert.ok(Math.hypot(model.previousShot.launchVelocity.x, model.previousShot.launchVelocity.y) > 100);
  assert.notDeepEqual(model.previousShot.launchPosition, WORLD.anchor);
});

test("One Move requires one trampoline move before aiming", () => {
  const model = new GameModel();
  model.setMode(GameMode.ONE_MOVE);
  assert.equal(model.canAim(), false);
  const trampoline = model.trampolineBounds;
  assert.equal(model.beginTrampolineMove({ x: trampoline.x + 30, y: trampoline.y + 5 }), true);
  model.dragTrampoline({ x: 450, y: trampoline.y });
  assert.equal(model.endTrampolineMove(), true);
  assert.equal(model.moveUsed, true);
  assert.equal(model.canAim(), true);
});

test("Morning Mayhem has a verified winning shot in both modes", () => {
  const quick = new GameModel();
  startShot(quick, { x: 65, y: 520 });
  finish(quick);
  assert.equal(quick.phase, GamePhase.SUCCEEDED);

  const oneMove = new GameModel();
  oneMove.setMode(GameMode.ONE_MOVE);
  const trampoline = oneMove.trampolineBounds;
  oneMove.beginTrampolineMove({ x: trampoline.x + 30, y: trampoline.y + 5 });
  oneMove.dragTrampoline({ x: 450, y: trampoline.y });
  oneMove.endTrampolineMove();
  startShot(oneMove, { x: 65, y: 520 });
  finish(oneMove);
  assert.equal(oneMove.phase, GamePhase.SUCCEEDED);
});

test("What If repeats exactly the stored shot", () => {
  const model = new GameModel();
  startKnownFailure(model);
  const expectedVelocity = { ...model.previousShot.launchVelocity };
  const expectedPosition = { ...model.previousShot.launchPosition };
  assert.equal(model.replayWith(Modifier.LOW_GRAVITY), true);
  assert.deepEqual(model.avatarVelocity, expectedVelocity);
  assert.deepEqual(model.avatarPosition, expectedPosition);
  assert.equal(model.modifier, Modifier.LOW_GRAVITY);
});

test("What If modifiers change real physics, not only labels", () => {
  const gravity = new GameModel();
  const pull = startKnownFailure(gravity);
  gravity.resetLevel(true);
  startShot(gravity, pull);
  const normalGravity = advance(gravity, 48);
  finish(gravity);
  assert.equal(gravity.phase, GamePhase.FAILED);
  gravity.replayWith(Modifier.LOW_GRAVITY);
  const lowGravity = advance(gravity, 48);
  assert.ok(Math.abs(normalGravity.y - lowGravity.y) > 20);

  const fan = new GameModel();
  startKnownFailure(fan);
  fan.resetLevel(true);
  startShot(fan, { x: 70, y: 530 });
  const normalFan = advance(fan, 90);
  finish(fan);
  assert.equal(fan.phase, GamePhase.FAILED);
  fan.replayWith(Modifier.STRONGER_FAN);
  const strongerFan = advance(fan, 90);
  assert.ok(Math.abs(normalFan.y - strongerFan.y) > 80);

  const bounce = new GameModel();
  startKnownFailure(bounce);
  bounce.resetLevel(true);
  startShot(bounce, { x: 171, y: 350 });
  const normalBounce = advance(bounce, 42);
  finish(bounce);
  assert.equal(bounce.phase, GamePhase.FAILED);
  bounce.replayWith(Modifier.SUPER_BOUNCY);
  const superBounce = advance(bounce, 42);
  assert.ok(Math.abs(normalBounce.y - superBounce.y) > 28);

  const head = new GameModel();
  startKnownFailure(head);
  const normalRadius = head.avatarRadius;
  head.replayWith(Modifier.GIANT_HEAD);
  assert.ok(head.avatarRadius > normalRadius * 1.4);
});

test("Personalities produce different expressions and reaction copy", () => {
  const model = new GameModel();
  model.setPersonality(Personality.PANIC);
  assert.equal(model.expression, "nervous");
  startShot(model, { x: 70, y: 530 });
  assert.equal(model.expression, "panic");
  const panicCopy = model.speechText;
  model.setPersonality(Personality.ZEN);
  assert.equal(model.expression, "neutral");
  assert.notEqual(model.speechText, panicCopy);
});
