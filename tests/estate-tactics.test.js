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
check('articulated slips are pure, bounded, surface-specific and recover to neutral',()=>{
  for(const card of T.cards)for(const surface of ['water','ice']){
    const duration=surface==='ice'?1.1:.8;
    for(let frame=0;frame<=100;frame++){
      const u={kind:card.id,slip:duration*(1-frame/100),slipDuration:duration,slipSurface:surface};
      const before=JSON.stringify(u),p=T.slipMotion(u);
      assert.equal(JSON.stringify(u),before);
      for(const [key,value] of Object.entries(p))if(typeof value==='number')assert(Number.isFinite(value),key);
      assert(p.drop>=0&&p.drop<=16);assert(Math.abs(p.lean)<=.48);
      if(u.slip>0&&card.id!=='heavy'){
        const hip=card.id==='bike'?-25:-24,head=card.id==='bike'?-49:card.id==='neighbor'?-55:-58;
        const arms=T.armPose(u,head,T.pose(u));
        for(const side of ['back','front'])assert(hip+p.drop+Math.sin(p.lean)*arms[side+'X']+Math.cos(p.lean)*(arms[side+'Y']-hip)<=-3+1e-8,'palm penetrated ground');
      }
      if(frame===0||frame===100){assert(Math.abs(p.drop)<1e-8);assert(Math.abs(p.lean)<1e-8);assert(Math.abs(p.slide)<1e-8);}
    }
  }
  const water=T.slipMotion({slip:.4,slipDuration:.8,slipSurface:'water'});
  const ice=T.slipMotion({slip:.55,slipDuration:1.1,slipSurface:'ice'});
  assert(ice.slide>water.slide);assert.notEqual(ice.impact,water.impact);
});
check('a fall keeps its original surface when weather changes',()=>{
  const g=game(2),u=spawn(g,'marian',true,.5);g.estate.ice=true;u.lane=1;u.moving=true;tick(g,.1);
  assert.equal(u.slipSurface,'ice');g.estate.ice=false;g.estate.rain=true;
  assert.equal(T.slipMotion(u).ice,true);assert.equal(u.slipDuration,1.1);
});
check('seeded automatic weather has warning, dry breaks, rain and ice independent of FPS',()=>{
  function run(dt){const g=game(2);g.estate.weather=T.weatherInit(42);const phases=new Set();for(let t=0;t<600;t+=dt){T.tick(g,dt,()=>{});const e=g.estate;phases.add(e.weather.phase+':'+e.weather.kind);assert(!(e.rain&&e.ice));if(e.weather.phase==='warning')assert(!e.rain&&!e.ice);}return [Array.from(phases).sort(),g.estate.weather.seed,g.estate.weather.phase];}
  const a=run(1/30),b=run(1/120);assert.deepEqual(a,b);for(const key of ['dry:dry','warning:rain','warning:ice','active:rain','active:ice'])assert(a[0].includes(key));assert.notDeepEqual(T.weatherInit(1),T.weatherInit(2));
});
check('ice causes longer local slips without damage, no repeat during cooldown, both teams',()=>{
  for(const p of [true,false]){const g=game(2),u=spawn(g,'marian',p,.5);g.estate.ice=true;u.lane=1;u.moving=true;tick(g,.1);assert(u.slip>.8);assert.equal(u.hp,u.max);assert.equal(u.slips,1);tick(g,2);assert.equal(u.slips,1);assert.equal(u.slip,0);assert(u.x!==.5);}
});
check('Menel name and attack timing descriptions match all eleven definitions',()=>{
  assert.equal(T.cards.find(c=>c.id==='marian').pl,'Menel');
  for(const c of T.cards){assert(T.description(c.id,'pl').includes('Odpoczynek '+c.interval+' s'));assert(T.description(c.id,'en').includes('wind-up '+(c.windup||.22)+' s'));}
});
check('slipping supports cannot heal or inspire either team',()=>{
  for(const side of [true,false])for(const kind of ['caretaker','musician']){
    const g=game(kind==='caretaker'?10:6);g.estate.rain=true;
    const support=spawn(g,kind,side,.4),ally=spawn(g,kind==='caretaker'?'heavy':'bat',side,.44);
    support.slip=.8;ally.hp=50;ally.wind=100;tick(g,.2);
    assert.equal(ally.hp,50);assert(!ally.inspired);
  }
});
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
check('eleven roles form progressive decks; old recruits stay after their card retires',()=>{assert.equal(T.cards.length,11);for(let stage=0;stage<12;stage++){const ids=Array.from(T.roster(stage));assert(ids.length<=4);const g=game(stage);for(const c of T.cards)assert.equal(T.status(g,c.id,true).ok,ids.includes(c.id));}const g=game(4),u=spawn(g,'dres',true);g.estate.segment=5;assert(!T.status(g,'dres',true).ok);tick(g,1);assert(u.hp>0&&u.x>.19);});
check('bat swing affects a second nearby rival but not a distant one',()=>{const g=game(5);spawn(g,'bat',true,.45);const a=spawn(g,'boxer',false,.48),b=spawn(g,'boxer',false,.49),far=spawn(g,'boxer',false,.7);a.wind=b.wind=far.wind=100;tick(g,.8);assert(a.hp<a.max&&b.hp<b.max);assert.equal(far.hp,far.max);});
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
  assert.equal(new Set(T.cards.map(c=>T.roles[c.id].kit)).size,11);
  for(const c of T.cards){assert.equal(T.archetype(c.id),T.roles[c.id].role);for(const lang of ['pl','en']){const text=T.description(c.id,lang);assert(text.includes(String(c.hp)));assert(text.includes(String(c.attack)));assert(text.includes(lang==='pl'?'Słabość:':'Weakness:'));}}
  assert(T.description('bat','pl').includes('13'));assert(T.description('heavy','en').includes('33'));assert(T.description('caretaker','pl').includes('+4'));assert(T.description('skater','en').includes('85%'));
});
check('caretaker holds behind an injured ally, heals, then resumes instead of creating a permanent stop',()=>{
  for(const p of [true,false]){const g=game(10),dir=p?1:-1,a=spawn(g,'heavy',p,.5+dir*.06),c=spawn(g,'caretaker',p,.5);a.wind=100;a.hp=a.max-8;const x=c.x;tick(g,1);assert.equal(c.x,x);assert(a.hp>a.max-8);tick(g,2);assert.equal(a.hp,a.max);assert((c.x-x)*dir>0);}
});
check('bat secondary hit selects the nearest eligible rival, not array insertion order',()=>{
  const g=game(5),a=spawn(g,'bat',true,.45),main=spawn(g,'boxer',false,.48),far=spawn(g,'boxer',false,.51),near=spawn(g,'boxer',false,.49);a.lane=main.lane=1;far.lane=near.lane=0;[main,far,near].forEach(u=>u.wind=100);tick(g,.8);assert.equal(near.max-near.hp,13);assert.equal(far.hp,far.max);
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
  function march(count,p=true){const g=game(6),u=spawn(g,'boxer',p,.45);for(let i=0;i<count;i++){const m=spawn(g,'musician',true,.4);m.lane=0;m.wind=100;}tick(g,.5);return Math.abs(u.x-.45);}
  const base=march(0);assert(Math.abs(march(1)/base-1.2)<.001);assert(Math.abs(march(2)-march(1))<.00001);assert(Math.abs(march(1,false)-base)<.00001);
});
check('cart projectile telegraphs, hits up to two additional neighbours and never its own team',()=>{
  for(const p of [true,false]){const g=game(8),dir=p?1:-1,a=spawn(g,'cart',p,.4),target=spawn(g,'bat',!p,.4+dir*.1),b=spawn(g,'bat',!p,.4+dir*.12),c=spawn(g,'bat',!p,.4+dir*.13),far=spawn(g,'bat',!p,.4+dir*.2),friend=spawn(g,'bat',p,.4+dir*.11);[target,b,c,far,friend].forEach(u=>u.wind=100);tick(g,.6);assert.equal(target.hp,target.max);tick(g,.6);assert(target.hp<target.max);assert.equal(b.max-b.hp,12);assert.equal(c.max-c.hp,12);assert.equal(far.hp,far.max);assert.equal(friend.hp,friend.max);assert.equal(target.slow,0);}
});
check('new support is chosen only with an escort and new ranged unit counters front',()=>{
  const g=game(6);spawn(g,'bat',false);spawn(g,'boxer',false);g.estate.tactics.e=0;assert.equal(T.choose(g),'musician');g.estate.segment=8;spawn(g,'bat',true);g.estate.units=g.estate.units.filter(u=>u.isP);assert.equal(T.choose(g),'cart');
});
check('wide carts spawn with room for their equipment and retain stable simulation at different FPS',()=>{
  function run(dt){const g=game(8);for(let i=0;i<9;i++)spawn(g,'cart',true);for(let lane=0;lane<3;lane++){const row=g.estate.units.filter(u=>u.lane===lane).sort((a,b)=>a.x-b.x);for(let j=1;j<row.length;j++)assert(row[j].x-row[j-1].x>=.061-1e-8);}spawn(g,'musician',true);for(let i=0;i<6;i++)spawn(g,'skater',false);tick(g,60,dt);return JSON.stringify([g.p.gold,g.e.gold,g.stats,g.estate.units.map(u=>[u.kind,u.hp,u.x])]);}assert.equal(run(1/30),run(1/120));
});
check('Marian is an early affordable control unit: short melee, slow, no friendly splash',()=>{
  for(const p of [true,false]){const g=game(2),dir=p?1:-1,m=spawn(g,'marian',p,.5),v=spawn(g,'bike',!p,.5+dir*.03),friend=spawn(g,'dres',p,.5+dir*.02);m.lane=v.lane=1;friend.lane=0;v.wind=friend.wind=100;tick(g,.75);assert(v.hp<v.max);assert(v.slow>1);assert.equal(friend.hp,friend.max);assert.equal(T.raidCapacity('marian',2),30);}
  const g=game(2);spawn(g,'dres',false);spawn(g,'bike',true);g.estate.tactics.e=0;assert.equal(T.choose(g),'marian');assert(!T.roster(4).includes('marian'));
});
check('rain causes brief, damage-free slips only on marked puddles, on either team',()=>{
  for(const p of [true,false])for(const wet of [true,false]){const g=game(2),u=spawn(g,'marian',p,.5);u.lane=1;u.moving=true;g.estate.rain=wet;const hp=u.hp,x=u.x;tick(g,.1);assert.equal(u.slip>0,wet);assert.equal(u.hp,hp);if(wet){assert.equal(u.x,x);assert.equal(u.wind,0);tick(g,1.3);assert.equal(u.slip,0);assert.equal(u.slips,1);assert((u.x-x)*(p?1:-1)>0);}}
  const g=game(2),u=spawn(g,'marian',true,.3);g.estate.rain=true;u.moving=true;tick(g,.2);assert(!u.slip);u.x=.5;u.lane=1;g.estate.segment=9;g.estate.tactics.clock=11;tick(g,.2);assert(!u.slip);assert.equal(u.x,.5);
});
check('wet battles are deterministic across FPS, raiders return and fallen actors can withdraw',()=>{
  function run(dt){const g=game(2);g.estate.rain=true;for(const p of [true,false]){spawn(g,'marian',p);spawn(g,'bike',p);spawn(g,'dres',p);}tick(g,90,dt);return JSON.stringify([g.p.gold,g.e.gold,g.stats,g.estate.units]);}assert.equal(run(1/30),run(1/120));
  const g=game(2),u=spawn(g,'marian',true,.5);g.estate.rain=true;u.lane=1;u.moving=true;tick(g,.1);assert(u.slip>0);T.finish(g,.1);assert.equal(u.slip,0);assert(u.retreat);assert.equal(T.slipPose(u),0);
  for(const c of T.cards){const r=game(c.unlock);r.estate.rain=true;spawn(r,c.id,true);tick(r,100);assert.equal(r.estate.units.length,0);assert.equal(r.e.gold,1000-T.raidCapacity(c.id,c.unlock));}
});
check('condition thresholds are bounded, shared, pure and safe for icon previews',()=>{
  for(const [hp,expected] of [[100,0],[76,0],[75,1],[51,1],[50,2],[26,2],[25,3],[1,3],[0,4],[-5,4],[150,0]]){const c=T.condition(hp,100);assert.equal(c.stage,expected);assert(c.wear>=0&&c.wear<=1);assert.equal(c.ratio+c.wear,1);}
  for(const [hp,max] of [[undefined,undefined],[1,undefined],[NaN,100],[10,0]])assert.equal(T.condition(hp,max).stage,0);
});
check('visual state prioritises withdrawal, return, slipping and impact over locomotion',()=>{
  const u={moving:true,follow:.1,wind:.1,hurt:.1,slip:.3,returning:true,retreat:true};
  for(const [key,expected] of [['retreat','withdraw'],['returning','return'],['slip','slip'],['hurt','hit'],['wind','anticipation'],['follow','follow'],['moving','move']]){const before=JSON.stringify(u);assert.equal(T.animationState(u),expected);assert.equal(JSON.stringify(u),before);u[key]=0;}assert.equal(T.animationState(u),'idle');
});
check('walking phase follows actual travel under slowdown and stopping',()=>{
  function sample(slow){const g=game(2),u=spawn(g,'dres',true,.2);u.slow=slow;tick(g,.5);return {distance:u.x-.2,walk:u.walk};}
  const normal=sample(0),slowed=sample(3);assert(Math.abs(normal.walk/normal.distance-slowed.walk/slowed.distance)<1e-8);assert(slowed.walk<normal.walk*.6);
  const g=game(2),u=spawn(g,'dres',true,.4),v=spawn(g,'dres',false,.42);u.wind=v.wind=100;const phase=u.walk;tick(g,.3);assert.equal(u.walk,phase);
});
check('locomotion blends in simulation, settles feet and immediately obeys patrol and slipping',()=>{
  const u={kind:'dres',moving:true,walk:.6,x:.4,wind:.2};T.updateLocomotion(u,1/30,false);assert(u.locomotion>0&&u.locomotion<1);const weight=u.locomotion;T.updateLocomotion(u,1/30,false);assert(u.locomotion>weight);u.moving=false;for(let i=0;i<15;i++)T.updateLocomotion(u,1/30,false);assert.equal(u.locomotion,0);assert.equal(T.pose(u).lift+T.pose(u).rightLift,0);assert.equal(u.x,.4);assert.equal(u.wind,.2);
  u.moving=true;u.locomotion=1;T.updateLocomotion(u,1/30,true);assert.equal(u.locomotion,0);u.returning=true;T.updateLocomotion(u,1/30,true);assert(u.locomotion>0);u.slip=.5;T.updateLocomotion(u,1/30,false);assert.equal(u.locomotion,0);
});
check('planar leg IK preserves segment lengths and clamps unreachable and coincident targets',()=>{
  for(const [upper,lower] of [[12,12],[9,9],[12,9]])for(const [x,y] of [[0,0],[0,21],[-8,18],[7,14],[100,100]]){const k=T.solveLeg(0,0,x,y,upper,lower);assert(Object.values(k).every(Number.isFinite));assert(Math.abs(Math.hypot(k.kx,k.ky)-upper)<1e-6);assert(Math.abs(Math.hypot(k.fx-k.kx,k.fy-k.ky)-lower)<1e-6);assert(Math.hypot(k.fx,k.fy)<upper+lower);}
});
check('accordion dissonance slows enemy cooldown by 25 percent, without stacking or altering windup',()=>{
  function sample(count){const g=game(6),v=spawn(g,'boxer',false,.5),friend=spawn(g,'boxer',true,.5);v.wind=friend.wind=100;v.cd=friend.cd=2;for(let i=0;i<count;i++){const m=spawn(g,'musician',true,.4);m.wind=100;}tick(g,.4);return {v,friend};}
  const none=sample(0),one=sample(1),two=sample(2);assert(Math.abs((2-one.v.cd)/(2-none.v.cd)-.75)<1e-8);assert.equal(one.v.cd,two.v.cd);assert.equal(one.friend.cd,none.friend.cd);assert.equal(one.v.wind,none.v.wind);assert(one.v.disrupted);
  for(const mode of ['far','dead','slipping','returning','patrol']){const g=game(6),m=spawn(g,'musician',true,.4),v=spawn(g,'boxer',false,.5);m.wind=v.wind=100;if(mode==='far')m.x=.2;if(mode==='dead')m.hp=0;if(mode==='slipping')m.slip=1;if(mode==='returning'){m.returning=true;m.loot=0;}if(mode==='patrol'){g.estate.segment=9;g.estate.tactics.clock=11;}tick(g,.1);assert(!v.disrupted,mode);}
  const m=T.cards.find(c=>c.id==='musician');assert.equal(m.cost,30);assert.equal(m.attack,16);assert.equal(m.hp,130);
});
check('boxer guard reduces ranged hits but not melee, counters throwers and is available to AI',()=>{
  for(const p of [true,false]){const dir=p?1:-1,g=game(6),a=spawn(g,'neighbor',!p,.5-dir*.13),b=spawn(g,'boxer',p,.5);b.wind=100;tick(g,.9);assert(Math.abs(b.max-b.hp-18*.7)<1e-8);assert(b.slow>0);
    const h=game(5),front=spawn(h,'bat',!p,.5-dir*.03),target=spawn(h,'boxer',p,.5);target.wind=100;front.lane=target.lane=1;tick(h,.8);assert(Math.abs(target.max-target.hp-26*1.4)<1e-8);
    const duel=game(5),boxer=spawn(duel,'boxer',p,p?.35:.65),thrower=spawn(duel,'neighbor',!p,p?.65:.35);tick(duel,20);assert(thrower.retreat);assert(!boxer.retreat);}
  const ai=game(5);spawn(ai,'neighbor',true);assert.equal(T.choose(ai),'boxer');ai.e.gold=33;assert.equal(T.choose(ai),'bat');
});
check('cart splash respects boxer guard and music sampling is independent of army array order',()=>{
  const g=game(5),b=spawn(g,'boxer',false,.51);g.estate.segment=8;const target=spawn(g,'bat',false,.5),cart=spawn(g,'cart',true,.4);b.wind=target.wind=100;b.lane=0;target.lane=cart.lane=1;tick(g,1.2);assert(Math.abs(b.max-b.hp-12*.7)<1e-8);
  function sample(reverse,p){const h=game(6),m=spawn(h,'musician',p,.4),v=spawn(h,'boxer',!p,.5);m.wind=v.wind=100;v.cd=2;if(reverse)h.estate.units.reverse();tick(h,.4);return [v.cd,v.disrupted];}assert.deepEqual(sample(false,true),sample(true,true));assert.deepEqual(sample(false,true),sample(false,false));
});
console.log('ESTATE TACTICS COMPLETE: '+checks+' checks');
