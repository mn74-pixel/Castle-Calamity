const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const {createCanvas} = require('@napi-rs/canvas');
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync('content/estate-tactics.js','utf8'),scope);
const tactics = scope.window.CASTLE_ESTATE_TACTICS;
for (const card of [...tactics.cards, {id:'courier'}]) for (const side of [true, false]) for (const scale of [.62, 1.8]) for (const phase of [0,.8,1.57,2.4,3.14,4.7]) {
  const canvas = createCanvas(240,180), ctx = canvas.getContext('2d');
  tactics.figure(ctx,{kind:card.id,isP:side,moving:true,walk:phase,locomotion:1},100,145,scale);
  const pixels = ctx.getImageData(25,140,150,10).data;
  let opaque=0; for(let i=3;i<pixels.length;i+=4) if(pixels[i]>200) opaque++;
  assert(opaque>0, `${card.id} side ${side} scale ${scale} phase ${phase} has no ground contact`);
}
console.log('OK estate ground contact: every character stays on the street across gait phases');
