(function(root){
  'use strict';
  // Estate combat is isolated from historical UD units. Coordinates are world
  // fractions; a fixed simulation step keeps combat independent of render FPS.
  var cards=[
    {id:'dres',pl:'Dresiarz',en:'Brawler',rolePl:'Front · zatrzymuje rower',roleEn:'Frontline · stops bikes',cost:18,hp:145,attack:21,interval:.9,speed:.034,range:.035,siege:120,unlock:0},
    {id:'bike',pl:'Rowerzysta',en:'Cyclist',rolePl:'Szybki · dosięga sąsiadki',roleEn:'Fast · catches throwers',cost:28,hp:82,attack:17,interval:.8,speed:.077,range:.034,siege:190,unlock:2},
    {id:'neighbor',pl:'Sąsiadka',en:'Neighbour',rolePl:'Dystans · spowalnia front',roleEn:'Ranged · slows frontline',cost:32,hp:78,attack:18,interval:1.45,speed:.028,range:.155,siege:100,unlock:4}
  ];
  var rules=[
    ['Dresiarz trzyma front. Butelki wspierają natarcie.','Brawlers hold the front. Bottles support the attack.'],
    ['Zajmij środek: +6 środków co 5 s bez przeciwnika.','Hold the centre: +6 funds every 5 s uncontested.'],
    ['Rowerzysta: szybki atak na blok, słaby przeciw dresom.','Cyclist: fast base attack, vulnerable to brawlers.'],
    ['Przy zapiekankach środek leczy jednostki obu stron.','The central snack stand heals units on either side.'],
    ['Sąsiadka spowalnia wroga kapciem. Osłoń ją dresem.','Neighbour slippers slow enemies. Protect her with a brawler.'],
    ['Śmietniki osłaniają środek: połowa obrażeń od kapci.','Bins shelter the centre: half damage from slippers.'],
    ['Zjedzona pizza leczy też twoją ekipę o 25 HP.','Eating pizza also heals your squad by 25 HP.'],
    ['Noc: krótszy zasięg sąsiadek. Rower skraca dystans.','Night: neighbours have shorter range. Bikes close the gap.'],
    ['Przy kebabie rekrutacja jest dwukrotnie szybsza.','Recruitment is twice as fast by the kebab stand.'],
    ['Patrol: co 14 s ekipy zamierają na 3 s.','Patrol: every 14 s squads freeze for 3 s.'],
    ['Nocny Express: każda dostawa daje dodatkowe 12 środków.','Night Express: each supply delivery gives 12 extra funds.'],
    ['Finał: jednostki zadają blokom o 35% większe obrażenia.','Finale: units deal 35% more damage to bases.']
  ];
  function def(id){return cards.find(function(c){return c.id===id;});}
  function init(g){var e=g.estate;e.units=[];e.shots=[];e.tactics={clock:0,carry:0,nextId:1,p:0,e:0,ai:0,capture:0,owner:null};}
  function status(g,id,p){var c=def(id),t=g.estate.tactics;if(!c||g.over)return {ok:false,reason:'end'};if(g.estate.segment<c.unlock)return {ok:false,reason:'locked'};if(t[p?'p':'e']>0)return {ok:false,reason:'recruit'};if((p?g.p:g.e).gold<c.cost)return {ok:false,reason:'gold'};return {ok:true,item:c};}
  function recruit(g,id,p){var s=status(g,id,p);if(!s.ok)return false;var c=s.item,e=g.estate,t=e.tactics;(p?g.p:g.e).gold-=c.cost;t[p?'p':'e']=e.segment===8?1.2:2.4;e.units.push({id:t.nextId++,kind:id,isP:p,x:p?.19:.81,hp:c.hp,max:c.hp,cd:.25,wind:0,target:null,slow:0,hurt:0,dead:0,walk:0,moving:false});if(p)g.stats.unitsSpawned++;return true;}
  function choose(g){var e=g.estate,t=e.tactics;if(t.ai>0||t.e>0)return null;var enemies=e.units.filter(function(u){return u.isP&&u.hp>0;});var last=enemies[enemies.length-1],id=last?(last.kind==='bike'?'dres':last.kind==='neighbor'?'bike':'neighbor'):'dres';if(e.segment<def(id).unlock)id='dres';return status(g,id,false).ok?id:null;}
  function heal(g,p,n){g.estate.units.forEach(function(u){if(u.isP===p&&u.hp>0)u.hp=Math.min(u.max,u.hp+n);});}
  function patrol(e){return e.segment===9&&e.tactics.clock%14>=11;}
  function hurt(g,u,amount,slow){if(!u||u.hp<=0)return;g.estate.tactics.impact=true;u.hp=Math.max(0,u.hp-amount);u.hurt=.24;u.slow=Math.max(u.slow,slow||0);if(!u.hp){u.dead=.55;u.wind=0;if(u.isP)g.stats.losses++;else g.stats.kills++;}}
  function multiplier(a,b){return (a==='dres'&&b==='bike')||(a==='bike'&&b==='neighbor')||(a==='neighbor'&&b==='dres')?1.4:1;}
  function step(g,dt,hit){
    var e=g.estate,t=e.tactics;t.clock+=dt;t.p=Math.max(0,t.p-dt);t.e=Math.max(0,t.e-dt);t.ai=Math.max(0,t.ai-dt);
    var stopped=patrol(e),live=e.units.filter(function(u){return u.hp>0;}),attacks=[];
    e.units.forEach(function(u){u.hurt=Math.max(0,u.hurt-dt);if(u.hp<=0){u.dead-=dt;return;}u.slow=Math.max(0,u.slow-dt);u.moving=false;if(stopped)return;
      var c=def(u.kind),dir=u.isP?1:-1,range=c.range*(u.kind==='neighbor'&&e.segment===7?.72:1),target=null,distance=Infinity;
      live.forEach(function(v){if(v.isP===u.isP)return;var d=Math.abs(v.x-u.x);if(d<distance){distance=d;target=v;}});
      u.cd=Math.max(0,u.cd-dt);
      if(u.wind>0){u.wind-=dt;if(u.wind<=0){var victim=live.find(function(v){return v.id===u.target;});if(victim&&Math.abs(victim.x-u.x)<=range+.035)attacks.push({u:u,v:victim});u.cd=c.interval;}return;}
      if(target&&distance<=range){if(u.cd<=0){u.wind=.22;u.target=target.id;}return;}
      var advance=c.speed*dt*(u.slow>0?.52:1),nx=u.x+dir*advance;
      // Queue friends without a hard army cap; ranged troops keep firing over them.
      live.forEach(function(v){if(v===u||v.isP!==u.isP)return;var ahead=(v.x-u.x)*dir;if(ahead>0&&ahead<.025+advance)nx=dir>0?Math.min(nx,v.x-.025):Math.max(nx,v.x+.025);});
      if(target)nx=dir>0?Math.min(nx,target.x-.032):Math.max(nx,target.x+.032);
      u.moving=Math.abs(nx-u.x)>.00001;u.x=nx;u.walk+=u.moving?dt*10:0;
      if((u.isP&&u.x>=.81)||(!u.isP&&u.x<=.19)){var base=u.isP?g.e:g.p;hit(base,Math.round(c.siege*(e.segment===11?1.35:1)),base.x+base.w/2,g.GY-30,{estate:true,estateUnit:true});u.hp=0;u.dead=.35;}
    });
    attacks.forEach(function(a){var c=def(a.u.kind),damage=c.attack*multiplier(a.u.kind,a.v.kind);if(a.u.kind==='neighbor')e.shots.push({x:a.u.x,from:a.u.x,to:a.v.x,target:a.v.id,isP:a.u.isP,t:0,duration:.32,damage:damage});else hurt(g,a.v,damage,0);});
    e.shots=e.shots.filter(function(s){if(stopped)return true;s.t+=dt;var u=e.units.find(function(v){return v.id===s.target;});if(u&&u.hp>0)s.to=u.x;s.x=s.from+(s.to-s.from)*Math.min(1,s.t/s.duration);if(s.t<s.duration)return true;if(u)hurt(g,u,s.damage*(e.segment===5&&Math.abs(u.x-.5)<.12?.5:1),1.3);return false;});
    e.units=e.units.filter(function(u){return u.hp>0||u.dead>0;});
    if(e.segment===3)live.forEach(function(u){if(u.hp>0&&Math.abs(u.x-.5)<.11)u.hp=Math.min(u.max,u.hp+dt*5);});
    if(e.segment===1){var p=live.some(function(u){return u.hp>0&&u.isP&&Math.abs(u.x-.5)<.1;}),q=live.some(function(u){return u.hp>0&&!u.isP&&Math.abs(u.x-.5)<.1;}),owner=p!==q?p:null;if(owner!==t.owner)t.capture=0;t.owner=owner;if(owner!==null){t.capture+=dt;if(t.capture>=5){t.capture-=5;var bank=owner?g.p:g.e;bank.gold=Math.min(9999,bank.gold+6);if(owner)g.stats.goldEarned+=6;}}}else{t.capture=0;t.owner=null;}
  }
  function tick(g,dt,hit,reward,impact){var t=g.estate.tactics,gold=g.stats.goldEarned;t.impact=false;t.carry+=dt;while(t.carry>=1/30&&!g.over){step(g,1/30,hit);t.carry-=1/30;}if(t.impact&&impact)impact();if(reward&&g.stats.goldEarned>gold)reward(true,g.stats.goldEarned-gold);}
  function line(c,x,y,a,b,color,w){c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();}
  function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function figure(c,u,x,y,s){
    var bike=u.kind==='bike',neighbor=u.kind==='neighbor',team=u.isP?'#528caa':'#b96552',ink='#233238',phase=u.walk||0,stride=u.moving?Math.sin(phase)*4:0,hit=u.hurt>0,attack=u.wind>0?Math.sin(u.wind/.22*Math.PI)*7:0;
    c.save();c.translate(x,y);c.scale((u.isP?1:-1)*s,s);c.globalAlpha=u.hp<=0?Math.max(0,u.dead/.55):1;ellipse(c,0,1,bike?22:14,3,'rgba(13,24,28,.3)');if(u.hp<=0)c.rotate(-.45);
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
    c.restore();
  }
  function draw(c,g,scale,lang){var e=g.estate,t=e.tactics,s=Math.min(1.8,Math.max(.62,scale*.74));
    if(e.segment===1||e.segment===3||e.segment===5){c.save();c.strokeStyle=e.segment===3?'#94b881':e.segment===5?'#c3bba4':t.owner===null?'#d8c492':t.owner?'#79bddd':'#db8f71';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.ellipse(g.W*.5,g.GY-1,g.W*.1,7,0,0,Math.PI*2);c.stroke();c.restore();}
    e.units.forEach(function(u){figure(c,u,u.x*g.W,g.GY-3,s);if(u.hp>0){var w=23*s,x=u.x*g.W-w/2,y=g.GY-65*s;c.fillStyle='#213139';c.fillRect(x-1,y-1,w+2,4);c.fillStyle=u.isP?'#84c5cf':'#e3a183';c.fillRect(x,y,w*u.hp/u.max,2);}});
    e.shots.forEach(function(v){c.save();c.translate(v.x*g.W,g.GY-38*s-Math.sin(v.t/v.duration*Math.PI)*26*s);c.rotate(v.t*16);ellipse(c,0,0,6*s,2.5*s,'#dab771');c.restore();});
    c.save();c.textAlign='center';c.font='bold '+Math.max(9,Math.min(12,g.W/90))+'px sans-serif';var text=rules[e.segment][lang==='en'?1:0];if(e.segment===9){var phase=t.clock%14;text=(patrol(e)?(lang==='en'?'PATROL — HOLD! ':'PATROL — STAĆ! '):phase>=9?(lang==='en'?'PATROL INCOMING · ':'NADJEŻDŻA PATROL · '):'')+text;}if(e.segment===1&&t.owner!==null)text+=' '+Math.ceil(5-t.capture)+' s';var y=g.GY+24;c.fillStyle='rgba(22,32,36,.88)';c.fillRect(g.W*.16,y-13,g.W*.68,20);c.fillStyle='#f2dfaf';c.fillText(text,g.W*.5,y,g.W*.66);c.restore();
  }
  root.CASTLE_ESTATE_TACTICS={cards:cards,rules:rules,init:init,status:status,recruit:recruit,choose:choose,heal:heal,tick:tick,draw:draw,figure:figure,patrol:patrol,multiplier:multiplier};
})(window);
