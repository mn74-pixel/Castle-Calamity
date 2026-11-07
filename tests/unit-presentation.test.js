const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const code = html.slice(html.indexOf('function arrangeUnitPresentation('), html.indexOf('\n/* ── Unit drawing ── */'));
const scope = {};
vm.runInNewContext(code, scope);
const units = Array.from({length: 9}, (_, i) => ({x: 250, y: 300, ud: {}, visualSlot: i + 1}));
const before = JSON.stringify(units), size = 32;
const arranged = scope.arrangeUnitPresentation(units, size);
assert.equal(JSON.stringify(units), before, 'layout must not alter combat state');
assert.equal(arranged.length, units.length);
for (let i = 0; i < arranged.length; i++) for (let j = i + 1; j < arranged.length; j++) {
  if (arranged[i].row === arranged[j].row) {
    assert(Math.abs(arranged[i].dx - arranged[j].dx) >= size * .70 - 1e-6, 'crowded actors need separate positions');
  }
}
assert(arranged.every(a => Math.abs(a.dx) <= size * 1.2));
console.log('OK unit presentation: nine actors remain distinct without changing combat positions');
