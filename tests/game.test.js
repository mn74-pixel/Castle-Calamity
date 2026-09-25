const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createCanvas, Image } = require("@napi-rs/canvas");

const root = path.resolve(__dirname, "..");
const outDir = path.resolve(__dirname, "renders");
fs.mkdirSync(outDir, { recursive: true });

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const inline = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const main = inline.reduce((best,src) => src.length > best.length ? src : best, "");
const end = main.lastIndexOf("})();");
if (end < 0) throw new Error("Nie znaleziono końca głównego skryptu gry");

const qaHooks = String.raw`
window.__QA = {
  regression71: function(){
    load(11);G.units=[];G.projs=[];
    var u=this.addUnit("warrior",true,W*.4),v=this.addUnit("warrior",false,W*.4+uRange(u)*2);
    u.tgt=v;u.state="fight";u.acd=0;var hp=v.hp;doFight(u,.02);var noRemoteDamage=v.hp===hp;
    var before=JSON.stringify(CAMPAIGN_STATE),era=ACTIVE_ERA_ID;
    launchTestLevel("electric",3);var opened=G.eraId==="electric"&&LI===3;
    var reward=recordCampaignWin(3,1);saveProgress(99);endTestSession();
    return {noRemoteDamage:noRemoteDamage,opened:opened,isolated:reward===0&&JSON.stringify(CAMPAIGN_STATE)===before&&ACTIVE_ERA_ID===era};
  },
  viewport: function(w,h,dpr,safe,offsetLeft,offsetTop){
    window.innerWidth=w; window.innerHeight=h; window.devicePixelRatio=dpr||1;
    window.__CASTLE_SAFE_AREA__=safe||{top:0,right:0,bottom:0,left:0};
    if(window.visualViewport){window.visualViewport.width=w;window.visualViewport.height=h;window.visualViewport.offsetLeft=offsetLeft||0;window.visualViewport.offsetTop=offsetTop||0;}
    document.documentElement.clientWidth=w;document.documentElement.clientHeight=h;
    rsz(true);repositionWorld();
    return {W:W,H:H,canvasLeft:parseFloat(CV.style.left)||0,canvasTop:parseFloat(CV.style.top)||0,canvasWidth:parseFloat(CV.style.width)||0,canvasHeight:parseFloat(CV.style.height)||0,view:VIEWPORT};
  },
  load: function(i){load(i);},
  render: function(){render();},
  intro: function(t){
    INTRO_ACTIVE=true;INTRO_T=t;INTRO_LAST=performance.now()/1000;INTRO_G=null;INTRO_CL=null;
    renderIntro();INTRO_ACTIVE=false;
  },
  state: function(){return {
    W:W,H:H,DPR:DPR,GY:GY,unitSize:getUnitDrawSize(),level:LI+1,
    lang:LANG,tutorialActive:TUTORIAL.active,tutorialStep:TUTORIAL.step,eraId:G&&G.eraId,
    archerRange:UD.archer.r,spearmanRange:UD.spearman.r,wizardRange:UD.wizard.r,
    firstMin:CONTENT.timing.firstMin,firstMax:CONTENT.timing.firstMax,
    nextMin:CONTENT.timing.nextMin,nextMax:CONTENT.timing.nextMax,
    freezeDuration:3.8,arrowRainWaves:3,gags:G&&G.gags?G.gags.length:0,introDuration:INTRO_DURATION
  };},
  faceCutoutAudit: function(){
    var src=document.createElement("canvas");src.width=320;src.height=220;
    var s=src.getContext("2d");s.fillStyle="#17305b";s.fillRect(0,0,320,220);
    s.fillStyle="#2c1711";s.beginPath();s.ellipse(160,76,49,63,0,0,Math.PI*2);s.fill();
    s.fillStyle="rgb(196,126,96)";s.beginPath();s.ellipse(160,91,40,51,0,0,Math.PI*2);s.fill();
    s.fillStyle="#f8f8f2";s.beginPath();s.arc(146,83,5,0,Math.PI*2);s.arc(174,83,5,0,Math.PI*2);s.fill();
    s.fillStyle="#2a1a16";s.beginPath();s.arc(146,83,2,0,Math.PI*2);s.arc(174,83,2,0,Math.PI*2);s.fill();
    var skinBox=detectFaceBySkin(src);
    var out=createFaceCutoutCanvas(src,{x:120,y:40,width:80,height:102}),o=out.getContext("2d");
    var corner=o.getImageData(0,0,1,1).data,edge=o.getImageData(7,96,1,1).data,center=o.getImageData(96,96,1,1).data;
    CT.clearRect(0,0,W,H);CT.fillStyle="#14213a";CT.fillRect(0,0,W,H);drawCrestImageContained(CT,out,W*.5-96,H*.5-96,192,192,0);
    return {width:out.width,height:out.height,cornerAlpha:corner[3],edgeAlpha:edge[3],centerAlpha:center[3],centerRGB:[center[0],center[1],center[2]],skinFound:!!skinBox,skinBox:skinBox};
  },
  fullscreenAudit: function(){
    var oldRequest=APP.requestFullscreen,oldWebkitRequest=APP.webkitRequestFullscreen;
    var oldExit=document.exitFullscreen,oldElement=document.fullscreenElement,oldStandalone=navigator.standalone;
    var oldHelp=showFullscreenHelp,requestCalls=0,exitCalls=0,helpCalls=0;
    navigator.standalone=false;document.fullscreenElement=null;
    APP.requestFullscreen=function(){requestCalls++;};APP.webkitRequestFullscreen=undefined;
    toggleGameFullscreen();
    document.fullscreenElement=APP;updateFullscreenUI();
    var activeLabel=document.getElementById("fullscreenMenuBtn").textContent;
    var activePressed=document.getElementById("btnFullscreen").getAttribute("aria-pressed");
    document.exitFullscreen=function(){exitCalls++;document.fullscreenElement=null;};
    toggleGameFullscreen();
    showFullscreenHelp=function(){helpCalls++;};APP.requestFullscreen=undefined;APP.webkitRequestFullscreen=undefined;
    document.fullscreenElement=null;requestGameFullscreen();
    APP.requestFullscreen=oldRequest;APP.webkitRequestFullscreen=oldWebkitRequest;
    document.exitFullscreen=oldExit;document.fullscreenElement=oldElement;navigator.standalone=oldStandalone;showFullscreenHelp=oldHelp;updateFullscreenUI();
    return {requestCalls:requestCalls,exitCalls:exitCalls,helpCalls:helpCalls,activeLabel:activeLabel,activePressed:activePressed};
  },
  abilityVisibilityAudit: function(){
    var oldEra=ACTIVE_ERA_ID,oldPack=ACTIVE_ERA_PACK,oldLevels=LV,oldLI=LI,oldElement=document.fullscreenElement;
    ACTIVE_ERA_ID="medieval";ACTIVE_ERA_PACK=ERA_REGISTRY.packs.medieval;LV=MEDIEVAL_LEVELS;
    var medieval=[];
    for(var i=0;i<5;i++){document.getElementById("abBar").children=[];load(i);medieval.push({level:i+1,count:document.getElementById("abBar").children.length,display:document.getElementById("abBar").style.display});}
    ACTIVE_ERA_ID="early-modern";ACTIVE_ERA_PACK=ERA_REGISTRY.packs["early-modern"];LV=EARLY_MODERN_LEVELS;document.getElementById("abBar").children=[];load(0);
    var eraTwo={count:document.getElementById("abBar").children.length,level:abilityCampaignLevel(),canCast:isAbilityUnlocked(ABILITIES.freeze)};
    document.fullscreenElement=APP;updateFullscreenUI();
    var fullscreenClass=APP.classList.contains("fullscreenMode");
    document.fullscreenElement=oldElement;ACTIVE_ERA_ID=oldEra;ACTIVE_ERA_PACK=oldPack;LV=oldLevels;LI=oldLI;updateFullscreenUI();
    return {medieval:medieval,eraTwo:eraTwo,fullscreenClass:fullscreenClass};
  },
  cardAvailabilityAudit: function(){
    if(ACTIVE_ERA_ID!=="medieval")switchEra("medieval",false);
    load(0);TUTORIAL.active=false;G.tutorialMode=true;G.p.gold=9999;G.units=[];buildCards();updHUD();
    var card=document.getElementById("cd_drwal"),badge=document.getElementById("cdstate_drwal");
    var initial={blocked:card.classList.contains("unitUnavailable"),aria:card.getAttribute("aria-disabled"),badge:badge.textContent};
    spawnUnit("drwal",true);spawnUnit("drwal",true);updHUD();
    var limited={blocked:card.classList.contains("unitUnavailable"),aria:card.getAttribute("aria-disabled"),badge:badge.textContent,reason:card.dataset.blockReason};
    G.units[0].state="dead";updHUD();
    var released={blocked:card.classList.contains("unitUnavailable"),aria:card.getAttribute("aria-disabled"),badge:badge.textContent};
    var warrior=document.getElementById("cd_warrior"),cost=effStat("warrior","c");
    G.p.gold=cost-.01;updHUD();
    var poor=warrior.classList.contains("unitUnavailable")&&warrior.dataset.blockReason==="funds";
    G.p.gold=cost;updHUD();var affordable=!warrior.classList.contains("unitUnavailable");
    spawnUnit("warrior",true);updHUD();var spent=warrior.classList.contains("unitUnavailable");
    G.p.gold=0;spawnUnit("drwal",true);var funds=unitCardAvailability("drwal",true).reason==="funds";
    return {initial:initial,limited:limited,released:released,poor:poor,affordable:affordable,spent:spent,funds:funds};
  },
  game: function(){return G;},
  clearUnits: function(){G.units=[];G.projs=[];G.gags=[];},
  addUnit: function(key,isP,x){
    var c=isP?G.p:G.e;c.gold=9999;spawnUnit(key,isP);
    var u=G.units[G.units.length-1];if(x!==undefined)u.x=x;u.y=G.GY;u.state="march";return u;
  },
  archerScene: function(){
    G.units=[];G.projs=[];
    var a=this.addUnit("archer",true,W*.43);a.state="fight";a.atkPhase=.72;a.tgt={x:W*.58,y:G.GY};
    var b=this.addUnit("archer",false,W*.57);b.state="fight";b.atkPhase=.72;b.tgt={x:W*.42,y:G.GY};
    refreshArcherAuras();
    render();return G.units.map(function(u){return !!u.archerAura;});
  },
  formationAura: function(){
    G.units=[];G.projs=[];this.addUnit("archer",true,W*.42);this.addUnit("archer",true,W*.46);
    refreshArcherAuras();render();return G.units.map(function(u){return !!u.archerAura;});
  },
  rangedShot: function(key,isP){
    G.units=[];G.projs=[];
    var shooter=this.addUnit(key,!!isP,isP?W*.38:W*.62);
    var target=this.addUnit("warrior",!isP,isP?W*.57:W*.43);
    target.x=shooter.x+(isP?1:-1)*uRange(shooter)*.8;shooter.state="fight";shooter.tgt=target;shooter.acd=0;doFight(shooter,0);
    var p=G.projs[0],ft=p.flightTime;
    return {type:p.type,vx:p.vx,vy:p.vy,grav:p.grav,ft:ft,endX:p.x+p.vx*ft,endY:p.y+p.vy*ft+.5*p.grav*ft*ft,targetX:target.x,targetY:target.y-22};
  },
  spearmanScene: function(isP){
    G.units=[];G.projs=[];
    var shooter=this.addUnit("spearman",!!isP,isP?W*.36:W*.64);
    var target=this.addUnit("warrior",!isP,isP?W*.58:W*.42);
    target.x=shooter.x+(isP?1:-1)*uRange(shooter)*.8;shooter.state="fight";shooter.tgt=target;shooter.acd=0;doFight(shooter,0);
    var p=G.projs[0],dt=.16;p.x+=p.vx*dt;p.y+=p.vy*dt+.5*p.grav*dt*dt;p.vy+=p.grav*dt;p.trail=[{x:p.x-p.vx*.09,y:p.y-p.vy*.09},{x:p.x-p.vx*.04,y:p.y-p.vy*.04}];
    shooter.atkPhase=.82;render();
    return {type:p.type,x:p.x,y:p.y,trail:p.trail.length,released:shooter.atkPhase>.35};
  },
  premiumUnitsScene: function(){
    load(7);G.units=[];G.projs=[];G.gags=[];G.T=7.4;
    var monk=this.addUnit("monk",true,W*.28);monk.vx=22;monk.step=1.1;monk.healPulse=.44;
    var mason=this.addUnit("mason",true,W*.39);mason.state="quarry";mason.vx=0;mason.atkPhase=.72;
    var golem=this.addUnit("golem",true,W*.50);golem.vx=18;golem.step=2.2;golem.atkPhase=.52;
    var wizard=this.addUnit("wizard",true,W*.61);wizard.vx=0;wizard.atkPhase=.64;
    var spear=this.addUnit("spearman",true,W*.72);spear.vx=24;spear.step=3.1;spear.atkPhase=.78;spear.throwRelease=.24;
    render();return {monk:monk.healPulse,mason:mason.atkPhase,golem:golem.atkPhase,wizard:wizard.atkPhase,spear:spear.throwRelease,count:G.units.length};
  },
  abilityScene: function(name){
    load(5);G.units=[];G.projs=[];G.gags=[];G.p.gold=9999;G.T=5.8;
    for(var i=0;i<4;i++){var p=this.addUnit(i%2?"archer":"warrior",true,W*(.28+i*.035));p.rallied=0;}
    for(var j=0;j<5;j++)this.addUnit(j%2?"pikeman":"warrior",false,W*(.61+j*.035));
    castAbility(name);
    if(G.arrowRainFx){
      G.arrowRainFx.life=1.72;
      var rains=G.projs.filter(function(p){return p.rain;});
      for(var r=0;r<rains.length;r++){
        rains[r].x=G.arrowRainFx.x1+(G.arrowRainFx.x2-G.arrowRainFx.x1)*(.08+(r%10)/11);
        rains[r].y=48+(r%10)*43+Math.floor(r/10)*15;
      }
    }
    if(G.freezeBurst)G.freezeBurst.life=.62;
    if(G.rallyFx)G.rallyFx.life=.72;
    render();return {arrow:!!G.arrowRainFx,freeze:!!G.freezeBurst,rally:!!G.rallyFx};
  },
  castleDamageAudit: function(){
    load(8);var c=G.e,stages=[];
    c.hp=c.max*.76;castleDmg(c,c.max*.02,c.x+c.w*.42,G.GY-c.h*.48);stages.push(c.damageStage);
    c.hp=c.max*.51;castleDmg(c,c.max*.02,c.x+c.w*.58,G.GY-c.h*.37);stages.push(c.damageStage);
    c.hp=c.max*.26;castleDmg(c,c.max*.02,c.x+c.w*.31,G.GY-c.h*.55);stages.push(c.damageStage);
    return {stages:stages,pulse:c.damagePulse,holes:c.holes.length};
  },
  castleDamageScene: function(){
    load(8);G.T=8.6;G.units=[];G.projs=[];G.gags=[];
    G.p.hp=G.p.max*.43;G.p.damageStage=2;G.p.damagePulse=.19;G.p.lastHitX=G.p.x+G.p.w*.67;G.p.lastHitY=G.GY-G.p.h*.48;
    G.e.hp=G.e.max*.18;G.e.damageStage=3;G.e.damagePulse=.25;G.e.lastHitX=G.e.x+G.e.w*.34;G.e.lastHitY=G.GY-G.e.h*.55;
    G.p.holes=[{x:G.p.x+G.p.w*.62,y:G.GY-G.p.h*.43,r:8,rot:.3,crackSeed:17}];
    G.e.holes=[{x:G.e.x+G.e.w*.36,y:G.GY-G.e.h*.50,r:11,rot:.7,crackSeed:29},{x:G.e.x+G.e.w*.68,y:G.GY-G.e.h*.30,r:7,rot:.2,crackSeed:41}];
    render();return {player:G.p.damageStage,enemy:G.e.damageStage};
  },
  projectileFxScene: function(){
    load(8);G.T=6.3;G.units=[];G.projs=[];G.gags=[];G.blasts=[];
    var types=["wizard","demonfire","crossbow","spearman","cannon"],kinds=[];
    for(var i=0;i<types.length;i++){
      var x=W*(.28+i*.11),y=G.GY-95-(i%2)*25,type=types[i];
      var p={type:type,x:x,y:y,vx:150,vy:-25,isP:true,spl:type==="cannon"?50:(type==="demonfire"?18:0),trail:[]};
      for(var t=0;t<8;t++)p.trail.push({x:x-55+t*6,y:y+15-t*2});
      G.projs.push(p);projectileImpactFX(p,x,G.GY-18,true);
    }
    for(var b=0;b<G.blasts.length;b++){G.blasts[b].life*=.62;G.blasts[b].r=G.blasts[b].mr*.72;kinds.push(G.blasts[b].impactKind);}
    render();return {kinds:kinds,projectiles:G.projs.length};
  },
  masonCycle: function(){
    load(6);G.p.gold=9999;G.units=[];
    spawnUnit("mason",true);spawnUnit("mason",true);spawnUnit("mason",true);
    var active=G.units.filter(function(u){return u.ud.mason&&u.isP&&u.state!=="dead";}).length;
    G.units=[];
    for(var i=0;i<9;i++)deliverStone(G.p,{state:"stoneReturn",vx:0,atkPhase:0});
    return {active:active,stage:G.p.buildStage,loads:G.p.buildLoads,max:G.p.max,base:G.p.baseMax};
  },
  masonWalkCycle: function(){
    load(6);G.tutorialMode=true;G.gagShown=true;G.p.gold=9999;G.units=[];
    spawnUnit("mason",true);
    for(var i=0;i<1100&&G.p.buildStage<1;i++)tick(.1);
    return {loads:G.p.buildLoads,stage:G.p.buildStage,active:G.units.filter(function(u){return u.ud.mason&&u.state!=="dead";}).length};
  },
  masonImmediateAudit: function(){
    load(6);G.tutorialMode=true;G.gagShown=true;G.p.gold=9999;G.units=[];G.p.hp=G.p.max-240;
    spawnUnit("mason",true);var m=G.units[0],before=G.p.hp;
    m.x=G.p.x+G.p.w+5;m.state="stoneReturn";m.carryStone=true;deliverStone(G.p,m);render();
    return {repair:G.p.hp-before,loads:G.p.buildLoads,trips:m.stoneTrips,state:m.state,pulse:G.p.buildPulse};
  },
  masonScene: function(){
    load(6);G.units=[];G.p.buildStage=3;G.p.buildLoads=0;G.p.max=Math.round(G.p.baseMax*1.225);G.p.hp=G.p.max;
    var m=this.addUnit("mason",true,W*.48);m.state="quarry";m.rockTarget=G.rocks[1];m.x=m.rockTarget.x;m.atkPhase=.9;
    render();return {rocks:G.rocks.length,stage:G.p.buildStage};
  },
  counter: function(attacker,target){return matchupMultiplier({key:attacker,ud:UD[attacker]},{key:target,ud:UD[target]});},
  aiAudit: function(){
    var oldRandom=Math.random;Math.random=function(){return .5;};
    function pick(idx){load(idx);G.e.gold=9999;G.units=[];return {profile:G.aiProfile,key:selectAiUnit()};}
    var result={defensive:pick(4),aggressive:pick(5),siege:pick(7),chaotic:pick(3),profiles:LV.map(function(l){return l.profile;})};
    Math.random=oldRandom;return result;
  },
  stressLevel: function(idx,seconds){
    load(idx);G.tutorialMode=false;G.gagShown=true;
    var roster=G.lv.ul,ri=0,steps=Math.round((seconds||60)*10),peakP=0,peakE=0,peakTotal=0,peakProjectiles=0,peakEffects=0;
    for(var i=0;i<steps&&!G.over;i++){
      if(i%20===0){var recruited=spawnUnit(roster[ri%roster.length],true);if(recruited)ri++;}
      tick(.1);
      peakP=Math.max(peakP,activeCombatCount(true));peakE=Math.max(peakE,activeCombatCount(false));
      peakTotal=Math.max(peakTotal,G.units.filter(function(u){return u.state!=="dead";}).length);
      peakProjectiles=Math.max(peakProjectiles,G.projs.length);
      peakEffects=Math.max(peakEffects,G.dust.length+G.sparks.length+G.smoke.length+G.embers.length+G.blasts.length);
    }
    var finite=isFinite(G.p.hp)&&isFinite(G.e.hp)&&G.units.every(function(u){return isFinite(u.x)&&isFinite(u.y)&&isFinite(u.hp);})&&G.projs.every(function(p){return isFinite(p.x)&&isFinite(p.y)&&isFinite(p.vx)&&isFinite(p.vy);});
    render();return {level:idx+1,finite:finite,units:G.units.length,profile:G.aiProfile,over:G.over,peakP:peakP,peakE:peakE,peakTotal:peakTotal,peakProjectiles:peakProjectiles,peakEffects:peakEffects,seconds:seconds||60};
  },
  armyFreedomAudit: function(){
    G=null;if(ACTIVE_ERA_ID!=="medieval")switchEra("medieval",false);load(11);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=99999;G.e.gold=99999;
    for(var i=0;i<14;i++){spawnUnit("warrior",true);spawnUnit("warrior",false);}
    var pCombat=activeCombatCount(true),eCombat=activeCombatCount(false),goldBefore=G.p.gold;
    var extra=spawnUnit("warrior",true),goldAfter=G.p.gold;
    for(var j=0;j<5;j++){spawnUnit("drwal",true);spawnUnit("drwal",false);}
    var pWorkers=G.units.filter(function(u){return u.isP&&u.ud.worker&&u.state!=="dead";}).length;
    var eWorkers=G.units.filter(function(u){return !u.isP&&u.ud.worker&&u.state!=="dead";}).length;
    return {pCombat:pCombat,eCombat:eCombat,pWorkers:pWorkers,eWorkers:eWorkers,extra:!!extra,spent:goldBefore-goldAfter,cost:UD.warrior.c,cardCap:MAX_BATTLE_CARDS};
  },
  balanceAudit: function(){
    function rows(levels){return levels.map(function(l){return {id:l.id,pH:l.pH,eH:l.eH,gm:l.gm,treeCap:l.treeCap,unitCap:l.unitCap,passiveP:l.passiveP,passiveE:l.passiveE};});}
    return {medieval:rows(MEDIEVAL_LEVELS),earlyModern:rows(EARLY_MODERN_LEVELS)};
  },
  humorScaleAudit: function(){
    return {human:humorousHumanScale(),soldier:getUnitDrawSize()/22,types:["policeman","flyingdesk","bathtub","cloudknight","moonjanitor","firemarshal","vacuumdemon","airdrop","runawaybanner","powderclerk"].filter(function(k){return !!GAG_MOTION[k];})};
  },
  introAudit: function(){return {duration:INTRO_DURATION,noText:renderIntroV44.toString().indexOf("fillText")<0,renderer:renderIntro===renderIntroV44};},
  cannonScene: function(isP){
    G.units=[];G.projs=[];var c=isP?G.p:G.e;c.gold=9999;spawnUnit("cannon",!!isP);
    var u=G.units[G.units.length-1];u.acd=0;doCannon(u,0);
    var p=G.projs[0],t=p.flightTime*.48;
    p.trail=[];
    for(var i=0;i<16;i++){var tt=t*(i/16);p.trail.push({x:p.x+p.vx*tt,y:p.y+p.vy*tt+.5*p.grav*tt*tt});}
    p.x=p.x+p.vx*t;p.y=p.y+p.vy*t+.5*p.grav*t*t;p.vy=p.vy+p.grav*t;
    render();return {x:p.x,y:p.y,vx:p.vx,vy:p.vy,grav:p.grav,flightTime:p.flightTime,arcHeight:p.arcHeight};
  },
  gagScene: function(type,dir){
    G.units=[];G.projs=[];G.gags=[];dir=dir||1;
    var spec=GAG_MOTION[type]||{pad:80,sky:false};var pad=spec.pad;
    var sky=!!spec.sky;
    G.gags.push({type:type,x:W*.5,y:sky?H*.28:G.GY-1,vx:dir*60,dir:dir,life:999,phase:1.7,exitPad:pad,panicAt:.4,panicked:type==="policeman",whistle:type==="policeman"?.55:0});
    render();
  },
  airdropScene: function(){
    load(8);G.units=[];G.projs=[];G.gags=[];G.T=8.2;
    var soldier=this.addUnit("warrior",false,W*.59);soldier.vx=0;
    var g={type:"airdrop",x:W*.48,y:H*.17,vx:98,dir:1,life:999,phase:1.4,exitPad:150};initAirdropGag(g);
    g.dropped=true;g.chuteOpen=true;g.jumpX=W*.52;g.jumpY=G.GY*.48;g.jumpVx=8;g.jumpVy=28;g.lookT=0;
    g.poopDropped=true;g.target=soldier;g.poop={x:g.jumpX+2,y:g.jumpY+10,vx:(soldier.x-g.jumpX)*1.1,vy:45,target:soldier};G.gags=[g];render();
    return {type:g.type,plane:!g.planeOff,chute:g.chuteOpen,poop:!!g.poop};
  },
  airdropAudit: function(){
    load(8);G.units=[];G.projs=[];G.gags=[];G.gagShown=true;
    var soldier=this.addUnit("warrior",false,W*.55);soldier.vx=0;soldier.state="march";
    var g={type:"airdrop",x:W*.30,y:H*.17,vx:100,dir:1,life:999,phase:0,exitPad:150};initAirdropGag(g);
    g.dropped=true;g.chuteOpen=true;g.jumpX=soldier.x-12;g.jumpY=G.GY*.43;g.jumpVx=8;g.jumpVy=27;g.lookT=0;G.gags=[g];
    var landed=false,stained=false,cut=false,startX=g.jumpX;
    for(var i=0;i<900&&G.gags.length;i++){updateAbsurdGags(.05);landed=landed||g.landed;stained=stained||soldier.gagStain>0;cut=cut||(g.landed&&g.cutT<.4);}
    return {landed:landed,stained:stained,cut:cut,escaped:G.gags.length===0,moved:Math.abs(g.jumpX-startX)>60,damaged:soldier.hp<soldier.max};
  },
  policemanScene: function(){
    load(4);G.units=[];G.projs=[];G.gags=[];G.T=7.8;
    var warrior=this.addUnit("warrior",true,W*.60);warrior.vx=18;warrior.step=1.1;
    G.gags.push({type:"policeman",x:W*.42,y:G.GY-1,vx:0,dir:1,life:999,phase:1.35,exitPad:110,panicAt:.4,panicked:false,whistle:.62});
    render();
    var scale=policemanUnitScale(),soldierScale=getUnitDrawSize()/22;
    return {scale:scale,expected:soldierScale,policeHeight:44*scale,soldierHeight:42*soldierScale,unitSize:getUnitDrawSize()};
  },
  fixedStepAudit: function(){
    load(0);G.tutorialMode=true;G.gagShown=true;G.simAcc=0;
    var before=G.T,steps=advanceSimulation(.05);
    return {steps:steps,time:G.T-before,acc:G.simAcc};
  },
  sweptHitAudit: function(){
    load(3);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];
    var target=this.addUnit("warrior",false,W*.54),before=target.hp;
    target.vx=0;G.over=true;
    G.projs.push({x:target.x-90,y:target.y-22,vx:1800,vy:0,atk:17,atkC:0,isP:true,life:1,spl:0,grav:0,type:"spearman",trail:[]});
    tick(.1);
    return {damage:before-target.hp,remaining:G.projs.length,targetState:target.state};
  },
  levelScene: function(i){load(i);G.T=9.25;render();},
  fishermanScene: function(t){
    G=null;if(ACTIVE_ERA_ID!=="medieval")switchEra("medieval",false);load(0);G.units=[];G.projs=[];G.gags=[];G.T=t;
    var raw=Math.max(0,Math.min(1,(t-10.65)/.8)),duck=raw*raw*(3-2*raw),scale=policemanUnitScale()*.72;
    var donjonH=G.p.h*.45,donjonY=G.GY-G.p.h-donjonH,x=G.p.x+G.p.w*.59,sillY=donjonY+donjonH*.73;
    render();return {visible:duck<.985,scale:scale,soldierScale:policemanUnitScale(),ratio:scale/policemanUnitScale(),x:x,y:sillY,castleTop:G.GY-G.p.h,donjonY:donjonY,ground:G.GY,duck:duck};
  },
  setGag: function(type,dir){
    var spec=GAG_MOTION[type],pad=spec.pad;
    G.gags=[{type:type,x:dir>0?-pad:W+pad,y:spec.sky?H*.28:G.GY-1,vx:dir*60,dir:dir,life:999,phase:0,exitPad:pad,panicAt:.4,panicked:false,whistle:0}];
  },
  updateGags: function(dt){updateAbsurdGags(dt);return G.gags.length;},
  levelGag: function(level){var old=Math.random;Math.random=function(){return 0;};load(level-1);G.gagShown=false;G.gags=[];spawnAbsurdGag();var type=G.gags[0]&&G.gags[0].type;Math.random=old;return type;},
  repeatGag: function(){var before=G.gags.length;G.gags=[];return {before:before,spawned:spawnAbsurdGag(),after:G.gags.length};},
  cast: function(name){G.p.gold=9999;LI=Math.max(LI,5);castAbility(name);return {projs:G.projs.length,freeze:G.freezeField,arrowFx:!!G.arrowRainFx,freezeBurst:!!G.freezeBurst,rallyFx:!!G.rallyFx};},
  audioAudit: function(){
    SFX_LAST={};AUDIO_VOICES=[];initAudio();SFX.bow();SFX.crossbow();SFX.spear();SFX.musket();SFX.cannon();SFX.arrowRain();SFX.freeze();SFX.rally();SFX.bossIntro("moon");SFX.bossPhase("demon",3);
    return {enabled:SFX_ON,master:AUDIO_SETTINGS.master,motifs:AUDIO_SETTINGS.motifs,keys:["bow","crossbow","spear","musket","cannon","arrowRain","freeze","rally","bossIntro","bossPhase"].filter(function(k){return typeof SFX[k]==="function";}),started:AC&&AC.starts||0};
  },
  levelOneAudit: function(){
    G=null;if(ACTIVE_ERA_ID!=="medieval")switchEra("medieval",false);load(0);
    return {trees:G.trees.length,treeCap:G.lv.treeCap,pH:G.lv.pH,eH:G.lv.eH,goldMul:G.lv.gm,aiDelay:G.lv.ad,unitCap:G.lv.unitCap,passiveP:G.lv.passiveP,treeRespawn:G.lv.treeRespawn};
  },
  castleHealthAudit: function(){
    G=null;if(ACTIVE_ERA_ID!=="medieval")switchEra("medieval",false);load(0);
    var c=G.e,before=castleHealthView(c);castleDmg(c,137,c.x+c.w*.4,G.GY-c.h*.42,{isP:true,key:"warrior",ud:UD.warrior});var after=castleHealthView(c);render();
    return {before:before,after:after,actual:c.hp,max:c.max};
  },
  unlockEraTwo: function(){
    var med=ensureCampaignEra("medieval");for(var i=0;i<MEDIEVAL_LEVELS.length;i++)med.completed[String(MEDIEVAL_LEVELS[i].id)]=true;
    updateEraUnlocked("medieval");G=null;var unlocked=isEraUnlocked("early-modern"),switched=switchEra("early-modern",false);
    return {unlocked:unlocked,switched:switched,era:ACTIVE_ERA_ID,levels:LV.length,max:MAX_UNLOCKED,completed:eraCompletedCount("medieval")};
  },
  earlyModernUnitAudit: function(){
    G=null;if(ACTIVE_ERA_ID!=="early-modern")switchEra("early-modern",false);load(2);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;
    var pike=this.addUnit("pikeguard",true,W*.35),knight=this.addUnit("knight",false,pike.x+30),pikeBefore=knight.hp;pike.state="fight";pike.tgt=knight;pike.acd=0;doFight(pike,0);
    G.units=[];G.projs=[];var musket=this.addUnit("musketeer",true,W*.34),guard=this.addUnit("pikeguard",false,W*.54);musket.state="fight";musket.tgt=guard;musket.acd=0;doFight(musket,0);var musketShot=G.projs[0];
    G.units=[];G.projs=[];var sapper=this.addUnit("sapper",true,W*.40),gun=this.addUnit("mortar",false,W*.40+24),gunBefore=gun.hp;sapper.state="fight";sapper.tgt=gun;sapper.acd=0;doFight(sapper,0);
    G.units=[];G.projs=[];var mortar=this.addUnit("mortar",true);mortar.acd=0;doCannon(mortar,0);var mortarShot=G.projs[0];
    return {pikeDamage:pikeBefore-knight.hp,musketType:musketShot&&musketShot.type,musketSpeed:musketShot&&Math.sqrt(musketShot.vx*musketShot.vx+musketShot.vy*musketShot.vy),sapperDamage:gunBefore-gun.hp,mortarType:mortarShot&&mortarShot.type,mortarArc:mortarShot&&mortarShot.arcHeight,catalog:UK.length};
  },
  earlyModernScene: function(levelIndex){
    G=null;if(ACTIVE_ERA_ID!=="early-modern")switchEra("early-modern",false);load(levelIndex||0);G.T=9.4;G.units=[];G.projs=[];G.gags=[];G.p.gold=9999;
    var keys=["pikeguard","musketeer","sapper","mortar"];for(var i=0;i<keys.length;i++){var u=this.addUnit(keys[i],true,W*(.35+i*.105));if(keys[i]==="musketeer")u.musketFlash=.18;if(keys[i]==="pikeguard"||keys[i]==="sapper")u.atkPhase=.62;}
    render();return {era:G.eraId,level:G.lv.id,units:G.units.map(function(u){return u.key;}),rocks:G.rocks.length,scene:(SC[G.lv.sc]||{}).earlyModern===true,castleStyle:G.eraPack.castleStyle,standalone:render.toString().indexOf('if(G.eraId==="early-modern")')>=0};
  },
  earlyModernGagAudit: function(){
    G=null;if(ACTIVE_ERA_ID!=="early-modern")switchEra("early-modern",false);var old=Math.random;Math.random=function(){return 0;};var types=[];
    for(var i=0;i<LV.length;i++){load(i);G.gagShown=false;G.gags=[];spawnAbsurdGag();types.push(G.gags[0]&&G.gags[0].type);}Math.random=old;return types;
  },
  restoreMedieval: function(){G=null;var ok=switchEra("medieval",false);return {ok:ok,era:ACTIVE_ERA_ID,levels:LV.length};},
  campaignAudit: function(){
    delete CAMPAIGN_STATE.completed[String(LV[2].id)];var before=CAMPAIGN_STATE.upgradePoints,reward1=recordCampaignWin(2,125),reward2=recordCampaignWin(2,140);
    initUpgrades();buildLevelSelect();
    return {era:CAMPAIGN_STATE.eraId,points:CAMPAIGN_STATE.upgradePoints,before:before,reward1:reward1,reward2:reward2,done:campaignCompletedCount(),mapPoints:ACTIVE_ERA_PACK.campaign.mapPoints.length,upgPoints:UPTS,stored:!!localStorage.getItem("castleCalamityCampaignV2")};
  }
  ,deckAudit: function(){
    var rows=LV.map(function(lv){return {id:lv.id,player:lv.ul.slice(),enemy:lv.ai.slice(),recommended:(lv.recommended||[]).slice(),briefing:lv.briefing||null};});
    return {max:MAX_BATTLE_CARDS,rows:rows,largest:Math.max.apply(null,rows.map(function(r){return Math.max(r.player.length,r.enemy.length);})),demon:rows[11]};
  }
  ,briefingAudit: function(){
    var continued=false,units=document.getElementById("briefingUnits");
    if(units.children)units.children.length=0; // stub QA nie implementuje setter innerHTML
    showLevelBriefing(11,function(){continued=true;});
    return {display:document.getElementById("briefing").style.display,title:document.getElementById("briefingTitle").textContent,body:document.getElementById("briefingBody").textContent,units:units.children.length,continued:continued};
  }
  ,formationAudit: function(){
    load(6);G.tutorialMode=true;G.gagShown=true;G.units=[];G.p.gold=9999;
    var back=this.addUnit("warrior",true,W*.42),front=this.addUnit("warrior",true,W*.42+4);
    back.state="march";front.state="march";back.vx=34;front.vx=34;
    resolveFriendlyFormation();
    return {gap:front.x-back.x,min:10*combatScale(),backVx:back.vx,frontX:front.x,backX:back.x};
  }
  ,battleIntelAudit: function(){
    load(6);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;
    var fighter=this.addUnit("warrior",true,W*.43),enemy=this.addUnit("warrior",false,W*.55);
    dmgUnit(enemy,42,fighter);castleDmg(G.e,55,G.e.x+G.e.w*.4,G.GY-G.e.h*.45,fighter);
    var worker=this.addUnit("drwal",true,W*.34);addMetricValue(worker,"gold",36);
    var mason=this.addUnit("mason",true,W*.38);addMetricValue(mason,"stoneLoads",1);
    var enemyMonk=this.addUnit("monk",false,W*.61);addMetricValue(enemyMonk,"healing",999);
    var rows=finalizeBattleIntel(6,false),smart=smartRecommendations(6),report=document.getElementById("unitReport");
    if(report.children)report.children.length=0;renderUnitReport(rows);
    var cards=report.children&&report.children[1]&&report.children[1].children?report.children[1].children.length:0;
    return {top:rows[0]&&rows[0].key,damage:rows[0]&&rows[0].damage,castle:rows[0]&&rows[0].castleDamage,enemySupportIgnored:!G.stats.unitMetrics.monk,smart:smart.slice(),cards:cards,stored:!!localStorage.getItem(BATTLE_INTEL_KEY)};
  }
  ,supportBlockAudit: function(){
    load(9);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;
    var wizard=this.addUnit("wizard",true,W*.37),worker=this.addUnit("drwal",false,W*.49),workerHp=worker.hp;
    wizard.state="fight";wizard.tgt=worker;wizard.acd=0;worker.state="gather";worker.vx=0;worker.ttgt={x:worker.x,w:100};
    doFight(wizard,0);G.over=true;for(var pi=0;pi<80&&G.projs.length;pi++)tick(.025);
    var wizardHit=workerHp-worker.hp,workerDead=worker.state==="dead";

    load(9);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;
    wizard=this.addUnit("wizard",true,W*.36);worker=this.addUnit("drwal",false,W*.42);
    var combat=this.addUnit("warrior",false,W*.48),picked=findFoe(wizard,260*combatScale());

    load(9);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;
    var golem=this.addUnit("golem",true,W*.39),backWizard=this.addUnit("wizard",true,W*.35),backWarrior=this.addUnit("warrior",true,W*.31),blockers=[];
    for(var bi=0;bi<2;bi++){var blocker=this.addUnit("drwal",false,W*(.44+bi*.035));blocker.state="gather";blocker.vx=0;blocker.ttgt={x:blocker.x,w:100};blockers.push(blocker);}
    golem.state="fight";golem.tgt=blockers[0];golem.acd=0;doFight(golem,0);var beforeX=golem.x;
    for(var ti=0;ti<480;ti++)tick(.025);
    var supportAlive=G.units.filter(function(u){return !u.isP&&u.ud.worker&&u.state!=="dead";}).length;
    return {wizardHit:wizardHit,workerDead:workerDead,priority:picked&&picked.key,blockerDead:blockers[0].state==="dead",supportAlive:supportAlive,frontMoved:golem.x>beforeX+30,backCount:[backWizard,backWarrior].filter(function(u){return u.state!=="dead";}).length};
  }
  ,unitRulesAudit: function(){
    var fighters=UK.filter(function(k){return !UD[k].worker&&!UD[k].mason&&!UD[k].cannon;}),attacks={};
    for(var fi=0;fi<fighters.length;fi++){
      load(6);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;
      var key=fighters[fi],a=this.addUnit(key,true,W*.44),target=this.addUnit("warrior",false,W*.44+Math.min(42,Math.max(22,uRange(a)*.72))),before=target.hp;
      a.state="fight";a.tgt=target;a.acd=0;doFight(a,0);attacks[key]={direct:target.hp<before,projectile:G.projs.length>0,finite:isFinite(a.hp)&&isFinite(a.x)};
    }
    load(6);G.units=[];G.projs=[];G.p.gold=9999;spawnUnit("cannon",true);var cannon=G.units[0];cannon.acd=0;doCannon(cannon,0);var cannonProjectile=G.projs.length===1&&G.projs[0].type==="cannon";
    G.units=[];G.projs=[];spawnUnit("mortar",true);var mortar=G.units[0];mortar.acd=0;doCannon(mortar,0);var mortarProjectile=G.projs.length===1&&G.projs[0].type==="mortar";
    var valid=UK.every(function(k){var u=UD[k];return u&&u.c>0&&u.h>0&&isFinite(u.a)&&isFinite(u.ac)&&isFinite(u.s)&&isFinite(u.r);});
    var counterRefs=true;for(var ak in UNIT_COUNTERS)for(var tk in UNIT_COUNTERS[ak])if(!UD[ak]||!UD[tk]||UNIT_COUNTERS[ak][tk]<=1)counterRefs=false;
    return {catalog:UK.length,unique:(new Set(UK)).size,valid:valid,allAttack:fighters.every(function(k){return attacks[k].finite&&(attacks[k].direct||attacks[k].projectile);}),attacks:attacks,cannonProjectile:cannonProjectile,mortarProjectile:mortarProjectile,worker:UD.drwal.worker===true,mason:UD.mason.mason===true&&UD.mason.trips===3,healer:UD.monk.heal===true,counters:counterRefs,bossesOutside:UK.indexOf("moonlord")<0&&UK.indexOf("demonking")<0};
  }
  ,castleSiegeAudit: function(){
    var fighters=UK.filter(function(k){return !UD[k].worker&&!UD[k].mason&&!UD[k].cannon;}),results={};
    for(var fi=0;fi<fighters.length;fi++){
      load(6);G.tutorialMode=true;G.gagShown=true;G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;
      var key=fighters[fi],u=this.addUnit(key,true,G.e.x-20*combatScale()),before=G.e.hp;
      u.state="march";u.acd=0;doMarch(u,.02);
      var entered=u.state==="dead",after=G.e.hp;
      strikeCastleOnce(u);
      results[key]={entered:entered,alive:u.state!=="dead",damage:before-G.e.hp,once:after===G.e.hp};
    }
    load(6);G.units=[];G.p.gold=9999;var wizard=this.addUnit("wizard",true,G.e.x-170*combatScale());doMarch(wizard,.02);
    return {results:results,allPersist:fighters.every(function(k){return results[k].entered&&!results[k].alive&&results[k].damage>0&&results[k].once;}),wizard:results.wizard,count:fighters.length,walksToGate:wizard.state!=="dead"};
  }
  ,futureEra: function(id,idx){
    var pack=ERA_REGISTRY.packs[id],previous=pack.unlockAfter.eraId;
    var locked=!isEraUnlocked(id);
    ERA_LEVELS[previous].forEach(function(l){ensureCampaignEra(previous).completed[String(l.id)]=true;});
    G=null;var switched=switchEra(id,false);load(idx||0);G.gagShown=true;
    return {switched:switched,locked:locked,levels:LV.length,deck:G.lv.ul.length,abilities:Object.keys(ABILITIES).every(function(k){return isAbilityUnlocked(ABILITIES[k]);}),name:G.lv.n,style:pack.castleStyle};
  }
  ,futureScene: function(id,idx){
    this.futureEra(id,idx);G.units=[];G.p.gold=9999;G.e.gold=9999;G.T=12;
    var keys=Object.keys(FUTURE.units).filter(function(k){return !!UD[k].electric===(id==="electric");});
    for(var i=0;i<keys.length;i++){var u=this.addUnit(keys[i],true,W*(.32+i*.12));u.atkPhase=.85;}
    render();return keys;
  }
  ,futureWeapons: function(){
    this.futureEra("electric",3);G.units=[];G.projs=[];G.p.gold=9999;G.e.gold=9999;G.tutorialMode=true;
    var medic=this.addUnit("fieldmedic",true,W*.4),ally=this.addUnit("voltguard",true,W*.4+20);ally.hp-=50;var hp=ally.hp;tick(.02);var heals=ally.hp>hp;
    var gun=this.addUnit("coilgun",true);gun.acd=0;doCannon(gun,0);var shoots=G.projs.length>0;
    G.projs=[];var pulse=this.addUnit("pulser",true,W*.4);fireRangedShot(pulse,W*.6,G.GY-22,1);
    return {heals:heals,shoots:shoots,electric:G.projs[0].electric===true};
  }
  ,gateQueue: function(){
    G=null;switchEra("medieval",false);load(6);G.units=[];G.p.gold=99999;G.e.gold=99999;G.gagShown=true;
    var all=[];for(var i=0;i<12;i++)all.push(this.addUnit("warrior",true,G.e.x-15*combatScale()));
    for(var j=0;j<all.length;j++)doMarch(all[j],.02);
    var enemy=this.addUnit("wizard",false,G.p.x+G.p.w+15*combatScale()),before=G.p.hp;doMarch(enemy,.02);
    return {cleared:all.every(function(u){return u.state==="dead";}),enemy:enemy.state==="dead"&&G.p.hp<before};
  }
  ,eraTransition: function(id){
    this.futureEra(id,3);for(var i=0;i<LV.length;i++)ensureCampaignEra(id).completed[String(LV[i].id)]=true;
    showEnd(true);var label=document.getElementById("eb1").textContent;
    document.getElementById("eb1").onclick();return {era:ACTIVE_ERA_ID,label:label};
  }
  ,audioBudget: function(){
    initAudio();AUDIO_VOICES=[];var start=AC.starts;
    for(var i=0;i<100;i++)tone(220,.2,"sine",.01);
    var bounded=AC.starts-start===48;AC.currentTime+=1;tone(220,.2,"sine",.01);
    return {bounded:bounded,recovered:AUDIO_VOICES.length===1,compressor:!!AUDIO_LIMITER};
  }
  ,castleEvolutionScene: function(idx){
    load(idx);G.T=8.4;G.units=[];G.projs=[];G.gags=[];render();
    var id=G.lv.id;return {id:id,tier:id>=11?2:(id>=7?1:0),cameo:id===7?"laundry":(id===9?"kettle":(id===11?"sleepyGuard":null))};
  }
  ,performanceAudit: function(){
    PERF.low=false;PERF.adaptive=false;PERF.dprCap=2;PERF.targetFrameMs=0;
    enableLeanMode("qa");window.devicePixelRatio=3;rsz(true);load(4);
    for(var i=0;i<90;i++)G.dust.push({x:W*.5,y:100,vx:0,vy:0,life:1,sz:2});
    tick(.016);
    var n1=getNoiseBuffer(),n2=getNoiseBuffer();
    return {low:PERF.low,adaptive:PERF.adaptive,dpr:DPR,frameMs:PERF.targetFrameMs,clouds:G.clouds.length,dust:G.dust.length,noiseReused:n1===n2,mode:G.performanceMode};
  }
  ,setLang: function(lang){applyLanguage(lang,true);return {lang:LANG,stored:localStorage.getItem("castleCalamityLanguage"),play:document.getElementById("pb").textContent,warrior:UD.warrior.n,level1:LV[0].n};}
  ,tutorialStart: function(){TUTORIAL.forceNext=true;load(0);return {active:TUTORIAL.active,step:TUTORIAL.step,aiFrozen:G.tutorialMode};}
  ,tutorialNext: function(){tutorialAdvance();return {active:TUTORIAL.active,step:TUTORIAL.step};}
  ,tutorialSpawn: function(key){G.p.gold=9999;var before=G.units.length;spawnUnit(key,true);return {active:TUTORIAL.active,step:TUTORIAL.step,spawned:G.units.length-before};}
  ,tutorialInfo: function(){return {text:document.getElementById("tutorialText").textContent,next:document.getElementById("tutorialNext").textContent,skip:document.getElementById("tutorialSkip").textContent};}
  ,tutorialStop: function(){stopTutorial(true);}
  ,endScene: function(won){G.stats.kills=7;G.stats.losses=2;G.stats.goldEarned=123;showEnd(won);return {title:document.getElementById("et").textContent,body:document.getElementById("em").textContent,stats:document.getElementById("stats").innerHTML};}
  ,spawnBossForQA: function(idx){load(idx);G.tutorialMode=true;G.gagShown=true;for(var i=0;i<90&&!G.boss.spawned;i++)tick(.1);return G.boss&&G.boss.unit;}
  ,bossScene: function(idx,phase){
    var u=this.spawnBossForQA(idx);if(!u)return null;
    u.hp=u.max*(phase===1?.82:(phase===2?.50:.20));updateBossEncounter(.02);
    if(u.ud.bossKind==="demon"){G.boss.portalT=0;updateBossEncounter(.05);}
    else if(phase===2){G.boss.cast={type:"charge",t:.42,max:1.05};u.bossCasting="charge";}
    render();return {key:u.key,phase:u.bossPhase,hp:u.hp,max:u.max,portals:G.bossPortals.length,tea:u.bossTea||0};
  }
  ,bossAudit: function(){
    var oldRandom=Math.random;Math.random=function(){return .5;};
    var moon=this.spawnBossForQA(9);moon.hp=moon.max*.2;updateBossEncounter(.02);
    var moonGold=G.p.gold;kill(moon);updateBossEncounter(.02);
    var moonResult={key:moon.key,phase:moon.bossPhase,tea:moon.bossTea>0,bounty:moon.ud.bounty,reward:G.p.gold-moonGold,bossKey:LV[9].bossKey};
    var demon=this.spawnBossForQA(11);demon.hp=demon.max*.2;updateBossEncounter(.02);
    var target=this.addUnit("warrior",true,demon.x-110);demon.state="fight";demon.tgt=target;demon.acd=0;G.projs=[];doFight(demon,0);
    G.boss.portalT=0;updateBossEncounter(.05);
    var before=G.bossPortals.length;updateBossPortals(2);
    var demonShots=G.projs.filter(function(p){return p.type==="demonfire";}).length,summonCount=countBossSummons();
    G.units=[demon];G.projs=[];demon.x=G.p.x+G.p.w+5;demon.state="march";demon.tgt=null;demon.acd=0;var castleHp=G.p.hp;doMarch(demon,.05);for(var ti=0;ti<24&&G.p.hp===castleHp;ti++)tick(.05);
    var demonResult={key:demon.key,phase:demon.bossPhase,shots:demonShots,portalTelegraph:before,summons:summonCount,castleAttack:G.p.hp<castleHp,aliveAtCastle:demon.state!=="dead",bossKey:LV[11].bossKey};
    Math.random=oldRandom;return {moon:moonResult,demon:demonResult};
  }
};
`;
const gameSource = main.slice(0, end) + qaHooks + main.slice(end);

function classList() {
  const values=new Set();
  return {
    add(...names) { names.forEach((name)=>values.add(name)); },
    remove(...names) { names.forEach((name)=>values.delete(name)); },
    toggle(name,force) { if(force===true){values.add(name);return true;}if(force===false){values.delete(name);return false;}if(values.has(name)){values.delete(name);return false;}values.add(name);return true; },
    contains(name) { return values.has(name); }
  };
}

function makeElement(tag = "div") {
  const el = {
    tagName: tag.toUpperCase(), style: {}, classList: classList(), dataset: {}, children: [],
    innerHTML: "", textContent: "", value: "", files: [], width: 60, height: 60,
    appendChild(ch) { this.children.push(ch); if(ch&&ch.id&&typeof elements!=="undefined")elements.set(ch.id,ch); return ch; },
    removeChild(ch) { this.children = this.children.filter((x) => x !== ch); },
    addEventListener() {}, removeEventListener() {}, click() {}, focus() {}, remove() { if(this.id&&typeof elements!=="undefined")elements.delete(this.id); },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k]; },
    querySelector() { return makeElement("div"); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { width: sandbox.window.innerWidth, height: sandbox.window.innerHeight, left: 0, top: 0 }; }
  };
  return el;
}

function decorateCanvas(c) {
  c.style = {};
  c.classList = classList();
  c.dataset = {};
  c.children = [];
  c.addEventListener = () => {};
  c.removeEventListener = () => {};
  c.appendChild = (ch) => { c.children.push(ch); return ch; };
  c.getBoundingClientRect = () => ({ width: sandbox.window.innerWidth, height: sandbox.window.innerHeight, left: 0, top: 0 });
  return c;
}

function audioParam(value = 0) {
  return {
    value,
    setValueAtTime(v) { this.value = v; },
    exponentialRampToValueAtTime(v) { this.value = v; },
    cancelScheduledValues() {},
    setTargetAtTime(v) { this.value = v; }
  };
}
function audioNode() { return { connect() { return this; } }; }
function FakeAudioContext() {
  this.currentTime = 0; this.sampleRate = 44100; this.state = "running"; this.destination = audioNode(); this.starts = 0;
}
FakeAudioContext.prototype.createGain = function(){ const n=audioNode();n.gain=audioParam(1);return n; };
FakeAudioContext.prototype.createDynamicsCompressor = function(){ const n=audioNode();for(const k of ["threshold","knee","ratio","attack","release"])n[k]=audioParam(0);return n; };
FakeAudioContext.prototype.createOscillator = function(){ const n=audioNode();n.type="sine";n.frequency=audioParam(440);n.start=()=>{this.starts++;};n.stop=()=>{};return n; };
FakeAudioContext.prototype.createBufferSource = function(){ const n=audioNode();n.playbackRate=audioParam(1);n.start=()=>{this.starts++;};return n; };
FakeAudioContext.prototype.createBiquadFilter = function(){ const n=audioNode();n.frequency=audioParam(1000);return n; };
FakeAudioContext.prototype.createStereoPanner = function(){ const n=audioNode();n.pan=audioParam(0);return n; };
FakeAudioContext.prototype.createBuffer = function(channels,length){ return { getChannelData(){ return new Float32Array(length); } }; };
FakeAudioContext.prototype.decodeAudioData = function(buffer,ok){ if(ok)ok({}); };
FakeAudioContext.prototype.resume = function(){ this.state="running"; };

const canvas = decorateCanvas(createCanvas(1280, 720));
const elements = new Map();
elements.set("cv", canvas);
elements.set("crestPreviewP", decorateCanvas(createCanvas(60, 60)));
elements.set("crestPreviewE", decorateCanvas(createCanvas(60, 60)));

const document = {
  readyState: "complete",
  documentElement: { clientWidth: 1280, clientHeight: 720 },
  body: makeElement("body"),
  getElementById(id) { if (!elements.has(id)) elements.set(id, makeElement("div")); return elements.get(id); },
  createElement(tag) { return tag.toLowerCase() === "canvas" ? decorateCanvas(createCanvas(60, 60)) : makeElement(tag); },
  addEventListener() {}, removeEventListener() {}, querySelectorAll() { return []; }, querySelector() { return null; }
};

let nowMs = 100000;
const sandbox = {
  console, Math, Date, JSON, Number, String, Boolean, Array, Object, RegExp,
  parseInt, parseFloat, isFinite, isNaN, Uint8Array, ArrayBuffer,
  document, Image,
  FileReader: function FileReader() {},
  location: { search: "", href: "http://localhost/" },
  navigator: {},
  performance: { now: () => nowMs },
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  setInterval: () => 1, clearInterval: () => {},
  setTimeout: (fn) => { if (typeof fn === "function") fn(); return 1; }, clearTimeout: () => {},
  ResizeObserver: function ResizeObserver() { this.observe = () => {}; },
  AudioContext: FakeAudioContext,
  webkitAudioContext: FakeAudioContext,
  localStorage: (() => { const data=new Map(); return { getItem(k) { return data.has(k)?data.get(k):null; }, setItem(k,v) { data.set(k,String(v)); }, removeItem(k) { data.delete(k); } }; })(),
  atob: (s) => Buffer.from(s, "base64").toString("binary"),
  btoa: (s) => Buffer.from(s, "binary").toString("base64")
};
sandbox.window = sandbox;
sandbox.window.innerWidth = 1280;
sandbox.window.innerHeight = 720;
sandbox.window.devicePixelRatio = 1;
sandbox.window.visualViewport = { width: 1280, height: 720, addEventListener() {} };
sandbox.window.addEventListener = () => {};
sandbox.window.removeEventListener = () => {};
sandbox.window.CASTLE_CONTENT = undefined;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(inline[0], sandbox, { filename: "audio-vars.js" });
vm.runInContext(fs.readFileSync(path.join(root, "content", "gags.js"), "utf8"), sandbox, { filename: "gags.js" });
vm.runInContext(fs.readFileSync(path.join(root, "content", "i18n.js"), "utf8"), sandbox, { filename: "i18n.js" });
vm.runInContext(fs.readFileSync(path.join(root, "content", "eras.js"), "utf8"), sandbox, { filename: "eras.js" });
vm.runInContext(fs.readFileSync(path.join(root, "content", "future-eras-v72.js"), "utf8"), sandbox, { filename: "future-eras-v72.js" });
vm.runInContext(gameSource, sandbox, { filename: "game.js" });

const qa = sandbox.window.__QA;
function save(name) { fs.writeFileSync(path.join(outDir, name), canvas.toBuffer("image/png")); }
function check(ok, msg) { if (!ok) throw new Error(msg); console.log("OK", msg); }
function approx(a, b, eps = 0.001) { return Math.abs(a - b) <= eps; }

qa.viewport(1280, 720, 1); qa.load(4);
let st = qa.state();
const iphoneCases=[
  {name:"iphone-se",w:667,h:375,safe:{top:0,right:0,bottom:21,left:44},offsetTop:0},
  {name:"iphone-14",w:844,h:390,safe:{top:0,right:47,bottom:21,left:47},offsetTop:0},
  {name:"iphone-15-pro-max",w:932,h:430,safe:{top:0,right:59,bottom:21,left:59},offsetTop:0},
  {name:"iphone-safari-toolbar",w:852,h:286,safe:{top:0,right:59,bottom:21,left:59},offsetTop:44}
];
for(const phone of iphoneCases){
  const vp=qa.viewport(phone.w,phone.h,3,phone.safe,0,phone.offsetTop);
  check(vp.W===phone.w-phone.safe.left-phone.safe.right&&vp.H===phone.h-phone.safe.top-phone.safe.bottom,`${phone.name}: canvas mieści się w widocznym bezpiecznym obszarze`);
  check(vp.canvasLeft===phone.safe.left&&vp.canvasTop===phone.safe.top&&vp.view.top===phone.offsetTop,`${phone.name}: notch, pasek Safari i offset viewportu nie obcinają pola gry`);
  qa.load(0);qa.render();save(`viewport-${phone.name}.png`);
}
qa.viewport(1280,720,1);qa.load(4);st=qa.state();
const levelOne=qa.levelOneAudit();
check(levelOne.trees===3&&levelOne.treeCap===3,"poziom 1 startuje i odrasta z najwyżej trzema drzewami");
check(levelOne.pH===950&&levelOne.eH===950&&levelOne.goldMul===1&&levelOne.aiDelay===9000&&levelOne.unitCap===8&&levelOne.passiveP===1.05&&levelOne.treeRespawn===28,"poziom 1 ma krótsze mury, najwyżej 8 kart talii i spokojniejszą ekonomię");
const fishermanDesktop=qa.fishermanScene(9.25);save("fisherman-castle-desktop.png");
check(fishermanDesktop.visible&&approx(fishermanDesktop.ratio,.72,.0001)&&fishermanDesktop.y<fishermanDesktop.castleTop,"wędkarz jest małą półpostacią osadzoną w centralnej wieży zamiast stać przed murem");
const fishermanDuck=qa.fishermanScene(11.05);save("fisherman-duck-desktop.png");
check(fishermanDuck.duck>0&&fishermanDuck.duck<1,"wędkarz ma pośrednią klatkę pionowego chowania się w wieży");
const fishermanGone=qa.fishermanScene(11.6);
check(!fishermanGone.visible&&fishermanGone.duck===1,"wędkarz podciąga but i całkowicie chowa się w wieży bez zanikania");
check(main.includes('CT.rect(openingL+1,openingT+1,openingW-2,openingH-1);CT.clip()')&&!main.includes('fishLeave'),"wnęka przycina dolną połowę postaci, a stary boczny odjazd został usunięty");
check(main.includes('cc&&cc.textContent!==costText')&&!main.includes('classList.toggle("off"')&&html.includes('.cd.unitUnavailable canvas{opacity:.38;}'),"HUD zachowuje stałą geometrię kart i używa spokojnej nakładki bez filtrów Safari");
const cardAvailability=qa.cardAvailabilityAudit();
check(!cardAvailability.initial.blocked&&cardAvailability.initial.aria==="false"&&!cardAvailability.initial.badge,"kafelek Drwala jest dostępny przed osiągnięciem limitu");
check(cardAvailability.limited.blocked&&cardAvailability.limited.aria==="true"&&cardAvailability.limited.reason==="workerLimit"&&cardAvailability.limited.badge.indexOf("2/2")>=0,"po dwóch Drwalach kafelek pokazuje stabilną blokadę 2/2");
check(!cardAvailability.released.blocked&&cardAvailability.released.aria==="false"&&!cardAvailability.released.badge,"po utracie Drwala kafelek automatycznie wraca do stanu dostępnego");
check(!/\.cd:hover\s*\{[^}]*transform/.test(html)&&!/\.cd:active\s*\{[^}]*scale/.test(html),"karty jednostek nie przesuwają się ani nie skalują podczas dotyku i hover");
check(!/\.cd\.off\{/.test(html)&&!/\.cd\{[^}]*transition:opacity/.test(html),"brak zasobów nie przygasza ani nie animuje całego kafelka jednostki");
const faceCutout=qa.faceCutoutAudit();save("face-cutout-local.png");
check(faceCutout.width===192&&faceCutout.height===192&&faceCutout.cornerAlpha===0&&faceCutout.centerAlpha===255,"lokalne wyszparowanie zapisuje twarz jako przezroczysty PNG 192×192");
check(faceCutout.edgeAlpha<faceCutout.centerAlpha&&faceCutout.skinFound,"miękka maska usuwa tło, a tryb zapasowy lokalizuje obszar twarzy bez usługi sieciowej");
check(faceCutout.centerRGB.join(",")==="196,126,96","środek twarzy zachowuje dokładne kolory źródłowego zdjęcia");
check(main.includes('typeof FaceDetector!=="function"')&&main.includes('toDataURL("image/png")')&&main.includes('globalCompositeOperation="destination-in"'),"wykrywanie twarzy ma natywną ścieżkę i przezroczystą lokalną maskę");
check(!main.includes('Math.round(channel / 44)')&&!main.includes('toDataURL("image/jpeg", 0.85)'),"zdjęcie twarzy nie dostaje filtra cartoon ani spłaszczającego tło JPEG");
check((main.match(/drawCrestImageContained\(CT/g)||[]).length>=3,"twarz zachowuje proporcje na tarczy, bannerze i chorągwi");
const fullscreenAudit=qa.fullscreenAudit();
check(fullscreenAudit.requestCalls===1&&fullscreenAudit.exitCalls===1,"przycisk przełącza wejście i wyjście z pełnego ekranu przez natywne API");
check(fullscreenAudit.helpCalls===1&&fullscreenAudit.activePressed==="true"&&/PEŁNY EKRAN/.test(fullscreenAudit.activeLabel),"iPhone bez Fullscreen API dostaje instrukcję uruchomienia PWA zamiast martwego przycisku");
check(html.includes("#appViewport:fullscreen")&&html.includes('id="btnFullscreen"')&&html.includes('id="fullscreenMenuBtn"'),"pełny ekran zachowuje osobny przycisk w menu i podczas bitwy");
const abilityVisibility=qa.abilityVisibilityAudit();
check(abilityVisibility.medieval.map(function(r){return r.count;}).join(",")==="0,0,1,2,3","zdolności pojawiają się kolejno na poziomach 3, 4 i 5 bez przedwczesnego odblokowania");
check(abilityVisibility.eraTwo.count===3&&abilityVisibility.eraTwo.level>12&&abilityVisibility.eraTwo.canCast,"Deszcz Strzał, Zew Bitwy i Mróz pozostają dostępne od pierwszej bitwy Epoki II");
check(abilityVisibility.fullscreenClass&&html.includes("#appViewport.fullscreenMode #abBar"),"pełny ekran telefonu włącza bezpieczny dok zdolności nad dolną strefą systemową");
check(html.includes('bottom:calc(max(6px,env(safe-area-inset-bottom)) + 28px)'),"dok zdolności jest obniżony o 18 px i nadal uwzględnia bezpieczną strefę iPhone’a");
const balanceAudit=qa.balanceAudit();
const allBalanceRows=balanceAudit.medieval.concat(balanceAudit.earlyModern);
check(allBalanceRows.every(function(r){return r.treeCap<=4;}),"wszystkie poziomy zachowują najwyżej 4 drzewa, a limit 8 dotyczy kart talii, nie żywej armii");
check(Math.max.apply(null,balanceAudit.medieval.map(function(r){return r.eH;}))===4300&&Math.max.apply(null,balanceAudit.medieval.map(function(r){return r.gm;}))===1.42,"mury i nagrody drzew kampanii są obniżone, aby późne bitwy nie puchły");
const healthAudit=qa.castleHealthAudit();
check(healthAudit.before.text==="950 / 950"&&healthAudit.after.text==="813 / 950"&&healthAudit.after.current===Math.floor(healthAudit.actual),"liczba HP pod zamkiem zmienia się razem z rzeczywistym stanem");
check(approx(healthAudit.after.pct,813/950,.00001),"pasek i wartość liczbowa HP korzystają z tego samego odczytu");
check(st.archerRange === 170, "zasięg łucznika = 170");
check(st.spearmanRange === 175 && st.spearmanRange >= st.archerRange, "zasięg oszczepnika = 175 i nie jest mniejszy od łucznika");
check(st.wizardRange === 180, "zasięg czarownika = 180");
check(st.unitSize === 46, "skala postaci desktop = 46 px");
check(st.nextMin === 55 && st.nextMax === 105, "rzadkie gagi: 55–105 s");
const airdropDef=sandbox.window.CASTLE_CONTENT.gags.find(function(g){return g.type==="airdrop";});
check(airdropDef&&airdropDef.weight===.22&&airdropDef.levels.join(",")==="7,8,9,10,11,12","samolot jest rzadkim wariantem wyłącznie późnej połowy kampanii");
check(st.eraId==="medieval", "poziomy korzystają z aktywnego pakietu średniowiecznego");
const deckAudit=qa.deckAudit();
check(deckAudit.max===8&&deckAudit.largest<=8,"każda talia gracza i AI ma najwyżej 8 różnych jednostek");
check(deckAudit.rows.every(function(r){return new Set(r.player).size===r.player.length&&new Set(r.enemy).size===r.enemy.length;}),"talie poziomów nie marnują miejsc na duplikaty");
check(["spearman","monk","wizard","golem"].every(function(k){return deckAudit.demon.recommended.indexOf(k)>=0&&deckAudit.demon.player.indexOf(k)>=0;})&&deckAudit.demon.briefing==="briefing.demonBody","poziom 12 dobiera właściwe kontry i ma raport przed bossem");
const formationAudit=qa.formationAudit();
check(formationAudit.gap>=formationAudit.min-.001&&formationAudit.backVx<34,"maszerujące jednostki zachowują miękki odstęp zamiast nakładać sylwetki");
const battleIntelAudit=qa.battleIntelAudit();
check(battleIntelAudit.top==="warrior"&&battleIntelAudit.damage===42&&battleIntelAudit.castle===55&&battleIntelAudit.enemySupportIgnored,"raport przypisuje wyniki wyłącznie jednostkom gracza, także przy trafieniu zamku");
check(battleIntelAudit.smart[0]==="warrior"&&battleIntelAudit.cards===3&&battleIntelAudit.stored,"przegrana zapisuje wyniki i podpowiada sprawdzoną jednostkę bez zmiany trudności");
const supportBlockAudit=qa.supportBlockAudit();
check(supportBlockAudit.wizardHit>0&&supportBlockAudit.workerDead,"Czarownik trafia i usuwa Drwala zamiast utrzymywać wieczny cel");
check(supportBlockAudit.priority==="warrior","jednostka bojowa ma pierwszeństwo przed bliższym Drwalem");
check(supportBlockAudit.blockerDead&&supportBlockAudit.supportAlive===0&&supportBlockAudit.frontMoved&&supportBlockAudit.backCount===2,"Golem i Czarownik usuwają serię Drwali, a szyk rusza dalej bez trwałego korka");
const armyFreedomAudit=qa.armyFreedomAudit();
check(armyFreedomAudit.pCombat===14&&armyFreedomAudit.eCombat===14&&armyFreedomAudit.extra&&armyFreedomAudit.spent===armyFreedomAudit.cost,"liczba żołnierzy nie ma twardego limitu; kolejny zakup działa i zużywa zasób");
check(armyFreedomAudit.cardCap===8,"limit ośmiu pozostaje wyłącznie limitem rodzajów jednostek w talii");
check(armyFreedomAudit.pWorkers===2&&armyFreedomAudit.eWorkers===2,"Drwale zachowują osobny limit dwóch na stronę, aby nie blokować drzew i szyku");
const unitRulesAudit=qa.unitRulesAudit();
check(unitRulesAudit.catalog===26&&unitRulesAudit.unique===26&&unitRulesAudit.valid&&unitRulesAudit.bossesOutside,"katalog ma 26 jednostek czterech epok, bossowie poza talią");
check(unitRulesAudit.allAttack&&unitRulesAudit.cannonProjectile&&unitRulesAudit.mortarProjectile&&unitRulesAudit.counters,"każdy z 20 bojowników atakuje, artyleria strzela, a wszystkie odwołania kontr są poprawne");
check(unitRulesAudit.worker&&unitRulesAudit.mason&&unitRulesAudit.healer,"Drwal, Kamieniarz i Mnich zachowują odrębne role wsparcia");
const castleSiegeAudit=qa.castleSiegeAudit();
check(castleSiegeAudit.count===20&&castleSiegeAudit.allPersist,"wszyscy 20 mobilni bojownicy uderzają dokładnie raz i giną przy bramie");
check(castleSiegeAudit.walksToGate&&!castleSiegeAudit.wizard.alive&&castleSiegeAudit.wizard.damage>0,"Czarownik przechodzi od swojego zasięgu do bramy przed ostatnim ciosem");

let lang=qa.setLang("en");
check(lang.lang==="en"&&lang.stored==="en"&&lang.play==="TO BATTLE"&&lang.warrior==="Warrior"&&lang.level1==="Green Fields", "lokalizacja angielska zmienia interfejs, dane i zapisuje wybór");
const briefingEn=qa.briefingAudit();check(briefingEn.body.indexOf("three fireballs")>=0&&briefingEn.units===4,"angielski raport Króla Demonów korzysta ze słownika");
qa.tutorialStart();let tutInfo=qa.tutorialInfo();check(tutInfo.text.indexOf("enemy castle")>=0&&tutInfo.next==="NEXT"&&tutInfo.skip==="SKIP", "angielski samouczek korzysta ze słownika");qa.tutorialStop();
qa.load(1);let endEn=qa.endScene(false);check(endEn.title==="Defeat!"&&endEn.body.indexOf("castle fell")>=0&&endEn.stats.indexOf("Battle time")>=0, "angielski ekran końca bitwy jest przetłumaczony");
lang=qa.setLang("pl");
check(lang.lang==="pl"&&lang.play==="DO BOJU"&&lang.warrior==="Wojownik", "powrót do lokalizacji polskiej");
const briefingAudit=qa.briefingAudit();
check(briefingAudit.display==="flex"&&briefingAudit.title==="KRÓL DEMONÓW"&&briefingAudit.body.indexOf("trzy kule")>=0&&briefingAudit.units===4,"raport poziomu 12 pokazuje zagrożenie i cztery polecane jednostki");

let tut=qa.tutorialStart();
check(tut.active&&tut.step===0&&tut.aiFrozen, "samouczek startuje w poziomie 1 i zatrzymuje AI");
tut=qa.tutorialNext();check(tut.step===1, "samouczek prowadzi do Drwala");
tut=qa.tutorialSpawn("warrior");check(tut.step===1&&tut.spawned===0, "samouczek chroni przed przypadkowym zakupem złej jednostki");
tut=qa.tutorialSpawn("drwal");check(tut.step===2, "zakup Drwala przechodzi do Wojownika");
tut=qa.tutorialSpawn("warrior");check(tut.step===3, "zakup Wojownika przechodzi do podsumowania");
tut=qa.tutorialNext();check(!tut.active&&!qa.game().tutorialMode, "ukończenie samouczka uruchamia normalną bitwę");
qa.load(0);check(!qa.state().tutorialActive, "ukończony samouczek nie uruchamia się ponownie automatycznie");

const cannonDesktop = qa.cannonScene(true); save("cannon-desktop.png");
check(cannonDesktop.y > 10 && cannonDesktop.y < st.GY, "kula armatnia widoczna na desktopie");
check(Math.abs(cannonDesktop.vx) > 180, "armata przemieszcza kulę wyraźnie w stronę celu");
check(cannonDesktop.arcHeight >= 88, "armata ma wysoką, czytelną parabolę");

const auraScene=qa.archerScene(); save("archer-profile.png");
check(!auraScene[0]&&!auraScene[1],"aura nie łączy łuczników przeciwnych drużyn");
const formation=qa.formationAura();save("archer-formation.png");check(formation[0]&&formation[1],"dwóch sojuszniczych łuczników aktywuje aurę formacji");
for (const type of ["cloudknight", "moonjanitor", "duckpatrol", "flyingdesk", "firemarshal", "teaballoon", "snowclerk", "vacuumdemon", "runawaybanner", "powderclerk"]) { qa.gagScene(type, 1); save(`gag-${type}.png`); }

qa.load(3);
const arrowShot=qa.rangedShot("archer",true);
check(arrowShot.vy<0&&arrowShot.grav>0&&approx(arrowShot.endX,arrowShot.targetX,1)&&approx(arrowShot.endY,arrowShot.targetY,1), "łucznik trafia kontrolowaną parabolą zamiast strzelać w dół");
const spearShot=qa.rangedShot("spearman",false);
check(spearShot.vx<0&&spearShot.vy<0&&spearShot.grav>0&&approx(spearShot.endX,spearShot.targetX,1)&&approx(spearShot.endY,spearShot.targetY,1), "oszczepnik czerwonych celuje w lewo i trafia parabolą");
const spearScene=qa.spearmanScene(true);save("spearman-release.png");
check(spearScene.type==="spearman"&&spearScene.trail===2&&spearScene.released,"oszczep opuszcza dłoń i jest widoczny podczas lotu");
const fixedStep=qa.fixedStepAudit();
check(fixedStep.steps===3&&approx(fixedStep.time,.05,.00001)&&fixedStep.acc<.00001,"symulacja wykonuje stałe kroki 60 Hz niezależnie od tempa renderowania");
const sweptHit=qa.sweptHitAudit();
check(sweptHit.damage===17&&sweptHit.remaining===0,"szybki oszczep trafia na całej drodze i nie przeskakuje przez cel");

const masonry=qa.masonCycle();
check(masonry.active===2,"jednocześnie pracuje najwyżej 2 kamieniarzy");
check(masonry.stage===3&&masonry.loads===0&&masonry.max===Math.round(masonry.base*1.225),"9 dostaw daje 3 etapy i 22,5% maksymalnego HP zamku");
const masonryImmediate=qa.masonImmediateAudit();
save("mason-first-delivery.png");
check(masonryImmediate.repair>0&&masonryImmediate.loads===1&&masonryImmediate.trips===2&&masonryImmediate.state==="toRock"&&masonryImmediate.pulse>0,"pierwsza dostawa Kamieniarza od razu naprawia mur, pokazuje postęp i rozpoczyna kolejny kurs");
const masonryWalk=qa.masonWalkCycle();
check(masonryWalk.stage===1&&masonryWalk.loads===0&&masonryWalk.active===0,"jeden Kamieniarz wykonuje trzy kursy i kończy pierwszy etap rozbudowy");
const masonScene=qa.masonScene();save("mason-castle-stage3.png");
check(masonScene.rocks===3&&masonScene.stage===3,"poziom 7 pokazuje kamieniołomy, kamieniarza i rozbudowany zamek");
check(!main.includes("g.phase*12%(18)"),"kartki latającego biurka nie używają skokowej pętli modulo");

const counters={pikeKnight:qa.counter("pikeman","knight"),knightArcher:qa.counter("knight","archer"),wizardGolem:qa.counter("wizard","golem")};
check(counters.pikeKnight>1.2&&counters.knightArcher>1.3&&counters.wizardGolem>1.25,"kontry są umiarkowane, ale wyraźnie silniejsze od neutralnego starcia");
const aiAudit=qa.aiAudit();
check(aiAudit.defensive.profile==="defensive"&&aiAudit.defensive.key==="monk","AI defensywne preferuje wsparcie");
check(aiAudit.aggressive.profile==="aggressive"&&aiAudit.aggressive.key==="knight","AI agresywne preferuje szybkie natarcie");
check(aiAudit.siege.profile==="siege"&&aiAudit.siege.key==="golem","AI oblężnicze preferuje jednostkę oblężniczą");
check(aiAudit.chaotic.profile==="chaotic"&&aiAudit.profiles.length===12,"każdy poziom ma przypisaną doktrynę AI");
const bossAudit=qa.bossAudit();
check(bossAudit.moon.bossKey==="moonlord"&&bossAudit.moon.phase===3&&bossAudit.moon.tea&&bossAudit.moon.bounty===150&&bossAudit.moon.reward===150,"poziom 10 ma Władcę Łuny, trzy fazy, przerwę na herbatę i jednorazową nagrodę");
check(bossAudit.demon.bossKey==="demonking"&&bossAudit.demon.phase===3&&bossAudit.demon.shots===3,"poziom 12 ma Króla Demonów i trzy czytelne pociski w fazie finałowej");
check(bossAudit.demon.portalTelegraph===1&&bossAudit.demon.summons===1,"portal Króla Demonów ostrzega przed jednym kontrolowanym przywołaniem");
check(bossAudit.demon.castleAttack&&bossAudit.demon.aliveAtCastle,"boss atakuje zamek cyklicznie i nie znika po pierwszym trafieniu");
for(const stressIdx of [0,6,9]){const sr=qa.stressLevel(stressIdx);check(sr.finite&&sr.peakTotal<=36,`60 s symulacji poziomu ${sr.level} pozostaje płynna przy armii ograniczanej ekonomią (${JSON.stringify(sr)})`);}
const level12Stress=qa.stressLevel(11,180);
check(level12Stress.finite&&level12Stress.peakTotal<=42,"wydłużona symulacja poziomu 12 pozostaje stabilna bez sztucznego limitu żołnierzy");
check(level12Stress.peakProjectiles<=28&&level12Stress.peakEffects<=128,`poziom 12 utrzymuje kontrolowany budżet pocisków i cząstek (${JSON.stringify(level12Stress)})`);

qa.viewport(1280,720,1);const bossMoonDesktop=qa.bossScene(9,2);save("boss-moon-phase2-desktop.png");
const bossDemonDesktop=qa.bossScene(11,3);save("boss-demon-phase3-desktop.png");
check(bossMoonDesktop&&bossMoonDesktop.key==="moonlord"&&bossMoonDesktop.phase===2,"render Władcy Łuny w fazie 2 na desktopie");
check(bossDemonDesktop&&bossDemonDesktop.key==="demonking"&&bossDemonDesktop.phase===3&&bossDemonDesktop.portals===1,"render Króla Demonów i zapowiedzianego portalu na desktopie");
const policeDesktop=qa.policemanScene();save("policeman-scale-desktop.png");
check(approx(policeDesktop.scale,policeDesktop.expected,.0001)&&policeDesktop.policeHeight>=policeDesktop.soldierHeight*.95,"policjant ma wysokość porównywalną z żołnierzem na desktopie");
const humorDesktop=qa.humorScaleAudit();
check(approx(humorDesktop.human,humorDesktop.soldier,.0001)&&humorDesktop.types.length===10,"wszystkie humorystyczne postacie ludzkie korzystają ze skali wojska");
const premiumDesktop=qa.premiumUnitsScene();save("premium-units-desktop.png");
check(premiumDesktop.count===5&&premiumDesktop.monk>0&&premiumDesktop.mason>0&&premiumDesktop.golem>0&&premiumDesktop.wizard>0&&premiumDesktop.spear>0,"mnich, Kamieniarz, Golem, Czarownik i Oszczepnik mają osobne animowane sylwetki na desktopie");
const airdropScene=qa.airdropScene();save("gag-airdrop.png");
check(airdropScene.type==="airdrop"&&airdropScene.plane&&airdropScene.chute&&airdropScene.poop,"gag pokazuje jednocześnie samolot, spadochroniarza i kreskówkowy spadający element");
const rainVisual=qa.abilityScene("arrowRain");save("ability-arrow-rain.png");
const freezeVisual=qa.abilityScene("freeze");save("ability-freeze.png");
const rallyVisual=qa.abilityScene("rally");save("ability-rally.png");
check(rainVisual.arrow&&freezeVisual.freeze&&rallyVisual.rally,"trzy umiejętności mają osobne globalne efekty wizualne");
check(!main.includes("CT.transform(1,0,-.12,1,0,0)"),"Deszcz Strzał wrócił do lekkiej oprawy v4.5 bez szerokich pasów cienia");
const castleDamage=qa.castleDamageAudit();
check(castleDamage.stages.join(",")==="1,2,3"&&castleDamage.pulse>0&&castleDamage.holes===3,"zamek przechodzi przez trzy czytelne progi uszkodzeń");
const castleDamageDesktop=qa.castleDamageScene();save("castle-damage-desktop.png");
check(castleDamageDesktop.player===2&&castleDamageDesktop.enemy===3,"render pokazuje średnie i krytyczne uszkodzenia zamków");
const projectileFx=qa.projectileFxScene();save("projectile-fx-desktop.png");
check(projectileFx.projectiles===5&&["magic","demon","bolt","spear","cannon"].every(function(k){return projectileFx.kinds.indexOf(k)>=0;}),"magia, demon, bełt, oszczep i armata mają różne efekty trafień");
const castleLaundry=qa.castleEvolutionScene(6);save("castle-evolution-laundry-desktop.png");
const castleKettle=qa.castleEvolutionScene(8);save("castle-evolution-kettle-desktop.png");
const castleGuard=qa.castleEvolutionScene(10);save("castle-evolution-guard-desktop.png");
check(castleLaundry.tier===1&&castleLaundry.cameo==="laundry"&&castleKettle.cameo==="kettle"&&castleGuard.tier===2&&castleGuard.cameo==="sleepyGuard","zamek ewoluuje po 6 poziomach, a trzy gagi scenograficzne nie powtarzają się na każdym zamku");
for(const bg of [{i:0,n:"day"},{i:4,n:"night"},{i:10,n:"snow"},{i:11,n:"bloodmoon"}]){qa.levelScene(bg.i);save(`background-${bg.n}.png`);}

qa.viewport(844, 390, 1); qa.load(4); st = qa.state();
check(st.unitSize === 25, "skala postaci telefon = 25 px");
const policePhone=qa.policemanScene();save("policeman-scale-phone.png");
check(approx(policePhone.scale,policePhone.expected,.0001)&&policePhone.policeHeight>=policePhone.soldierHeight*.95,"policjant zachowuje skalę żołnierza na telefonie");
const humorPhone=qa.humorScaleAudit();check(approx(humorPhone.human,humorPhone.soldier,.0001),"postacie humorystyczne zachowują skalę wojska także na telefonie");
const fishermanPhone=qa.fishermanScene(9.25);save("fisherman-castle-phone.png");
check(fishermanPhone.visible&&approx(fishermanPhone.ratio,.72,.0001)&&fishermanPhone.y<fishermanPhone.castleTop,"półpostać wędkarza pozostaje osadzona w wieży także na telefonie");
const cannonPhone = qa.cannonScene(true); save("cannon-phone.png");
check(cannonPhone.y > 8 && cannonPhone.y < st.GY, "kula armatnia widoczna na telefonie");
const bossMoonPhone=qa.bossScene(9,3);save("boss-moon-phase3-phone.png");
const bossDemonPhone=qa.bossScene(11,2);save("boss-demon-phase2-phone.png");
check(bossMoonPhone&&bossMoonPhone.tea>0,"filiżanka Władcy Łuny pozostaje czytelna na telefonie");
check(bossDemonPhone&&bossDemonPhone.key==="demonking","Król Demonów renderuje się na telefonie");
const premiumPhone=qa.premiumUnitsScene();save("premium-units-phone.png");
check(premiumPhone.count===5,"pięć dopracowanych sylwetek zachowuje skalę na telefonie");
const castleDamagePhone=qa.castleDamageScene();save("castle-damage-phone.png");
check(castleDamagePhone.enemy===3,"krytyczne uszkodzenia zamku pozostają czytelne na telefonie");

const introAudit=qa.introAudit();check(introAudit.renderer&&introAudit.noText&&introAudit.duration<14,"intro v4.4 jest krótsze niż 14 s i nie rysuje napisów");
qa.intro(3.32);save("intro-arrow-phone.png");qa.intro(6.72);save("intro-cone-phone.png");qa.intro(8.56);save("intro-ticket-phone.png");qa.intro(10.72);save("intro-chase-phone.png");
qa.viewport(1280,720,1);qa.intro(3.32);save("intro-arrow-desktop.png");qa.intro(8.56);save("intro-ticket-desktop.png");qa.intro(10.72);save("intro-chase-desktop.png");

qa.viewport(640, 360, 1);
for (let i = 0; i < 12; i++) { qa.levelScene(i); save(`level-${String(i + 1).padStart(2, "0")}.png`); }

qa.load(4);
for (const type of ["chicken", "bathtub", "policeman", "cloudknight", "moonjanitor", "skyfish", "duckpatrol", "flyingdesk", "firemarshal", "teaballoon", "snowclerk", "vacuumdemon", "runawaybanner", "powderclerk"]) {
  qa.setGag(type, 1);
  check(qa.updateGags(1) === 1, `${type}: nie znika po wejściu na ekran`);
  check(qa.updateGags(4) === 1, `${type}: pozostaje widoczny w połowie drogi`);
  check(qa.updateGags(60) === 0, `${type}: znika dopiero za przeciwną krawędzią`);
}
const airdropAudit=qa.airdropAudit();
check(airdropAudit.landed&&airdropAudit.stained&&airdropAudit.cut&&airdropAudit.moved&&airdropAudit.escaped&&!airdropAudit.damaged,"spadochroniarz brudzi żołnierza bez obrażeń, ląduje, odcina czaszę i ucieka poza ekran");
const expectedGags=["chicken","bathtub","policeman","cloudknight","moonjanitor","skyfish","duckpatrol","flyingdesk","firemarshal","teaballoon","snowclerk","vacuumdemon"];
for(let gi=0;gi<expectedGags.length;gi++)check(qa.levelGag(gi+1)===expectedGags[gi],`poziom ${gi+1} ma własny gag: ${expectedGags[gi]}`);
const repeat=qa.repeatGag();check(repeat.before===1&&!repeat.spawned&&repeat.after===0,"gag pojawia się najwyżej raz w bitwie");
const gagDefs=sandbox.window.CASTLE_CONTENT.gags;
check(gagDefs.some(function(g){return g.type==="runawaybanner";})&&gagDefs.some(function(g){return g.type==="powderclerk";}),"dwa nowe abstrakcyjne warianty zwiększają różnorodność bez zwiększania częstotliwości gagów");

const eraTwo=qa.unlockEraTwo();
check(eraTwo.unlocked&&eraTwo.switched&&eraTwo.era==="early-modern"&&eraTwo.levels===6&&eraTwo.completed===12,"Epoka II odblokowuje się po ukończeniu 12 bitew średniowiecza");
const eraTwoDeck=qa.deckAudit();
check(eraTwoDeck.rows.length===6&&eraTwoDeck.largest<=8&&eraTwoDeck.rows.every(function(r){return new Set(r.player).size===r.player.length&&new Set(r.enemy).size===r.enemy.length;}),"sześć poziomów Epoki II zachowuje talie do 8 jednostek");
const eraTwoUnits=qa.earlyModernUnitAudit();
check(eraTwoUnits.catalog===26&&eraTwoUnits.pikeDamage>0&&eraTwoUnits.sapperDamage>0,"Pikinier i Saper mają działające role bojowe oraz kontry");
check(eraTwoUnits.musketType==="musket"&&eraTwoUnits.musketSpeed>500&&eraTwoUnits.mortarType==="mortar"&&eraTwoUnits.mortarArc>=112,"Muszkieter i Moździerz korzystają z odmiennych pocisków i fizyki");
for(const eraIdx of [0,1,2,3,4,5]){const sr=qa.stressLevel(eraIdx);check(sr.finite&&sr.peakTotal<=36,`60 s symulacji Epoki II, poziom ${sr.level}, stabilna armia regulowana zasobami`);}
const eraTwoGags=qa.earlyModernGagAudit();
check(eraTwoGags.length===6&&eraTwoGags.every(function(type){return type==="clockworkduck";}),"mechaniczna kaczka jest rzadkim gagiem wyłącznie Epoki II");
qa.viewport(1280,720,1);qa.earlyModernScene(4);save("era2-canal-desktop.png");
qa.viewport(844,390,1,{top:0,right:47,bottom:21,left:47});qa.earlyModernScene(5);save("era2-foundry-iphone.png");
qa.viewport(1280,720,1);const eraTwoDesktop=qa.earlyModernScene(3);save("era2-units-castle-desktop.png");
check(eraTwoDesktop.scene&&eraTwoDesktop.units.join(",")==="pikeguard,musketeer,sapper,mortar"&&eraTwoDesktop.rocks===3&&eraTwoDesktop.castleStyle==="brick-bastion"&&eraTwoDesktop.standalone,"Epoka II ma własne sylwetki, tło i samodzielny ceglany fort zamiast nakładki na zamek");
qa.viewport(844,390,1,{top:0,right:47,bottom:21,left:47});const eraTwoPhone=qa.earlyModernScene(2);save("era2-units-castle-iphone.png");
check(eraTwoPhone.scene&&eraTwoPhone.units.length===4,"nowe jednostki i bastion mieszczą się na iPhonie z bezpiecznymi marginesami");
qa.gagScene("clockworkduck",1);save("gag-clockwork-duck.png");
const restoredEra=qa.restoreMedieval();check(restoredEra.ok&&restoredEra.era==="medieval"&&restoredEra.levels===12,"powrót z Epoki II zachowuje kampanię średniowieczną");
for(const era of ["industrial","electric"]){
  const f=qa.futureEra(era,0);check(f.switched&&f.levels===4&&f.abilities,"nowa epoka "+era+" ma cztery bitwy i zachowuje zdolności");
  check(qa.deckAudit().largest<=8,"nowa epoka "+era+" zachowuje limit ośmiu kart");
  for(let i=0;i<4;i++){const r=qa.stressLevel(i,90);check(r.finite&&r.peakTotal<=40,era+" bitwa "+(i+1)+": 90 s stabilnej symulacji");}
  qa.viewport(1280,720,1);qa.futureScene(era,3);save(era+"-desktop.png");
  qa.viewport(844,390,1,{top:0,right:47,bottom:21,left:47});qa.futureScene(era,3);save(era+"-iphone.png");
  qa.setLang("en");check(!qa.futureEra(era,0).name.includes(".level."),era+" ma angielską nazwę poziomu");qa.setLang("pl");
}
const fw=qa.futureWeapons();check(fw.heals&&fw.shoots&&fw.electric,"Sanitariusz leczy, działo strzela, impuls ma własny efekt");
const eq=qa.gateQueue();check(eq.cleared&&eq.enemy,"12 żołnierzy opuszcza bramę po ciosie, reguła działa także dla przeciwnika");
check(qa.eraTransition("industrial").era==="electric","przycisk po finale Epoki III rzeczywiście otwiera Epokę IV");
const ab=qa.audioBudget();check(ab.bounded&&ab.recovered&&ab.compressor,"audio ogranicza głosy, odzyskuje budżet i ma kompresor sumy");
qa.restoreMedieval();
qa.viewport(640,360,1);

qa.load(4); const rain = qa.cast("arrowRain");
check(rain.projs === 30 && rain.arrowFx, "Deszcz Strzał: 3 fale / 30 strzał");
qa.load(4); const frost = qa.cast("freeze");
check(approx(frost.freeze, 3.8)&&frost.freezeBurst, "Mróz trwa 3,8 s i ma osobną falę lodu");
qa.load(4); const rallyCast=qa.cast("rally");
check(rallyCast.rallyFx,"Zew Bitwy ma osobny globalny sygnał wizualny");

const audioAudit=qa.audioAudit();
check(audioAudit.keys.length===10&&audioAudit.master>0&&audioAudit.motifs>0&&audioAudit.started>=20,"dziesięć rodzin dźwięku ma osobne procedury, warstwy i niezależny poziom motywów");
const campaignAudit=qa.campaignAudit();
check(campaignAudit.era==="medieval"&&campaignAudit.mapPoints===12,"mapa kampanii korzysta z 12 punktów aktywnego pakietu epoki");
check(campaignAudit.reward1===3&&campaignAudit.reward2===0&&campaignAudit.points===campaignAudit.before+3,"pieczęcie są przyznawane tylko za pierwsze ukończenie poziomu");
check(campaignAudit.stored&&campaignAudit.upgPoints===campaignAudit.points,"postęp i punkty ulepszeń wracają z trwałego zapisu kampanii");

const performanceAudit=qa.performanceAudit();
check(performanceAudit.low&&performanceAudit.adaptive&&performanceAudit.mode==="adaptive","tryb oszczędny może zostać włączony automatycznie bez zmiany zasad gry");
check(performanceAudit.dpr===1.25&&performanceAudit.frameMs===30,"słabszy telefon ogranicza bufor Retina i renderuje w budżecie około 30 kl./s");
check(performanceAudit.clouds===7&&performanceAudit.dust<=36,"tryb oszczędny ogranicza warstwy chmur i cząstki");
check(performanceAudit.noiseReused,"odgłosy szumu współdzielą jeden AudioBuffer zamiast alokować go przy każdym trafieniu");

console.log("QA V7.0 COMPLETE", JSON.stringify({ desktop: cannonDesktop, phone: cannonPhone, iphoneCases, levelOne, fishermanDesktop, fishermanDuck, fishermanPhone, fishermanGone, faceCutout, fullscreenAudit, abilityVisibility, cardAvailability, balanceAudit, healthAudit, arrowShot, spearShot, spearScene, fixedStep, sweptHit, policeDesktop, policePhone, humorDesktop, humorPhone, premiumDesktop, premiumPhone, castleDamage, projectileFx, masonry, masonryImmediate, masonryWalk, counters, aiAudit, bossAudit, deckAudit, formationAudit, battleIntelAudit, supportBlockAudit, armyFreedomAudit, unitRulesAudit, castleSiegeAudit, airdropAudit, briefingAudit, castleLaundry, castleKettle, castleGuard, eraTwo, eraTwoUnits, eraTwoGags, eraTwoDesktop, eraTwoPhone, introAudit, audioAudit, campaignAudit, performanceAudit }));


const regression71=qa.regression71();check(regression71.noRemoteDamage&&regression71.opened&&regression71.isolated,"v7.1: zasięg ataku, dowolny poziom testowy i zachowanie kampanii");

check(cardAvailability.poor&&cardAvailability.affordable&&cardAvailability.spent&&cardAvailability.funds,"karty blokują brak środków, odblokowują dokładny koszt i wracają do blokady po zakupie");
