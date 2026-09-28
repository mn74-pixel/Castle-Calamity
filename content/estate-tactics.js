(function(root){
  'use strict';
  // Estate combat is isolated from historical UD units. Coordinates are world
  // fractions; a fixed simulation step keeps combat independent of render FPS.
  var cards=[
    {id:'dres',pl:'Dresiarz',en:'Brawler',rolePl:'Front · zatrzymuje rower',roleEn:'Frontline · stops bikes',cost:18,hp:145,attack:21,interval:.9,speed:.034,range:.035,siege:120,unlock:0},
    {id:'bike',pl:'Rowerzysta',en:'Cyclist',rolePl:'Szybki · dosięga sąsiadki',roleEn:'Fast · catches throwers',cost:28,hp:82,attack:17,interval:.8,speed:.077,range:.034,siege:190,unlock:2},
    {id:'neighbor',pl:'Sąsiadka',en:'Neighbour',rolePl:'Dystans · spowalnia front',roleEn:'Ranged · slows frontline',cost:32,hp:78,attack:18,interval:1.45,speed:.028,range:.155,siege:100,unlock:4},
    {id:'bat',pl:'Dres z kijem',en:'Bat brawler',rolePl:'Ciężki front · szeroki zamach',roleEn:'Heavy front · sweeping swing',cost:32,hp:180,attack:26,interval:1.05,speed:.031,range:.044,siege:160,unlock:5},
    {id:'skater',pl:'Rolkarz',en:'Skater',rolePl:'Szybki · odporny na spowolnienie',roleEn:'Fast · resists slowing',cost:36,hp:95,attack:17,interval:.75,speed:.095,range:.034,siege:230,unlock:7},
    {id:'caretaker',pl:'Dozorca',en:'Caretaker',rolePl:'Wsparcie · regeneruje ekipę',roleEn:'Support · restores the squad',cost:42,hp:210,attack:9,interval:1.4,speed:.025,range:.035,siege:75,unlock:9}
  ];
  function roster(stage){var ids=[stage>=5?'bat':'dres'];if(stage>=2)ids.push(stage>=7?'skater':'bike');if(stage>=4)ids.push('neighbor');if(stage>=9)ids.push('caretaker');return ids;}
  var rules=[
    ['Dresiarz trzyma front. Butelki wspierają natarcie.','Brawlers hold the front. Bottles support the attack.'],
    ['Zajmij środek: +6 środków co 5 s bez przeciwnika.','Hold the centre: +6 funds every 5 s uncontested.'],
    ['Rowerzysta: szybko dociera pod okno, ale uważa na dresy.','Cyclist: reaches the window fast, but watch for brawlers.'],
    ['Przy zapiekankach środek leczy jednostki obu stron.','The central snack stand heals units on either side.'],
    ['Sąsiadka spowalnia wroga kapciem. Osłoń ją dresem.','Neighbour slippers slow enemies. Protect her with a brawler.'],
    ['Kij: szeroki zamach. Śmietniki osłaniają przed kapciem.','Bat: sweeping swing. Bins shelter against slippers.'],
    ['Zjedzona pizza leczy też twoją ekipę o 25 HP.','Eating pizza also heals your squad by 25 HP.'],
    ['Rolkarz odporniejszy na kapcie. Noc skraca zasięg.','Skaters resist slowing. Night reduces throwing range.'],
    ['Przy kebabie rekrutacja jest dwukrotnie szybsza.','Recruitment is twice as fast by the kebab stand.'],
    ['Patrol: co 14 s ekipy zamierają na 3 s.','Patrol: every 14 s squads freeze for 3 s.'],
    ['Nocny Express: każda dostawa daje dodatkowe 12 środków.','Night Express: each supply delivery gives 12 extra funds.'],
    ['Finał: presja pod oknem obniża morale o 35% mocniej.','Finale: pressure at the window drains 35% more morale.']
  ];
  function def(id){return cards.find(function(c){return c.id===id;});}
  var LANES=[1,0,2],SPACING=.043;
  function laneOf(u){return u.lane===undefined?1:u.lane;}
  function retire(u){u.hp=0;u.retreat=true;u.wind=0;u.moving=true;}
  function retreat(u,dt){u.x+=(u.isP?-1:1)*.105*dt;u.walk+=dt*12;u.hurt=0;}
  function init(g){var e=g.estate;e.units=[];e.shots=[];e.tactics={clock:0,carry:0,nextId:1,p:0,e:0,ai:0,capture:0,owner:null};}
  function status(g,id,p){var c=def(id),t=g.estate.tactics;if(!c||g.over)return {ok:false,reason:'end'};if(!roster(g.estate.segment).includes(id))return {ok:false,reason:'locked'};if(t[p?'p':'e']>0)return {ok:false,reason:'recruit'};if((p?g.p:g.e).gold<c.cost)return {ok:false,reason:'gold'};return {ok:true,item:c};}
  function recruit(g,id,p){var s=status(g,id,p);if(!s.ok)return false;var c=s.item,e=g.estate,t=e.tactics,allies=e.units.filter(function(u){return u.isP===p&&u.hp>0;}),lane=LANES.slice().sort(function(a,b){return allies.filter(function(u){return laneOf(u)===a;}).length-allies.filter(function(u){return laneOf(u)===b;}).length;})[0],x=p?.19:.81;
    allies.forEach(function(u){if(laneOf(u)===lane)x=p?Math.min(x,u.x-SPACING):Math.max(x,u.x+SPACING);});
    (p?g.p:g.e).gold-=c.cost;t[p?'p':'e']=e.segment===8?1.2:2.4;e.units.push({id:t.nextId++,kind:id,isP:p,x:x,lane:lane,drawLane:lane,hp:c.hp,max:c.hp,cd:.25,wind:0,target:null,slow:0,hurt:0,retreat:false,blocked:0,walk:0,moving:false});if(p)g.stats.unitsSpawned++;return true;}
  function choose(g){var e=g.estate,t=e.tactics;if(t.ai>0||t.e>0)return null;var deck=roster(e.segment),enemies=e.units.filter(function(u){return u.isP&&u.hp>0;}),allies=e.units.filter(function(u){return !u.isP&&u.hp>0;}),last=enemies[enemies.length-1],role=last?archetype(last.kind):'fast',wanted=role==='fast'?'front':role==='ranged'?'fast':'ranged';if(deck.includes('caretaker')&&allies.length>=2&&!allies.some(function(u){return u.kind==='caretaker';})&&status(g,'caretaker',false).ok)return 'caretaker';var order=deck.slice().sort(function(a,b){return Number(archetype(b)===wanted)-Number(archetype(a)===wanted);});return order.find(function(id){return status(g,id,false).ok;})||null;}
  function heal(g,p,n){g.estate.units.forEach(function(u){if(u.isP===p&&u.hp>0)u.hp=Math.min(u.max,u.hp+n);});}
  function patrol(e){return e.segment===9&&e.tactics.clock%14>=11;}
  function hurt(g,u,amount,slow){if(!u||u.hp<=0)return;g.estate.tactics.impact=true;u.hp=Math.max(0,u.hp-amount);u.hurt=.24;u.slow=Math.max(u.slow,slow||0);if(!u.hp){retire(u);if(u.isP)g.stats.losses++;else g.stats.kills++;}}
  function archetype(id){return id==='dres'||id==='bat'?'front':id==='bike'||id==='skater'?'fast':id==='neighbor'?'ranged':'support';}
  function multiplier(a,b){a=archetype(a);b=archetype(b);return (a==='front'&&b==='fast')||(a==='fast'&&b==='ranged')||(a==='ranged'&&b==='front')?1.4:1;}
  function step(g,dt,hit){
    var e=g.estate,t=e.tactics;t.clock+=dt;t.p=Math.max(0,t.p-dt);t.e=Math.max(0,t.e-dt);t.ai=Math.max(0,t.ai-dt);
    var stopped=patrol(e),live=e.units.filter(function(u){return u.hp>0;}),attacks=[];
    e.units.forEach(function(u){u.hurt=Math.max(0,u.hurt-dt);u.drawLane=(u.drawLane===undefined?laneOf(u):u.drawLane)+(laneOf(u)-(u.drawLane===undefined?laneOf(u):u.drawLane))*Math.min(1,dt*9);if(u.hp<=0){if(u.retreat)retreat(u,dt);return;}u.slow=Math.max(0,u.slow-dt);u.moving=false;if(stopped)return;
      var c=def(u.kind),dir=u.isP?1:-1,range=c.range*(u.kind==='neighbor'&&e.segment===7?.72:1),target=null,distance=Infinity;
      live.forEach(function(v){if(v.isP===u.isP||(u.kind!=='neighbor'&&laneOf(v)!==laneOf(u)))return;var d=Math.abs(v.x-u.x);if(d<distance){distance=d;target=v;}});
      u.cd=Math.max(0,u.cd-dt);
      if(u.wind>0){u.wind-=dt;if(u.wind<=0){var victim=live.find(function(v){return v.id===u.target;});if(victim&&(u.kind==='neighbor'||laneOf(victim)===laneOf(u))&&Math.abs(victim.x-u.x)<=range+.035)attacks.push({u:u,v:victim});u.cd=c.interval;}return;}
      if(target&&distance<=range){if(u.cd<=0){u.wind=.22;u.target=target.id;}return;}
      var advance=c.speed*dt*(u.slow>0?(u.kind==='skater'?.85:.52):1),nx=u.x+dir*advance;
      // Friends block only their own lane. A stalled marcher may use a clear
      // neighbouring lane, but never teleport through another actor.
      var blocker=live.find(function(v){var ahead=(v.x-u.x)*dir;return v!==u&&v.isP===u.isP&&laneOf(v)===laneOf(u)&&ahead>=0&&ahead<SPACING+advance;});
      u.blocked=blocker?(u.blocked||0)+dt:0;
      if(blocker&&u.blocked>=.45){var free=LANES.find(function(l){return Math.abs(l-laneOf(u))===1&&!live.some(function(v){return v!==u&&laneOf(v)===l&&Math.abs(v.x-u.x)<SPACING*1.4;});});if(free!==undefined){u.lane=free;u.blocked=0;return;}}
      if(blocker)nx=u.x+dir*Math.max(0,Math.min(advance,(blocker.x-u.x)*dir-SPACING));
      if(target&&laneOf(target)===laneOf(u))nx=dir>0?Math.min(nx,target.x-.032):Math.max(nx,target.x+.032);
      u.moving=Math.abs(nx-u.x)>.00001;u.x=nx;u.walk+=u.moving?dt*10:0;
      if((u.isP&&u.x>=.81)||(!u.isP&&u.x<=.19)){var base=u.isP?g.e:g.p;hit(base,Math.round(c.siege*(e.segment===11?1.35:1)),base.x+base.w/2,g.GY-30,{estate:true,estateUnit:true});retire(u);}
    });
    attacks.forEach(function(a){var c=def(a.u.kind),damage=c.attack*multiplier(a.u.kind,a.v.kind);if(a.u.kind==='neighbor')e.shots.push({x:a.u.x,from:a.u.x,to:a.v.x,fromLane:laneOf(a.u),toLane:laneOf(a.v),target:a.v.id,isP:a.u.isP,t:0,duration:.32,damage:damage});else{hurt(g,a.v,damage,0);if(a.u.kind==='bat'){var second=live.find(function(v){return v!==a.v&&v.isP!==a.u.isP&&v.hp>0&&Math.abs(v.x-a.u.x)<.065&&Math.abs(laneOf(v)-laneOf(a.u))<=1;});if(second)hurt(g,second,c.attack*.5,0);}}});
    e.shots=e.shots.filter(function(s){if(stopped)return true;s.t+=dt;var u=e.units.find(function(v){return v.id===s.target;});if(u&&u.hp>0){s.to=u.x;s.toLane=laneOf(u);}s.x=s.from+(s.to-s.from)*Math.min(1,s.t/s.duration);if(s.t<s.duration)return true;if(u)hurt(g,u,s.damage*(e.segment===5&&Math.abs(u.x-.5)<.12?.5:1),1.3);return false;});
    e.units=e.units.filter(function(u){return u.hp>0||(u.retreat&&u.x>-.04&&u.x<1.04);});
    if(e.segment===3)live.forEach(function(u){if(u.hp>0&&Math.abs(u.x-.5)<.11)u.hp=Math.min(u.max,u.hp+dt*5);});
    live.forEach(function(u){u.recover=Math.max(0,(u.recover||0)-dt);if(!stopped&&u.hp>0&&u.hp<u.max&&live.some(function(v){return v!==u&&v.hp>0&&v.kind==='caretaker'&&v.isP===u.isP&&Math.abs(v.x-u.x)<.09;})){u.hp=Math.min(u.max,u.hp+dt*4);u.recover=.25;}});
    if(e.segment===1){var p=live.some(function(u){return u.hp>0&&u.isP&&Math.abs(u.x-.5)<.1;}),q=live.some(function(u){return u.hp>0&&!u.isP&&Math.abs(u.x-.5)<.1;}),owner=p!==q?p:null;if(owner!==t.owner)t.capture=0;t.owner=owner;if(owner!==null){t.capture+=dt;if(t.capture>=5){t.capture-=5;var bank=owner?g.p:g.e;bank.gold=Math.min(9999,bank.gold+6);if(owner)g.stats.goldEarned+=6;}}}else{t.capture=0;t.owner=null;}
  }
  function tick(g,dt,hit,reward,impact){var t=g.estate.tactics,gold=g.stats.goldEarned;t.impact=false;t.carry+=dt;while(t.carry>=1/30&&!g.over){step(g,1/30,hit);t.carry-=1/30;}if(t.impact&&impact)impact();if(reward&&g.stats.goldEarned>gold)reward(true,g.stats.goldEarned-gold);}
  function finish(g,dt){var e=g.estate;e.shots=[];e.units.forEach(function(u){if(u.hp>0)retire(u);retreat(u,dt);});e.units=e.units.filter(function(u){return u.x>-.04&&u.x<1.04;});}
  function line(c,x,y,a,b,color,w){c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();}
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function figure(c,u,x,y,s){
    var bike=u.kind==='bike',neighbor=u.kind==='neighbor',team=u.isP?'#528caa':'#b96552',ink='#233238',phase=u.walk||0,stride=u.moving?Math.sin(phase)*4:0,hit=u.hurt>0,attack=u.wind>0?Math.sin(u.wind/.22*Math.PI)*7:0;
    c.save();c.translate(x,y);c.scale((u.isP?1:-1)*(u.retreat?-1:1)*s,s);ellipse(c,0,1,bike?22:14,3,'rgba(13,24,28,.3)');
    if(bike){[-18,18].forEach(function(xx){ellipse(c,xx,-9,10,10,ink);ellipse(c,xx,-9,7,7,'#a4b4aa');ellipse(c,xx,-9,5.5,5.5,'#526560');for(var n=0;n<3;n++){var a=phase+n*Math.PI/3;line(c,xx-Math.cos(a)*7,-9-Math.sin(a)*7,xx+Math.cos(a)*7,-9+Math.sin(a)*7,'#c4c9b3',.6);}});line(c,-18,-9,-6,-25,'#d4b35f',2);line(c,-6,-25,1,-9,'#d4b35f',2);line(c,1,-9,-18,-9,'#d4b35f',2);line(c,-6,-25,13,-25,'#d4b35f',2);line(c,13,-25,1,-9,'#d4b35f',2);line(c,13,-25,18,-9,'#d4b35f',2);line(c,13,-25,12,-31,ink,2);line(c,12,-31,17,-32,ink,2);line(c,-10,-26,-3,-26,ink,3);}
    var hip=bike?-25:-20,head=bike?-49:neighbor?-51:-54;
    line(c,-4,hip,-5+stride,bike?-12:-3,ink,7);line(c,4,hip,6-stride,bike?-10:-3,ink,7);line(c,-5+stride,bike?-12:-3,1+stride,bike?-12:-3,'#b8b5a2',3);line(c,6-stride,bike?-10:-3,12-stride,bike?-10:-3,'#b8b5a2',3);
    c.fillStyle=hit?'#ead2a2':neighbor?'#8c796c':team;c.strokeStyle=ink;c.lineWidth=1.5;c.beginPath();c.moveTo(-8,head+12);c.lineTo(7,head+12);c.lineTo(neighbor?13:10,neighbor?-15:hip+1);c.lineTo(neighbor?-13:-10,neighbor?-15:hip+1);c.closePath();c.fill();c.stroke();
    if(neighbor){c.fillStyle='#cbbca0';c.fillRect(-6,-34,13,18);for(var dot=0;dot<4;dot++)ellipse(c,-4+dot*3,-28+dot%2*5,1,1,'#9b6555');}else{line(c,-6,head+14,-7,hip-1,'#dfd7b9',1.3);line(c,-3,head+14,-4,hip-1,'#dfd7b9',1.3);}
    line(c,-7,head+16,-11,head+28,team,6);line(c,-11,head+28,-7,head+32,'#d5ad88',4);line(c,7,head+16,bike?15:12+attack,bike?-32:head+25,team,6);line(c,bike?15:12+attack,bike?-32:head+25,bike?17:17+attack,bike?-32:head+22,'#d5ad88',4);
    if(neighbor){ellipse(c,18+attack,head+21,5,2,'#d6b46e');c.strokeStyle=ink;c.lineWidth=1;c.stroke();line(c,-11,-25,-11,-17,'#d1c3a4',1);c.fillStyle='#857f4e';c.fillRect(-16,-19,10,11);}
    ellipse(c,0,head+6,7,9,'#d4a982');ellipse(c,5,head+7,3,3,'#d4a982');
    if(neighbor){c.fillStyle='#b38b56';c.beginPath();c.moveTo(-9,head+13);c.lineTo(-8,head-3);c.quadraticCurveTo(3,head-8,8,head+3);c.lineTo(2,head+1);c.lineTo(-4,head+4);c.closePath();c.fill();}else{ellipse(c,-1,head,7,4,ink);if(bike){line(c,-7,head,8,head,team,3);line(c,5,head+1,11,head+2,team,2);}}
    line(c,2,head+5,4,head+(hit?6:5),ink,1.2);line(c,6,head+6,7,head+9,'#986d52',1);line(c,3,head+12,6,head+(hit?11:12),ink,.9);
    if(u.retreat){line(c,16,-35,16,-50,'#a8aa92',1.2);c.fillStyle='#f4ecd5';c.beginPath();c.moveTo(16,-50);c.quadraticCurveTo(24,-54+Math.sin(phase)*2,29,-48);c.lineTo(29,-40);c.quadraticCurveTo(23,-44,16,-41);c.closePath();c.fill();}
    if(u.kind==='bat'&&!u.retreat){c.save();c.translate(17+attack,head+22);c.rotate(-.55+attack*.13);line(c,0,2,0,-27,ink,6);line(c,0,1,0,-10,'#997343',3);line(c,0,-10,0,-27,'#d3ac6c',5);line(c,-2,-16,-2,-26,'#efd59b',1);c.restore();line(c,-8,head+1,8,head+1,team,3);}
    if(u.kind==='skater'){[-4+stride,8-stride].forEach(function(xx){line(c,xx-4,-1,xx+7,-1,team,4);for(var wh=0;wh<3;wh++)ellipse(c,xx-3+wh*4,2,2,2,ink);});line(c,-6,head-2,6,head-2,'#e9be63',4);line(c,-5,-17,0,-17,team,4);line(c,5,-17,10,-17,team,4);}
    if(u.kind==='caretaker'){c.fillStyle='#687a65';c.fillRect(-9,head+15,18,22);c.fillStyle='#d9c59b';c.fillRect(-5,head+20,7,6);line(c,-9,head-3,10,head-3,team,4);line(c,18,-43,22,-7,'#b49b70',2);c.fillStyle='#b8a780';c.fillRect(16,-9,15,6);for(var br=0;br<4;br++)line(c,18+br*3,-7,18+br*3,-2,'#8a7854',1);line(c,-12,-24,-17,-14,'#bbb9a3',1);c.fillStyle='#9caaa0';c.fillRect(-23,-14,12,11);c.fillStyle='#e2d0a2';c.fillRect(-18,-12,3,7);c.fillRect(-20,-10,7,3);}
    if(u.recover>0&&!u.retreat){line(c,-14,head-3,-14,head+3,'#c5e7a3',2);line(c,-17,head,-11,head,'#c5e7a3',2);}
    c.restore();
  }
  function draw(c,g,scale,lang){var e=g.estate,t=e.tactics,s=Math.min(1.8,Math.max(.62,scale*.74));
    if(e.segment===1||e.segment===3||e.segment===5){c.save();c.strokeStyle=e.segment===3?'#94b881':e.segment===5?'#c3bba4':t.owner===null?'#d8c492':t.owner?'#79bddd':'#db8f71';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.ellipse(g.W*.5,g.GY-1,g.W*.1,7,0,0,Math.PI*2);c.stroke();c.restore();}
    e.units.slice().sort(function(a,b){return a.drawLane-b.drawLane;}).forEach(function(u){var offset=(u.drawLane===undefined?laneOf(u):u.drawLane)*12*s;figure(c,u,u.x*g.W,g.GY-3+offset,s);if(u.hp>0){var w=23*s,x=u.x*g.W-w/2,y=g.GY-65*s+offset;c.fillStyle='#213139';c.fillRect(x-1,y-1,w+2,4);c.fillStyle=u.isP?'#84c5cf':'#e3a183';c.fillRect(x,y,w*u.hp/u.max,2);}});
    e.shots.forEach(function(v){var q=v.t/v.duration,lane=v.fromLane+(v.toLane-v.fromLane)*q;c.save();c.translate(v.x*g.W,g.GY-38*s+lane*12*s-Math.sin(q*Math.PI)*26*s);c.rotate(v.t*16);ellipse(c,0,0,6*s,2.5*s,'#dab771');c.restore();});
    c.save();c.textAlign='center';c.font='bold '+Math.max(9,Math.min(12,g.W/90))+'px sans-serif';var text=rules[e.segment][lang==='en'?1:0];if(e.segment===9){var phase=t.clock%14;text=(patrol(e)?(lang==='en'?'PATROL — HOLD! ':'PATROL — STAĆ! '):phase>=9?(lang==='en'?'PATROL INCOMING · ':'NADJEŻDŻA PATROL · '):'')+text;}if(e.segment===1&&t.owner!==null)text+=' '+Math.ceil(5-t.capture)+' s';if(g.over)text=lang==='en'?'ENOUGH! Time for tea. Everyone heads home.':'WYSTARCZY! Czas na herbatę. Wracamy do domu.';var y=Math.min(g.H-14,g.GY+48);c.fillStyle='rgba(22,32,36,.88)';c.fillRect(g.W*.16,y-13,g.W*.68,20);c.fillStyle='#f2dfaf';c.fillText(text,g.W*.5,y,g.W*.66);c.restore();
  }
  root.CASTLE_ESTATE_TACTICS={cards:cards,roster:roster,archetype:archetype,rules:rules,init:init,status:status,recruit:recruit,choose:choose,heal:heal,tick:tick,finish:finish,draw:draw,figure:figure,patrol:patrol,multiplier:multiplier};
})(window);
