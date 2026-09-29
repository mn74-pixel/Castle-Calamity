(function(root){
  'use strict';
  // Estate combat is isolated from historical UD units. Coordinates are world
  // fractions; a fixed simulation step keeps combat independent of render FPS.
  var cards=[
    {id:'dres',pl:'Dresiarz',en:'Brawler',rolePl:'Front · zatrzymuje rower',roleEn:'Frontline · stops bikes',cost:18,hp:145,attack:21,interval:.9,speed:.034,range:.035,siege:120,unlock:0},
    {id:'bike',pl:'Rowerzysta',en:'Cyclist',rolePl:'Szybki · dosięga sąsiadki',roleEn:'Fast · catches throwers',cost:22,hp:112,attack:21,interval:.8,speed:.077,range:.034,siege:190,unlock:2},
    {id:'neighbor',pl:'Sąsiadka',en:'Neighbour',rolePl:'Dystans · spowalnia front',roleEn:'Ranged · slows frontline',cost:32,hp:78,attack:18,interval:1.45,speed:.028,range:.155,siege:100,unlock:4},
    {id:'bat',pl:'Dres z kijem',en:'Bat brawler',rolePl:'Ciężki front · szeroki zamach',roleEn:'Heavy front · sweeping swing',cost:32,hp:180,attack:26,interval:1.05,speed:.031,range:.044,siege:160,unlock:5},
    {id:'skater',pl:'Rolkarz',en:'Skater',rolePl:'Szybki · odporny na spowolnienie',roleEn:'Fast · resists slowing',cost:30,hp:125,attack:22,interval:.75,speed:.095,range:.034,siege:230,unlock:7},
    {id:'caretaker',pl:'Dozorca',en:'Caretaker',rolePl:'Wsparcie · regeneruje ekipę',roleEn:'Support · restores the squad',cost:42,hp:210,attack:9,interval:1.4,speed:.025,range:.035,siege:75,unlock:9},
    {id:'heavy',pl:'Wielki Heniek',en:'Big Henry',rolePl:'Osiłek · uderza w grupę',roleEn:'Heavy · hits a crowd',cost:54,hp:280,attack:44,interval:2.3,windup:.55,speed:.022,range:.045,siege:270,unlock:9}
  ];
  // A single role sheet drives combat, card descriptions and the visual kit.
  var roles={
    dres:{role:'front',kit:'tracksuit',weakPl:'kapcie z dystansu',weakEn:'ranged slippers'},
    bike:{role:'fast',kit:'cycling',weakPl:'zablokowany front',weakEn:'a blocked frontline'},
    neighbor:{role:'ranged',kit:'apron',slow:1.3,weakPl:'rower i rolki',weakEn:'bikes and skaters'},
    bat:{role:'front',kit:'vest',splash:{range:.065,factor:.5,limit:1},weakPl:'ostrzał z dystansu',weakEn:'ranged pressure'},
    skater:{role:'fast',kit:'sport',slowFactor:.85,weakPl:'ciężki front',weakEn:'heavy frontline'},
    caretaker:{role:'support',kit:'workcoat',heal:4,aura:.09,weakPl:'sam nie zatrzyma natarcia',weakEn:'cannot stop a push alone'},
    heavy:{role:'front',kit:'heavyvest',splash:{range:.085,factor:.75,limit:Infinity},weakPl:'rozstawiony dystans i długi odpoczynek',weakEn:'spread ranged units and long recovery'}
  };
  function description(id,lang){var c=def(id),r=roles[id];if(!c||!r)return '';var en=lang==='en',parts=[en?c.roleEn:c.rolePl,(en?'Stamina ':'Wytrzymałość ')+c.hp,(en?'Hit ':'Cios ')+c.attack];
    if(r.splash)parts.push((en?'Splash ':'Obszar ')+c.attack*r.splash.factor+(r.splash.limit===1?(en?' · one extra target':' · jeden dodatkowy cel'):(en?' · nearby group':' · pobliska grupa')));
    if(r.slow)parts.push((en?'Slow ':'Spowolnienie ')+r.slow+' s');
    if(r.slowFactor)parts.push(en?'Keeps 85% speed when slowed':'Zachowuje 85% prędkości przy spowolnieniu');
    if(r.heal)parts.push((en?'Allies +':'Sojusznicy +')+r.heal+(en?' stamina/s; does not stack':' wytrzymałości/s; nie kumuluje się'));
    parts.push((en?'Weakness: ':'Słabość: ')+(en?r.weakEn:r.weakPl));return parts.join(' · ');
  }
  function roster(stage){var ids=[stage>=9?'heavy':stage>=5?'bat':'dres'];if(stage>=2)ids.push(stage>=7?'skater':'bike');if(stage>=4)ids.push('neighbor');if(stage>=9)ids.push('caretaker');return ids;}
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
  function archetype(id){return roles[id]?roles[id].role:'support';}
  function multiplier(a,b){a=archetype(a);b=archetype(b);return (a==='front'&&b==='fast')||(a==='fast'&&b==='ranged')||(a==='ranged'&&b==='front')?1.4:1;}
  function step(g,dt,hit){
    var e=g.estate,t=e.tactics;t.clock+=dt;t.p=Math.max(0,t.p-dt);t.e=Math.max(0,t.e-dt);t.ai=Math.max(0,t.ai-dt);
    var stopped=patrol(e),live=e.units.filter(function(u){return u.hp>0;}),attacks=[];
    e.units.forEach(function(u){u.hurt=Math.max(0,u.hurt-dt);u.follow=Math.max(0,(u.follow||0)-dt);u.shock=Math.max(0,(u.shock||0)-dt);u.drawLane=(u.drawLane===undefined?laneOf(u):u.drawLane)+(laneOf(u)-(u.drawLane===undefined?laneOf(u):u.drawLane))*Math.min(1,dt*9);if(u.hp<=0){if(u.retreat)retreat(u,dt);return;}u.slow=Math.max(0,u.slow-dt);u.moving=false;if(stopped)return;
      var c=def(u.kind),dir=u.isP?1:-1,range=c.range*(u.kind==='neighbor'&&e.segment===7?.72:1),target=null,distance=Infinity;
      live.forEach(function(v){if(v.isP===u.isP||(u.kind!=='neighbor'&&laneOf(v)!==laneOf(u)))return;var d=Math.abs(v.x-u.x);if(d<distance){distance=d;target=v;}});
      u.cd=Math.max(0,u.cd-dt);
      if(u.wind>0){u.wind-=dt;if(u.wind<=0){u.follow=.2;if(u.kind==='heavy')u.shock=.35;var victim=live.find(function(v){return v.id===u.target;});if(victim&&(u.kind==='neighbor'||laneOf(victim)===laneOf(u))&&Math.abs(victim.x-u.x)<=range+.035)attacks.push({u:u,v:victim});u.cd=c.interval;}return;}
      if(target&&distance<=range){if(u.cd<=0){u.wind=c.windup||.22;u.target=target.id;}return;}
      var support=roles[u.kind];if(support.heal&&live.some(function(v){var ahead=(v.x-u.x)*dir;return v!==u&&v.hp>0&&v.hp<v.max&&v.isP===u.isP&&ahead>0&&ahead<support.aura;}))return;var advance=c.speed*dt*(u.slow>0?(support.slowFactor||.52):1),nx=u.x+dir*advance;
      // Friends block only their own lane. A stalled marcher may use a clear
      // neighbouring lane, but never teleport through another actor.
      var blocker=live.find(function(v){var ahead=(v.x-u.x)*dir;return v!==u&&v.isP===u.isP&&laneOf(v)===laneOf(u)&&ahead>=0&&ahead<SPACING+advance;});
      u.blocked=blocker?(u.blocked||0)+dt:0;
      if(blocker&&u.blocked>=.45){var free=LANES.find(function(l){return Math.abs(l-laneOf(u))===1&&!live.some(function(v){return v!==u&&laneOf(v)===l&&Math.abs(v.x-u.x)<SPACING*1.4;});});if(free!==undefined){u.lane=free;u.blocked=0;return;}}
      if(blocker)nx=u.x+dir*Math.max(0,Math.min(advance,(blocker.x-u.x)*dir-SPACING));
      if(target&&laneOf(target)===laneOf(u))nx=dir>0?Math.min(nx,target.x-.032):Math.max(nx,target.x+.032);
      u.moving=Math.abs(nx-u.x)>.00001;u.x=nx;u.walk+=u.moving?dt*(u.kind==='heavy'?6:u.kind==='skater'?7:u.kind==='bike'?13:10):0;
      if((u.isP&&u.x>=.81)||(!u.isP&&u.x<=.19)){var base=u.isP?g.e:g.p;hit(base,Math.round(c.siege*(e.segment===11?1.35:1)),base.x+base.w/2,g.GY-30,{estate:true,estateUnit:true});retire(u);}
    });
    attacks.forEach(function(a){var c=def(a.u.kind),damage=c.attack*multiplier(a.u.kind,a.v.kind);if(a.u.kind==='neighbor')e.shots.push({x:a.u.x,from:a.u.x,to:a.v.x,fromLane:laneOf(a.u),toLane:laneOf(a.v),target:a.v.id,isP:a.u.isP,t:0,duration:.32,damage:damage});else{hurt(g,a.v,damage,0);var splash=roles[a.u.kind].splash;if(splash){var victims=live.filter(function(v){return v!==a.v&&v.hp>0&&v.isP!==a.u.isP&&Math.abs(v.x-a.u.x)<splash.range&&Math.abs(laneOf(v)-laneOf(a.u))<=1;}).sort(function(v,w){return Math.abs(v.x-a.u.x)-Math.abs(w.x-a.u.x)||v.id-w.id;});victims.slice(0,splash.limit).forEach(function(v){hurt(g,v,c.attack*splash.factor,0);});}}});
    e.shots=e.shots.filter(function(s){if(stopped)return true;s.t+=dt;var u=e.units.find(function(v){return v.id===s.target;});if(u&&u.hp>0){s.to=u.x;s.toLane=laneOf(u);}s.x=s.from+(s.to-s.from)*Math.min(1,s.t/s.duration);if(s.t<s.duration)return true;if(u)hurt(g,u,s.damage*(e.segment===5&&Math.abs(u.x-.5)<.12?.5:1),roles.neighbor.slow);return false;});
    e.units=e.units.filter(function(u){return u.hp>0||(u.retreat&&u.x>-.04&&u.x<1.04);});
    if(e.segment===3)live.forEach(function(u){if(u.hp>0&&Math.abs(u.x-.5)<.11)u.hp=Math.min(u.max,u.hp+dt*5);});
    live.forEach(function(u){u.recover=Math.max(0,(u.recover||0)-dt);if(!stopped&&u.hp>0&&u.hp<u.max&&live.some(function(v){return v!==u&&v.hp>0&&v.kind==='caretaker'&&v.isP===u.isP&&Math.abs(v.x-u.x)<roles.caretaker.aura;})){u.hp=Math.min(u.max,u.hp+dt*roles.caretaker.heal);u.recover=.25;}});
    if(e.segment===1){var p=live.some(function(u){return u.hp>0&&u.isP&&Math.abs(u.x-.5)<.1;}),q=live.some(function(u){return u.hp>0&&!u.isP&&Math.abs(u.x-.5)<.1;}),owner=p!==q?p:null;if(owner!==t.owner)t.capture=0;t.owner=owner;if(owner!==null){t.capture+=dt;if(t.capture>=5){t.capture-=5;var bank=owner?g.p:g.e;bank.gold=Math.min(9999,bank.gold+6);if(owner)g.stats.goldEarned+=6;}}}else{t.capture=0;t.owner=null;}
  }
  function tick(g,dt,hit,reward,impact){var t=g.estate.tactics,gold=g.stats.goldEarned;t.impact=false;t.carry+=dt;while(t.carry>=1/30&&!g.over){step(g,1/30,hit);t.carry-=1/30;}if(t.impact&&impact)impact();if(reward&&g.stats.goldEarned>gold)reward(true,g.stats.goldEarned-gold);}
  function finish(g,dt){var e=g.estate;e.shots=[];e.units.forEach(function(u){if(u.hp>0)retire(u);retreat(u,dt);});e.units=e.units.filter(function(u){return u.x>-.04&&u.x<1.04;});}
  function line(c,x,y,a,b,color,w){c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();}
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  // All street-level adults share this scale; doorways must fit the actor,
  // never the reverse. Keep the historical unit-size clamp in one adapter.
  function actorScale(height){return Math.min(1.8,Math.max(.62,Math.round(Math.max(24,Math.min(46,height*.064)))/22*.74));}
  function pose(u){var phase=u.walk||0,moving=!!u.moving,cycle=moving?Math.sin(phase):0;
    return {stride:cycle*(u.kind==='skater'?7:u.kind==='heavy'?3:5),lift:moving?Math.max(0,Math.cos(phase))*3:0,
      bob:moving&&u.kind!=='bike'?Math.abs(cycle)*.85:0,
      recoil:(u.hurt||0)/.24*2.5,
      reach:u.wind>0?-Math.sin(u.wind/(u.kind==='heavy'?.55:.22)*Math.PI)*4:(u.follow||0)/.2*9,
      pedalX:Math.cos(phase)*5,pedalY:Math.sin(phase)*5};
  }
  function limb(c,x,y,kx,ky,fx,fy,color,width){line(c,x,y,kx,ky,'#233238',width+1.5);line(c,kx,ky,fx,fy,'#233238',width+1.5);line(c,x,y,kx,ky,color,width);line(c,kx,ky,fx,fy,color,width);line(c,x-1,y+1,kx-1,ky,'#71818a',.8);}
  function outfit(id,team){return {cycling:'#c9b785',apron:'#806977',vest:'#444f58',sport:'#786b91',workcoat:'#687a65',heavyvest:'#60564c'}[(roles[id]||{}).kit]||team;}
  function costume(c,u,head,hip,team){var ink='#233238';
    // Team colour is always on the chest/shoulder, independent of clothing.
    line(c,-7,head+18,7,head+18,team,3);
    if(u.kind==='dres'){line(c,-8,head+13,-4,head+18,'#bed0ca',2);line(c,-4,head+18,1,head+13,'#bed0ca',2);line(c,-6,hip-7,4,hip-7,ink,1);}
    if(u.kind==='bike'){c.fillStyle='#785d3c';c.fillRect(-12,head+16,6,15);line(c,-7,head+15,5,hip-4,'#725d48',2);line(c,-8,hip-2,8,hip-2,team,3);}
    if(u.kind==='bat'){line(c,-7,head+13,-2,head+21,'#c6c1a7',2);line(c,6,head+13,2,head+21,'#c6c1a7',2);c.fillStyle=team;c.fillRect(-7,hip-10,5,4);}
    if(u.kind==='skater'){line(c,-7,head+19,8,head+28,'#e2c88d',3);line(c,-6,hip-2,6,hip-2,team,3);}
    if(u.kind==='neighbor'){line(c,-5,head+17,-6,-20,'#e2d1aa',1.2);line(c,6,head+17,7,-20,'#e2d1aa',1.2);c.fillStyle=team;c.fillRect(-4,-29,8,4);}
  }
  function figure(c,u,x,y,s){
    var bike=u.kind==='bike',neighbor=u.kind==='neighbor',team=u.isP?'#528caa':'#b96552',ink='#233238',phase=u.walk||0,p=pose(u),stride=p.stride,hit=u.hurt>0,attack=p.reach;
    c.save();c.translate(x,y);c.scale((u.facing||((u.isP?1:-1)*(u.retreat?-1:1)))*s,s);ellipse(c,0,1,bike?22:14,3,'rgba(13,24,28,.3)');
    if(u.kind==='heavy'&&u.shock>0&&!u.retreat){c.save();c.globalAlpha=u.shock/.35;c.strokeStyle='#e8ce91';c.lineWidth=2;c.beginPath();c.ellipse(12,0,15+(1-u.shock/.35)*28,5,0,0,Math.PI*2);c.stroke();c.restore();}
    if(bike){[-18,18].forEach(function(xx){ellipse(c,xx,-9,10,10,ink);ellipse(c,xx,-9,7,7,'#a4b4aa');ellipse(c,xx,-9,5.5,5.5,'#526560');for(var n=0;n<3;n++){var a=phase+n*Math.PI/3;line(c,xx-Math.cos(a)*7,-9-Math.sin(a)*7,xx+Math.cos(a)*7,-9+Math.sin(a)*7,'#c4c9b3',.6);}});line(c,-18,-9,-6,-25,'#d4b35f',2);line(c,-6,-25,1,-9,'#d4b35f',2);line(c,1,-9,-18,-9,'#d4b35f',2);line(c,-6,-25,13,-25,'#d4b35f',2);line(c,13,-25,1,-9,'#d4b35f',2);line(c,13,-25,18,-9,'#d4b35f',2);line(c,13,-25,12,-31,ink,2);line(c,12,-31,17,-32,ink,2);line(c,-10,-26,-3,-26,ink,3);}
    var hip=bike?-25:-24,head=bike?-49:neighbor?-55:-58;
    if(bike){[-1,1].forEach(function(side){var fx=1+side*p.pedalX,fy=-9+side*p.pedalY;limb(c,-4,hip,6+side*3,-21,fx,fy,side<0?'#35444f':'#485866',5);line(c,fx-2,fy,fx+4,fy,'#d0c7ae',2.5);line(c,1,-9,fx,fy,ink,1.5);});}
    else{limb(c,-4,hip,-6+stride*.35,-12,-5+stride,-3-p.lift,'#35444f',5);limb(c,4,hip,7-stride*.4,-12,6-stride,-3,'#485866',5);line(c,-7+stride,-3-p.lift,1+stride,-3-p.lift,'#c6bea7',3);line(c,4-stride,-3,12-stride,-3,'#c6bea7',3);}
    c.save();c.translate(-p.recoil,-p.bob);if(u.kind==='heavy')c.scale(1.65,1);c.rotate(hit?-.045:bike?.075+attack*.012:attack*.003);
    c.fillStyle=outfit(u.kind,team);c.strokeStyle=ink;c.lineWidth=1.5;c.beginPath();c.moveTo(-8,head+12);c.lineTo(7,head+12);c.lineTo(neighbor?13:10,neighbor?-15:hip+1);c.lineTo(neighbor?-13:-10,neighbor?-15:hip+1);c.closePath();c.fill();c.stroke();
    c.fillStyle='rgba(20,30,38,.23)';c.beginPath();c.moveTo(4,head+13);c.lineTo(7,head+13);c.lineTo(10,hip);c.lineTo(2,hip);c.closePath();c.fill();line(c,0,head+14,0,hip-2,'#c6c5b4',.8);line(c,-7,hip-2,8,hip-2,ink,2);line(c,2,hip-8,7,hip-9,ink,.8);
    if(neighbor){c.fillStyle='#cbbca0';c.fillRect(-6,-34,13,18);for(var dot=0;dot<4;dot++)ellipse(c,-4+dot*3,-28+dot%2*5,1,1,'#9b6555');}else if(u.kind==='dres'||u.kind==='courier'){line(c,-6,head+14,-7,hip-1,'#dfd7b9',1.3);line(c,-3,head+14,-4,hip-1,'#dfd7b9',1.3);}
    costume(c,u,head,hip,team);limb(c,-7,head+16,-11-stride*.5,head+26,-7-stride,head+32,team,4.5);ellipse(c,-7-stride,head+32,2.5,2.5,'#d5ad88');limb(c,7,head+16,bike?12:12+attack*.5,bike?-36:head+25,bike?17:17+attack,bike?-32:u.cargo?-30:head+22,team,4.5);ellipse(c,bike?17:17+attack,bike?-32:u.cargo?-30:head+22,2.5,2.5,'#d5ad88');
    if(neighbor){ellipse(c,18+attack,head+21,5,2,'#d6b46e');c.strokeStyle=ink;c.lineWidth=1;c.stroke();line(c,-11,-25,-11,-17,'#d1c3a4',1);c.fillStyle='#857f4e';c.fillRect(-16,-19,10,11);}
    c.save();if(u.kind==='heavy')c.scale(.72,1);ellipse(c,0,head+6,6,7.5,'#d4a982');ellipse(c,5,head+7,2.5,2.5,'#d4a982');
    if(neighbor){c.fillStyle='#b38b56';c.beginPath();c.moveTo(-9,head+13);c.lineTo(-8,head-3);c.quadraticCurveTo(3,head-8,8,head+3);c.lineTo(2,head+1);c.lineTo(-4,head+4);c.closePath();c.fill();}else{ellipse(c,-1,head,7,4,ink);if(bike){line(c,-7,head,8,head,team,3);line(c,5,head+1,11,head+2,team,2);}}
    line(c,2,head+5,4,head+(hit?6:5),ink,1.2);line(c,6,head+6,7,head+9,'#986d52',1);line(c,3,head+12,6,head+(hit?11:12),ink,.9);
    line(c,1,head+3,5,head+(hit?5:3),ink,1);line(c,-4,head+8,-3,head+11,'#efc49c',1);line(c,-2,head+14,3,head+15,'#ad7f61',1.4);
    c.restore();if(u.kind==='heavy'){ellipse(c,0,hip-6,12,9,outfit(u.kind,team));line(c,-8,hip-12,8,hip-12,team,3);line(c,0,hip-13,0,hip-2,'#c6bda4',1);line(c,-10,hip,10,hip,ink,3);c.fillStyle='#d9bd77';c.fillRect(-2,hip-2,4,4);line(c,0,head+11,5,head+11,ink,2);line(c,-5,head+1,5,head+1,'#c9a95f',2);}if(u.kind==='courier'){line(c,-8,head-1,8,head-1,team,4);line(c,5,head+1,12,head+1,ink,2);line(c,0,head+11,4,head+13,'#695244',2);c.fillStyle='#d1bd89';c.fillRect(-6,head+21,5,6);line(c,-8,hip-6,8,hip-6,'#d1bd89',2);if(u.cargo){c.fillStyle='#977544';c.strokeStyle=ink;c.lineWidth=1.3;c.fillRect(9,-28,18,14);c.strokeRect(9,-28,18,14);line(c,11,-24,25,-24,'#d1b47a',1.5);line(c,11,-20,25,-20,'#d1b47a',1.5);line(c,12,-30,24,-30,ink,2);}}
    if(u.retreat){line(c,16,-35,16,-50,'#a8aa92',1.2);c.fillStyle='#f4ecd5';c.beginPath();c.moveTo(16,-50);c.quadraticCurveTo(24,-54+Math.sin(phase)*2,29,-48);c.lineTo(29,-40);c.quadraticCurveTo(23,-44,16,-41);c.closePath();c.fill();}
    if(u.kind==='bat'&&!u.retreat){c.save();c.translate(17+attack,head+22);c.rotate(-.55+attack*.13);line(c,0,2,0,-27,ink,6);line(c,0,1,0,-10,'#997343',3);line(c,0,-10,0,-27,'#d3ac6c',5);line(c,-2,-16,-2,-26,'#efd59b',1);c.restore();line(c,-8,head+1,8,head+1,team,3);}
    if(u.kind==='skater'){[-4+stride,8-stride].forEach(function(xx){line(c,xx-4,-1,xx+7,-1,team,4);for(var wh=0;wh<3;wh++)ellipse(c,xx-3+wh*4,2,2,2,ink);});line(c,-6,head-2,6,head-2,'#e9be63',4);line(c,-5,-17,0,-17,team,4);line(c,5,-17,10,-17,team,4);}
    if(u.kind==='caretaker'){c.fillStyle='#687a65';c.fillRect(-9,head+15,18,22);c.fillStyle='#d9c59b';c.fillRect(-5,head+20,7,6);line(c,-8,head+17,8,head+17,team,3);line(c,0,head+19,0,hip-1,'#b4bda3',1);line(c,-9,head-3,10,head-3,team,4);line(c,18,-43,22,-7,'#b49b70',2);c.fillStyle='#b8a780';c.fillRect(16,-9,15,6);for(var br=0;br<4;br++)line(c,18+br*3,-7,18+br*3,-2,'#8a7854',1);line(c,-12,-24,-17,-14,'#bbb9a3',1);c.fillStyle='#9caaa0';c.fillRect(-23,-14,12,11);c.fillStyle='#e2d0a2';c.fillRect(-18,-12,3,7);c.fillRect(-20,-10,7,3);}
    if(u.recover>0&&!u.retreat){line(c,-14,head-3,-14,head+3,'#c5e7a3',2);line(c,-17,head,-11,head,'#c5e7a3',2);}
    c.restore();
    c.restore();
  }
  function draw(c,g,scale,lang){var e=g.estate,t=e.tactics,s=Math.min(1.8,Math.max(.62,scale*.74));
    if(e.segment===1||e.segment===3||e.segment===5){c.save();c.strokeStyle=e.segment===3?'#94b881':e.segment===5?'#c3bba4':t.owner===null?'#d8c492':t.owner?'#79bddd':'#db8f71';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.ellipse(g.W*.5,g.GY-1,g.W*.1,7,0,0,Math.PI*2);c.stroke();c.restore();}
    e.units.slice().sort(function(a,b){return a.drawLane-b.drawLane;}).forEach(function(u){var offset=(u.drawLane===undefined?laneOf(u):u.drawLane)*12*s;figure(c,u,u.x*g.W,g.GY-3+offset,s);if(u.hp>0){var w=23*s,x=u.x*g.W-w/2,y=g.GY-65*s+offset;c.fillStyle='#213139';c.fillRect(x-1,y-1,w+2,4);c.fillStyle=u.isP?'#84c5cf':'#e3a183';c.fillRect(x,y,w*u.hp/u.max,2);}});
    e.shots.forEach(function(v){var q=v.t/v.duration,lane=v.fromLane+(v.toLane-v.fromLane)*q;c.save();c.translate(v.x*g.W,g.GY-38*s+lane*12*s-Math.sin(q*Math.PI)*26*s);c.rotate(v.t*16);ellipse(c,0,0,6*s,2.5*s,'#dab771');c.restore();});
    c.save();c.textAlign='center';c.font='bold '+Math.max(9,Math.min(12,g.W/90))+'px sans-serif';var text=rules[e.segment][lang==='en'?1:0];if(e.segment===9){var phase=t.clock%14;text=(patrol(e)?(lang==='en'?'PATROL — HOLD! ':'PATROL — STAĆ! '):phase>=9?(lang==='en'?'PATROL INCOMING · ':'NADJEŻDŻA PATROL · '):'')+text;}if(e.segment===1&&t.owner!==null)text+=' '+Math.ceil(5-t.capture)+' s';if(g.over)text=lang==='en'?'ENOUGH! Time for tea. Everyone heads home.':'WYSTARCZY! Czas na herbatę. Wracamy do domu.';var y=Math.min(g.H-14,g.GY+48);c.fillStyle='rgba(22,32,36,.88)';c.fillRect(g.W*.16,y-13,g.W*.68,20);c.fillStyle='#f2dfaf';c.fillText(text,g.W*.5,y,g.W*.66);c.restore();
  }
  root.CASTLE_ESTATE_TACTICS={outfit:outfit,roles:roles,description:description,actorScale:actorScale,pose:pose,cards:cards,roster:roster,archetype:archetype,rules:rules,init:init,status:status,recruit:recruit,choose:choose,heal:heal,tick:tick,finish:finish,draw:draw,figure:figure,patrol:patrol,multiplier:multiplier};
})(window);
