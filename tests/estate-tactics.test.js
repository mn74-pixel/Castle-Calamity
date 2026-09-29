const assert = require('assert/strict');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../content/estate-tactics.js'),'utf8'),scope);
const T = scope.window.CASTLE_ESTATE_TACTICS;
function game(segment=4){const g={W:1280,GY:590,p:{gold:1000,hp:2200,x:0,w:160},e:{gold:1000,hp:2200,x:1120,w:160},estate:{segment},stats:{kills:0,losses:0,unitsSpawned:0,goldEarned:0}};T.init(g);return g;}
function tick(g,seconds,dt=1/60){for(let t=0;t<seconds-1e-8;t+=dt)T.tick(g,Math.min(dt,seconds-t),(base,n)=>{base.hp=Math.max(0,base.hp-n);if(!base.hp)g.over=true;});}
function spawn(g,id,p,x){g.estate.tactics[p?'p':'e']=0;assert(T.recruit(g,id,p));const u=g.estate.units.at(-1);if(x!==undefined)u.x=x;return u;}
let checks=0;
function check(name,fn){fn();checks++;console.log('OK Estate tactics: '+name);}
check('unlock stages, shared funds, separate recruitment cooldown',()=>{const g=game(0);assert.equal(T.status(g,'bike',true).reason,'locked');assert.equal(T.status(g,'neighbor',true).reason,'locked');spawn(g,'dres',true);assert.equal(g.p.gold,982);assert.equal(g.stats.unitsSpawned,1);assert.equal(T.status(g,'dres',true).reason,'recruit');tick(g,2.5);assert(T.status(g,'dres',true).ok);g.p.gold=0;assert.equal(T.status(g,'dres',true).reason,'gold');});
check('every unit steals once, returns funds home and leaves both buildings intact',()=>{for(const c of T.cards)for(const p of [true,false]){const g=game(c.unlock);spawn(g,c.id,p);tick(g,90);const loot=T.raidCapacity(c.id,c.unlock);assert.equal((p?g.e:g.p).hp,2200);assert.equal((p?g.e:g.p).gold,1000-loot);assert.equal((p?g.p:g.e).gold,1000-c.cost+loot);assert.equal(g.estate.units.length,0);assert.equal(g.stats.kills+g.stats.losses,0);}});
check('dres stops bikes; bikes catch exposed neighbours; neighbours kite dres through slowing',()=>{for(const [a,b] of [['dres','bike'],['bike','neighbor'],['neighbor','dres']]){const g=game();spawn(g,a,true,.35);spawn(g,b,false,.65);tick(g,20);assert.equal(g.stats.kills,1,a+' should win');assert.equal(g.stats.losses,0,a+' should survive');}});
check('ranged telegraph, projectile impact and slowdown are real',()=>{const g=game();spawn(g,'neighbor',true,.4);const v=spawn(g,'dres',false,.53);tick(g,.3);assert(g.estate.units[0].wind>0);assert.equal(v.hp,v.max);tick(g,.25);assert.equal(g.estate.shots.length,1);tick(g,.4);assert(v.hp<v.max);assert(v.slow>0);});
check('bins halve ranged damage; night reduces range',()=>{function sample(seg){const g=game(4);spawn(g,'neighbor',true,.38);const v=spawn(g,'dres',false,.52);g.estate.segment=seg;v.wind=100;tick(g,.9);return v.max-v.hp;}assert(sample(4)>0);assert(Math.abs(sample(5)*2-sample(4))<1e-8);assert.equal(sample(7),0);});
check('centre capture rewards control, contested centre resets progress',()=>{const g=game(1);const u=spawn(g,'dres',true,.45);u.wind=100;tick(g,5.1);assert.equal(g.p.gold,988);const v=spawn(g,'dres',false,.55);v.wind=100;tick(g,6);assert.equal(g.p.gold,988);assert.equal(g.estate.tactics.owner,null);});
check('snack zone heals both sides; squad healing cannot resurrect',()=>{const g=game(3),u=spawn(g,'dres',true,.45),v=spawn(g,'dres',false,.55);u.wind=v.wind=100;u.hp=v.hp=50;tick(g,2);assert(Math.abs(u.hp-60)<.01&&Math.abs(v.hp-60)<.01);T.heal(g,true,25);assert(Math.abs(u.hp-85)<.01);u.hp=0;T.heal(g,true,25);assert.equal(u.hp,0);});
check('kebab recruitment, patrol pause/resume and finale loot',()=>{const g=game(8);spawn(g,'bat',true);assert.equal(g.estate.tactics.p,1.2);g.estate.segment=9;g.estate.tactics.clock=11;const x=g.estate.units[0].x;tick(g,2);assert.equal(g.estate.units[0].x,x);tick(g,2);assert(g.estate.units[0].x>x);const f=game(11);spawn(f,'skater',true,.8);tick(f,1);assert.equal(f.e.hp,2200);assert.equal(f.e.gold,1000-T.raidCapacity('skater',11));});
check('AI counters visible troops, obeys locks and pays normally',()=>{const g=game();spawn(g,'bike',true);assert.equal(T.choose(g),'dres');g.estate.units=[];spawn(g,'dres',true);assert.equal(T.choose(g),'neighbor');g.estate.segment=0;assert.equal(T.choose(g),'dres');g.e.gold=0;assert.equal(T.choose(g),null);});
check('frame-rate independent combat and bounded effects in a long battle',()=>{function battle(dt){const g=game();for(let i=0;i<8;i++){spawn(g,T.cards[i%3].id,true,.2-i*.025);spawn(g,T.cards[(i+1)%3].id,false,.8+i*.025);}tick(g,60,dt);assert(g.estate.shots.length<10);assert(g.estate.units.every(u=>Number.isFinite(u.x)&&Number.isFinite(u.hp)));return JSON.stringify([g.p.hp,g.e.hp,g.stats,g.estate.units.map(u=>[u.kind,Math.round(u.hp),Math.round(u.x*1000)])]);}assert.equal(battle(1/30),battle(1/120));});
check('recruitment has no hard army cap and game-over blocks purchases',()=>{const g=game();g.p.gold=9999;for(let i=0;i<30;i++)spawn(g,'dres',true);assert.equal(g.estate.units.length,30);g.over=true;assert.equal(T.recruit(g,'dres',false),false);});
check('frontline can pass its own stationary ranged support',()=>{for(const p of [true,false]){const g=game(),support=spawn(g,'neighbor',p,p?.4:.6),front=spawn(g,'dres',p,p?.34:.66),enemy=spawn(g,'dres',!p,p?.54:.46);support.lane=front.lane=enemy.lane=1;enemy.hp=enemy.max=10000;tick(g,4);assert((front.x-support.x)*(p?1:-1)>.02,'melee must overtake support');}});
check('three lanes distribute a crowd without overlapping spawns or limiting purchases',()=>{const g=game();for(let i=0;i<30;i++)spawn(g,'dres',true);for(let lane=0;lane<3;lane++){const row=g.estate.units.filter(u=>u.lane===lane).sort((a,b)=>a.x-b.x);assert.equal(row.length,10);for(let i=1;i<row.length;i++)assert(row[i].x-row[i-1].x>=.043-1e-8);}});
check('equal dres crowds resolve rather than forming a permanent queue',()=>{for(const stage of [0,3,8,9]){const g=game(stage);g.p.hp=g.e.hp=100000;for(let i=0;i<12;i++){spawn(g,T.roster(stage)[0],true);spawn(g,T.roster(stage)[0],false);}tick(g,110);assert(g.stats.kills+g.stats.losses>=12,'combat must resolve at stage '+stage);assert.equal(g.estate.units.filter(T.active).length,0,'no permanent crowd at stage '+stage);tick(g,90);assert.equal(g.estate.units.length,0);}});
check('defeated residents walk home, cannot block, attack or be healed',()=>{const g=game(),u=spawn(g,'bike',true,.45),v=spawn(g,'dres',false,.49);u.hp=1;tick(g,1);assert(u.retreat&&u.hp===0);const x=u.x,hp=v.hp;tick(g,1);assert(u.x<x);assert.equal(v.hp,hp);T.heal(g,true,999);assert.equal(u.hp,0);tick(g,10);assert(!g.estate.units.includes(u));});
check('end of feud clears projectiles and sends squads home without new losses',()=>{const g=game();spawn(g,'dres',true,.5);spawn(g,'neighbor',false,.6);g.estate.shots.push({});const stats=JSON.stringify(g.stats);for(let i=0;i<100;i++)T.finish(g,.1);assert.equal(g.estate.shots.length,0);assert.equal(g.estate.units.length,0);assert.equal(JSON.stringify(g.stats),stats);});
check('nine roles form progressive decks; old recruits stay after their card retires',()=>{assert.equal(T.cards.length,9);for(let stage=0;stage<12;stage++){const ids=Array.from(T.roster(stage));assert(ids.length<=4);const g=game(stage);for(const c of T.cards)assert.equal(T.status(g,c.id,true).ok,ids.includes(c.id));}const g=game(4),u=spawn(g,'dres',true);g.estate.segment=5;assert(!T.status(g,'dres',true).ok);tick(g,1);assert(u.hp>0&&u.x>.19);});
check('bat swing affects a second nearby rival but not a distant one',()=>{const g=game(5);spawn(g,'bat',true,.45);const a=spawn(g,'bike',false,.48),b=spawn(g,'bike',false,.49),far=spawn(g,'bike',false,.7);a.wind=b.wind=far.wind=100;tick(g,.8);assert(a.hp<a.max&&b.hp<b.max);assert.equal(far.hp,far.max);});
check('skater keeps most speed when slowed',()=>{const g=game(7),u=spawn(g,'skater',true,.2);u.slow=3;tick(g,1);assert(u.x>.27);});
check('caretaker restores nearby allies, not enemies or withdrawn units, and auras do not stack',()=>{const g=game(9),a=spawn(g,'heavy',true,.4),b=spawn(g,'heavy',false,.45),c=spawn(g,'caretaker',true,.35),d=spawn(g,'caretaker',true,.36);[a,b,c,d].forEach(u=>u.wind=100);a.hp=b.hp=50;tick(g,2);assert(Math.abs(a.hp-58)<.001);assert.equal(b.hp,50);a.hp=0;tick(g,.5);assert.equal(a.hp,0);});
check('bike is affordable pressure, not an expensive disposable frontliner',()=>{
  const bike=T.cards.find(c=>c.id==='bike'),front=T.cards.find(c=>c.id==='dres');
  assert(bike.cost<=front.cost*1.25);assert(bike.hp>=110);
  for(const side of [true,false]){const g=game(),b=spawn(g,'bike',side,.5),d=spawn(g,'dres',!side,side?.53:.47);tick(g,8);assert(b.retreat);assert(d.hp>0&&d.hp<=front.hp*.5,'counter wins but pays a meaningful price');}
  function pressure(id){const c=T.cards.find(c=>c.id===id),g=game(c.unlock);spawn(g,id,true);let time=0;while(g.p.gold===1000-c.cost&&time<90){tick(g,1/30);time+=1/30;}return {time,value:(g.p.gold-1000+c.cost)/c.cost};}
  const b=pressure('bike'),d=pressure('dres');assert(b.time<d.time*.5);assert(b.value>=d.value*.95);
});
check('upgraded front still counters skaters, skaters catch ranged support on either side',()=>{
  for(const side of [true,false])for(const [a,b] of [['bat','skater'],['skater','neighbor']]){const g=game(7);const winner=spawn(g,a,side,side?.35:.65),loser=spawn(g,b,!side,side?.65:.35);tick(g,14);assert(winner.hp>0||!winner.retreat||g[side?'e':'p'].hp<2200,a+' fulfils its role');assert(loser.retreat,b+' retreats');assert.equal(side?g.stats.losses:g.stats.kills,0);}
});
check('animation has anticipation, follow-through, recoil and circular pedal travel',()=>{
  assert(T.pose({wind:.11}).reach<0);assert(T.pose({follow:.2}).reach>0);assert(T.pose({hurt:.24}).recoil>0);assert.equal(T.pose({}).reach,0);
  for(let phase=0;phase<6.3;phase+=.2){const p=T.pose({kind:'bike',walk:phase,moving:true});assert(Math.abs(p.pedalX*p.pedalX+p.pedalY*p.pedalY-25)<1e-8);}
  const g=game(),a=spawn(g,'dres',true,.45);spawn(g,'dres',false,.48);tick(g,.55);assert(a.follow>0);tick(g,.25);assert.equal(a.follow,0);
  for(const h of [375,390,720,1100])assert.equal(T.actorScale(h),Math.round(Math.max(24,Math.min(46,h*.064)))/22*.74);
});
check('heavy telegraphs a crowd hit, spares allies and distant enemies, then recovers slowly',()=>{
  for(const p of [true,false]){const g=game(10),dir=p?1:-1,h=spawn(g,'heavy',p,.5),a=spawn(g,'skater',!p,.5+dir*.04),b=spawn(g,'skater',!p,.5+dir*.055),far=spawn(g,'skater',!p,.5+dir*.12),friend=spawn(g,'skater',p,.5+dir*.06);
    h.lane=a.lane=1;b.lane=0;far.lane=friend.lane=2;[a,b,far,friend].forEach(u=>u.wind=100);
    tick(g,.7);assert.equal(a.hp,a.max,'no damage before the long windup');assert(h.wind>0);
    tick(g,.2);assert(a.hp<a.max);assert.equal(b.max-b.hp,33);assert.equal(far.hp,far.max);assert.equal(friend.hp,friend.max);assert(h.shock>0);
    const hp=a.hp;tick(g,1);assert.equal(a.hp,hp,'recovery gives opponents a response window');assert.equal(h.shock,0);
  }
});
check('heavy unlock replaces the bat card, preserves existing bat units and shared cost',()=>{
  const g=game(8),old=spawn(g,'bat',true);assert.equal(T.status(g,'heavy',true).reason,'locked');g.estate.segment=9;g.estate.tactics.p=0;g.p.gold=53;assert.equal(T.status(g,'heavy',true).reason,'gold');g.p.gold=54;spawn(g,'heavy',true);assert.equal(g.p.gold,0);assert(!T.roster(9).includes('bat'));tick(g,.1);assert(old.hp>0);assert.equal(T.choose(g),'cart');
});
check('spread ranged support can stop the expensive heavy before he reaches the building',()=>{
  for(const p of [true,false]){const g=game(10),h=spawn(g,'heavy',p,p?.35:.65);spawn(g,'cart',!p,p?.64:.36);spawn(g,'cart',!p,p?.69:.31);tick(g,25);assert(h.retreat);assert.equal((p?g.e:g.p).hp,2200);}
});
check('role sheets describe actual powers in both languages and have distinct clothing',()=>{
  assert.equal(new Set(T.cards.map(c=>T.roles[c.id].kit)).size,9);
  for(const c of T.cards){assert.equal(T.archetype(c.id),T.roles[c.id].role);for(const lang of ['pl','en']){const text=T.description(c.id,lang);assert(text.includes(String(c.hp)));assert(text.includes(String(c.attack)));assert(text.includes(lang==='pl'?'Słabość:':'Weakness:'));}}
  assert(T.description('bat','pl').includes('13'));assert(T.description('heavy','en').includes('33'));assert(T.description('caretaker','pl').includes('+4'));assert(T.description('skater','en').includes('85%'));
});
check('caretaker holds behind an injured ally, heals, then resumes instead of creating a permanent stop',()=>{
  for(const p of [true,false]){const g=game(10),dir=p?1:-1,a=spawn(g,'heavy',p,.5+dir*.06),c=spawn(g,'caretaker',p,.5);a.wind=100;a.hp=a.max-8;const x=c.x;tick(g,1);assert.equal(c.x,x);assert(a.hp>a.max-8);tick(g,2);assert.equal(a.hp,a.max);assert((c.x-x)*dir>0);}
});
check('bat secondary hit selects the nearest eligible rival, not array insertion order',()=>{
  const g=game(5),a=spawn(g,'bat',true,.45),main=spawn(g,'bike',false,.48),far=spawn(g,'bike',false,.51),near=spawn(g,'bike',false,.49);a.lane=main.lane=1;far.lane=near.lane=0;[main,far,near].forEach(u=>u.wind=100);tick(g,.8);assert.equal(near.max-near.hp,13);assert.equal(far.hp,far.max);
});
check('cycling grips stay on handlebars and the throwing hand releases its slipper',()=>{
  for(let t=0;t<7;t+=.25){const u={kind:'bike',walk:t,moving:true},a=T.armPose(u,-49,T.pose(u));assert.equal(a.backX,15);assert.equal(a.frontX,17);assert.equal(a.backY,-32);assert.equal(a.frontY,-32);}
  const ready={kind:'neighbor',wind:.11},released={kind:'neighbor',follow:.2};
  const a=T.armPose(ready,-55,T.pose(ready)),b=T.armPose(released,-55,T.pose(released));assert(a.slipper);assert(!b.slipper);assert.equal(a.frontY,-48);assert.equal(b.frontY,-48);
});
check('slipper visual leaves the throwing hand on both sides and arrives at the target lane',()=>{
  for(const p of [true,false])for(const s of [.84,1.55]){const v={x:.5,isP:p,t:0,duration:.32,fromLane:0,toLane:2};const start=T.shotPose(v,s,590,1280);assert.equal(start.x,640+(p?26:-26)*s);assert.equal(start.y,587-48*s);v.t=.32;const end=T.shotPose(v,s,590,1280);assert.equal(end.x,640);assert(Math.abs(end.y-(587-38*s+24*s))<1e-8);}
});
check('raid deducts only available money, credits it only at home and cannot steal twice',()=>{
  for(const p of [true,false])for(const available of [0,7,100]){const g=game(4),bank=p?g.p:g.e,enemy=p?g.e:g.p;enemy.gold=available;const u=spawn(g,'bike',p,p?.809:.191),before=bank.gold,expected=Math.min(available,T.raidCapacity('bike',4));let callbacks=0;
    T.tick(g,.1,()=>{throw Error('raid must not damage the base');});assert(u.returning);assert.equal(enemy.gold,available-expected);assert.equal(bank.gold,before);assert.equal(u.loot,expected);assert(!T.active(u));
    for(let t=0;t<10;t+=.1)T.tick(g,.1,()=>{},(side,n)=>{assert(side);callbacks+=n;});assert.equal(bank.gold,before+expected);assert.equal(callbacks,p?expected:0);assert.equal(g.estate.units.length,0);tick(g,20);assert.equal(bank.gold,before+expected);assert.equal(g.stats.kills+g.stats.losses,0);
  }
});
check('returning raiders do not fight, block, heal or retain money after the feud ends',()=>{
  const g=game(4),u=spawn(g,'bike',true,.809);tick(g,.1);const loot=u.loot,enemy=spawn(g,'dres',false,.78);enemy.lane=u.lane;const hp=u.hp;tick(g,1);assert.equal(u.hp,hp);assert.equal(enemy.hp,enemy.max);u.hp=50;T.heal(g,true,100);assert.equal(u.hp,50);const gold=g.e.gold;T.finish(g,.1);assert.equal(g.e.gold,gold+loot);assert.equal(u.loot,0);T.finish(g,.1);assert.equal(g.e.gold,gold+loot);
});
check('simultaneous arrivals cannot overdraft an almost empty enemy bank',()=>{const g=game(4);g.e.gold=7;const a=spawn(g,'bike',true,.809),b=spawn(g,'bike',true,.809);tick(g,.1);assert.equal(g.e.gold,0);assert.equal(a.loot+b.loot,7);const bank=g.p.gold;tick(g,10);assert.equal(g.p.gold,bank+7);assert.equal(g.stats.goldEarned,7);});
check('a rival behind the unit cannot teleport it backwards before a raid',()=>{const g=game(4),a=spawn(g,'bike',true,.809),b=spawn(g,'bike',false,.191);tick(g,.1);assert(a.returning&&b.returning);assert(a.x>.79&&b.x<.21);assert.equal(a.loot,33);assert.equal(b.loot,33);});
check('heavy rig alternates feet, anticipates impact and stays deterministic without mutating state',()=>{
  const u={kind:'heavy',moving:true,walk:.7,wind:.3,animTime:2},before=JSON.stringify(u),a=T.heavyPose(u),b=T.heavyPose(u);assert.equal(JSON.stringify(a),JSON.stringify(b));assert.equal(JSON.stringify(u),before);assert(a.drop>0&&a.squash<1&&a.lean<0);
  assert(T.heavyPose({follow:.2}).reach>0);const left=T.heavyPose({moving:true,walk:0}),right=T.heavyPose({moving:true,walk:Math.PI});assert(left.leftLift>left.rightLift);assert(right.rightLift>right.leftLift);
  for(let t=0;t<20;t+=.1){const p=T.heavyPose({moving:true,walk:t,animTime:t});assert(Object.values(p).every(Number.isFinite));assert(p.leftX<p.rightX);assert(p.leftLift>=0&&p.rightLift>=0);}
});
check('walking alternates foot lift without lifting both feet, idle is stable',()=>{
  for(const kind of ['dres','bat','neighbor','skater','caretaker','courier']){const left=T.pose({kind,moving:true,walk:0}),right=T.pose({kind,moving:true,walk:Math.PI});assert(left.lift>0&&left.rightLift===0);assert(right.rightLift>0&&right.lift===0);for(let t=0;t<7;t+=.1){const p=T.pose({kind,moving:true,walk:t});assert(p.lift*p.rightLift===0);assert(Math.abs(p.sway)<=.025);}const idle=T.pose({kind,walk:3});assert.equal(idle.lift+idle.rightLift+idle.sway,0);}
});
check('music accelerates nearby allies by 20 percent without stacking or helping enemies',()=>{
  function march(count,p=true){const g=game(6),u=spawn(g,'bike',p,.45);for(let i=0;i<count;i++){const m=spawn(g,'musician',true,.4);m.lane=0;m.wind=100;}tick(g,.5);return Math.abs(u.x-.45);}
  const base=march(0);assert(Math.abs(march(1)/base-1.2)<.001);assert(Math.abs(march(2)-march(1))<.00001);assert(Math.abs(march(1,false)-base)<.00001);
});
check('cart projectile telegraphs, hits up to two additional neighbours and never its own team',()=>{
  for(const p of [true,false]){const g=game(8),dir=p?1:-1,a=spawn(g,'cart',p,.4),target=spawn(g,'bat',!p,.4+dir*.1),b=spawn(g,'bat',!p,.4+dir*.12),c=spawn(g,'bat',!p,.4+dir*.13),far=spawn(g,'bat',!p,.4+dir*.2),friend=spawn(g,'bat',p,.4+dir*.11);[target,b,c,far,friend].forEach(u=>u.wind=100);tick(g,.6);assert.equal(target.hp,target.max);tick(g,.6);assert(target.hp<target.max);assert.equal(b.max-b.hp,12);assert.equal(c.max-c.hp,12);assert.equal(far.hp,far.max);assert.equal(friend.hp,friend.max);assert.equal(target.slow,0);}
});
check('new support is chosen only with an escort and new ranged unit counters front',()=>{
  const g=game(6);spawn(g,'bat',false);spawn(g,'bike',false);g.estate.tactics.e=0;assert.equal(T.choose(g),'musician');g.estate.segment=8;spawn(g,'bat',true);g.estate.units=g.estate.units.filter(u=>u.isP);assert.equal(T.choose(g),'cart');
});
check('wide carts spawn with room for their equipment and retain stable simulation at different FPS',()=>{
  function run(dt){const g=game(8);for(let i=0;i<9;i++)spawn(g,'cart',true);for(let lane=0;lane<3;lane++){const row=g.estate.units.filter(u=>u.lane===lane).sort((a,b)=>a.x-b.x);for(let j=1;j<row.length;j++)assert(row[j].x-row[j-1].x>=.061-1e-8);}spawn(g,'musician',true);for(let i=0;i<6;i++)spawn(g,'skater',false);tick(g,60,dt);return JSON.stringify([g.p.gold,g.e.gold,g.stats,g.estate.units.map(u=>[u.kind,u.hp,u.x])]);}assert.equal(run(1/30),run(1/120));
});
console.log('ESTATE TACTICS COMPLETE: '+checks+' checks');
