(function(root){
  'use strict';
  // One self-contained interlude. Positions use world fractions so rotation and
  // fullscreen never change a delivery route or an in-flight bottle's target.
  // A dedicated Polish estate chapter, entered independently of the historical campaign.
  var TACTICS=root.CASTLE_ESTATE_TACTICS;
  var level=Object.assign({},root.CASTLE_FUTURE.levels.modern[3],{id:'estate',n:'Osiedle Wielkiej Awantury',special:'estate',ul:['drwal'],ai:[],recommended:[],pH:2200,eH:2200,passiveP:2.4,passiveE:1.7,treeCount:0,treeCap:0});
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
  choices=choices.concat(TACTICS.cards);
  var SEGMENT_SECONDS=14;
  var segments=[
    {id:'balcony',pl:'1/12 Podwórko przy Słonecznej',en:'1/12 Sunny Street Courtyard',hintPl:'Poznaj rzut i dostawę',hintEn:'Learn throw and supply',runner:13,ai:3.2,cd:1,brawlers:0,prop:'balcony',landmark:'loggia',arena:'balcony_canyon',scene:0,food:false,accent:'#d4c188',supply:2},
    {id:'queue',pl:'2/12 Kolejka do Monopolowego',en:'2/12 Off-licence Queue',hintPl:'Pilnuj zapasu butelek',hintEn:'Watch your bottle stock',runner:12.8,ai:3.05,cd:.99,brawlers:0,prop:'queue',landmark:'monopolowy',arena:'shopfront',scene:0,food:false,accent:'#c7a56b',supply:2},
    {id:'bench-league',pl:'3/12 Liga Ławkowa',en:'3/12 Bench League',hintPl:'Pierwsza osiedlowa awantura',hintEn:'First estate scuffle',runner:12.5,ai:2.95,cd:.98,brawlers:1,prop:'bench',landmark:'lawka',arena:'bench_square',scene:0,food:false,accent:'#b38a63',supply:2},
    {id:'snack',pl:'4/12 Zapiekanka ratunkowa',en:'4/12 Emergency Baguette',hintPl:'Jedzenie odnawia kondycję',hintEn:'Food restores stamina',runner:12.2,ai:2.9,cd:.97,brawlers:1,prop:'snack',landmark:'zapiekanki',arena:'snack_kiosk',scene:0,food:true,foodType:0,accent:'#d38a45',supply:2},
    {id:'carpet',pl:'5/12 Bitwa o trzepak',en:'5/12 Carpet-Rack Clash',hintPl:'Ogórek skraca przestój',hintEn:'Pickle cuts downtime',runner:12,ai:2.8,cd:.95,brawlers:1,prop:'rack',landmark:'trzepak',arena:'rack_yard',scene:1,food:true,foodType:1,accent:'#9f6d5b',supply:2},
    {id:'bins',pl:'6/12 Śmietnikowy rozejm',en:'6/12 Bin-Shed Truce',hintPl:'Więcej chaosu, ten sam plan',hintEn:'More chaos, same plan',runner:11.7,ai:2.72,cd:.94,brawlers:2,prop:'bins',landmark:'smietniki',arena:'bin_alley',scene:1,food:true,foodType:1,accent:'#76816d',supply:2},
    {id:'pizza',pl:'7/12 Pizza na pół',en:'7/12 Half-and-Half Pizza',hintPl:'Pizza daje dłuższą regenerację',hintEn:'Pizza grants longer recovery',runner:11.4,ai:2.65,cd:.93,brawlers:2,prop:'pizza',landmark:'pizza',arena:'pizza_pavilion',scene:1,food:true,foodType:2,accent:'#c47b4f',supply:2},
    {id:'night',pl:'8/12 Nocna zmiana',en:'8/12 Night Shift',hintPl:'Noc przyspiesza tempo',hintEn:'Night raises the tempo',runner:11.1,ai:2.55,cd:.91,brawlers:2,prop:'night',landmark:'nocna-brama',arena:'night_gate',scene:2,food:true,foodType:2,accent:'#62779a',supply:2},
    {id:'kebab',pl:'9/12 Kebab ostatniej szansy',en:'9/12 Last-Chance Kebab',hintPl:'Kebab zmniejsza koszt kondycji',hintEn:'Kebab makes drinks cheaper',runner:10.8,ai:2.48,cd:.90,brawlers:2,prop:'kebab',landmark:'kebab',arena:'kebab_corner',scene:2,food:true,foodType:3,accent:'#b48754',supply:2},
    {id:'patrol',pl:'10/12 Patrol na sygnale',en:'10/12 Patrol on the Radio',hintPl:'Patrol ucisza bójkę tylko na chwilę',hintEn:'Patrol calms things briefly',runner:10.6,ai:2.42,cd:.89,brawlers:2,prop:'patrol',landmark:'patrol',arena:'parking_patrol',scene:2,food:true,foodType:3,accent:'#5f86a2',supply:2,patrol:true},
    {id:'closed',pl:'11/12 Monopolowy zamknięty',en:'11/12 Off-licence Closed',hintPl:'Zostaje tylko Nocny Express',hintEn:'Only Night Express remains',runner:9.7,ai:2.35,cd:.88,brawlers:3,prop:'closed',landmark:'zamkniety-sklep',arena:'closed_arcade',scene:3,food:true,foodType:3,accent:'#855a58',supply:3,nightRunner:true},
    {id:'finale',pl:'12/12 Finał Wielkiej Płyty',en:'12/12 Concrete Finale',hintPl:'Pełna logistyka, pełny chaos',hintEn:'Full logistics, full chaos',runner:9.2,ai:2.22,cd:.84,brawlers:3,prop:'finale',landmark:'nocny-express',arena:'night_express',scene:3,food:true,foodType:3,accent:'#c39b64',supply:3,nightRunner:true,finale:true}
  ];
  var visualSegment=0;
  var estatePalettes=[
    {s1:'#536e83',s2:'#d5c5a0',g1:'#90997c',g2:'#4c6659',sun:'#ffdf9e',sr:18},
    {s1:'#596881',s2:'#d3a47f',g1:'#7f8974',g2:'#4b5957',sun:'#ffd095',sr:19,dusk:true},
    {s1:'#18273e',s2:'#66768b',g1:'#505f63',g2:'#293b43',sun:'#e8dbc0',sr:15,night:true},
    {s1:'#111d31',s2:'#3c5167',g1:'#455357',g2:'#25353e',sun:'#d5decc',sr:16,night:true}
  ];
  function scenePalette(g){return estatePalettes[segmentOf(g).scene];}
  segments.forEach(function(seg,i){seg.period=i<6?'1988':'1997';seg.brawlers=0;seg.hintPl=TACTICS.rules[i][0];seg.hintEn=TACTICS.rules[i][1];});
  function active(g){return !!(g&&g.lv&&g.lv.special==='estate');}
  function makeSide(){return {cd:0,action:null,stamina:100,bottles:2,food:0,restT:0,mealT:0,regenBonus:0,costMul:1,notice:'',noticeT:0,combo:0,comboT:0,hitReactT:0,hitReactPower:0};}
  function init(g){if(!active(g))return;g.trees=[];g.rocks=[];g.gagShown=true;g.gagT=1e9;
    g.estate={time:0,ai:4.4,segment:0,testSegment:null,segmentFlash:2.2,brawlT:1.8,p:makeSide(),e:makeSide(),runners:[],bottles:[],glass:[],brawlers:[],delivered:0,hits:0};visualSegment=0;g.lv.sc=segments[0].scene;g.p.gold=g.e.gold=72;TACTICS.init(g);
  }
  function side(g,p){return g.estate[p?'p':'e'];}
  function count(g,p){return g.estate.runners.filter(function(r){return r.isP===p;}).length;}
  function segmentOf(g){return segments[Math.max(0,Math.min(segments.length-1,g.estate.segment||0))];}
  function setSegment(g,index,forTest){if(!active(g)||!g.estate)return false;index=Math.max(0,Math.min(segments.length-1,Number(index)||0));g.estate.segment=index;g.estate.testSegment=forTest?index:null;g.estate.time=index*SEGMENT_SECONDS+.05;visualSegment=index;g.lv.sc=segments[index].scene;g.estate.segmentFlash=2.2;g.estate.brawlT=.05;g.estate.brawlers=[];ensureBrawlers(g);
    if(forTest){g.estate.pendingSegment=null;TACTICS.init(g);[true,false].forEach(function(p){var st=side(g,p),c=p?g.p:g.e;st.stamina=100;st.bottles=5;st.food=segments[index].food?2:0;st.cd=0;st.restT=0;st.mealT=0;st.regenBonus=0;st.costMul=1;st.notice='';st.noticeT=0;st.combo=0;st.comboT=0;st.action=null;c.gold=240;});g.estate.runners=[];g.estate.bottles=[];}return true;}
  function syncSegment(g){var e=g.estate,next=e.testSegment!==null?e.testSegment:Math.min(segments.length-1,Math.floor(e.time/SEGMENT_SECONDS));e.pendingSegment=next!==e.segment?next:null;
    // Finish a doorway crossing before replacing its building. New arrivals
    // wait outside; this bounds the delay and prevents endless transition locks.
    if(next!==e.segment&&!e.runners.some(function(r){return r.phase==='enter'||r.phase==='inside'||r.phase==='exit';})){
      e.segment=next;e.pendingSegment=null;e.segmentFlash=2.2;e.brawlT=.35;e.brawlers=[];
      e.runners.forEach(function(r){if(r.phase==='approach'){r.fromX=r.x;r.fromY=r.y;r.phaseDuration=Math.max(.6,r.phaseDuration-r.phaseT);r.phaseT=0;r.routeSegment=next;}});
    }visualSegment=e.segment;g.lv.sc=segments[e.segment].scene;return segmentOf(g);}
  function ensureBrawlers(g){var e=g.estate,seg=segmentOf(g),wanted=seg.brawlers||0;while(e.brawlers.length<wanted){var i=e.brawlers.length;e.brawlers.push({t:i*1.05,seed:e.segment*7+i,type:(e.segment+i)%5});}if(e.brawlers.length>wanted)e.brawlers.length=wanted;}
  function tickBrawlers(g,dt){var e=g.estate;e.brawlT-=dt;if(e.brawlT<=0){ensureBrawlers(g);e.brawlT=5.8;}e.brawlers.forEach(function(b){b.t+=dt;});}
  function itemById(id){return choices.filter(function(i){return i.id===id;})[0];}
  function availableChoices(g){var stage=g.estate.segment,army=TACTICS.roster(stage);return choices.filter(function(c){return c.unlock!==undefined?army.includes(c.id):c.id==='food'?stage>=3:c.id==='beer'?stage<6:true;});}
  function foodFor(g){var seg=segmentOf(g);return foods[Math.min(foods.length-1,seg.foodType||0)];}
  function staminaCost(g,item,p){var st=side(g,p);return Math.max(8,Math.round((item.stamina||0)*(st.mealT>0?st.costMul:1)));}
  function notice(st,code){st.notice=code;st.noticeT=1.25;}
  function noticeText(code,lang){var pl={gold:'Brak kredytów',bottles:'Brak pustych butelek',hungry:'Zjedz coś',rest:'Chwila przerwy',limit:'Dwóch dostawców w drodze',recruit:'Ekipa zaraz będzie gotowa',locked:'Karta jeszcze niedostępna',full:'Jedzenie 2/2',supply:'Dostawa: +butelki',food:'Jedzenie dostarczone',eat:'Kondycja w górę',hit:'Celny rzut!'};var en={gold:'Not enough credits',bottles:'No empty bottles',hungry:'Eat something',rest:'Take a short break',limit:'Two runners already out',recruit:'Squad getting ready',locked:'Card not unlocked yet',full:'Food 2/2',supply:'Supply: +bottles',food:'Food delivered',eat:'Stamina restored',hit:'Direct hit!'};return (lang==='en'?en:pl)[code]||'';}
  function applyFood(g,p){var st=side(g,p),food=foodFor(g);st.stamina=Math.min(100,st.stamina+food.restore);st.mealT=food.seconds||0;st.regenBonus=0;st.costMul=1;
    if(g.estate.segment===6)TACTICS.heal(g,p,25);
    if(food.buff==='quick')st.regenBonus=.35;
    else if(food.buff==='reset'){st.cd=Math.max(0,st.cd-1.15);st.restT=0;}
    else if(food.buff==='regen')st.regenBonus=.95;
    else if(food.buff==='efficient')st.costMul=.78;
    notice(st,'eat');return food;
  }
  function status(g,id,p){if(!active(g)||!g.estate)return {ok:false,reason:'end'};var item=itemById(id),seg=segmentOf(g),st=side(g,p);if(!item||!active(g)||g.over)return {ok:false,reason:'end'};
    if(!availableChoices(g).some(function(c){return c.id===id;}))return {ok:false,reason:'locked'};
    if(item.unlock!==undefined)return TACTICS.status(g,id,p);
    if(id==='food'){
      if(!seg.food)return {ok:false,reason:'locked'};
      if(st.food>0)return {ok:true,item:item,action:'eat'};
      if(count(g,p)>=2)return {ok:false,reason:'limit'};
      if((p?g.p:g.e).gold<item.cost)return {ok:false,reason:'gold'};
      return {ok:true,item:item,action:'order'};
    }
    if(id==='runner'&&count(g,p)>=2)return {ok:false,reason:'limit'};
    if(item.damage&&st.restT>0)return {ok:false,reason:'rest'};
    if(item.damage&&st.cd>0)return {ok:false,reason:'wait'};
    if(item.damage&&st.bottles<1)return {ok:false,reason:'bottles'};
    var need=item.damage?staminaCost(g,item,p):0;if(item.damage&&st.stamina<need){var food=foodFor(g);if(!(st.food>0&&st.stamina+food.restore>=need))return {ok:false,reason:'hungry'};}
    if((p?g.p:g.e).gold<item.cost)return {ok:false,reason:'gold'};
    return {ok:true,item:item};
  }
  function buy(g,id,p){if(!active(g)||!g.estate||g.over)return false;var st=side(g,p),s=status(g,id,p);if(!s.ok){notice(st,s.reason);return false;}var item=s.item,seg=segmentOf(g);
    if(item.unlock!==undefined)return TACTICS.recruit(g,id,p);
    if(id==='food'&&s.action==='eat'){eat(g,p);return true;}
    (p?g.p:g.e).gold-=item.cost;
    if(id==='runner'||id==='food')g.estate.runners.push(makeRunner(g,p,id==='food'?'food':'supply',id==='food'?Math.max(5.8,seg.runner*.64):seg.runner));
    else{var need=staminaCost(g,item,p);if(st.stamina<need&&st.food>0)eat(g,p);st.stamina=Math.max(0,st.stamina-need);st.bottles--;st.cd=item.cd*seg.cd;st.action={item:item,t:0,released:false};st.comboT=Math.max(st.comboT,2.6);}
    return true;
  }
  function eat(g,p){var st=side(g,p);if(st.food<1)return false;st.food--;applyFood(g,p);return true;}
  function estateViewportScale(ground){return Math.max(.92,Math.min(1.5,ground/590));}
  function anchor(g,p,fromHand){var c=p?g.p:g.e,b=baseLayout(c,g.GY);return {x:b.x+b.w*(fromHand?(p?.66:.34):.5),y:g.GY-b.h*(fromHand?127/260:139/260)};}
  function baseLayout(c,ground){var boost=estateViewportScale(ground),w=c.w*1.42*boost,h=c.h*1.42*boost;return {x:c.isP?c.x-10:c.x+c.w-w+10,w:w,h:h};}
  function launch(g,a,p){g.estate.bottles.push({isP:p,item:a.item,t:0,duration:1.7,arc:Math.min(g.H*.18,100)});}
  // Door geometry is shared by scenery, animation and delivery navigation.
  // Scene changes cannot leave a courier walking to a vanished shop.
  var SERVICE_KIOSKS={0:{offset:-15,w:150,h:89},1:{offset:0,w:190,h:92},3:{offset:0,w:194,h:94},6:{offset:0,w:198,h:94},8:{offset:0,w:190,h:96}};
  function serviceDoor(g,index){var stage=index===undefined?g.estate.segment:index,model=SERVICE_KIOSKS[stage],scale=Math.min(1.46*estateViewportScale(g.GY),g.W*.36/248),cx=g.W*.5,y=g.GY;
    if(stage===11)return {stage:stage,kind:'van',x:cx-75*scale,y:y-8*scale,w:25*scale,h:68*scale,scale:scale};
    if(model)return {stage:stage,kind:'shop',x:cx+(model.offset+model.w*.20)*scale,y:y,w:model.w*.20*scale,h:(model.h-14)*scale,scale:scale};
    scale=TACTICS.actorScale(g.H)*1.05;cx=g.W*.28;y-=4*scale;
    return {stage:stage,kind:'annex',x:cx+22*scale,y:y,w:22*scale,h:76*scale,scale:scale,buildingX:cx,buildingY:y,sign:stage>=7?'EXPRESS 24':'SPOŻYWCZY'};
  }
  function makeRunner(g,p,kind,duration){var x=anchor(g,p).x/g.W;return {isP:p,kind:kind,duration:duration,t:0,seed:g.estate.time,phase:'approach',phaseT:0,phaseDuration:duration*.40,routeSegment:g.estate.segment,x:x,y:1,fromX:x,fromY:1};}
  function runnerTarget(g,r){var d=serviceDoor(g,r.routeSegment);return {x:(d.x+d.w*.52)/g.W,y:d.y/g.GY,door:d};}
  function advanceRunner(g,r,dt){var remaining=dt;while(remaining>1e-8&&r.phase!=='done'){
      if(r.phase==='approach'&&r.phaseT>=r.phaseDuration&&g.estate.pendingSegment!==null&&g.estate.pendingSegment!==undefined)break;
      var used=Math.min(remaining,Math.max(0,r.phaseDuration-r.phaseT));r.phaseT+=used;r.t+=used;remaining-=used;
      var q=Math.min(1,r.phaseT/r.phaseDuration),target=runnerTarget(g,r),home=anchor(g,r.isP).x/g.W,streetY=1+6/g.GY;
      if(r.phase==='approach'){var street=Math.min(1,q/.8);r.x=r.fromX+(target.x-r.fromX)*street;r.y=q<=.8?r.fromY+(streetY-r.fromY)*street:streetY+(target.y-streetY)*(q-.8)/.2;}
      else if(r.phase==='enter'||r.phase==='exit'){r.x=target.x+target.door.w/g.W*.8*(r.phase==='enter'?q:1-q);r.y=target.y;}
      else if(r.phase==='return'){r.x=q<.2?r.fromX:r.fromX+(home-r.fromX)*(q-.2)/.8;r.y=q<.2?r.fromY+(streetY-r.fromY)*q/.2:streetY+(1-streetY)*(q-.2)/.8;}
      if(q<1)break;
      if(r.phase==='approach'&&g.estate.pendingSegment!==null&&g.estate.pendingSegment!==undefined)break;
      var next={approach:'enter',enter:'inside',inside:'exit',exit:'return',return:'done'}[r.phase];r.phase=next;r.phaseT=0;
      r.phaseDuration=r.duration*({enter:.08,inside:.06,exit:.08,return:.38,done:0}[next]);
      if(next==='return'){r.fromX=r.x;r.fromY=r.y;}
    }return r.phase==='done';
  }
  function doorOpen(g){return g.estate.runners.reduce(function(open,r){if(r.routeSegment!==g.estate.segment)return open;var q=r.phaseT/r.phaseDuration,v=r.phase==='approach'?Math.max(0,Math.min(1,(q-.9)*10)):r.phase==='enter'||r.phase==='inside'?1:r.phase==='exit'?Math.min(1,(1-q)*4):0;return Math.max(open,v);},0);}
  function paintServiceDoor(ctx,g,leafOnly){var d=serviceDoor(g),open=doorOpen(g);ctx.save();
    if(!leafOnly){ctx.fillStyle='#182c2c';ctx.fillRect(d.x,d.y-d.h,d.w,d.h);ctx.fillStyle='#e5c77f';ctx.globalAlpha=.18;ctx.fillRect(d.x+2,d.y-d.h+2,d.w-4,d.h-2);ctx.globalAlpha=1;}
    if(leafOnly){var width=d.w*Math.max(.10,Math.cos(open*1.42));materialRect(ctx,d.x,d.y-d.h,width,d.h,'#79968a','#3d5c54','#283d3c');if(width>5)glassPanel(ctx,d.x+width*.15,d.y-d.h+4,width*.65,d.h*.62,segments[g.estate.segment].scene>=2);ctx.fillStyle='#ead7a4';ctx.fillRect(d.x+width*.76,d.y-d.h*.4,Math.max(1,width*.1),2);}
    ctx.restore();
  }
  function drawDeliveries(ctx,g,unitScale){paintServiceDoor(ctx,g,false);var d=serviceDoor(g);function paintRunner(r){if(r.phase==='inside'||r.phase==='done')return;var crossing=r.phase==='enter'||r.phase==='exit',dir=r.phase==='return'?(r.isP?-1:1):(r.isP?1:-1),s=TACTICS.actorScale(g.H),cargo=r.phase==='exit'||r.phase==='return';ctx.save();
      if(crossing){ctx.beginPath();ctx.rect(d.x,d.y-d.h,d.w,d.h);ctx.clip();}
      TACTICS.figure(ctx,{kind:'courier',isP:r.isP,facing:dir,moving:true,walk:r.t*10+r.seed,cargo:cargo},r.x*g.W,r.y*g.GY,s);ctx.restore();}
    g.estate.runners.filter(function(r){return r.phase==='enter'||r.phase==='exit';}).forEach(paintRunner);paintServiceDoor(ctx,g,true);
    g.estate.runners.filter(function(r){return r.phase==='approach'||r.phase==='return';}).forEach(paintRunner);
  }
  function finishRunner(g,r,reward){var st=side(g,r.isP),c=r.isP?g.p:g.e,seg=segmentOf(g);if(r.kind==='food'){st.food=Math.min(2,st.food+1);notice(st,'food');if(!r.isP&&st.stamina<38)eat(g,false);return;}
    var gain=seg.id==='closed'?40:28,pack=seg.supply||2;c.gold=Math.min(9999,c.gold+gain);st.bottles=Math.min(6,st.bottles+pack);notice(st,'supply');if(r.isP){g.stats.goldEarned+=gain;g.estate.delivered++;}if(reward)reward(r.isP,gain);}
  function chooseDrink(g,p){var st=side(g,p),c=p?g.p:g.e,seg=segmentOf(g),order=seg.id==='finale'?['vodka','wine','beer']:seg.id==='closed'?['wine','beer','vodka']:['wine','beer','vodka'];for(var i=0;i<order.length;i++){var id=order[i],it=itemById(id),need=staminaCost(g,it,p);if(c.gold>=it.cost&&st.bottles>0&&(st.stamina>=need||st.food>0))return id;}return null;}
  function tick(g,dt,hit,reward,impact){if(!active(g)||g.over)return;var e=g.estate;e.time+=dt;var seg=syncSegment(g);e.segmentFlash=Math.max(0,e.segmentFlash-dt);tickBrawlers(g,dt);
    [true,false].forEach(function(p){var st=side(g,p);st.cd=Math.max(0,st.cd-dt);st.restT=Math.max(0,st.restT-dt);st.noticeT=Math.max(0,st.noticeT-dt);st.comboT=Math.max(0,st.comboT-dt);if(st.comboT<=0)st.combo=0;
      st.hitReactT=Math.max(0,(st.hitReactT||0)-dt);
      if(st.mealT>0){st.mealT=Math.max(0,st.mealT-dt);if(st.mealT<=0){st.regenBonus=0;st.costMul=1;}}
      var baseRegen=seg.food?.16:.52;st.stamina=Math.min(100,st.stamina+dt*(baseRegen+st.regenBonus));
      if(st.action){st.action.t+=dt;if(st.action.t>=1.18&&!st.action.released){st.action.released=true;launch(g,st.action,p);}if(st.action.t>=1.78)st.action=null;}});
    e.runners=e.runners.filter(function(r){if(!advanceRunner(g,r,dt))return true;finishRunner(g,r,reward);return false;});
    e.bottles=e.bottles.filter(function(b){b.t+=dt;if(b.t<b.duration)return true;var target=anchor(g,!b.isP),victim=side(g,!b.isP);hit(b.isP?g.e:g.p,b.item.damage,target.x,target.y,{estate:true});victim.hitReactT=.72;victim.hitReactPower=b.item.id==='vodka'?1.35:b.item.id==='wine'?1.08:.9;e.hits++;var shooter=side(g,b.isP);shooter.combo=Math.min(9,(shooter.combo||0)+1);shooter.comboT=2.8;notice(shooter,'hit');
      e.impacts=e.impacts||[];e.impacts.push({x:target.x,y:target.y,t:0,col:b.item.col,power:b.item.id==='vodka'?1.35:b.item.id==='wine'?1.1:.9});
      if(shooter.stamina<10)shooter.restT=2.4;if(seg.finale){var owner=b.isP?g.p:g.e;owner.gold=Math.min(9999,owner.gold+3);}for(var i=0;i<(b.item.id==='vodka'?10:7);i++)e.glass.push({p:!b.isP,t:0,vx:(i-4)*11,vy:-18-i*3,col:b.item.col});return false;});
    e.glass=e.glass.filter(function(s){s.t+=dt;return s.t<.65;});e.impacts=(e.impacts||[]).filter(function(v){v.t+=dt;return v.t<.55;});
    TACTICS.tick(g,dt,hit,reward,impact);
    e.ai-=dt;if(!g.over&&e.ai<=0){e.ai=seg.ai;var es=side(g,false),drink=chooseDrink(g,false),unit=TACTICS.choose(g);
      if(count(g,false)<1&&(es.bottles<2||g.e.gold<22))buy(g,'runner',false);
      if(unit&&buy(g,unit,false))e.tactics.ai=7;
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
  var ART_CACHE=new Map();
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function shade(hex,m){var s=hex.replace('#',''),n=parseInt(s,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;r=clamp(Math.round(r*m),0,255);g=clamp(Math.round(g*m),0,255);b=clamp(Math.round(b*m),0,255);return 'rgb('+r+','+g+','+b+')';}
  function rounded(ctx,x,y,w,h,r,fill,stroke){r=Math.min(r,w*.5,h*.5);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
  function materialRect(ctx,x,y,w,h,top,bottom,stroke){var g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,top);g.addColorStop(.55,bottom);g.addColorStop(1,shade(bottom,.78));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}}
  function panelWall(ctx,x,y,w,h,base,rows,cols,night){materialRect(ctx,x,y,w,h,shade(base,1.08),base,shade(base,.60));ctx.strokeStyle='rgba(38,45,45,.28)';ctx.lineWidth=1;
    for(var r=1;r<rows;r++){var yy=y+h*r/rows;ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}
    for(var col=1;col<cols;col++){var xx=x+w*col/cols;ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx,y+h);ctx.stroke();}
    for(var rr=0;rr<rows;rr++)for(var cc=0;cc<cols;cc++){if((rr+cc)%2!==0)continue;var wx=x+(cc+.18)*w/cols,wy=y+(rr+.18)*h/rows,ww=w/cols*.42,wh=h/rows*.42;var wg=ctx.createLinearGradient(wx,wy,wx,wy+wh);wg.addColorStop(0,night?'#f0d888':'#a9c1c2');wg.addColorStop(1,night?'#9f8455':'#50696d');ctx.fillStyle=wg;ctx.fillRect(wx,wy,ww,wh);ctx.fillStyle='rgba(255,255,255,.20)';ctx.fillRect(wx+1,wy+1,ww*.25,wh-2);}
  }
  function contactShadow(ctx,x,y,rx,alpha){ctx.save();ctx.globalAlpha=alpha===undefined?.22:alpha;ctx.fillStyle='#080a0b';ctx.beginPath();ctx.ellipse(x,y,rx,rx*.22,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function poster(ctx,x,y,w,h,c1,c2,text){ctx.save();ctx.translate(x,y);ctx.rotate(-.02);materialRect(ctx,0,0,w,h,c1,c2,'rgba(45,40,35,.55)');ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='bold '+Math.max(5,Math.round(h*.20))+'px sans-serif';ctx.textAlign='center';ctx.fillText(text,w*.5,h*.34);ctx.globalAlpha=.55;ctx.fillStyle='#1d2527';for(var i=0;i<3;i++)ctx.fillRect(w*.18,h*(.52+i*.12),w*.64,1);ctx.restore();}
  function drawTreeUrban(ctx,x,y,s,night){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#4f4034';ctx.fillRect(-3,-46,6,46);var grad=ctx.createRadialGradient(-5,-54,2,0,-54,25);grad.addColorStop(0,night?'#607866':'#759469');grad.addColorStop(1,night?'#263b35':'#3f6348');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(-8,-55,18,0,Math.PI*2);ctx.arc(10,-58,17,0,Math.PI*2);ctx.arc(1,-72,16,0,Math.PI*2);ctx.fill();ctx.restore();}
  function glassPanel(ctx,x,y,w,h,night){var g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,night?'#50677a':'#99b9bd');g.addColorStop(.55,night?'#263b4c':'#607f82');g.addColorStop(1,night?'#172630':'#39585a');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.moveTo(x+2,y+2);ctx.lineTo(x+w*.38,y+2);ctx.lineTo(x+w*.12,y+h-2);ctx.lineTo(x+2,y+h-2);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(22,30,32,.65)';ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
  function metalShutter(ctx,x,y,w,h){var g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,'#5a5d5f');g.addColorStop(.48,'#888b89');g.addColorStop(1,'#4b4f51');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(32,34,36,.48)';for(var i=1;i<Math.floor(h/7);i++){var yy=y+i*7;ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}}
  function awning(ctx,x,y,w,h,c1,c2){ctx.save();ctx.fillStyle=shade(c1,.65);ctx.fillRect(x,y,w,h);var stripes=8;for(var i=0;i<stripes;i++){ctx.fillStyle=i%2?c1:c2;ctx.beginPath();ctx.moveTo(x+i*w/stripes,y);ctx.lineTo(x+(i+1)*w/stripes,y);ctx.lineTo(x+(i+1)*w/stripes-3,y+h);ctx.lineTo(x+i*w/stripes+3,y+h);ctx.closePath();ctx.fill();}ctx.restore();}
  function wheel(ctx,x,y,r){ctx.fillStyle='#161b1e';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#7d8585';ctx.beginPath();ctx.arc(x,y,r*.42,0,Math.PI*2);ctx.fill();}
  function enamelSign(ctx,x,y,w,h,text,color,size){
    ctx.save();ctx.lineWidth=1;rounded(ctx,x,y,w,h,1.5,color||'#315f67','#263d42');
    ctx.strokeStyle='#e7dfbd';ctx.strokeRect(x+2,y+2,w-4,h-4);
    ctx.fillStyle='#faf0cf';ctx.font='bold '+(size||10)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x+w/2,y+h/2+.5,w-7);
    ctx.fillStyle='#bcb9a5';ctx.fillRect(x+3,y+3,1,1);ctx.fillRect(x+w-4,y+h-4,1,1);ctx.restore();
  }
  function maluch(ctx,x,y,s,color){
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);contactShadow(ctx,0,1,37,.3);
    ctx.lineJoin='round';ctx.strokeStyle='#293d42';ctx.lineWidth=1.5;
    ctx.fillStyle=color||'#d39748';ctx.beginPath();ctx.moveTo(-34,-8);ctx.lineTo(-34,-24);ctx.lineTo(-25,-28);ctx.lineTo(-18,-44);ctx.lineTo(14,-44);ctx.lineTo(23,-27);ctx.lineTo(33,-23);ctx.lineTo(34,-8);ctx.closePath();ctx.fill();ctx.stroke();
    glassPanel(ctx,-17,-41,13,15,false);glassPanel(ctx,-1,-41,13,15,false);
    ctx.fillStyle='#8fb0b1';ctx.beginPath();ctx.moveTo(15,-41);ctx.lineTo(21,-28);ctx.lineTo(16,-28);ctx.closePath();ctx.fill();
    line(ctx,-30,-23,29,-23,'#efd2a0',1);line(ctx,-3,-24,-3,-9,'#765f49',.7);
    ctx.fillStyle='#d9d4bc';ctx.fillRect(4,-23,7,2);ctx.fillRect(-36,-12,7,4);ctx.fillRect(29,-12,7,4);
    ctx.fillStyle='#f3d793';ctx.fillRect(28,-22,6,6);ctx.fillStyle='#9c4839';ctx.fillRect(-34,-22,3,6);
    wheel(ctx,-21,-7,8);wheel(ctx,21,-7,8);ctx.fillStyle='#e8d9b6';ctx.fillRect(-23,-8,4,2);ctx.fillRect(19,-8,4,2);
    for(var vent=0;vent<3;vent++)line(ctx,-30+vent*3,-22,-30+vent*3,-17,'#725a45',1);
    ctx.restore();
  }
  function periodProps(ctx,g,seg){
    var s=Math.max(.68,Math.min(1.45,g.GY/590)),y=g.GY-106*s;
    // The service lane sits behind the main actors, not on their collision line.
    maluch(ctx,g.W*.31,y,s*.90,'#c88743');
    if(seg.period==='1997')maluch(ctx,g.W*.70,y,s*.78,'#91a29b');
    ctx.save();ctx.translate(g.W*.74,y);ctx.scale(s,s);
    // Glazed telephone booth with a receiver, coin box and enamel header.
    rectPanel(ctx,-15,-91,30,89,'#567d75');glassPanel(ctx,-11,-72,22,65,seg.scene>=2);
    line(ctx,-13,-76,13,-76,'#e4d6b2',3);enamelSign(ctx,-16,-92,32,15,'TELEFON','#456c69',5.4);
    ctx.fillStyle='#c4bda4';ctx.fillRect(-5,-60,11,20);ctx.fillStyle='#293f41';ctx.fillRect(-1,-56,4,7);
    line(ctx,-7,-60,-7,-48,'#23383b',3);line(ctx,-7,-48,-3,-41,'#23383b',1);
    line(ctx,0,-75,0,-7,'#9baf9b',1);ctx.restore();
  }
  function saturator(ctx,x,y){
    ctx.save();ctx.translate(x,y);contactShadow(ctx,0,0,22,.25);
    rectPanel(ctx,-20,-29,40,25,'#7ba49c');rectPanel(ctx,-23,-33,46,4,'#e3d5b1');
    wheel(ctx,-14,-2,5);wheel(ctx,14,-2,5);
    rounded(ctx,-9,-49,10,16,3,'#aeb8aa','#425b5a');line(ctx,-4,-48,-4,-59,'#bdc4b5',2);
    line(ctx,-4,-59,5,-59,'#bdc4b5',2);line(ctx,5,-59,5,-53,'#bdc4b5',2);
    for(var i=0;i<3;i++){ctx.fillStyle=i===0?'#b95744':'#dae1ca';ctx.fillRect(8+i*4,-42,3,9);}
    enamelSign(ctx,-16,-24,32,13,'SODOWA','#53786f',5.5);ctx.restore();
  }
  function courtyardMotion(ctx,g){
    var b=baseLayout(g.p,g.GY);ctx.save();ctx.translate(b.x,g.GY);ctx.scale(b.w/200,b.h/260);
    // A laundry line in one loggia, not a repeated facade texture.
    line(ctx,63,-188,142,-187,'#515d54',.8);
    [0,1,2].forEach(function(i){var x=71+i*21,flutter=Math.sin(g.estate.time*1.9+i)*1.5;
      ctx.fillStyle=['#d9d3b8','#a46955','#7c9d98'][i];ctx.beginPath();ctx.moveTo(x,-188);ctx.lineTo(x+13,-188);ctx.lineTo(x+13+flutter,-177);ctx.lineTo(x+flutter,-178);ctx.closePath();ctx.fill();
      ctx.fillStyle='#c2a56c';ctx.fillRect(x+1,-190,1.5,3);ctx.fillRect(x+10,-190,1.5,3);
    });ctx.restore();
  }
  function faceDetails(ctx,x,y,s,mood){
    mood=mood||'neutral';ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    // Brows and separated eyes remain legible after the character is scaled to gameplay size.
    var tense=mood==='angry'||mood==='grimace'||mood==='focus';ctx.strokeStyle='#513d35';ctx.lineWidth=Math.max(.55,.8*s);ctx.beginPath();
    if(mood==='grimace'){ctx.moveTo(x-4.2*s,y-4.3*s);ctx.lineTo(x-1.2*s,y-2.8*s);ctx.moveTo(x+1.2*s,y-2.8*s);ctx.lineTo(x+4.2*s,y-4.3*s);}
    else{ctx.moveTo(x-4*s,y-3.3*s);ctx.lineTo(x-1.4*s,y-(tense?4.2:3.6)*s);ctx.moveTo(x+1.4*s,y-(tense?4.2:3.6)*s);ctx.lineTo(x+4*s,y-3.3*s);}ctx.stroke();
    ctx.strokeStyle='#23282b';ctx.fillStyle='#23282b';ctx.lineWidth=Math.max(.65,.85*s);ctx.beginPath();
    if(mood==='grimace'){ctx.moveTo(x-4*s,y-1.5*s);ctx.lineTo(x-1.2*s,y-.7*s);ctx.moveTo(x+1.2*s,y-.7*s);ctx.lineTo(x+4*s,y-1.5*s);ctx.stroke();}
    else if(mood==='grin'){ctx.moveTo(x-4.2*s,y-1.2*s);ctx.quadraticCurveTo(x-2.6*s,y-3.2*s,x-1*s,y-1.2*s);ctx.moveTo(x+1*s,y-1.2*s);ctx.quadraticCurveTo(x+2.6*s,y-3.2*s,x+4.2*s,y-1.2*s);ctx.stroke();}
    else{ctx.arc(x-2.6*s,y-1.7*s,.85*s,0,Math.PI*2);ctx.arc(x+2.6*s,y-1.7*s,.85*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.arc(x-2.35*s,y-2*s,.24*s,0,Math.PI*2);ctx.arc(x+2.85*s,y-2*s,.24*s,0,Math.PI*2);ctx.fill();}
    // A compact angular nose reads better than a single dot at this scale.
    ctx.strokeStyle='#9d6652';ctx.lineWidth=Math.max(.5,.65*s);ctx.beginPath();ctx.moveTo(x+.2*s,y-.5*s);ctx.lineTo(x-.5*s,y+1.5*s);ctx.lineTo(x+1.1*s,y+1.5*s);ctx.stroke();
    ctx.strokeStyle=mood==='angry'||mood==='grimace'?'#562f2d':'#7a3f3f';ctx.lineWidth=Math.max(.65,.8*s);ctx.beginPath();if(mood==='angry'){ctx.moveTo(x-2.6*s,y+4*s);ctx.quadraticCurveTo(x,y+2.8*s,x+2.8*s,y+4*s);}else if(mood==='grimace'){ctx.moveTo(x-3.4*s,y+3*s);ctx.lineTo(x-1.7*s,y+4.2*s);ctx.lineTo(x,y+3*s);ctx.lineTo(x+1.7*s,y+4.2*s);ctx.lineTo(x+3.4*s,y+3*s);}else if(mood==='grin'){ctx.moveTo(x-3*s,y+2.5*s);ctx.quadraticCurveTo(x,y+5.6*s,x+3*s,y+2.5*s);ctx.fillStyle='#783b39';ctx.lineTo(x+2.2*s,y+3.5*s);ctx.quadraticCurveTo(x,y+4.8*s,x-2.2*s,y+3.5*s);ctx.closePath();ctx.fill();ctx.stroke();}else if(mood==='focus'){ctx.moveTo(x-2.6*s,y+3.2*s);ctx.lineTo(x+2.5*s,y+3.2*s);}else{ctx.moveTo(x-2.5*s,y+3.4*s);ctx.quadraticCurveTo(x,y+4*s,x+2.5*s,y+3.2*s);}ctx.stroke();
    ctx.fillStyle='rgba(190,92,76,.18)';ctx.beginPath();ctx.ellipse(x-4.7*s,y+1.4*s,1.5*s,.8*s,0,0,Math.PI*2);ctx.ellipse(x+4.7*s,y+1.4*s,1.5*s,.8*s,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function person(ctx,x,y,scale,team,step,carrying,dir){dir=dir||1;var f=scale,stride=Math.sin(step),liftA=Math.max(0,stride)*3.2,liftB=Math.max(0,-stride)*3.2,bob=Math.abs(Math.cos(step))*.85;
    contactShadow(ctx,x,y+1,12*f,.20);ctx.save();ctx.translate(x,y-bob*f);ctx.scale(dir*f,f);ctx.lineCap='round';ctx.lineJoin='round';
    // spodnie i buty — pełne bryły zamiast patyczków
    ctx.fillStyle='#28323a';ctx.strokeStyle='#151a1e';ctx.lineWidth=1.1;
    var ax=-4-stride*3.6,bx=4+stride*3.6;rounded(ctx,ax-3,-20,6,18-liftA,2,'#2e3942','#161c20');rounded(ctx,bx-3,-20,6,18-liftB,2,'#2e3942','#161c20');
    ctx.fillStyle='#15191d';rounded(ctx,ax-5,-4-liftA,10,4,1,'#15191d');rounded(ctx,bx-4,-4-liftB,10,4,1,'#15191d');
    // kurtka z ramionami i światłem
    var body=ctx.createLinearGradient(-11,-41,11,-17);body.addColorStop(0,shade(team,1.18));body.addColorStop(.62,team);body.addColorStop(1,shade(team,.64));ctx.fillStyle=body;ctx.strokeStyle='rgba(18,23,26,.75)';
    ctx.beginPath();ctx.moveTo(-9,-39);ctx.quadraticCurveTo(0,-43,9,-39);ctx.lineTo(12,-18);ctx.quadraticCurveTo(0,-14,-12,-18);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.13)';ctx.beginPath();ctx.moveTo(-6,-37);ctx.lineTo(-2,-39);ctx.lineTo(-4,-20);ctx.lineTo(-7,-20);ctx.closePath();ctx.fill();
    line(ctx,-8,-34,-13-stride*2.5,-22,'#d1a17d',4.6);line(ctx,8,-34,13+stride*2.5,-23,'#d1a17d',4.6);
    // szyja i głowa
    ctx.fillStyle='#c99573';rounded(ctx,-3,-43,6,5,2,'#c99573');
    var skin=ctx.createRadialGradient(-2,-48,1,0,-49,9);skin.addColorStop(0,'#efc4a0');skin.addColorStop(1,'#bd8565');ctx.fillStyle=skin;ctx.strokeStyle='rgba(70,48,39,.7)';ctx.beginPath();ctx.ellipse(0,-50,7.1,8.1,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#bd8565';ctx.beginPath();ctx.ellipse(-7,-49.5,1.6,2.4,0,0,Math.PI*2);ctx.ellipse(7,-49.5,1.6,2.4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#443a35';ctx.beginPath();ctx.moveTo(-7,-52);ctx.quadraticCurveTo(-4,-61,4,-59);ctx.quadraticCurveTo(9,-57,7,-51);ctx.quadraticCurveTo(1,-56,-7,-52);ctx.fill();
    faceDetails(ctx,0,-50,.72,'neutral');
    if(carrying){ctx.save();ctx.translate(12,-23);ctx.rotate(-.08);materialRect(ctx,0,0,17,13,'#b88c4d','#815d32','#5d4429');if(carrying==='food')foodIcon(ctx,8,6,.62,2);else for(var b=0;b<3;b++)bottle(ctx,choices[b],4+b*5,-1,.33,0);ctx.restore();}
    ctx.restore();
  }
  function menelFace(slot){var m=root.CASTLE_MENELE;return m&&typeof m.face==='function'?m.face(slot):null;}
  function menelStyle(slot,fallback){var m=root.CASTLE_MENELE;return m&&typeof m.style==='function'?Number(m.style(slot))||0:fallback;}
  function menelName(slot){var m=root.CASTLE_MENELE;return m&&typeof m.name==='function'?String(m.name(slot)||'').slice(0,14):'';}
  function brawler(ctx,x,y,scale,dir,type,phase,faceImg,drawFace,style){
    style=style===undefined?type%4:style;var shirts=['#704c42','#446474','#6b6345','#524b67'],shirt=shirts[style%4],hit=Math.sin(phase*2.4),duck=Math.max(0,Math.sin(phase*.72))*2,stride=Math.sin(phase*1.15)*2.2;
    contactShadow(ctx,x,y+1,12*scale,.22);ctx.save();ctx.translate(x,y);ctx.scale(dir*scale,scale);ctx.lineCap='round';ctx.lineJoin='round';
    rounded(ctx,-8+stride,-19,6,18,2,'#29343b','#171d20');rounded(ctx,2-stride,-19,6,18,2,'#29343b','#171d20');rounded(ctx,-10+stride,-4,10,4,1,'#15191c');rounded(ctx,1-stride,-4,10,4,1,'#15191c');
    var coat=ctx.createLinearGradient(-12,-42,12,-17);coat.addColorStop(0,shade(shirt,1.2));coat.addColorStop(.6,shirt);coat.addColorStop(1,shade(shirt,.62));ctx.fillStyle=coat;ctx.strokeStyle='rgba(20,24,26,.78)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-10,-38+duck);ctx.quadraticCurveTo(0,-43+duck,10,-38+duck);ctx.lineTo(12,-18);ctx.quadraticCurveTo(0,-14,-12,-18);ctx.closePath();ctx.fill();ctx.stroke();
    if(style===1){ctx.fillStyle='rgba(226,230,220,.78)';rounded(ctx,-16,-28+duck,8,14,2,'rgba(226,230,220,.78)','#9aa09b');}
    if(style===2){ctx.strokeStyle='#d4b258';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-9,-31+duck);ctx.lineTo(9,-31+duck);ctx.stroke();}
    line(ctx,-8,-34+duck,-15-hit*5,-22,'#c99572',5);line(ctx,8,-34+duck,15+hit*6,-25,'#c99572',5);
    ctx.fillStyle='#c99572';rounded(ctx,-3,-46+duck,6,6,2,'#c99572');
    if(faceImg&&drawFace){ctx.save();ctx.translate(0,-51+duck);drawFace(ctx,faceImg,-10,-12,20,24,0);ctx.restore();}
    else{var skin=ctx.createRadialGradient(-2,-52+duck,1,0,-52+duck,9);skin.addColorStop(0,'#efc3a0');skin.addColorStop(1,'#b97f61');ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-52+duck,7.4,8.3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#b97f61';ctx.beginPath();ctx.ellipse(-7.1,-51+duck,1.4,2.2,0,0,Math.PI*2);ctx.ellipse(7.1,-51+duck,1.4,2.2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=style===3?'#343649':'#443a34';ctx.beginPath();ctx.moveTo(-7,-54+duck);ctx.quadraticCurveTo(-4,-62+duck,4,-61+duck);ctx.quadraticCurveTo(9,-58+duck,7,-52+duck);ctx.fill();faceDetails(ctx,0,-52+duck,.78,hit>.25?'angry':'grin');}
    if(style===3){ctx.strokeStyle='#1f282c';ctx.lineWidth=1;ctx.strokeRect(-6,-55+duck,5,3);ctx.strokeRect(1,-55+duck,5,3);line(ctx,-1,-53.5+duck,1,-53.5+duck,'#1f282c',1);}
    ctx.restore();
  }
  function drawBrawlers(ctx,g,unitScale,drawFace){
    g.estate.brawlers.forEach(function(b,i){var center=g.W*(.43+i*.08),phase=(b.t+b.seed*.37)%6.2,clash=phase<3.7?1:0,sep=clash?(22-Math.sin(phase*1.8)*7):29;
      var aSlot=i%2,zSlot=(i+1)%2;
      brawler(ctx,center-sep,g.GY,unitScale,1,b.type,phase,menelFace(aSlot),drawFace,menelStyle(aSlot,b.type%4));
      brawler(ctx,center+sep,g.GY,unitScale,-1,b.type+1,phase+1.4,menelFace(zSlot),drawFace,menelStyle(zSlot,(b.type+1)%4));
      if(!clash){ctx.save();ctx.fillStyle='#eee1bd';ctx.fillRect(center-8,g.GY-45,16,10);ctx.strokeStyle='#6c5b45';ctx.strokeRect(center-8,g.GY-45,16,10);
        var an=menelName(aSlot),zn=menelName(zSlot);ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#f0dfb8';if(an)ctx.fillText(an,center-sep,g.GY-58);if(zn)ctx.fillText(zn,center+sep,g.GY-58);ctx.restore();}
    });
  }
  function sky(ctx,w,gy,top,bottom){var gr=ctx.createLinearGradient(0,0,0,gy);gr.addColorStop(0,top);gr.addColorStop(1,bottom);ctx.fillStyle=gr;ctx.fillRect(0,0,w,gy);}
  function lamp(ctx,x,y,on){ctx.strokeStyle='#4c5353';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-90);ctx.lineTo(x+18,y-90);ctx.stroke();ctx.fillStyle=on?'#f1d58b':'#9aa1a0';ctx.beginPath();ctx.ellipse(x+22,y-89,9,5,0,0,Math.PI*2);ctx.fill();}
  function car(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);contactShadow(ctx,0,1,31,.28);var body=ctx.createLinearGradient(-28,-26,28,-5);body.addColorStop(0,shade(col,1.16));body.addColorStop(.55,col);body.addColorStop(1,shade(col,.62));ctx.fillStyle=body;ctx.strokeStyle='#242b2e';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-29,-16);ctx.lineTo(-20,-17);ctx.lineTo(-9,-29);ctx.lineTo(15,-29);ctx.lineTo(26,-18);ctx.lineTo(30,-15);ctx.lineTo(27,-5);ctx.lineTo(-27,-5);ctx.closePath();ctx.fill();ctx.stroke();glassPanel(ctx,-7,-27,20,9,true);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(-25,-14,44,2);wheel(ctx,-18,-5,7);wheel(ctx,19,-5,7);ctx.restore();}
  function kiosk(ctx,x,y,w,h,sign,body,accent){
    var left=x-w/2,night=segments[visualSegment].scene>=2,shop=sign==='MONOPOLOWY';
    ctx.save();ctx.lineJoin='round';contactShadow(ctx,x,y,w*.57,.30);
    // Enamel fascia, corrugated roof and a deep service window: a local service pavilion.
    materialRect(ctx,left,y-h,w,h,'#dbd1ae',shop?'#b9b493':'#769485','#2b4143');
    ctx.fillStyle='#465d56';ctx.fillRect(left+w*.84,y-h,w*.16,h);
    ctx.fillStyle='#344a49';ctx.fillRect(left-6,y-h-29,w+12,10);
    ctx.fillStyle='#d3c8a5';ctx.fillRect(left-7,y-h-31,w+14,3);
    for(var roof=0;roof<12;roof++)line(ctx,left+roof*w/12,y-h-28,left+roof*w/12+4,y-h-21,'#829385',.7);
    enamelSign(ctx,left-2,y-h-20,w+4,27,sign,shop?'#315f5a':accent,14);
    ctx.fillStyle='#273e40';ctx.fillRect(left+9,y-h+15,w*.60,h*.58);
    glassPanel(ctx,left+12,y-h+18,w*.57,h*.51,night);
    // Framed display: bottles and paper labels stay below the high-contrast fascia.
    for(var shelf=0;shelf<2;shelf++){
      var sy=y-h+35+shelf*22;
      ctx.fillStyle='#bfb28b';ctx.fillRect(left+13,sy+11,w*.55,3);
      for(var item=0;item<7;item++){
        var ix=left+20+item*w*.074;
        if(shop){bottle(ctx,choices[item%3],ix,sy+3,.38,0);}
        else{ctx.fillStyle=item%2?'#d68e50':'#e4d5a1';ctx.fillRect(ix-3,sy+3,9,6);ctx.fillStyle='#a44d3d';ctx.fillRect(ix-1,sy+4,6,1);}
      }
    }
    line(ctx,left+w*.34,y-h+16,left+w*.34,y-h*.24,'#b1b5a0',2);
    ctx.fillStyle='#d1c6a6';ctx.fillRect(left+6,y-h*.24,w*.64,7);
    ctx.fillStyle='#3a504a';ctx.fillRect(left+w*.70,y-h+14,w*.20,h-14);
    glassPanel(ctx,left+w*.73,y-h+19,w*.14,h*.48,night);
    line(ctx,left+w*.76,y-22,left+w*.82,y-22,'#e9dbaf',1.6);
    ctx.fillStyle='#38564f';ctx.fillRect(left,y-15,w,15);
    for(var rib=0;rib<16;rib++)line(ctx,left+rib*w/16,y-13,left+rib*w/16,y-2,'#738574',.6);
    enamelSign(ctx,left+w*.715,y-35,w*.18,12,shop?'8–20':sign==='PRASA · RUCH'?'PRASA':'BAR','#f0e0b6',5);
    if(shop){poster(ctx,left+w*.92,y-h+22,12,27,'#ddc498','#ab9b7d','SKUP');}
    ctx.restore();
  }
  function rectPanel(ctx,x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#27363b';ctx.lineWidth=1.2;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
  var ESTATE_SKYLINE_LAYOUTS=[
    [{x:-.05,w:.24,h:.88,step:.22,utility:.72,type:1},{x:.23,w:.17,h:.62,step:0,utility:.25,type:2},{x:.47,w:.28,h:1,step:.18,utility:.62,type:0},{x:.82,w:.20,h:.71,step:0,utility:.40,type:2}],
    [{x:-.09,w:.22,h:.65,step:0,utility:.34,type:0},{x:.17,w:.31,h:.94,step:.16,utility:.68,type:2},{x:.56,w:.19,h:.72,step:0,utility:.22,type:1},{x:.79,w:.29,h:.83,step:.20,utility:.52,type:0}],
    [{x:-.04,w:.18,h:.72,step:.18,utility:.58,type:2},{x:.24,w:.25,h:.58,step:0,utility:.18,type:1},{x:.58,w:.29,h:.89,step:.14,utility:.76,type:0},{x:.91,w:.13,h:.63,step:0,utility:.31,type:2}]
  ];
  // Address-based lighting: no random calls, timers or draw-time simulation changes.
  function roomNoise(seed){var n=Math.imul(seed^0x45d9f3b,0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return ((n^(n>>>16))>>>0)/4294967296;}
  var ROOM_TONES=['#efd098','#dfb077','#ddd8b6','#b5c8d0','#e5be9e'];
  function roomLight(seed,time,night){
    var period=43+roomNoise(seed+19)*71,phase=Math.max(0,time||0)+roomNoise(seed+41)*period,cycle=Math.floor(phase/period),q=Math.min(1,(phase-cycle*period)/1.4);q=q*q*(3-2*q);
    function level(n){return roomNoise(seed+Math.imul(n+37,7919))<(night?.58:.12)?.48+roomNoise(seed+7)*.42:0;}
    return {level:level(cycle-1)*(1-q)+level(cycle)*q,tone:ROOM_TONES[Math.floor(roomNoise(seed+83)*ROOM_TONES.length)],curtain:.12+roomNoise(seed+101)*.32,period:period};
  }
  function estateBackgroundBlock(ctx,w,baseY,maxH,b,c1,c2,night,detail){var x=b.x*w,bw=b.w*w,h=maxH*b.h,y=baseY-h,step=b.step*bw;
    var gr=ctx.createLinearGradient(x,y,x+bw,y+h);gr.addColorStop(0,c1);gr.addColorStop(1,c2);ctx.fillStyle=gr;ctx.fillRect(x,y,bw,h);if(step){ctx.fillStyle=shade(c1,.94);ctx.fillRect(x+bw-step,y-h*.10,step,h*.10);}
    ctx.fillStyle='rgba(24,38,42,.13)';ctx.fillRect(x+bw*.82,y,bw*.18,h);ctx.strokeStyle='rgba(231,234,215,.10)';ctx.lineWidth=1;for(var seam=1;seam<5;seam++){ctx.beginPath();ctx.moveTo(x,y+h*seam/5);ctx.lineTo(x+bw,y+h*seam/5);ctx.stroke();}
    var glow=night?'#c2ac78':'#bac5b9',rows=Math.max(2,Math.floor(h/34));ctx.fillStyle=glow;
    // Larger framed windows, subtly recessed, with staggered curtains and unlit rooms.
    for(var floor=0;floor<rows;floor++){
      var fy=y+12+floor*(h-20)/rows;
      for(var flat=0;flat<Math.max(2,Math.floor(bw/34));flat++){
        var fx=x+10+flat*34,room=roomLight(1000+detail*397+floor*53+flat*17,0,night);
        ctx.fillStyle=night?'#364558':'#708a89';ctx.fillRect(fx,fy,10,14);
        ctx.save();ctx.globalAlpha=room.level*(night?.68:.3);ctx.fillStyle=room.tone;ctx.fillRect(fx+1,fy+1,8,12);ctx.restore();
        ctx.fillStyle=night?'rgba(186,191,186,.22)':'#bfc8b8';ctx.fillRect(fx+1,fy+1,2+room.curtain*5,11);
        ctx.fillStyle='rgba(20,30,40,.28)';ctx.fillRect(fx,fy,10,2);
        ctx.fillStyle=night?'#6b7380':'#a4b0a3';ctx.fillRect(fx-1,fy+14,12,2);
      }
    }
    ctx.fillStyle=glow;
    if(b.type===1){for(var br=0;br<rows;br++){var by=y+28+br*(h-20)/rows;ctx.fillStyle=night?'#4d6070':'#92a197';ctx.fillRect(x+bw*.12,by,bw*.64,5);}}
    if(b.type===2){ctx.fillStyle=night?'#35465b':'#7a8f89';ctx.fillRect(x+bw*.43,y+4,bw*.16,h-8);for(var sr=0;sr<rows;sr++){var stair=roomLight(7000+detail*397+sr*53,0,night);ctx.fillStyle=night?'#53606b':'#bfcbba';ctx.fillRect(x+bw*.46,y+12+sr*(h-20)/rows,bw*.07,13);if(night){ctx.save();ctx.globalAlpha=.12+stair.level*.45;ctx.fillStyle=stair.tone;ctx.fillRect(x+bw*.46,y+12+sr*(h-20)/rows,bw*.07,13);ctx.restore();}}}
    var ux=x+bw*b.utility,roof=y-(step&&b.utility>1-b.step?h*.10:0);ctx.fillStyle=shade(c2,.78);ctx.fillRect(ux-8,roof-8,16,8);ctx.strokeStyle=shade(c2,.62);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ux,roof-8);ctx.lineTo(ux,roof-25);ctx.stroke();ctx.beginPath();ctx.arc(ux,roof-27,3,0,Math.PI*2);ctx.stroke();
  }
  function urbanEstateLayer(ctx,w,baseY,maxH,c1,c2,alpha,layout,night){ctx.save();ctx.globalAlpha=1;ESTATE_SKYLINE_LAYOUTS[layout].forEach(function(b,i){estateBackgroundBlock(ctx,w,baseY,maxH,b,c1,c2,night,i+layout);});ctx.restore();}
  function paintArenaBackdrop(ctx,w,gy,seg){
    var night=seg.scene>=2,scale=Math.max(.65,Math.min(1.6,gy/590));
    // Opaque architecture occludes the sun; distance is encoded in hue and contrast.
    urbanEstateLayer(ctx,w,gy-76*scale,408*scale,night?'#53657c':'#b1b4ab',night?'#424f66':'#9ba9a1',.55,0,night);
    urbanEstateLayer(ctx,w,gy-38*scale,303*scale,night?'#46556d':'#99a29a',night?'#323e55':'#88998e',.70,1,night);
    // Keep the middle open: low pavilions and trees rather than a third wall of blocks.
    materialRect(ctx,w*.24,gy-144*scale,w*.20,65*scale,night?'#586168':'#c5b996',night?'#3d4a53':'#9d9e83','#657871');
    materialRect(ctx,w*.60,gy-137*scale,w*.16,58*scale,night?'#586168':'#b8b595',night?'#3d4a53':'#8f9e89','#657871');
    enamelSign(ctx,w*.255,gy-140*scale,w*.12,15*scale,'SPOŻYWCZY',night?'#42615c':'#698574',8*scale);
    enamelSign(ctx,w*.615,gy-133*scale,w*.12,15*scale,seg.period==='1988'?'PRASA · RUCH':'VIDEO · KASETY',night?'#42615c':'#698574',7*scale);
    [ .27,.68,.79 ].forEach(function(px,i){drawTreeUrban(ctx,w*px,gy-73*scale,(i===1?.85:1.10)*scale,night);});
    lamp(ctx,w*.34,gy-81*scale,night);lamp(ctx,w*.66,gy-81*scale,night);
  }
  function drawArenaBackdrop(ctx,w,gy,seg){var key=seg.scene+':'+seg.period+':'+w+':'+gy,sprite=ART_CACHE.get(key);if(!sprite){var sc=document.createElement('canvas'),dpr=2;sc.width=Math.max(1,Math.round(w*dpr));sc.height=Math.max(1,Math.round(gy*dpr));var sctx=sc.getContext('2d');sctx.scale(dpr,dpr);paintArenaBackdrop(sctx,w,gy,seg);sprite=sc;ART_CACHE.set(key,sprite);if(ART_CACHE.size>4)ART_CACHE.delete(ART_CACHE.keys().next().value);}ctx.drawImage(sprite,0,0,w,gy);}
  function graffiti(ctx,x,y,text,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.globalAlpha=.62;ctx.fillStyle=col||'#734e63';ctx.font='bold 10px sans-serif';ctx.fillText(text,0,0);ctx.restore();}
  function puddle(ctx,x,y,w){ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#b8d1d2';ctx.beginPath();ctx.ellipse(x,y,w,3.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.22;ctx.fillStyle='#f5df9e';ctx.fillRect(x-w*.35,y-1,w*.3,1);ctx.restore();}
  function trash(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#d8d0b7';ctx.rotate(-.18);ctx.fillRect(-5,-2,10,4);ctx.restore();}
  function bollard(ctx,x,y){ctx.fillStyle='#575c5b';ctx.fillRect(x-3,y-19,6,19);ctx.fillStyle='#d7c55d';ctx.fillRect(x-3,y-15,6,4);}
  function neonGlow(ctx,x,y,w,h,col){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=col;for(var n=4;n>0;n--)ctx.fillRect(x-n*2,y-n*2,w+n*4,h+n*4);ctx.restore();}
  function landmarkOutline(ctx){ctx.strokeStyle='#27363b';ctx.lineWidth=1.4;ctx.lineJoin='round';ctx.lineCap='round';}
  function drawArenaScene(ctx,g,seg){
    var y=g.GY,mid=g.W*.5,t=g.estate.time,night=seg.scene>=2,sceneScale=estateViewportScale(y),groundDepth=112*sceneScale;ctx.save();
    // Narrow urban ground plane; the scenery, not a grey parking lot, owns the frame.
    var ground=ctx.createLinearGradient(0,y-groundDepth,0,y+4);ground.addColorStop(0,night?'#50595f':'#747368');ground.addColorStop(1,night?'#2e3538':'#4c554c');ctx.fillStyle=ground;ctx.fillRect(0,y-groundDepth,g.W,groundDepth+4);
    var pavement=ctx.createLinearGradient(0,y,0,g.H);pavement.addColorStop(0,night?'#434a4d':'#929482');pavement.addColorStop(1,night?'#242c32':'#596a60');ctx.fillStyle=pavement;ctx.fillRect(0,y,g.W,g.H-y);
    ctx.fillStyle=night?'#222e32':'#506657';ctx.fillRect(0,y,g.W,17);ctx.fillStyle='rgba(239,228,195,.34)';ctx.fillRect(0,y-4,g.W,2);ctx.fillStyle='rgba(27,34,31,.22)';ctx.fillRect(0,y+2,g.W,4);
    ctx.strokeStyle=night?'#37434a':'#6d7c6b';ctx.lineWidth=1;
    for(var slab=0;slab<g.W/90;slab++){ctx.beginPath();ctx.moveTo(slab*90,y+20);ctx.lineTo(slab*90-35,g.H);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(0,y+50);ctx.lineTo(g.W,y+50);ctx.stroke();
    ctx.fillStyle=night?'#3d5548':'#6f8b5c';for(var grass=0;grass<18;grass++){var gx=(grass*97+31)%g.W;ctx.fillRect(gx,y+4+(grass%3),2,5+(grass%4));}
    ctx.strokeStyle='rgba(35,42,41,.18)';ctx.lineWidth=1;for(var crack=0;crack<7;crack++){var cx=(crack*167+51)%g.W,cy=y-8-(crack%3)*13;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+8,cy+3);ctx.lineTo(cx+3,cy+8);ctx.stroke();}
    ctx.fillStyle=night?'#85847b':'#aaa596';for(var curb=0;curb<9;curb++)ctx.fillRect(curb*g.W/9+4,y-groundDepth+1,Math.max(12,g.W/9-13),4);
    ctx.strokeStyle='rgba(224,220,199,.22)';for(var bay=0;bay<6;bay++){ctx.beginPath();ctx.moveTo(bay*g.W/6+22,y-83*sceneScale);ctx.lineTo(bay*g.W/6+37,y-106*sceneScale);ctx.stroke();}
    // Pools of light, wet asphalt and sparse street debris give the foreground depth without clutter.
    if(night){ctx.save();ctx.globalCompositeOperation='lighter';[g.W*.19,g.W*.78].forEach(function(lx){var pool=ctx.createRadialGradient(lx,y-48*sceneScale,1,lx,y-48*sceneScale,70*sceneScale);pool.addColorStop(0,'rgba(244,215,139,.22)');pool.addColorStop(.42,'rgba(222,191,112,.09)');pool.addColorStop(1,'rgba(222,191,112,0)');ctx.fillStyle=pool;ctx.beginPath();ctx.ellipse(lx,y-42*sceneScale,75*sceneScale,22*sceneScale,0,0,Math.PI*2);ctx.fill();});ctx.restore();}
    puddle(ctx,g.W*.30,y-21*sceneScale,28*sceneScale);puddle(ctx,g.W*.72,y-62*sceneScale,20*sceneScale);
    var paperX=g.W*.43+(t*7)%(g.W*.14);ctx.save();ctx.translate(paperX,y-18*sceneScale+Math.sin(t*2.4)*2);ctx.rotate(Math.sin(t*1.7)*.24);trash(ctx,0,0,.82);ctx.restore();
    ctx.save();ctx.strokeStyle='rgba(28,34,34,.42)';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(g.W*.57,y-53*sceneScale,17*sceneScale,6*sceneScale,0,0,Math.PI*2);ctx.stroke();for(var mh=0;mh<4;mh++){ctx.beginPath();ctx.moveTo(g.W*.57-12*sceneScale+mh*8*sceneScale,y-57*sceneScale);ctx.lineTo(g.W*.57-8*sceneScale+mh*8*sceneScale,y-49*sceneScale);ctx.stroke();}ctx.restore();
    landmarkOutline(ctx);

    // One large, iconic modern-estate landmark per stage.
    periodProps(ctx,g,seg);
    var service=serviceDoor(g);if(service.kind==='annex'){ctx.save();ctx.translate(service.buildingX,service.buildingY);ctx.scale(service.scale,service.scale);kiosk(ctx,0,0,110,90,service.sign,'#64867b','#416d63');ctx.restore();}
    var landmarkScale=Math.min(1.46*sceneScale,g.W*.36/248);ctx.save();ctx.translate(mid,y);ctx.scale(landmarkScale,landmarkScale);ctx.translate(-mid,-y);contactShadow(ctx,mid,y-1,112,.34);landmarkOutline(ctx);
    if(seg.arena==='balcony_canyon'){
      kiosk(ctx,mid-15,y,150,89,'PRASA · RUCH','#64867b','#416d63');
      for(var mag=0;mag<5;mag++){poster(ctx,mid-70+mag*17,y-59,13,23,['#dcc5a0','#8ca7a1','#c88c73'][mag%3],'#9a967e',['SPORT','FILM','DOM','TV','AUTO'][mag]);}
      saturator(ctx,mid+90,y);
    }else if(seg.arena==='shopfront'){
      kiosk(ctx,mid,y,190,92,'MONOPOLOWY','#65594a','#aa5140');for(var q=0;q<2;q++)TACTICS.figure(ctx,{kind:'courier',isP:true,walk:q,moving:false},mid-65+q*28,y,TACTICS.actorScale(g.H)/landmarkScale);
    }else if(seg.arena==='bench_square'){
      drawTreeUrban(ctx,mid-115,y,.62,false);drawTreeUrban(ctx,mid+112,y,.58,false);ctx.fillStyle='#293235';ctx.fillRect(mid-91,y-49,8,43);ctx.fillRect(mid+83,y-49,8,43);for(var slat=0;slat<3;slat++){var sy=y-47+slat*10;materialRect(ctx,mid-87,sy,174,8,'#846148','#563c31','#27363b');}materialRect(ctx,mid-94,y-23,188,11,'#86634a','#584033','#27363b');ctx.fillStyle='#31393a';ctx.fillRect(mid-76,y-12,8,12);ctx.fillRect(mid+68,y-12,8,12);
    }else if(seg.arena==='snack_kiosk'){
      kiosk(ctx,mid,y,194,94,'ZAPIEKANKI','#6d4e39','#d38b44');
    }else if(seg.arena==='rack_yard'){
      ctx.strokeStyle='#27363b';ctx.lineWidth=11;ctx.strokeRect(mid-80,y-101,160,97);ctx.strokeStyle='#87928c';ctx.lineWidth=7;ctx.strokeRect(mid-80,y-101,160,97);ctx.fillStyle='#994d48';ctx.fillRect(mid-64,y-85,128,66);landmarkOutline(ctx);ctx.lineWidth=2;ctx.strokeRect(mid-63,y-84,126,64);ctx.strokeStyle='rgba(238,207,164,.55)';for(var stripe=0;stripe<4;stripe++){ctx.beginPath();ctx.moveTo(mid-58,y-76+stripe*15);ctx.lineTo(mid+58,y-76+stripe*15);ctx.stroke();}ctx.fillStyle='#353e3e';ctx.fillRect(mid-87,y-7,18,7);ctx.fillRect(mid+69,y-7,18,7);
    }else if(seg.arena==='bin_alley'){
      materialRect(ctx,mid-118,y-83,236,78,'#77756b','#504f4b','#27363b');ctx.fillStyle='#343d3d';ctx.fillRect(mid-124,y-88,248,10);for(var bi=-2;bi<=2;bi++){var bx=mid+bi*43;ctx.fillStyle=bi%2?'#61796a':'#526d72';ctx.fillRect(bx-17,y-50,34,45);landmarkOutline(ctx);ctx.strokeRect(bx-16.5,y-49.5,33,44);ctx.fillStyle='#334640';ctx.fillRect(bx-20,y-57,40,8);ctx.fillStyle='#d7c36b';ctx.fillRect(bx-5,y-35,10,8);ctx.fillStyle='#202829';ctx.beginPath();ctx.arc(bx-11,y-3,3,0,Math.PI*2);ctx.arc(bx+11,y-3,3,0,Math.PI*2);ctx.fill();}
    }else if(seg.arena==='pizza_pavilion'){
      kiosk(ctx,mid,y,198,94,'PIZZA 24','#5e4944','#bb4e40');
    }else if(seg.arena==='night_gate'){
      materialRect(ctx,mid-118,y-137,236,132,'#53606b','#303840','#20272d');ctx.fillStyle='#151b20';ctx.fillRect(mid-74,y-89,148,84);ctx.fillStyle='#70828c';ctx.fillRect(mid-118,y-111,236,10);for(var gw=-2;gw<=2;gw++)glassPanel(ctx,mid+gw*39-14,y-132,28,16,true);ctx.fillStyle='#e8d596';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText('NOCNA BRAMA',mid,y-96);rectPanel(ctx,mid-112,y-102,25,18,'#516878');ctx.fillStyle='#eee1b9';ctx.font='bold 7px sans-serif';ctx.fillText('12',mid-99,y-90);lamp(ctx,mid-95,y-1,true);lamp(ctx,mid+87,y-1,true);bollard(ctx,mid-67,y);bollard(ctx,mid+67,y);
    }else if(seg.arena==='kebab_corner'){
      kiosk(ctx,mid,y,190,96,'KEBAB 24','#51443b','#c49a59');ctx.fillStyle='#caa35f';ctx.fillRect(mid-6,y-77,12,53);ctx.fillStyle='#874b37';for(var k=0;k<5;k++)ctx.fillRect(mid-4,y-72+k*9,8,6);
    }else if(seg.arena==='parking_patrol'){
      ctx.fillStyle='rgba(226,220,194,.26)';ctx.fillRect(mid-132,y-42,48,3);ctx.fillRect(mid+84,y-42,48,3);car(ctx,mid-114,y-7,.48,'#6e655d');car(ctx,mid+114,y-7,.48,'#586b77');var px=mid+Math.sin(t*.82)*28;car(ctx,px,y-7,1.16,'#456b8a');ctx.save();ctx.globalAlpha=.16;ctx.fillStyle='#75bce5';ctx.beginPath();ctx.arc(px-7,y-47,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8caeda';ctx.beginPath();ctx.arc(px+7,y-47,8,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle='#7fc0df';ctx.fillRect(px-14,y-49,14,5);ctx.fillStyle='#6698ce';ctx.fillRect(px,y-49,14,5);ctx.fillStyle='#e8ddd0';ctx.fillRect(px-29,y-28,58,6);ctx.fillStyle='#35556e';ctx.font='bold 7px sans-serif';ctx.textAlign='center';ctx.fillText('PATROL',px,y-23);
    }else if(seg.arena==='closed_arcade'){
      materialRect(ctx,mid-114,y-101,228,96,'#69615d','#443f40','#302e30');ctx.fillStyle='#303638';ctx.fillRect(mid-118,y-106,236,10);metalShutter(ctx,mid-96,y-82,192,72);rounded(ctx,mid-54,y-88,108,22,2,'#3d4142','#252b2d');ctx.fillStyle='#eadab5';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',mid,y-72);poster(ctx,mid-108,y-78,18,30,'#82534e','#573938','24H');
    }else{
      var van=mid;contactShadow(ctx,van,y-2,94,.42);materialRect(ctx,van-82,y-85,120,77,'#d3c1a0','#889789','#26343a');ctx.fillStyle='#b7b79a';ctx.strokeStyle='#26343a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(van+38,y-59);ctx.lineTo(van+61,y-55);ctx.lineTo(van+78,y-35);ctx.lineTo(van+76,y-8);ctx.lineTo(van+38,y-8);ctx.closePath();ctx.fill();ctx.stroke();glassPanel(ctx,van+46,y-51,20,18,true);ctx.fillStyle='#e8d7b0';ctx.fillRect(van-68,y-62,73,25);ctx.strokeStyle='#3a3240';for(var hatch=0;hatch<3;hatch++){ctx.beginPath();ctx.moveTo(van-64,y-57+hatch*7);ctx.lineTo(van+1,y-57+hatch*7);ctx.stroke();}ctx.fillStyle='#d8c28d';ctx.fillRect(van-68,y-106,130,22);ctx.strokeStyle='#26343a';ctx.strokeRect(van-67.5,y-105.5,129,21);ctx.fillStyle='#f4e0ad';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('NOCNY EXPRESS',van-3,y-91);rounded(ctx,van+11,y-68,23,16,2,'#3b3341','#26343a');ctx.fillStyle='#f0d899';ctx.font='bold 8px sans-serif';ctx.fillText('24H',van+22,y-57);ctx.fillStyle='#f3dfaa';ctx.fillRect(van+68,y-27,8,7);ctx.fillStyle='#30383b';ctx.fillRect(van-87,y-14,10,6);ctx.fillRect(van+74,y-14,9,6);wheel(ctx,van-52,y-7,11);wheel(ctx,van+52,y-7,11);
    }
    ctx.restore(); // landmark scale
    ctx.restore();
  }
  function stageBadge(ctx,g,lang){
    if(g.over||g.estate.segmentFlash<=.75)return;var seg=segmentOf(g),life=Math.min(1,(g.estate.segmentFlash-.75)/.85),w=Math.min(350,g.W*.45),x=(g.W-w)/2,y=Math.max(108,Math.min(150,g.GY*.25));
    ctx.save();ctx.globalAlpha=life;rounded(ctx,x,y,w,34,5,'rgba(23,31,34,.84)',seg.accent||'#d8c49c');ctx.fillStyle='#f2dfb6';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText((lang==='en'?seg.en:seg.pl)+' · '+seg.period,g.W*.5,y+14);ctx.font='9px sans-serif';ctx.fillStyle='#cad3cb';ctx.fillText(lang==='en'?seg.hintEn:seg.hintPl,g.W*.5,y+27,w-16);ctx.restore();
  }
  function damageScratches(ctx,c,x,y,w,h){var d=Math.max(0,1-c.hp/c.max),n=Math.floor(d*8);ctx.strokeStyle='rgba(43,51,51,.72)';ctx.lineWidth=1.4;for(var i=0;i<n;i++){var px=x+8+(i*31)%Math.max(12,w-20),py=y+10+(i*19)%Math.max(12,h-18);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+7,py+7);ctx.lineTo(px+3,py+14);ctx.stroke();}}
  var ESTATE_BASE_CACHE=new Map(),ESTATE_INK='#26343e';
  var APARTMENT_ROOMS=[[31,-215,14,25],[31,-176,14,25],[31,-137,14,25],[31,-98,14,25],[65,-216,27,24],[113,-216,26,24],[157,-216,16,24],[65,-178,27,18],[113,-178,26,18],[157,-178,16,18],[67,-78,25,24],[111,-78,26,24]];
  function roomInterior(ctx,x,y,w,h,seed,time,night){
    var room=roomLight(seed,time,night);ctx.save();
    ctx.fillStyle=night?'#263d49':'#486369';ctx.fillRect(x,y,w,h);
    ctx.globalAlpha=room.level;var glow=ctx.createLinearGradient(x,y,x+w,y+h);glow.addColorStop(0,room.tone);glow.addColorStop(1,'#826c58');ctx.fillStyle=glow;ctx.fillRect(x+1,y+1,w-2,h-2);ctx.globalAlpha=1;
    // Interior ceiling, deep jambs and translucent net curtains remain inside the glass.
    ctx.fillStyle='rgba(12,27,35,.34)';ctx.fillRect(x,y,w,3);ctx.fillRect(x,y,2,h);
    ctx.fillStyle=night?'rgba(207,206,181,.36)':'rgba(224,221,194,.58)';ctx.fillRect(x+2,y+2,w*room.curtain,h-4);ctx.fillRect(x+w-4,y+2,3,h-4);
    line(ctx,x+3,y+3,x+3,y+h-3,'rgba(244,231,200,.3)',.7);
    ctx.fillStyle='rgba(169,206,215,.13)';ctx.beginPath();ctx.moveTo(x+w*.55,y+2);ctx.lineTo(x+w-3,y+2);ctx.lineTo(x+w-3,y+h*.35);ctx.lineTo(x+w*.55,y+h*.65);ctx.fill();
    line(ctx,x+w*.5,y,x+w*.5,y+h,night?'#adb3a5':'#e6dbbf',1.2);
    // Light catches only the lower reveal; no additive glow through concrete.
    ctx.globalAlpha=room.level*.55;line(ctx,x+1,y+h-1,x+w-1,y+h-1,room.tone,1.5);ctx.restore();
  }
  function apartmentLights(ctx,g,player){var c=player?g.p:g.e,layout=baseLayout(c,g.GY),night=segmentOf(g).scene>=2;
    ctx.save();ctx.translate(layout.x,g.GY);ctx.scale(layout.w/200,layout.h/260);
    APARTMENT_ROOMS.forEach(function(r,i){roomInterior(ctx,r[0],r[1],r[2],r[3],(player?113:719)+i*67,g.estate.time,night);});ctx.restore();
  }
  var ESTATE_BASE_GRAMMAR=['apartment-mass','side-wings','stair-core','entrance-steps','hero-loggia','window-bays','flat-roof-services','recessed-window-reveals','side-wall-perspective','balcony-cast-shadows','independent-room-lighting','roof-occlusion'];
  // Five-storey prefabricated housing: flat roof, recessed balconies and a glazed stairwell.
  function paintApartmentBlock(ctx,player){
    var night=(segments[visualSegment]||segments[0]).scene>=2,team=player?'#4f8586':'#b8624e',ink='#303e40',cream=night?'#a2aaa3':'#ded5b7',shadeWall=night?'#697f7f':'#a69f8b';
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    function box(x,y,w,h,fill,stroke){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke!==false){ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);}}
    function stroke(x,y,xx,yy,col,width){line(ctx,x,y,xx,yy,col,width||1);}
    function plane(points,fill){ctx.fillStyle=fill;ctx.beginPath();points.forEach(function(p,i){if(i)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);});ctx.closePath();ctx.fill();}
    function pane(x,y,w,h,lit,curtain){
      plane([[x-3,y+h+3],[x+w+3,y+h+3],[x+w+7,y+h+8],[x+1,y+h+8]],'rgba(27,42,45,.22)');
      box(x-2,y-2,w+4,h+5,'#eee4c8');box(x,y,w,h,lit?'#dab979':'#3e5b60');
      box(x+1,y+1,w*.32,h-2,lit?'#f6dea1':'#94b1ac',false);
      if(curtain){box(x+w-5,y+1,4,h-2,'#d2c9ad',false);stroke(x+w-4,y+1,x+w-4,y+h-1,'#b6aa91',.6);}
      stroke(x+w*.5,y,x+w*.5,y+h,'#e6dbbf',1.2);
      stroke(x,y,x+w,y,night?'#303f42':'#64726d',1.8);stroke(x,y,x,y+h,'#43585a',1.4);
      plane([[x+w*.52,y+2],[x+w-2,y+2],[x+w-2,y+h*.28],[x+w*.52,y+h*.63]],lit?'rgba(255,232,172,.16)':'rgba(211,233,225,.2)');
      box(x-3,y+h+2,w+6,2,'#868d7f',false);
    }
    // Deep side return, one continuous roof and a warm concrete front.
    box(2,-232,196,232,shadeWall);
    box(9,-230,171,226,cream);
    var facadeLight=ctx.createLinearGradient(9,-230,180,-4);facadeLight.addColorStop(0,night?'rgba(194,213,207,.08)':'rgba(255,244,211,.28)');facadeLight.addColorStop(1,'rgba(35,48,49,.19)');box(9,-230,171,226,facadeLight,false);
    plane([[180,-230],[198,-222],[198,0],[180,-4]],night?'#435e62':'#737e75');stroke(180,-229,180,-4,'#eee0b9',1.3);
    var returnShade=ctx.createLinearGradient(180,-220,198,-220);returnShade.addColorStop(0,'rgba(14,29,36,.08)');returnShade.addColorStop(1,'rgba(14,29,36,.34)');plane([[180,-230],[198,-222],[198,0],[180,-4]],returnShade);
    // Roof overhang casts one coherent diagonal shadow onto the upper facade.
    plane([[9,-229],[180,-229],[180,-222],[16,-222]],'rgba(24,37,42,.26)');
    for(var sideFloor=0;sideFloor<5;sideFloor++)stroke(181,-191+sideFloor*43,197,-184+sideFloor*43,night?'#617679':'#919c8b',.7);
    box(9,-230,13,226,'#c3bda6',false);
    box(23,-230,30,226,team,false);
    box(53,-230,4,226,'#8b8d79',false);
    // Prefabrication joints are quiet; structural silhouette has the strongest contour.
    for(var row=0;row<5;row++){
      var yy=-222+row*43;
      stroke(9,yy+36,180,yy+36,'#b6ad94',.75);
      stroke(9,yy+37,180,yy+37,'#eee3c7',.6);
    }
    [60,105,151].forEach(function(x){stroke(x,-229,x,-9,'#b7ad95',.65);});
    // Rectangular stairwell and landing windows.
    box(27,-218,22,159,'#354e54');
    for(var floor=0;floor<4;floor++){
      pane(31,-215+floor*39,14,25,floor%2===0,false);
      stroke(29,-183+floor*39,47,-183+floor*39,'#b7beb0',3);
    }
    // Upper apartment windows; no roof crown or raised centre.
    pane(65,-216,27,24,false,true);pane(113,-216,26,24,true,true);pane(157,-216,16,24,false,false);
    pane(65,-178,27,18,true,true);pane(113,-178,26,18,false,true);pane(157,-178,16,18,false,false);
    // Hero loggia: same coordinates as its live actor clipping rectangle.
    box(57,-158,94,67,'#807a69');box(63,-153,82,56,'#293e43');
    plane([[57,-158],[151,-158],[145,-151],[63,-151]],'#a4a28b');plane([[57,-158],[63,-151],[63,-97],[57,-91]],'#d4c5a2');plane([[145,-151],[151,-158],[151,-91],[145,-97]],'#435656');
    box(64,-152,9,54,'#1e3238',false);pane(112,-148,27,43,false,true);
    var recessShade=ctx.createLinearGradient(63,-153,63,-124);recessShade.addColorStop(0,'rgba(7,19,27,.52)');recessShade.addColorStop(1,'rgba(7,19,27,0)');box(63,-153,82,29,recessShade,false);
    box(77,-149,25,43,'#725845',false);box(79,-145,20,22,'#9c805e',false);
    box(62,-106,85,14,team);stroke(61,-108,148,-108,'#f0e4c6',3);
    plane([[62,-92],[147,-92],[153,-83],[70,-83]],'rgba(30,42,44,.32)');stroke(63,-94,146,-94,'#345253',2);
    // Smaller stacked loggias on the right create depth at gameplay scale.
    [ -145,-102,-59 ].forEach(function(y,i){
      box(157,y,17,30,'#34494b');box(159,y+2,12,17,i===1?'#dab976':'#688d8d',false);
      box(154,y+21,23,10,team);stroke(153,y+20,179,y+20,'#ece0c0',2);
      plane([[154,y+31],[177,y+31],[181,y+36],[158,y+36]],'rgba(29,44,47,.28)');stroke(176,y+22,176,y+30,'#304f52',1.5);
    });
    pane(67,-78,25,24,true,true);pane(111,-78,26,24,false,true);
    // Pebble-dash plinth and terrazzo entrance; no glossy modern air-conditioning.
    box(9,-37,171,34,'#88877a');box(25,-52,28,49,'#2b4044');
    pane(29,-48,20,40,false,false);stroke(40,-31,40,-22,'#e4d7ad',1.6);
    box(20,-55,39,4,'#d9cfb3');box(19,-51,40,3,'#555d58',false);
    box(24,-5,31,4,'#b0aa95');box(19,-2,40,4,'#d0c5a6');
    box(56,-38,5,15,'#d5c6a0');for(var buz=0;buz<4;buz++)box(57,-36+buz*3,1.5,1,'#384c4c',false);
    // Enamel street plate, entrance number and basement ventilation.
    enamelSign(ctx,99,-29,64,15,'SŁONECZNA '+(player?'7':'9'),'#28597b',6.8);
    enamelSign(ctx,59,-48,12,12,player?'7':'9','#28597b',8);
    box(71,-19,19,9,'#3c4948');for(var v=0;v<4;v++)stroke(74+v*4,-18,74+v*4,-11,'#9d9c8b',.8);
    box(151,-22,22,11,'#3c4948');for(var v2=0;v2<4;v2++)stroke(153+v2*5,-21,153+v2*5,-12,'#9d9c8b',.8);
    // Geraniums, television aerial, drainpipe and patched concrete: sparse local detail.
    box(159,-85,14,5,'#a45f42');for(var flower=0;flower<4;flower++){stroke(161+flower*3,-85,160+flower*3,-90,'#506c49',1);ctx.fillStyle='#d88067';ctx.beginPath();ctx.arc(160+flower*3,-91,1.8,0,Math.PI*2);ctx.fill();}
    stroke(185,-229,185,-4,'#414f4e',2);stroke(184,-227,184,-5,'#c3c4ad',.6);
    box(0,-235,180,6,'#495958');plane([[180,-235],[200,-227],[200,-221],[180,-229]],'#344d51');stroke(0,-235,180,-235,'#e4d9b8',2);stroke(180,-235,200,-227,'#c4c6ab',1.4);
    box(64,-244,19,9,'#899085');box(62,-246,23,3,'#d0c4a4');
    box(151,-243,16,8,'#92917e');box(149,-246,20,3,'#c7baa0');
    stroke(108,-237,108,-263,'#344849',1.2);stroke(94,-256,123,-256,'#344849',1);
    for(var ant=0;ant<5;ant++)stroke(97+ant*5,-261,97+ant*5,-251,'#344849',.8);
    // One worn plaster patch, deliberately away from the hero and signage.
    ctx.fillStyle='#c2baa0';ctx.beginPath();ctx.moveTo(114,-45);ctx.lineTo(131,-45);ctx.lineTo(126,-38);ctx.lineTo(117,-39);ctx.fill();
    ctx.restore();
  }
  function estateApartmentBase(ctx,c,ground){
    var key='estate:'+c.isP+':'+((segments[visualSegment]||segments[0]).scene>=2),sprite=ESTATE_BASE_CACHE.get(key);if(!sprite){sprite=document.createElement('canvas');sprite.width=624;sprite.height=900;var sc=sprite.getContext('2d');sc.scale(3,3);sc.translate(4,296);paintApartmentBlock(sc,c.isP);ESTATE_BASE_CACHE.set(key,sprite);}
    ctx.save();var layout=baseLayout(c,ground),drawW=layout.w,drawH=layout.h,sx=drawW/200,sy=drawH/260,drawX=layout.x;contactShadow(ctx,drawX+drawW*.5,ground+2,drawW*.53,.42);ctx.drawImage(sprite,drawX-4*sx,ground-296*sy,208*sx,300*sy);ctx.restore();
  }
  function arenaBase(ctx,c,ground){estateApartmentBase(ctx,c,ground);}
  function surrenderPose(g,p){var lost=(p?g.p:g.e).hp<=0,q=lost?clamp((g.overT||0)/1.05,0,1):0;return {lost:lost,drop:40*q*q,tilt:(p?-1:1)*q*.28,flag:lost&&q>.45};}
  function resident(ctx,g,p,img,drawFace,unitScale){
    var c=p?g.p:g.e,pose=surrenderPose(g,p);var st=side(g,p),a=pose.lost?null:st.action,t=a?a.t:0,dir=p?1:-1,layout=baseLayout(c,g.GY),drawW=layout.w,drawH=layout.h,sx=drawW/200,sy=drawH/260,drawX=layout.x,sway=Math.sin(g.estate.time*2.0+(p?0:1))*.8,hitLife=clamp((st.hitReactT||0)/.72,0,1),hitPulse=Math.sin((1-hitLife)*Math.PI),recoilDir=p?-1:1;
    // The resident is clipped by the same rectangular loggia opening painted into the facade.
    ctx.save();ctx.translate(drawX,g.GY);ctx.scale(sx,sy);ctx.beginPath();ctx.rect(63,-153,82,56);ctx.clip();
    ctx.translate(100,-98+pose.drop);ctx.rotate(pose.tilt);ctx.translate(-100,98);
    ctx.translate(sway+recoilDir*hitPulse*5*(st.hitReactPower||1),hitPulse*1.5);ctx.translate(100,-98);ctx.rotate(recoilDir*hitPulse*.055*(st.hitReactPower||1));ctx.scale(1+hitPulse*.025,1-hitPulse*.035);ctx.translate(-100,98);
    var body=p?'#4f7c9d':'#9e5b55';ctx.fillStyle=body;ctx.strokeStyle=ESTATE_INK;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(82,-94);ctx.lineTo(84,-121);ctx.quadraticCurveTo(100,-134,116,-121);ctx.lineTo(118,-94);ctx.closePath();ctx.fill();ctx.stroke();
    var hx=100+dir*19,hy=-109,bottleAngle=0;if(a){if(t<.42){var lift=Math.min(1,t/.42),ease=lift*lift*(3-2*lift);hx=100+dir*(19-10*ease);hy=-109-23*ease;bottleAngle=-dir*1.28*ease;}else if(t<.76){hx=100+dir*(9+Math.sin(t*24)*.7);hy=-132+Math.sin(t*18)*.5;bottleAngle=-dir*1.32;}else if(t<1.18){var wind=(t-.76)/.42;hx=100+dir*(9-33*wind);hy=-132-6*wind;bottleAngle=-dir*1.32+dir*1.82*wind;}else{hx=100+dir*(32+(t-1.18)*8);hy=-127+(t-1.18)*24;bottleAngle=dir*.55;}}
    line(ctx,100+dir*12,-117,hx,hy,'#d3aa85',6);
    ctx.save();ctx.translate(100,-139);if(a&&t<.76)ctx.rotate(-dir*.07);if(hitLife>0)ctx.rotate(recoilDir*hitPulse*.10);if(img)drawFace(ctx,img,-16,-18,32,36,0);else{var residentSkin=ctx.createRadialGradient(-3,-3,1,0,0,13);residentSkin.addColorStop(0,'#f0c4a0');residentSkin.addColorStop(1,'#bd8263');ctx.fillStyle=residentSkin;ctx.strokeStyle='rgba(64,45,38,.68)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,10,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#bd8263';ctx.beginPath();ctx.ellipse(-9.5,0,2,3,0,0,Math.PI*2);ctx.ellipse(9.5,0,2,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#49403a';ctx.beginPath();ctx.moveTo(-10,-6);ctx.quadraticCurveTo(-6,-15,4,-13);ctx.quadraticCurveTo(11,-11,10,-4);ctx.quadraticCurveTo(2,-9,-10,-6);ctx.fill();var mood=hitLife>0?'grimace':a?(t<.76?'grin':'focus'):'neutral';faceDetails(ctx,0,0,1.08,mood);}ctx.restore();
    ctx.fillStyle='rgba(239,231,207,.20)';ctx.fillRect(98,-121,2,25);ctx.strokeStyle='rgba(33,43,47,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(91,-122);ctx.lineTo(100,-116);ctx.lineTo(109,-122);ctx.stroke();line(ctx,88,-113,81,-101,'#d3aa85',5);ctx.fillStyle='#d3aa85';ctx.beginPath();ctx.arc(80,-100,3,0,Math.PI*2);ctx.fill();
    if(a&&!a.released)bottle(ctx,a.item,hx,hy-4,.74,bottleAngle);ctx.restore();
    // Loggia rail sits in front of the character and belongs to the facade.
    ctx.save();ctx.translate(drawX,g.GY);ctx.scale(sx,sy);ctx.fillStyle='#7d8a85';ctx.fillRect(63,-104,82,11);ctx.fillStyle='#e5d9b8';ctx.fillRect(60,-108,88,4);for(var rail=0;rail<6;rail++)ctx.fillRect(68+rail*14,-104,2,11);ctx.restore();
    if(pose.flag){ctx.save();ctx.translate(drawX,g.GY);ctx.scale(sx,sy);var wave=Math.sin((g.overT||0)*8)*2;line(ctx,116,-109,116,-140,'#c1b088',1.5);ctx.fillStyle='#f9efcf';ctx.strokeStyle=ESTATE_INK;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(116,-140);ctx.quadraticCurveTo(126,-143+wave,137,-137);ctx.lineTo(137,-123);ctx.quadraticCurveTo(126,-129+wave,116,-125);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  }
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate,seg=segmentOf(g);
    apartmentLights(ctx,g,true);apartmentLights(ctx,g,false);
    courtyardMotion(ctx,g);resident(ctx,g,true,pFace,drawFace,unitScale);resident(ctx,g,false,eFace,drawFace,unitScale);
    drawDeliveries(ctx,g,unitScale);
    e.bottles.forEach(function(b){var q=Math.min(1,b.t/b.duration),a=anchor(g,b.isP,true),z=anchor(g,!b.isP);bottle(ctx,b.item,a.x+(z.x-a.x)*q,a.y+(z.y-a.y)*q-4*b.arc*q*(1-q),Math.max(.8,unitScale*.85),q*9*(b.isP?1:-1));});
    e.glass.forEach(function(s){var a=anchor(g,s.p);ctx.save();ctx.globalAlpha=1-s.t/.65;ctx.fillStyle=s.col;ctx.beginPath();ctx.ellipse(a.x+s.vx*s.t,a.y+s.vy*s.t+120*s.t*s.t,2,3,0,0,Math.PI*2);ctx.fill();ctx.restore();});
    (e.impacts||[]).forEach(function(v){ctx.save();ctx.translate(v.x,v.y);ctx.globalAlpha=1-v.t/.55;ctx.strokeStyle=v.col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,6+v.t*34*v.power,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(255,244,211,.92)';for(var ray=0;ray<8;ray++){var ra=ray*Math.PI/4+v.t*2,r1=5+v.t*17,r2=12+v.t*38*v.power;ctx.beginPath();ctx.moveTo(Math.cos(ra)*r1,Math.sin(ra)*r1);ctx.lineTo(Math.cos(ra)*r2,Math.sin(ra)*r2);ctx.stroke();}ctx.restore();});
    TACTICS.draw(ctx,g,unitScale,lang);stageBadge(ctx,g,lang);
    var ps=side(g,true),barW=Math.min(170,Math.max(126,g.W*.12)),bx=14,by=Math.max(58,Math.min(154,g.H*.18)),stam=ps.stamina;ctx.save();rounded(ctx,bx,by,barW,42,6,'rgba(24,32,35,.91)',seg.accent||'rgba(238,219,176,.45)');ctx.fillStyle=seg.accent||'#d8c49c';ctx.fillRect(bx,by+6,3,30);
    ctx.fillStyle='#e7d9b5';ctx.font='bold 9px sans-serif';ctx.textAlign='left';ctx.fillText((lang==='en'?'STAMINA ':'KONDYCJA ')+Math.round(stam)+'%',bx+6,by+11);ctx.fillStyle='#46534e';ctx.fillRect(bx+6,by+15,barW-12,6);ctx.fillStyle=stam<22?'#bd665b':stam<48?'#c7aa5e':'#91b56b';ctx.fillRect(bx+6,by+15,(barW-12)*stam/100,6);
    ctx.fillStyle='#ead7ad';ctx.font='bold 8px sans-serif';ctx.fillText((lang==='en'?'BOTTLES ':'BUTELKI ')+ps.bottles+'  ·  '+(lang==='en'?'FOOD ':'POSIŁKI ')+ps.food+(ps.combo>1?'  ×'+ps.combo:''),bx+6,by+34);if(ps.noticeT>0&&ps.notice){ctx.textAlign='left';ctx.fillStyle='#fff0b8';ctx.font='bold 9px sans-serif';ctx.fillText(noticeText(ps.notice,lang),bx,by-7);}ctx.restore();
  }
  function buildCards(doc,g,lang,onBuy,paused){var row=doc.getElementById('cds'),deck=availableChoices(g);row.innerHTML='';row._estateBuy=onBuy;row._estateDeck=deck.map(function(c){return c.id;}).join(',');deck.forEach(function(item,i){var card=doc.createElement('button');card.type='button';card.className='cd';card.id='estate_'+item.id;card.dataset.hotkey=String(i+1);
    var title=lang==='en'?item.en:item.pl;card.setAttribute('aria-label',title+(item.rolePl?' · '+(lang==='en'?item.roleEn:item.rolePl):''));card.title=title+(item.unlock!==undefined?' · '+TACTICS.description(item.id,lang):item.damage?' · '+item.damage+(lang==='en'?' morale':' morale'):item.id==='food'?' · stamina':' · supply');
    if(item.unlock!==undefined)card.setAttribute('aria-label',title+' · '+TACTICS.description(item.id,lang));var kbd=doc.createElement('div');kbd.className='cdk';kbd.textContent=String(i+1);card.appendChild(kbd);
    var wrap=doc.createElement('div');wrap.className='iconWrap';var canvas=doc.createElement('canvas');canvas.width=56;canvas.height=56;canvas.id='estate_icon_'+item.id;var ctx=canvas.getContext('2d');if(item.unlock!==undefined)TACTICS.figure(ctx,{kind:item.id,isP:true,hp:1,walk:0},item.id==='cart'?20:26,54,item.id==='cart'?.65:.8);else if(item.id==='runner')TACTICS.figure(ctx,{kind:'courier',isP:true,walk:0,cargo:true},24,54,.8);else if(item.id==='food')foodIcon(ctx,28,29,1.5,segmentOf(g).foodType||0);else bottle(ctx,item,28,29,1.6,-.15);wrap.appendChild(canvas);
    var overlay=doc.createElement('div');overlay.className='cdState';overlay.id='estate_state_'+item.id;wrap.appendChild(overlay);card.appendChild(wrap);
    var name=doc.createElement('div');name.className='estateName';name.id='estate_name_'+item.id;name.textContent=title;card.appendChild(name);var cost=doc.createElement('div');cost.className='cdc';cost.id='estate_cost_'+item.id;cost.textContent=item.cost;card.appendChild(cost);card.addEventListener('click',function(){onBuy(item.id);});row.appendChild(card);
  });updateCards(doc,g,lang,!!paused);}
  function updateCards(doc,g,lang,paused){var row=doc.getElementById('cds'),deck=availableChoices(g);if(row._estateBuy&&row._estateDeck!==deck.map(function(c){return c.id;}).join(',')){buildCards(doc,g,lang,row._estateBuy,paused);return;}deck.forEach(function(item){var el=doc.getElementById('estate_'+item.id);if(!el)return;var s=status(g,item.id,true),off=paused||!s.ok;el.disabled=off;el.setAttribute('aria-disabled',String(off));el.classList.toggle('unitUnavailable',off);
    var label=s.reason==='recruit'?Math.ceil(g.estate.tactics.p)+' s':s.reason==='limit'?'2/2':s.reason==='wait'?Math.ceil(side(g,true).cd)+' s':s.reason==='gold'?(lang==='en'?'CREDITS':'KREDYTY'):s.reason==='bottles'?'🍾 0':s.reason==='hungry'?'🍴':s.reason==='full'?'2/2':s.reason==='rest'?(lang==='en'?'REST':'PRZERWA'):'';
    var badge=doc.getElementById('estate_state_'+item.id);if(badge){badge.textContent=label;badge.style.display=off?'flex':'none';}
    if(item.id==='food'){var cv=doc.getElementById('estate_icon_food'),cc=doc.getElementById('estate_cost_food'),nn=doc.getElementById('estate_name_food'),st=side(g,true),food=foodFor(g);if(cv){var cx=cv.getContext('2d');cx.clearRect(0,0,56,56);foodIcon(cx,28,29,1.5,segmentOf(g).foodType||0);}if(cc)cc.textContent=st.food>0?(lang==='en'?'EAT':'ZJEDZ'):item.cost;if(nn)nn.textContent=st.food>0?(lang==='en'?'Eat '+food.en:'Zjedz: '+food.pl):(lang==='en'?item.en:item.pl);}
  });}
  var oldBase=root.CASTLE_ERA_ART.drawBase;
  root.CASTLE_ERA_ART.drawBase=function(ctx,c,ground,era,l,t){if(era==='modern'&&l==='estate'){arenaBase(ctx,c,ground);return;}return oldBase(ctx,c,ground,era,l,t);};
  var oldBackdrop=root.CASTLE_ERA_ART.backdrop;
  root.CASTLE_ERA_ART.backdrop=function(ctx,w,gy,era,l){if(era!=='modern'||l!=='estate')return oldBackdrop(ctx,w,gy,era,l);drawArenaBackdrop(ctx,w,gy,segments[visualSegment]||segments[0]);};
  root.CASTLE_ESTATE={roomLight:roomLight,availableChoices:availableChoices,serviceDoor:serviceDoor,runnerTarget:runnerTarget,doorOpen:doorOpen,advanceRunner:advanceRunner,surrenderPose:surrenderPose,finishTick:function(g,dt){g.estate.p.action=g.estate.e.action=null;g.estate.bottles=[];g.estate.glass=[];g.estate.impacts=[];TACTICS.finish(g,dt);},scenePalette:scenePalette,drawScenery:function(ctx,g){drawArenaScene(ctx,g,segmentOf(g));},baseLayout:baseLayout,anchor:anchor,active:active,init:init,buy:buy,eat:eat,status:status,tick:tick,draw:draw,buildCards:buildCards,updateCards:updateCards,choices:choices,foods:foods,segments:segments,level:level,segmentSeconds:SEGMENT_SECONDS,setSegment:setSegment,chooseDrink:chooseDrink,staminaCost:staminaCost,currentVisual:function(){return visualSegment;},arenaKinds:segments.map(function(s){return s.arena;}),landmarkKinds:segments.map(function(s){return s.landmark;}),artCache:function(){return ART_CACHE.size;},styleVersion:'8.9.1',periods:['1988','1997'],baseGrammar:ESTATE_BASE_GRAMMAR.slice(),baseCache:function(){return ESTATE_BASE_CACHE.size;}};
})(window);
