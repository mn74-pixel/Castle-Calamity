const assert=require('assert/strict');
const fs=require('fs');
const vm=require('vm');
const {createCanvas}=require('@napi-rs/canvas');
const scope={window:{}};
vm.runInNewContext(fs.readFileSync(require('path').join(__dirname,'../content/face-rig.js'),'utf8'),scope);
const R=scope.window.CASTLE_FACE_RIG,doc={createElement:()=>createCanvas(96,96)};
function portrait(){const c=createCanvas(320,320),x=c.getContext('2d');x.fillStyle='#e9e9e9';x.fillRect(0,0,320,320);x.fillStyle='#bb8261';x.beginPath();x.ellipse(160,157,100,143,0,0,Math.PI*2);x.fill();x.fillStyle='#532227';x.fillRect(152,216,38,8);return c;}
const face=portrait(),detected=R.detect(face,doc);
assert.equal(R.impactPulse(0,1),0);assert.equal(R.impactPulse(.72,1),0);assert(R.impactPulse(.66,1)>R.impactPulse(.36,1)*3);assert(R.impactPulse(.66,1.35)>R.impactPulse(.66,.9));
assert(R.valid(detected));assert.equal(detected.method,'contrast');assert(Math.abs(detected.mouth.x-171/320)<.05);assert(Math.abs(detected.mouth.y-220/320)<.035);
const blank=createCanvas(100,100);assert.equal(R.detect(blank,doc).method,'estimate');
const uniform=createCanvas(320,320),uc=uniform.getContext('2d');uc.fillStyle='#bb8261';uc.fillRect(0,0,320,240);assert.equal(R.detect(uniform,doc).method,'estimate','skin colour and transparent crop boundary alone are not lips');
assert(!R.valid({version:1,mouth:{x:Infinity,y:.7}}));assert(!R.valid({version:1,mouth:{x:.5,y:0}}));
face.faceRig=detected;
for(const dir of [-1,1])for(const angle of [-.3,0,.2])for(const pulse of [0,.4,1]){
  const lips=R.mouth(face,angle,pulse,dir),tilt=dir*1.32,hand=R.grip(lips,tilt);
  assert(Math.abs(hand.x+16*.74*Math.sin(tilt)-lips.x)<1e-9);
  assert(Math.abs(hand.y-4-16*.74*Math.cos(tilt)-lips.y)<1e-9);
}
const cut=portrait();R.removeBackdrop(cut);const pixels=cut.getContext('2d');assert.equal(pixels.getImageData(0,0,1,1).data[3],0);assert.equal(pixels.getImageData(160,160,1,1).data[3],255);assert.equal(pixels.getImageData(165,220,1,1).data[3],255);
const before=face.toBuffer('image/png'),draw=(c,img,x,y,w,h)=>c.drawImage(img,x,y,w,h),out=createCanvas(80,80),ctx=out.getContext('2d');ctx.translate(40,40);
R.react(ctx,face,draw,0,1);const neutral=out.toBuffer('image/png');ctx.clearRect(-40,-40,80,80);R.react(ctx,face,draw,.8,1);assert(!neutral.equals(out.toBuffer('image/png')));assert(before.equals(face.toBuffer('image/png')));
console.log('OK Face rig: local lip estimate/fallback, neck-to-mouth alignment both sides, protected cutout, non-destructive photo reaction');
