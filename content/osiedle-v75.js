(function(root){
  'use strict';
  // One self-contained interlude. Positions use world fractions so rotation and
  // fullscreen never change a delivery route or an in-flight bottle's target.
  var level=root.CASTLE_FUTURE.levels.modern[3];
  Object.assign(level,{n:'Osiedle Wielkiej Awantury',special:'estate',ul:['drwal'],ai:[],recommended:[],pH:2200,eH:2200,passiveP:1.5,passiveE:1.25,treeCount:0,treeCap:0});
  root.CASTLE_I18N.pl['modern.level.4']=level.n;
  root.CASTLE_I18N.en['modern.level.4']='The Great Concrete Estate Feud';
  var choices=[
    {id:'beer',pl:'Piwo',en:'Beer',cost:12,damage:65,cd:3.8,stamina:18,col:'#957029'},
    {id:'wine',pl:'Wino',en:'Wine',cost:25,damage:150,cd:5.2,stamina:28,col:'#5b793e'},
    {id:'vodka',pl:'Wódka',en:'Vodka',cost:40,damage:255,cd:6.6,stamina:38,col:'#a9d5db'},
    {id:'food',pl:'Jedzenie',en:'Food',cost:10,col:'#d78d46'},
    {id:'runner',pl:'Dostawca',en:'Runner',cost:8,col:'#d3b16d'}
  ];
  var foods=[
    {id:'zapiekanka',pl:'Zapiekanka',en:'Baguette',restore:30,buff:'quick',seconds:4},
    {id:'pickle',pl:'Ogórek',en:'Pickle',restore:22,buff:'reset',seconds:4},
    {id:'pizza',pl:'Pizza',en:'Pizza',restore:44,buff:'regen',seconds:8},
    {id:'kebab',pl:'Kebab',en:'Kebab',restore:58,buff:'efficient',seconds:10}
  ];
  var SEGMENT_SECONDS=7;
  var segments=[
    {id:'balcony',pl:'1/12 Balkonowe otwarcie',en:'1/12 Balcony Opening',hintPl:'Poznaj rzut i dostawę',hintEn:'Learn throw and supply',runner:13,ai:3.2,cd:1,brawlers:0,prop:'balcony',arena:'balcony_canyon',food:false,accent:'#d4c188',tint:'day',supply:2},
    {id:'queue',pl:'2/12 Kolejka do Monopolowego',en:'2/12 Off-licence Queue',hintPl:'Pilnuj zapasu butelek',hintEn:'Watch your bottle stock',runner:12.8,ai:3.05,cd:.99,brawlers:0,prop:'queue',arena:'shopfront',food:false,accent:'#c7a56b',tint:'day',supply:2},
    {id:'bench-league',pl:'3/12 Liga Ławkowa',en:'3/12 Bench League',hintPl:'Pierwsza osiedlowa awantura',hintEn:'First estate scuffle',runner:12.5,ai:2.95,cd:.98,brawlers:1,prop:'bench',arena:'bench_square',food:false,accent:'#b38a63',tint:'warm',supply:2},
    {id:'snack',pl:'4/12 Zapiekanka ratunkowa',en:'4/12 Emergency Baguette',hintPl:'Jedzenie odnawia kondycję',hintEn:'Food restores stamina',runner:12.2,ai:2.9,cd:.97,brawlers:1,prop:'snack',arena:'snack_kiosk',food:true,foodType:0,accent:'#d38a45',tint:'warm',supply:2},
    {id:'carpet',pl:'5/12 Bitwa o trzepak',en:'5/12 Carpet-Rack Clash',hintPl:'Ogórek skraca przestój',hintEn:'Pickle cuts downtime',runner:12,ai:2.8,cd:.95,brawlers:1,prop:'rack',arena:'rack_yard',food:true,foodType:1,accent:'#9f6d5b',tint:'warm',supply:2},
    {id:'bins',pl:'6/12 Śmietnikowy rozejm',en:'6/12 Bin-Shed Truce',hintPl:'Więcej chaosu, ten sam plan',hintEn:'More chaos, same plan',runner:11.7,ai:2.72,cd:.94,brawlers:2,prop:'bins',arena:'bin_alley',food:true,foodType:1,accent:'#76816d',tint:'grey',supply:2},
    {id:'pizza',pl:'7/12 Pizza na pół',en:'7/12 Half-and-Half Pizza',hintPl:'Pizza daje dłuższą regenerację',hintEn:'Pizza grants longer recovery',runner:11.4,ai:2.65,cd:.93,brawlers:2,prop:'pizza',arena:'pizza_pavilion',food:true,foodType:2,accent:'#c47b4f',tint:'sunset',supply:2},
    {id:'night',pl:'8/12 Nocna zmiana',en:'8/12 Night Shift',hintPl:'Noc przyspiesza tempo',hintEn:'Night raises the tempo',runner:11.1,ai:2.55,cd:.91,brawlers:2,prop:'night',arena:'night_gate',food:true,foodType:2,accent:'#62779a',tint:'night',supply:2},
    {id:'kebab',pl:'9/12 Kebab ostatniej szansy',en:'9/12 Last-Chance Kebab',hintPl:'Kebab zmniejsza koszt kondycji',hintEn:'Kebab makes drinks cheaper',runner:10.8,ai:2.48,cd:.90,brawlers:2,prop:'kebab',arena:'kebab_corner',food:true,foodType:3,accent:'#b48754',tint:'night',supply:2},
    {id:'patrol',pl:'10/12 Patrol na sygnale',en:'10/12 Patrol on the Radio',hintPl:'Patrol ucisza bójkę tylko na chwilę',hintEn:'Patrol calms things briefly',runner:10.6,ai:2.42,cd:.89,brawlers:2,prop:'patrol',arena:'parking_patrol',food:true,foodType:3,accent:'#5f86a2',tint:'night',supply:2,patrol:true},
    {id:'closed',pl:'11/12 Monopolowy zamknięty',en:'11/12 Off-licence Closed',hintPl:'Zostaje tylko Nocny Express',hintEn:'Only Night Express remains',runner:9.7,ai:2.35,cd:.88,brawlers:3,prop:'closed',arena:'closed_arcade',food:true,foodType:3,accent:'#855a58',tint:'late',supply:3,nightRunner:true},
    {id:'finale',pl:'12/12 Finał Wielkiej Płyty',en:'12/12 Concrete Finale',hintPl:'Pełna logistyka, pełny chaos',hintEn:'Full logistics, full chaos',runner:9.2,ai:2.22,cd:.84,brawlers:3,prop:'finale',arena:'night_express',food:true,foodType:3,accent:'#c39b64',tint:'finale',supply:3,nightRunner:true,finale:true}
  ];
  var visualSegment=0;
  function active(g){return !!(g&&g.lv&&g.lv.special==='estate');}
  function makeSide(){return {cd:0,action:null,stamina:100,bottles:2,food:0,restT:0,mealT:0,regenBonus:0,costMul:1,notice:'',noticeT:0,combo:0,comboT:0};}
  function init(g){if(!active(g))return;g.trees=[];g.rocks=[];g.gagShown=true;g.gagT=1e9;
    g.estate={time:0,ai:4.4,segment:0,testSegment:null,segmentFlash:2.2,brawlT:1.8,p:makeSide(),e:makeSide(),runners:[],bottles:[],glass:[],brawlers:[],delivered:0,hits:0};visualSegment=0;g.p.gold=g.e.gold=46;
  }
  function side(g,p){return g.estate[p?'p':'e'];}
  function count(g,p){return g.estate.runners.filter(function(r){return r.isP===p;}).length;}
  function segmentOf(g){return segments[Math.max(0,Math.min(segments.length-1,g.estate.segment||0))];}
  function setSegment(g,index,forTest){if(!active(g)||!g.estate)return false;index=Math.max(0,Math.min(segments.length-1,Number(index)||0));g.estate.segment=index;g.estate.testSegment=forTest?index:null;g.estate.time=index*SEGMENT_SECONDS+.05;visualSegment=index;g.estate.segmentFlash=2.2;g.estate.brawlT=.05;g.estate.brawlers=[];ensureBrawlers(g);
    if(forTest){[true,false].forEach(function(p){var st=side(g,p),c=p?g.p:g.e;st.stamina=100;st.bottles=5;st.food=segments[index].food?2:0;st.cd=0;st.restT=0;st.mealT=0;st.regenBonus=0;st.costMul=1;st.notice='';st.noticeT=0;st.combo=0;st.comboT=0;st.action=null;c.gold=240;});g.estate.runners=[];g.estate.bottles=[];}return true;}
  function syncSegment(g){var e=g.estate,next=e.testSegment!==null?e.testSegment:Math.min(segments.length-1,Math.floor(e.time/SEGMENT_SECONDS));if(next!==e.segment){e.segment=next;e.segmentFlash=2.2;e.brawlT=.35;e.brawlers=[];}visualSegment=e.segment;return segmentOf(g);}
  function ensureBrawlers(g){var e=g.estate,seg=segmentOf(g),wanted=seg.brawlers||0;while(e.brawlers.length<wanted){var i=e.brawlers.length;e.brawlers.push({t:i*1.05,seed:e.segment*7+i,type:(e.segment+i)%5});}if(e.brawlers.length>wanted)e.brawlers.length=wanted;}
  function tickBrawlers(g,dt){var e=g.estate;e.brawlT-=dt;if(e.brawlT<=0){ensureBrawlers(g);e.brawlT=5.8;}e.brawlers.forEach(function(b){b.t+=dt;});}
  function itemById(id){return choices.filter(function(i){return i.id===id;})[0];}
  function foodFor(g){var seg=segmentOf(g);return foods[Math.min(foods.length-1,seg.foodType||0)];}
  function staminaCost(g,item,p){var st=side(g,p);return Math.max(8,Math.round((item.stamina||0)*(st.mealT>0?st.costMul:1)));}
  function notice(st,code){st.notice=code;st.noticeT=1.25;}
  function noticeText(code,lang){var pl={gold:'Brak środków',bottles:'Brak pustych butelek',hungry:'Zjedz coś',rest:'Chwila przerwy',limit:'Dwóch dostawców w drodze',locked:'Jedzenie od 4/12',full:'Jedzenie 2/2',supply:'Dostawa: +butelki',food:'Jedzenie dostarczone',eat:'Kondycja w górę',hit:'Celny rzut!'};var en={gold:'Not enough funds',bottles:'No empty bottles',hungry:'Eat something',rest:'Take a short break',limit:'Two runners already out',locked:'Food unlocks at 4/12',full:'Food 2/2',supply:'Supply: +bottles',food:'Food delivered',eat:'Stamina restored',hit:'Direct hit!'};return (lang==='en'?en:pl)[code]||'';}
  function applyFood(g,p){var st=side(g,p),food=foodFor(g);st.stamina=Math.min(100,st.stamina+food.restore);st.mealT=food.seconds||0;st.regenBonus=0;st.costMul=1;
    if(food.buff==='quick')st.regenBonus=.35;
    else if(food.buff==='reset'){st.cd=Math.max(0,st.cd-1.15);st.restT=0;}
    else if(food.buff==='regen')st.regenBonus=.95;
    else if(food.buff==='efficient')st.costMul=.78;
    notice(st,'eat');return food;
  }
  function status(g,id,p){var item=itemById(id),seg=segmentOf(g),st=side(g,p);if(!item||!active(g)||g.over)return {ok:false,reason:'end'};
    if((id==='runner'||id==='food')&&count(g,p)>=2)return {ok:false,reason:'limit'};
    if(id==='food'&&!seg.food)return {ok:false,reason:'locked'};
    if(id==='food'&&st.food>=2)return {ok:false,reason:'full'};
    if(item.damage&&st.restT>0)return {ok:false,reason:'rest'};
    if(item.damage&&st.cd>0)return {ok:false,reason:'wait'};
    if(item.damage&&st.bottles<1)return {ok:false,reason:'bottles'};
    var need=item.damage?staminaCost(g,item,p):0;if(item.damage&&st.stamina<need){var food=foodFor(g);if(!(st.food>0&&st.stamina+food.restore>=need))return {ok:false,reason:'hungry'};}
    if((p?g.p:g.e).gold<item.cost)return {ok:false,reason:'gold'};
    return {ok:true,item:item};
  }
  function buy(g,id,p){var st=side(g,p),s=status(g,id,p);if(!s.ok){notice(st,s.reason);return false;}var item=s.item,seg=segmentOf(g);(p?g.p:g.e).gold-=item.cost;
    if(id==='runner')g.estate.runners.push({isP:p,t:0,duration:seg.runner,seed:g.estate.time,kind:'supply',scooter:!!seg.nightRunner});
    else if(id==='food')g.estate.runners.push({isP:p,t:0,duration:Math.max(6.6,seg.runner*.72),seed:g.estate.time+.3,kind:'food',scooter:!!seg.nightRunner});
    else{var need=staminaCost(g,item,p);if(st.stamina<need&&st.food>0)eat(g,p);st.stamina=Math.max(0,st.stamina-need);st.bottles--;st.cd=item.cd*seg.cd;st.action={item:item,t:0,released:false};st.comboT=Math.max(st.comboT,2.6);}
    return true;
  }
  function eat(g,p){var st=side(g,p);if(st.food<1)return false;st.food--;applyFood(g,p);return true;}
  function anchor(g,p,fromHand){var c=p?g.p:g.e,seg=segmentOf(g);
    if(seg.arena==='balcony_canyon')return {x:c.x+c.w*(.5+(fromHand?(p?1:-1)*.195:0)),y:g.GY-c.h*(fromHand?179/260:.64)};
    var fx=p?c.x+c.w*.77:c.x+c.w*.23;return {x:fx+(fromHand?(p?8:-8):0),y:g.GY-(fromHand?63:55)};}
  function launch(g,a,p){g.estate.bottles.push({isP:p,item:a.item,t:0,duration:1.7,arc:Math.min(g.H*.18,100)});}
  function finishRunner(g,r,reward){var st=side(g,r.isP),c=r.isP?g.p:g.e,seg=segmentOf(g);if(r.kind==='food'){st.food=Math.min(2,st.food+1);notice(st,'food');if(st.stamina<32)eat(g,r.isP);return;}
    var gain=seg.id==='closed'?22:28,pack=seg.supply||2;c.gold=Math.min(9999,c.gold+gain);st.bottles=Math.min(6,st.bottles+pack);notice(st,'supply');if(r.isP){g.stats.goldEarned+=gain;g.estate.delivered++;}if(reward)reward(r.isP,gain);}
  function chooseDrink(g,p){var st=side(g,p),c=p?g.p:g.e,seg=segmentOf(g),order=seg.id==='finale'?['vodka','wine','beer']:seg.id==='closed'?['wine','beer','vodka']:['wine','beer','vodka'];for(var i=0;i<order.length;i++){var id=order[i],it=itemById(id),need=staminaCost(g,it,p);if(c.gold>=it.cost&&st.bottles>0&&(st.stamina>=need||st.food>0))return id;}return null;}
  function tick(g,dt,hit,reward){if(!active(g)||g.over)return;var e=g.estate;e.time+=dt;var seg=syncSegment(g);e.segmentFlash=Math.max(0,e.segmentFlash-dt);tickBrawlers(g,dt);
    [true,false].forEach(function(p){var st=side(g,p);st.cd=Math.max(0,st.cd-dt);st.restT=Math.max(0,st.restT-dt);st.noticeT=Math.max(0,st.noticeT-dt);st.comboT=Math.max(0,st.comboT-dt);if(st.comboT<=0)st.combo=0;
      if(st.mealT>0){st.mealT=Math.max(0,st.mealT-dt);if(st.mealT<=0){st.regenBonus=0;st.costMul=1;}}
      var baseRegen=seg.food?.16:.52;st.stamina=Math.min(100,st.stamina+dt*(baseRegen+st.regenBonus));
      if(st.action){st.action.t+=dt;if(st.action.t>=1.05&&!st.action.released){st.action.released=true;launch(g,st.action,p);}if(st.action.t>=1.65)st.action=null;}});
    e.runners=e.runners.filter(function(r){r.t+=dt;if(r.t<r.duration)return true;finishRunner(g,r,reward);return false;});
    e.bottles=e.bottles.filter(function(b){b.t+=dt;if(b.t<b.duration)return true;var target=anchor(g,!b.isP);hit(b.isP?g.e:g.p,b.item.damage,target.x,target.y,{estate:true});e.hits++;var shooter=side(g,b.isP);shooter.combo=Math.min(9,(shooter.combo||0)+1);shooter.comboT=2.8;notice(shooter,'hit');
      e.impacts=e.impacts||[];e.impacts.push({x:target.x,y:target.y,t:0,col:b.item.col,power:b.item.id==='vodka'?1.35:b.item.id==='wine'?1.1:.9});
      if(shooter.stamina<10)shooter.restT=2.4;if(seg.finale){var owner=b.isP?g.p:g.e;owner.gold=Math.min(9999,owner.gold+3);}for(var i=0;i<(b.item.id==='vodka'?10:7);i++)e.glass.push({p:!b.isP,t:0,vx:(i-4)*11,vy:-18-i*3,col:b.item.col});return false;});
    e.glass=e.glass.filter(function(s){s.t+=dt;return s.t<.65;});e.impacts=(e.impacts||[]).filter(function(v){v.t+=dt;return v.t<.55;});
    e.ai-=dt;if(e.ai<=0){e.ai=seg.ai;var es=side(g,false),drink=chooseDrink(g,false);
      if(count(g,false)<1&&(es.bottles<2||g.e.gold<22))buy(g,'runner',false);
      if(seg.food&&es.stamina<50&&es.food<1)buy(g,'food',false);
      if(es.stamina<30&&es.food>0)eat(g,false);
      if(drink)buy(g,drink,false);else if(es.bottles<1)buy(g,'runner',false);
    }
  }
  function bottle(ctx,item,x,y,scale,angle){ctx.save();ctx.translate(x,y);ctx.rotate(angle||0);ctx.scale(scale,scale);ctx.lineWidth=1.3;ctx.strokeStyle='#283c3d';ctx.fillStyle=item.col;
    ctx.beginPath();ctx.moveTo(-2,-16);ctx.lineTo(2,-16);ctx.lineTo(2,-9);ctx.lineTo(5,-6);ctx.lineTo(5,8);ctx.quadraticCurveTo(5,11,2,11);ctx.lineTo(-3,11);ctx.quadraticCurveTo(-5,11,-5,8);ctx.lineTo(-5,-6);ctx.lineTo(-2,-9);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#eee0b8';ctx.fillRect(-4,-2,8,7);ctx.fillStyle=item.id==='wine'?'#944752':item.id==='vodka'?'#547dad':'#aa713b';ctx.fillRect(-2,0,4,3);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillRect(-3,-7,1,7);ctx.restore();
  }
  function line(ctx,x,y,xx,yy,col,w){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}
  function foodIcon(ctx,x,y,scale,type){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);if(type===3){ctx.fillStyle='#d9a16a';ctx.beginPath();ctx.moveTo(-9,6);ctx.lineTo(8,8);ctx.lineTo(5,-8);ctx.lineTo(-6,-6);ctx.closePath();ctx.fill();ctx.fillStyle='#6e9a56';ctx.fillRect(-5,-4,9,3);}else if(type===2){ctx.fillStyle='#d9a65d';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#b94638';ctx.beginPath();ctx.arc(-3,-2,2,0,Math.PI*2);ctx.arc(4,2,2,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#dca65f';ctx.fillRect(-10,-5,20,10);ctx.fillStyle='#eee0a4';ctx.fillRect(-7,-3,14,6);if(type===1){ctx.fillStyle='#709658';ctx.fillRect(-5,-1,10,2);}}ctx.restore();}
  function person(ctx,x,y,scale,team,step,carrying){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);var swing=Math.sin(step)*5;
    line(ctx,-4,-17,-6+swing,-2,'#283846',5);line(ctx,4,-17,6-swing,-2,'#283846',5);
    ctx.fillStyle=team;ctx.beginPath();ctx.moveTo(-7,-34);ctx.lineTo(7,-34);ctx.lineTo(9,-16);ctx.lineTo(-8,-16);ctx.closePath();ctx.fill();
    line(ctx,-6,-31,-10-swing*.6,-20,'#d5a77e',4);line(ctx,6,-31,11+swing*.6,-22,'#d5a77e',4);
    ctx.fillStyle='#e1b38b';ctx.beginPath();ctx.ellipse(0,-40,6,7,0,0,Math.PI*2);ctx.fill();line(ctx,2,-40,4,-40,'#38413c',1);line(ctx,-5,-31,0,-27,'#c3c6b3',2);line(ctx,0,-27,5,-31,'#c3c6b3',2);line(ctx,-6+swing,-2,-2+swing,-2,'#202d34',4);line(ctx,6-swing,-2,10-swing,-2,'#202d34',4);ctx.fillStyle='#59433c';ctx.beginPath();ctx.ellipse(0,-45,6,3,0,Math.PI,Math.PI*2);ctx.fill();
    if(carrying){ctx.fillStyle='#a47e45';ctx.fillRect(6,-23,14,11);if(carrying==='food')foodIcon(ctx,13,-19,.55,2);else for(var b=0;b<3;b++)bottle(ctx,choices[b],9+b*4,-25,.3,0);ctx.strokeStyle='#644f32';ctx.strokeRect(6,-23,14,11);}ctx.restore();
  }
  function menelFace(slot){var m=root.CASTLE_MENELE;return m&&typeof m.face==='function'?m.face(slot):null;}
  function menelStyle(slot,fallback){var m=root.CASTLE_MENELE;return m&&typeof m.style==='function'?Number(m.style(slot))||0:fallback;}
  function menelName(slot){var m=root.CASTLE_MENELE;return m&&typeof m.name==='function'?String(m.name(slot)||'').slice(0,14):'';}
  function brawler(ctx,x,y,scale,dir,type,phase,faceImg,drawFace,style){
    style=style===undefined?type%4:style;var shirts=['#76554c','#476779','#6e674b','#544f68'],skin=['#d0a27c','#b88a68','#dda982','#c99672'],shirt=shirts[style%4],face=skin[type%skin.length];
    ctx.save();ctx.translate(x,y);ctx.scale(dir*scale,scale);var hit=Math.sin(phase*2.4),duck=Math.max(0,Math.sin(phase*.72))*2;
    line(ctx,-3,-16,-5-hit*2,-2,'#28343a',5);line(ctx,4,-16,7+hit*2,-2,'#28343a',5);
    ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-9,-34+duck);ctx.lineTo(9,-34+duck);ctx.lineTo(10,-16);ctx.lineTo(-10,-16);ctx.closePath();ctx.fill();
    if(style===1){ctx.fillStyle='rgba(230,235,225,.72)';ctx.fillRect(-11,-25+duck,7,12);} // reklamówka
    if(style===2){ctx.strokeStyle='#d6b65e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-8,-30+duck);ctx.lineTo(8,-30+duck);ctx.stroke();} // opaska
    line(ctx,-6,-30+duck,-12-hit*5,-21,'#c89a76',5);line(ctx,6,-30+duck,13+hit*7,-25,'#c89a76',5);
    if(faceImg&&drawFace){ctx.save();ctx.translate(0,-41+duck);drawFace(ctx,faceImg,-8,-9,16,18,0);ctx.restore();}
    else{ctx.fillStyle=face;ctx.beginPath();ctx.ellipse(0,-41+duck,6.7,7.5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=style===3?'#343b48':'#4c4139';ctx.beginPath();ctx.ellipse(0,-46+duck,7,3.2,0,Math.PI,Math.PI*2);ctx.fill();}
    if(style===0){ctx.fillStyle='#3b4143';ctx.fillRect(-8,-49+duck,16,3);}
    if(style===3){ctx.strokeStyle='#1f292d';ctx.lineWidth=1;ctx.strokeRect(-6,-44+duck,5,3);ctx.strokeRect(1,-44+duck,5,3);line(ctx,-1,-42.5,1,-42.5,'#1f292d',1);}
    ctx.restore();
  }
  function drawBrawlers(ctx,g,unitScale,drawFace){
    g.estate.brawlers.forEach(function(b,i){var center=g.W*(.42+i*.08),phase=(b.t+b.seed*.37)%6.2,clash=phase<3.7?1:0,sep=clash?(22-Math.sin(phase*1.8)*7):29;
      var aSlot=i%2,zSlot=(i+1)%2;
      brawler(ctx,center-sep,g.GY,Math.max(.72,unitScale*.96),1,b.type,phase,menelFace(aSlot),drawFace,menelStyle(aSlot,b.type%4));
      brawler(ctx,center+sep,g.GY,Math.max(.72,unitScale*.96),-1,b.type+1,phase+1.4,menelFace(zSlot),drawFace,menelStyle(zSlot,(b.type+1)%4));
      if(!clash){ctx.save();ctx.fillStyle='#eee1bd';ctx.fillRect(center-8,g.GY-45,16,10);ctx.strokeStyle='#6c5b45';ctx.strokeRect(center-8,g.GY-45,16,10);
        var an=menelName(aSlot),zn=menelName(zSlot);ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#f0dfb8';if(an)ctx.fillText(an,center-sep,g.GY-58);if(zn)ctx.fillText(zn,center+sep,g.GY-58);ctx.restore();}
    });
  }
  function sky(ctx,w,gy,top,bottom){var gr=ctx.createLinearGradient(0,0,0,gy);gr.addColorStop(0,top);gr.addColorStop(1,bottom);ctx.fillStyle=gr;ctx.fillRect(0,0,w,gy);}
  function distantBlock(ctx,x,gy,w,h,lit){ctx.fillStyle=lit?'#58646c':'#778078';ctx.fillRect(x,gy-h,w,h);ctx.fillStyle=lit?'#d6bd78':'#b9baa7';for(var r=0;r<5;r++)for(var q=0;q<3;q++)ctx.fillRect(x+6+q*(w-12)/3,gy-h+10+r*(h-18)/5,Math.max(3,w*.12),Math.max(3,h*.055));}
  function lamp(ctx,x,y,on){ctx.strokeStyle='#4c5353';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-90);ctx.lineTo(x+18,y-90);ctx.stroke();ctx.fillStyle=on?'#f1d58b':'#9aa1a0';ctx.beginPath();ctx.ellipse(x+22,y-89,9,5,0,0,Math.PI*2);ctx.fill();}
  function car(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=col;ctx.fillRect(-28,-17,56,14);ctx.beginPath();ctx.moveTo(-17,-17);ctx.lineTo(-8,-29);ctx.lineTo(15,-29);ctx.lineTo(25,-17);ctx.closePath();ctx.fill();ctx.fillStyle='#b9c9c7';ctx.fillRect(-6,-27,18,8);ctx.fillStyle='#252d30';ctx.beginPath();ctx.arc(-17,0,7,0,Math.PI*2);ctx.arc(18,0,7,0,Math.PI*2);ctx.fill();ctx.restore();}
  function kiosk(ctx,x,y,w,h,sign,body,accent){ctx.fillStyle=body;ctx.fillRect(x-w/2,y-h,w,h);ctx.fillStyle=accent;ctx.fillRect(x-w/2-3,y-h-18,w+6,18);ctx.fillStyle='#fff0c4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(sign,x,y-h-5);ctx.fillStyle='#2f3b3b';ctx.fillRect(x-w*.34,y-h*.67,w*.68,h*.42);ctx.fillStyle='#d9c88f';ctx.fillRect(x-w*.30,y-h*.63,w*.60,3);}
  function drawArenaBackdrop(ctx,w,gy,seg){
    ctx.save();
    if(seg.arena==='balcony_canyon'){sky(ctx,w,gy,'#7fa5b2','#c5c6ab');distantBlock(ctx,w*.02,gy,w*.24,gy*.66,false);distantBlock(ctx,w*.74,gy,w*.24,gy*.69,false);}
    else if(seg.arena==='shopfront'){sky(ctx,w,gy,'#8aa6af','#d0c5a5');distantBlock(ctx,w*.78,gy,w*.19,gy*.45,false);ctx.fillStyle='#887f6a';ctx.fillRect(0,gy*.63,w*.72,gy*.27);}
    else if(seg.arena==='bench_square'){sky(ctx,w,gy,'#88b3c2','#cfcea9');distantBlock(ctx,w*.05,gy,w*.16,gy*.37,false);distantBlock(ctx,w*.79,gy,w*.17,gy*.34,false);ctx.fillStyle='#7f9a68';ctx.fillRect(0,gy*.73,w,gy*.27);}
    else if(seg.arena==='snack_kiosk'){sky(ctx,w,gy,'#b6a68c','#dfc18f');ctx.fillStyle='#86745e';ctx.fillRect(0,gy*.72,w,gy*.28);distantBlock(ctx,w*.78,gy,w*.18,gy*.30,false);}
    else if(seg.arena==='rack_yard'){sky(ctx,w,gy,'#9da4a0','#c8b7a0');ctx.fillStyle='#7c756c';for(var i=0;i<6;i++){ctx.fillRect(i*w/6,gy*.60,w/6-3,gy*.30);ctx.fillStyle='#5e5d59';ctx.fillRect(i*w/6+5,gy*.66,w/6-13,gy*.22);ctx.fillStyle='#7c756c';}}
    else if(seg.arena==='bin_alley'){sky(ctx,w,gy,'#808d8a','#aaa99a');ctx.fillStyle='#727873';ctx.fillRect(0,gy*.64,w,gy*.36);ctx.fillStyle='#555d59';for(var b=0;b<4;b++)ctx.fillRect(w*.13+b*w*.22,gy*.73,w*.13,gy*.18);}
    else if(seg.arena==='pizza_pavilion'){sky(ctx,w,gy,'#b66f68','#e5b478');ctx.fillStyle='#75625a';ctx.fillRect(0,gy*.68,w,gy*.32);distantBlock(ctx,w*.05,gy,w*.18,gy*.32,false);}
    else if(seg.arena==='night_gate'){sky(ctx,w,gy,'#1f304b','#566377');distantBlock(ctx,0,gy,w*.36,gy*.70,true);distantBlock(ctx,w*.64,gy,w*.36,gy*.70,true);ctx.fillStyle='#222c35';ctx.fillRect(w*.36,gy*.39,w*.28,gy*.61);}
    else if(seg.arena==='kebab_corner'){sky(ctx,w,gy,'#222a43','#5d4c59');ctx.fillStyle='#3d3c43';ctx.fillRect(0,gy*.68,w,gy*.32);distantBlock(ctx,w*.75,gy,w*.20,gy*.39,true);}
    else if(seg.arena==='parking_patrol'){sky(ctx,w,gy,'#26344d','#6b6f77');ctx.fillStyle='#53575b';ctx.fillRect(0,gy*.68,w,gy*.32);for(var p=0;p<5;p++)car(ctx,w*(.1+p*.2),gy*.82,.65,p%2?'#5d6975':'#75635d');}
    else if(seg.arena==='closed_arcade'){sky(ctx,w,gy,'#1b2031','#47434c');ctx.fillStyle='#4a4546';ctx.fillRect(0,gy*.59,w,gy*.41);for(var s=0;s<5;s++){ctx.fillStyle='#313033';ctx.fillRect(s*w/5+5,gy*.65,w/5-10,gy*.26);ctx.strokeStyle='#6e6260';for(var rr=0;rr<6;rr++){ctx.beginPath();ctx.moveTo(s*w/5+8,gy*.68+rr*11);ctx.lineTo((s+1)*w/5-8,gy*.68+rr*11);ctx.stroke();}}}
    else{sky(ctx,w,gy,'#251c3d','#695060');distantBlock(ctx,w*.02,gy,w*.20,gy*.42,true);distantBlock(ctx,w*.78,gy,w*.20,gy*.44,true);ctx.fillStyle='#4c4550';ctx.fillRect(0,gy*.72,w,gy*.28);}
    ctx.restore();
  }
  function drawArenaScene(ctx,g,seg){
    var y=g.GY,mid=g.W*.5,t=g.estate.time;ctx.save();
    if(seg.arena==='balcony_canyon'){ctx.strokeStyle='#b7b29f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(g.W*.18,y-110);ctx.lineTo(g.W*.82,y-95);ctx.stroke();for(var l=0;l<5;l++){ctx.fillStyle=l%2?'#b34f4b':'#dfd2b8';ctx.fillRect(g.W*.28+l*g.W*.09,y-106+l*2,20,10);}}
    else if(seg.arena==='shopfront'){kiosk(ctx,mid,y,170,80,'MONOPOLOWY','#6b6557','#a64e3f');for(var q=0;q<5;q++)person(ctx,mid-95+q*24,y,.72,'#6f7568',q+t,false);}
    else if(seg.arena==='bench_square'){ctx.fillStyle='#6a4f3f';ctx.fillRect(mid-90,y-22,180,9);ctx.fillRect(mid-82,y-13,7,13);ctx.fillRect(mid+75,y-13,7,13);ctx.fillStyle='#909985';ctx.fillRect(mid-8,y-74,16,52);ctx.strokeStyle='#c9d0c0';ctx.lineWidth=2;ctx.strokeRect(mid-30,y-110,60,36);}
    else if(seg.arena==='snack_kiosk'){kiosk(ctx,mid,y,180,92,'ZAPIEKANKI','#75543c','#d58c43');ctx.fillStyle='rgba(245,235,205,.35)';for(var st=0;st<4;st++){ctx.beginPath();ctx.arc(mid-30+st*18,y-105-(st%2)*8,8+st*3,0,Math.PI*2);ctx.fill();}}
    else if(seg.arena==='rack_yard'){ctx.strokeStyle='#808a84';ctx.lineWidth=6;ctx.strokeRect(mid-72,y-100,144,94);ctx.fillStyle='#9f4e48';ctx.fillRect(mid-58,y-88,116,70);ctx.strokeStyle='#e1bf73';ctx.lineWidth=3;for(var cp=0;cp<6;cp++){ctx.beginPath();ctx.moveTo(mid-55,y-82+cp*11);ctx.lineTo(mid+55,y-68+cp*11);ctx.stroke();}}
    else if(seg.arena==='bin_alley'){ctx.fillStyle='#4f6258';for(var bin=-2;bin<=2;bin++){ctx.fillRect(mid+bin*47-19,y-52,38,47);ctx.fillStyle='#34443d';ctx.fillRect(mid+bin*47-22,y-57,44,7);ctx.fillStyle='#4f6258';}ctx.fillStyle='#725f51';ctx.fillRect(mid+95,y-30,60,25);ctx.fillStyle='#806c59';ctx.fillRect(mid+103,y-46,44,18);}
    else if(seg.arena==='pizza_pavilion'){kiosk(ctx,mid,y,190,88,'PIZZA 24','#604b46','#b94d3f');for(var sc=0;sc<3;sc++)car(ctx,mid-105+sc*105,y-8,.50,sc%2?'#4d6473':'#79605a');}
    else if(seg.arena==='night_gate'){ctx.fillStyle='#313944';ctx.fillRect(mid-125,y-150,250,150);ctx.fillStyle='#151b22';ctx.beginPath();ctx.arc(mid,y-15,75,Math.PI,0);ctx.lineTo(mid+75,y);ctx.lineTo(mid-75,y);ctx.closePath();ctx.fill();lamp(ctx,mid-115,y-5,true);lamp(ctx,mid+95,y-5,true);}
    else if(seg.arena==='kebab_corner'){kiosk(ctx,mid,y,165,94,'KEBAB 24','#54463d','#c89a55');ctx.fillStyle='#d9b36a';ctx.fillRect(mid-7,y-77,14,50);ctx.fillStyle='#8a4c38';for(var k=0;k<5;k++)ctx.fillRect(mid-5,y-72+k*9,10,6);ctx.fillStyle='#b8a27a';for(var ch=-1;ch<=1;ch+=2){ctx.fillRect(mid+ch*78,y-20,28,4);ctx.fillRect(mid+ch*82,y-16,4,16);}}
    else if(seg.arena==='parking_patrol'){for(var cc=0;cc<4;cc++)car(ctx,mid-170+cc*112,y-8,.62,cc%2?'#657889':'#7b655c');var px=(t*70)%(g.W+130)-65;car(ctx,px,y-8,.72,'#486b88');ctx.fillStyle='#7db8da';ctx.fillRect(px-4,y-42,10,5);}
    else if(seg.arena==='closed_arcade'){ctx.fillStyle='#504a49';ctx.fillRect(mid-125,y-92,250,87);ctx.fillStyle='#333236';ctx.fillRect(mid-105,y-79,210,68);ctx.strokeStyle='#776a65';ctx.lineWidth=4;for(var rr=0;rr<8;rr++){ctx.beginPath();ctx.moveTo(mid-103,y-73+rr*8);ctx.lineTo(mid+103,y-73+rr*8);ctx.stroke();}ctx.fillStyle='#e6d8b2';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',mid,y-45);}
    else{var van=(t*55)%(g.W+220)-110;ctx.fillStyle='#6e4c70';ctx.fillRect(van-48,y-48,96,38);ctx.fillStyle='#d8c18c';ctx.fillRect(van-32,y-61,48,14);ctx.fillStyle='#f3dfa9';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('NOCNY EXPRESS',van,y-51);ctx.fillStyle='#222b31';ctx.beginPath();ctx.arc(van-28,y-7,9,0,Math.PI*2);ctx.arc(van+29,y-7,9,0,Math.PI*2);ctx.fill();for(var fl=0;fl<14;fl++){ctx.fillStyle=fl%2?'#efc56f':'#cf6a68';ctx.beginPath();ctx.arc(g.W*.20+fl*g.W*.045,y-135-(fl%2)*5,2.5,0,Math.PI*2);ctx.fill();}}
    ctx.restore();
  }
  function stageBadge(ctx,g,lang){var seg=segmentOf(g),showHint=g.estate.segmentFlash>0,alpha=showHint?1:.78,w=Math.min(320,g.W*.38),x=(g.W-w)/2,y=Math.max(46,Math.min(82,g.GY*.16));
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='rgba(31,41,46,.80)';ctx.fillRect(x,y,w,showHint?37:24);ctx.strokeStyle=seg.accent||'rgba(238,219,176,.55)';ctx.strokeRect(x+.5,y+.5,w-1,(showHint?36:23));
    ctx.fillStyle='#f3dfb5';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(lang==='en'?seg.en:seg.pl,g.W*.5,y+16);
    if(showHint){ctx.font='10px sans-serif';ctx.fillStyle='#cad4cf';ctx.fillText(lang==='en'?seg.hintEn:seg.hintPl,g.W*.5,y+30);}ctx.restore();
  }
  function damageScratches(ctx,c,x,y,w,h){var d=Math.max(0,1-c.hp/c.max),n=Math.floor(d*8);ctx.strokeStyle='rgba(43,51,51,.72)';ctx.lineWidth=1.4;for(var i=0;i<n;i++){var px=x+8+(i*31)%Math.max(12,w-20),py=y+10+(i*19)%Math.max(12,h-18);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+7,py+7);ctx.lineTo(px+3,py+14);ctx.stroke();}}
  function arenaBase(ctx,c,ground){
    var seg=segments[visualSegment]||segments[0],x=c.x,w=c.w,h=c.h,isP=c.isP,team=isP?'#5686a4':'#a96960';ctx.save();
    if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*30);}
    if(seg.arena==='balcony_canyon'){var bh=h;ctx.fillStyle=isP?'#aab0a2':'#b2a59b';ctx.fillRect(x+4,ground-bh,w-8,bh);ctx.fillStyle='#52666a';for(var r=0;r<6;r++)for(var q=0;q<3;q++)ctx.fillRect(x+16+q*(w-42)/2,ground-bh+15+r*(bh-40)/6,22,17);ctx.fillStyle=team;ctx.fillRect(x+5,ground-40,w-10,35);damageScratches(ctx,c,x+4,ground-bh,w-8,bh);}
    else if(seg.arena==='shopfront'){ctx.fillStyle='#817b68';ctx.fillRect(x+5,ground-118,w-10,113);ctx.fillStyle=team;ctx.fillRect(x+2,ground-128,w-4,20);ctx.fillStyle='#eee0b7';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(isP?'PAWILON A':'PAWILON B',x+w/2,ground-114);ctx.fillStyle='#2d3637';ctx.fillRect(x+18,ground-95,w-36,75);damageScratches(ctx,c,x+8,ground-105,w-16,90);}
    else if(seg.arena==='bench_square'){ctx.fillStyle='#8b8a78';ctx.fillRect(x+8,ground-52,w-16,47);ctx.fillStyle=team;ctx.fillRect(x+8,ground-58,w-16,9);ctx.fillStyle='#6b4f3e';ctx.fillRect(x+24,ground-87,w-48,8);ctx.fillRect(x+30,ground-79,6,27);ctx.fillRect(x+w-36,ground-79,6,27);damageScratches(ctx,c,x+8,ground-52,w-16,47);}
    else if(seg.arena==='snack_kiosk'){ctx.fillStyle='#72533f';ctx.fillRect(x+8,ground-105,w-16,100);ctx.fillStyle='#d58c43';ctx.fillRect(x+4,ground-122,w-8,20);ctx.fillStyle='#2e3736';ctx.fillRect(x+22,ground-82,w-44,48);damageScratches(ctx,c,x+8,ground-105,w-16,100);}
    else if(seg.arena==='rack_yard'){ctx.fillStyle='#77736c';ctx.fillRect(x+6,ground-94,w-12,89);ctx.strokeStyle='#545451';ctx.lineWidth=3;for(var g=0;g<5;g++){ctx.beginPath();ctx.moveTo(x+13,ground-82+g*16);ctx.lineTo(x+w-13,ground-82+g*16);ctx.stroke();}ctx.fillStyle=team;ctx.fillRect(x+8,ground-101,w-16,9);damageScratches(ctx,c,x+6,ground-94,w-12,89);}
    else if(seg.arena==='bin_alley'){ctx.fillStyle='#53665c';ctx.fillRect(x+10,ground-72,w-20,67);ctx.fillStyle='#33443e';ctx.fillRect(x+6,ground-80,w-12,10);ctx.fillStyle=team;ctx.fillRect(x+18,ground-88,w-36,8);damageScratches(ctx,c,x+10,ground-72,w-20,67);}
    else if(seg.arena==='pizza_pavilion'){ctx.fillStyle='#66514c';ctx.fillRect(x+6,ground-103,w-12,98);ctx.fillStyle='#b94d3f';ctx.fillRect(x+2,ground-122,w-4,21);ctx.fillStyle='#f0d590';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(isP?'PIZZA A':'PIZZA B',x+w/2,ground-108);ctx.fillStyle='#273334';ctx.fillRect(x+22,ground-82,w-44,51);damageScratches(ctx,c,x+6,ground-103,w-12,98);}
    else if(seg.arena==='night_gate'){ctx.fillStyle='#4b545c';ctx.fillRect(x+5,ground-155,w-10,150);ctx.fillStyle='#171d23';ctx.beginPath();ctx.arc(x+w/2,ground-5,w*.28,Math.PI,0);ctx.lineTo(x+w*.78,ground-5);ctx.lineTo(x+w*.22,ground-5);ctx.closePath();ctx.fill();ctx.fillStyle=team;ctx.fillRect(x+7,ground-163,w-14,9);damageScratches(ctx,c,x+5,ground-155,w-10,150);}
    else if(seg.arena==='kebab_corner'){ctx.fillStyle='#55483e';ctx.fillRect(x+9,ground-108,w-18,103);ctx.fillStyle='#c89a55';ctx.fillRect(x+4,ground-127,w-8,21);ctx.fillStyle='#fff0bd';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(isP?'KEBAB A':'KEBAB B',x+w/2,ground-113);ctx.fillStyle='#2b3434';ctx.fillRect(x+26,ground-87,w-52,52);damageScratches(ctx,c,x+9,ground-108,w-18,103);}
    else if(seg.arena==='parking_patrol'){car(ctx,x+w/2,ground-5,Math.max(.75,w/165),isP?'#5a7284':'#81655f');ctx.fillStyle=team;ctx.fillRect(x+18,ground-57,w-36,7);damageScratches(ctx,c,x+14,ground-48,w-28,42);}
    else if(seg.arena==='closed_arcade'){ctx.fillStyle='#4f4a49';ctx.fillRect(x+5,ground-108,w-10,103);ctx.fillStyle='#2d2d30';ctx.fillRect(x+17,ground-91,w-34,74);ctx.strokeStyle='#766964';ctx.lineWidth=3;for(var rr=0;rr<7;rr++){ctx.beginPath();ctx.moveTo(x+20,ground-84+rr*10);ctx.lineTo(x+w-20,ground-84+rr*10);ctx.stroke();}ctx.fillStyle=team;ctx.fillRect(x+8,ground-117,w-16,8);damageScratches(ctx,c,x+5,ground-108,w-10,103);}
    else{ctx.fillStyle='#56505a';ctx.fillRect(x+10,ground-65,w-20,60);ctx.fillStyle=team;ctx.fillRect(x+12,ground-73,w-24,8);ctx.fillStyle='#d2bd8a';for(var box=0;box<3;box++)ctx.fillRect(x+24+box*32,ground-48-(box%2)*10,24,18);damageScratches(ctx,c,x+10,ground-65,w-20,60);}
    ctx.restore();
  }
  function resident(ctx,g,p,img,drawFace){var c=p?g.p:g.e,seg=segmentOf(g);if(c.collapseT)return;var st=side(g,p),a=st.action,t=a?a.t:0,dir=p?1:-1;
    if(seg.arena==='balcony_canyon'){ctx.save();ctx.translate(c.x+c.w*.5,g.GY);ctx.scale(c.w/200,c.h/260);ctx.beginPath();ctx.rect(-41,-222,82,92);ctx.clip();var lean=a&&t<1.05?Math.sin(Math.min(1,t/.7)*Math.PI*.5)*4:0;
      ctx.fillStyle=p?'#608cac':'#b66b5c';ctx.beginPath();ctx.moveTo(-27,-128);ctx.lineTo(-22,-173);ctx.quadraticCurveTo(0,-185,22,-173);ctx.lineTo(29,-128);ctx.closePath();ctx.fill();ctx.save();ctx.translate(dir*lean,-190);if(img)drawFace(ctx,img,-25,-30,50,57,0);else{ctx.fillStyle='#d3aa85';ctx.beginPath();ctx.ellipse(0,-4,17,22,0,0,Math.PI*2);ctx.fill();}ctx.restore();
      var hx=dir*26,hy=-149;if(a){if(t<.85){var lift=Math.min(1,t/.3);hx=dir*(26-14*lift);hy=-149-41*lift;}else if(t<1.05){hx=-dir*30;hy=-190;}else{hx=dir*39;hy=-179+(t-1.05)*35;}}line(ctx,dir*20,-170,hx,hy,'#d3aa85',8);if(a&&!a.released)bottle(ctx,a.item,hx,hy-6,1.05,t<.85?-dir*1.9:dir*.5);ctx.restore();return;}
    var x=p?c.x+c.w*.77:c.x+c.w*.23,scale=Math.max(.9,Math.min(1.3,g.H/520)),bob=Math.sin(g.estate.time*2+(p?0:1))*.6;ctx.save();ctx.translate(x,g.GY+bob);ctx.scale(dir*scale,scale);
    line(ctx,-4,-19,-5,-2,'#263139',6);line(ctx,4,-19,6,-2,'#263139',6);ctx.fillStyle=p?'#557f9d':'#a35f59';ctx.beginPath();ctx.moveTo(-10,-42);ctx.lineTo(10,-42);ctx.lineTo(12,-18);ctx.lineTo(-12,-18);ctx.closePath();ctx.fill();
    var armX=15,armY=-30;if(a){if(t<.75){armX=8;armY=-49;}else if(t<1.05){armX=-15;armY=-52;}else{armX=22;armY=-43;}}line(ctx,8,-37,armX,armY,'#d3aa85',7);
    ctx.save();ctx.translate(0,-51);if(img)drawFace(ctx,img,-10,-11,20,23,0);else{ctx.fillStyle='#d6a984';ctx.beginPath();ctx.ellipse(0,0,8,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4a4039';ctx.beginPath();ctx.ellipse(0,-6,8,3,0,Math.PI,Math.PI*2);ctx.fill();}ctx.restore();
    if(a&&!a.released)bottle(ctx,a.item,armX,armY-3,.78,.45);ctx.restore();
  }
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate,seg=segmentOf(g);
    drawArenaScene(ctx,g,seg);resident(ctx,g,true,pFace,drawFace);resident(ctx,g,false,eFace,drawFace);
    e.runners.forEach(function(r){var q=r.t/r.duration,home=r.isP?anchor(g,true,false).x:anchor(g,false,false).x,shop=g.W*(r.isP?.35:.65),progress=q<.43?q/.43:q<.57?1:(1-q)/.43;person(ctx,home+(shop-home)*progress,g.GY,unitScale,r.isP?'#6a91ad':'#b97163',e.time*13+r.seed,q>.57?(r.kind==='food'?'food':true):false);});
    e.bottles.forEach(function(b){var q=Math.min(1,b.t/b.duration),a=anchor(g,b.isP,true),z=anchor(g,!b.isP);bottle(ctx,b.item,a.x+(z.x-a.x)*q,a.y+(z.y-a.y)*q-4*b.arc*q*(1-q),Math.max(.8,unitScale*.85),q*9*(b.isP?1:-1));});
    e.glass.forEach(function(s){var a=anchor(g,s.p);ctx.save();ctx.globalAlpha=1-s.t/.65;ctx.fillStyle=s.col;ctx.fillRect(a.x+s.vx*s.t,a.y+s.vy*s.t+120*s.t*s.t,3,5);ctx.restore();});
    (e.impacts||[]).forEach(function(v){ctx.save();ctx.globalAlpha=1-v.t/.55;ctx.strokeStyle=v.col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(v.x,v.y,6+v.t*34*v.power,0,Math.PI*2);ctx.stroke();ctx.restore();});
    drawBrawlers(ctx,g,unitScale,drawFace);stageBadge(ctx,g,lang);
    var ps=side(g,true),barW=Math.min(166,g.W*.21),bx=Math.max(8,g.p.w*.11),by=Math.max(47,g.GY*.15),stam=ps.stamina;ctx.save();ctx.fillStyle='rgba(27,37,40,.82)';ctx.fillRect(bx,by,barW,36);ctx.strokeStyle=seg.accent||'rgba(238,219,176,.35)';ctx.strokeRect(bx+.5,by+.5,barW-1,35);
    ctx.fillStyle='#e7d9b5';ctx.font='bold 10px sans-serif';ctx.textAlign='left';ctx.fillText((lang==='en'?'STAMINA ':'KONDYCJA ')+Math.round(stam)+'%',bx+5,by+11);ctx.fillStyle='#46534e';ctx.fillRect(bx+5,by+15,barW-10,6);ctx.fillStyle=stam<22?'#bd665b':stam<48?'#c7aa5e':'#91b56b';ctx.fillRect(bx+5,by+15,(barW-10)*stam/100,6);
    ctx.fillStyle='#ead7ad';ctx.fillText('🍾 '+ps.bottles+'   🍴 '+ps.food+(ps.combo>1?'   ×'+ps.combo:''),bx+5,by+32);if(ps.noticeT>0&&ps.notice){ctx.textAlign='center';ctx.fillStyle='#fff0b8';ctx.font='bold 10px sans-serif';ctx.fillText(noticeText(ps.notice,lang),bx+barW*.5,by+49);}ctx.restore();
  }
  function buildCards(doc,g,lang,onBuy){var row=doc.getElementById('cds');row.innerHTML='';choices.forEach(function(item,i){var card=doc.createElement('button');card.type='button';card.className='cd';card.id='estate_'+item.id;card.dataset.hotkey=String(i+1);
    var title=lang==='en'?item.en:item.pl;card.setAttribute('aria-label',title);card.title=title+(item.damage?' · '+item.damage+' HP':item.id==='food'?' · stamina':' · supply');
    var kbd=doc.createElement('div');kbd.className='cdk';kbd.textContent=String(i+1);card.appendChild(kbd);
    var wrap=doc.createElement('div');wrap.className='iconWrap';var canvas=doc.createElement('canvas');canvas.width=56;canvas.height=56;canvas.id='estate_icon_'+item.id;var ctx=canvas.getContext('2d');if(item.id==='runner')person(ctx,24,54,1,'#6a91ad',0,true);else if(item.id==='food')foodIcon(ctx,28,29,1.5,segmentOf(g).foodType||0);else bottle(ctx,item,28,29,1.6,-.15);wrap.appendChild(canvas);
    var overlay=doc.createElement('div');overlay.className='cdState';overlay.id='estate_state_'+item.id;wrap.appendChild(overlay);card.appendChild(wrap);
    var name=doc.createElement('div');name.className='estateName';name.textContent=title;card.appendChild(name);var cost=doc.createElement('div');cost.className='cdc';cost.textContent=item.cost;card.appendChild(cost);card.addEventListener('click',function(){onBuy(item.id);});row.appendChild(card);
  });updateCards(doc,g,lang,false);}
  function updateCards(doc,g,lang,paused){choices.forEach(function(item){var el=doc.getElementById('estate_'+item.id);if(!el)return;var s=status(g,item.id,true),off=paused||!s.ok;el.disabled=off;el.setAttribute('aria-disabled',String(off));el.classList.toggle('unitUnavailable',off);
    var label=s.reason==='limit'?'2/2':s.reason==='wait'?Math.ceil(side(g,true).cd)+' s':s.reason==='gold'?(lang==='en'?'FUNDS':'ŚRODKI'):s.reason==='bottles'?'🍾 0':s.reason==='hungry'?'🍴':s.reason==='locked'?(lang==='en'?'LATER':'OD 4/12'):s.reason==='full'?'2/2':s.reason==='rest'?(lang==='en'?'REST':'PRZERWA'):'';
    var badge=doc.getElementById('estate_state_'+item.id);if(badge){badge.textContent=label;badge.style.display=off?'flex':'none';}
    if(item.id==='food'){var cv=doc.getElementById('estate_icon_food');if(cv){var cx=cv.getContext('2d');cx.clearRect(0,0,56,56);foodIcon(cx,28,29,1.5,segmentOf(g).foodType||0);}}
  });}
  var oldBase=root.CASTLE_ERA_ART.drawBase;
  root.CASTLE_ERA_ART.drawBase=function(ctx,c,ground,era,l,t){if(era==='modern'&&l===4){arenaBase(ctx,c,ground);return;}return oldBase(ctx,c,ground,era,l,t);};
  var oldBackdrop=root.CASTLE_ERA_ART.backdrop;
  root.CASTLE_ERA_ART.backdrop=function(ctx,w,gy,era,l){if(era!=='modern'||l!==4)return oldBackdrop(ctx,w,gy,era,l);drawArenaBackdrop(ctx,w,gy,segments[visualSegment]||segments[0]);};
  root.CASTLE_ESTATE={active:active,init:init,buy:buy,eat:eat,status:status,tick:tick,draw:draw,buildCards:buildCards,updateCards:updateCards,choices:choices,foods:foods,segments:segments,segmentSeconds:SEGMENT_SECONDS,setSegment:setSegment,chooseDrink:chooseDrink,staminaCost:staminaCost,currentVisual:function(){return visualSegment;},arenaKinds:segments.map(function(s){return s.arena;})};
})(window);
