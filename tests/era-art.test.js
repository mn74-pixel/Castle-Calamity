const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const {createCanvas}=require('@napi-rs/canvas');
let allocations=0;
const window={},document={createElement(){allocations++;return createCanvas(1,1);}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../content/era-art-v73.js'),'utf8'),{window,document});
const art=window.CASTLE_ERA_ART,canvas=createCanvas(640,480),ctx=canvas.getContext('2d');
const castle={x:20,w:200,h:260,isP:true,hp:100,max:100};
function frame(era,level){ctx.clearRect(0,0,640,480);art.drawBase(ctx,castle,400,era,level,0);return canvas.toBuffer('image/png');}
const intact=frame('industrial',1),firstCount=allocations;
for(let i=0;i<120;i++)frame('industrial',1);
assert.equal(allocations,firstCount,'static architecture must be reused across frames');
castle.hp=20;const damaged=frame('industrial',1);assert.notDeepEqual(damaged,intact,'cached art must still show current damage');
assert.equal(allocations,firstCount,'damage must not allocate static architecture');castle.hp=100;
castle.collapseT=.5;assert.notDeepEqual(frame('industrial',1),intact,'collapse still animates cached architecture');castle.collapseT=0;
const signatures=new Set();
for(const era of ['early-modern','industrial','electric'])for(let level=1;level<=(era==='early-modern'?6:4);level++){
  castle.w=200;castle.h=260;signatures.add(frame(era,level).toString('base64'));
  castle.w=108;castle.h=190;assert.ok(frame(era,level).length>4000,'phone artwork renders');
}
assert.ok(signatures.size>=12,'each era has its own silhouette and visible early level upgrades');
// The cache is bounded: visiting 14 variants evicts the initial frame.
const before=allocations;frame('industrial',1);assert.equal(allocations,before+1,'old campaigns must not accumulate cached artwork');
console.log('OK art v7.3: 14 later levels, phone scaling, reused static art, live damage and collapse, bounded cache');
