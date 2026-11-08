const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync('content/estate-tactics.js','utf8'),scope);
const tactics = scope.window.CASTLE_ESTATE_TACTICS;
const html = fs.readFileSync('index.html','utf8');
const code = html.slice(html.indexOf('function projectilePresentationOffset('),html.indexOf('\n/* ── Unit drawing ── */'));
vm.runInNewContext(code,scope);
function separation(entries,label){
  const ordered=entries.slice().sort((a,b)=>a.x-b.x);
  for(let i=1;i<ordered.length;i++)assert(ordered[i].x-ordered[i-1].x+1e-7 >= (ordered[i].width+ordered[i-1].width)/2,`${label}: silhouettes overlap`);
}
for(const [width,size] of [[667,24],[1280,46]]) for(const count of [2,8,16,30]){
  scope.W=width;scope.G={p:{x:0,w:width*.15},e:{x:width*.85}};
  const units=Array.from({length:count},(_,i)=>({key:i%7===0?'knight':i%9===0?'golem':'warrior',x:width/2+(i%3-1)*2,y:300,ud:{},visualSlot:i+1}));
  const before=JSON.stringify(units),arranged=scope.arrangeUnitPresentation(units,size);
  assert.equal(JSON.stringify(units),before);assert.equal(arranged.length,count);
  const boxes=arranged.map(a=>({x:a.unit.x+a.dx,width:size*(a.unit.key==='knight'?2.5:a.unit.key==='golem'?1.8:1.4)*a.scale}));
  separation(boxes,`castle ${width} ${count}`);assert(boxes.every(a=>a.x-a.width/2>=scope.G.p.w+4-1e-6&&a.x+a.width/2<=scope.G.e.x-4+1e-6));assert(arranged.every(a=>a.dy>=0&&a.scale>0&&a.scale<=1));
  const people=Array.from({length:count},(_,i)=>({id:i+1,kind:['bike','cart','heavy','dres'][i%4],x:.5+(i%3-1)*.001,lane:i%3,hp:100}));
  const original=JSON.stringify(people),s=tactics.actorScale(width===667?375:720),estate=tactics.layoutEstateActors(people,width,s);
  assert.equal(JSON.stringify(people),original);assert.equal(estate.length,count);separation(estate,`estate ${width} ${count}`);
  assert(estate.every(a=>a.offset>=0&&a.x-a.width/2>=8-1e-6&&a.x+a.width/2<=width-8+1e-6));
}
const scattered=[{x:100,width:20},{x:200,width:20},{x:300,width:20}];
assert.deepEqual(Array.from(tactics.spreadActors(scattered,0,400),p=>p.x),[100,200,300],'separate units should not move');

const positions={1:{dx:-20,dy:6,scale:.5},2:{dx:30,dy:12,scale:.75}};
const shot={visualSource:1,visualTarget:2,visualLife:1,life:1,flightTime:1,visualStartX:10,visualStartY:-20,visualEndX:0,visualEndY:-20};
let shift=scope.projectilePresentationOffset(shot,positions);assert.equal(shift.x,-25);assert.equal(shift.y,16);
shot.life=0;shift=scope.projectilePresentationOffset(shot,positions);assert.equal(shift.x,30);assert.equal(shift.y,17);
const estateShot={x:.5,isP:true,t:0,duration:1,fromLane:0,toLane:2,source:1,target:2};
const refs={1:{dx:-20,scale:.5},2:{dx:30,scale:.75}};
let visual=tactics.shotVisualPosition(estateShot,1,200,600,refs);
let original=tactics.shotPose(estateShot,1,200,600);assert.equal(visual.x-original.x,-33);assert.equal(visual.y-original.y,24);
estateShot.t=1;visual=tactics.shotVisualPosition(estateShot,1,200,600,refs);original=tactics.shotPose(estateShot,1,200,600);assert.equal(visual.x-original.x,30);assert.equal(visual.y-original.y,9.5);
console.log('OK presentation: mixed crowds stay separated and grounded without changing combat state');
