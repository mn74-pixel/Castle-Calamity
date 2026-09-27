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
    {id:'balcony',pl:'1/12 Balkonowe otwarcie',en:'1/12 Balcony Opening',hintPl:'Poznaj rzut i dostawę',hintEn:'Learn throw and supply',runner:13,ai:3.2,cd:1,brawlers:0,prop:'balcony',food:false,accent:'#d4c188',tint:'day',supply:2},
    {id:'queue',pl:'2/12 Kolejka do Monopolowego',en:'2/12 Off-licence Queue',hintPl:'Pilnuj zapasu butelek',hintEn:'Watch your bottle stock',runner:12.8,ai:3.05,cd:.99,brawlers:0,prop:'queue',food:false,accent:'#c7a56b',tint:'day',supply:2},
    {id:'bench-league',pl:'3/12 Liga Ławkowa',en:'3/12 Bench League',hintPl:'Pierwsza osiedlowa awantura',hintEn:'First estate scuffle',runner:12.5,ai:2.95,cd:.98,brawlers:1,prop:'bench',food:false,accent:'#b38a63',tint:'warm',supply:2},
    {id:'snack',pl:'4/12 Zapiekanka ratunkowa',en:'4/12 Emergency Baguette',hintPl:'Jedzenie odnawia kondycję',hintEn:'Food restores stamina',runner:12.2,ai:2.9,cd:.97,brawlers:1,prop:'snack',food:true,foodType:0,accent:'#d38a45',tint:'warm',supply:2},
    {id:'carpet',pl:'5/12 Bitwa o trzepak',en:'5/12 Carpet-Rack Clash',hintPl:'Ogórek skraca przestój',hintEn:'Pickle cuts downtime',runner:12,ai:2.8,cd:.95,brawlers:1,prop:'rack',food:true,foodType:1,accent:'#9f6d5b',tint:'warm',supply:2},
    {id:'bins',pl:'6/12 Śmietnikowy rozejm',en:'6/12 Bin-Shed Truce',hintPl:'Więcej chaosu, ten sam plan',hintEn:'More chaos, same plan',runner:11.7,ai:2.72,cd:.94,brawlers:2,prop:'bins',food:true,foodType:1,accent:'#76816d',tint:'grey',supply:2},
    {id:'pizza',pl:'7/12 Pizza na pół',en:'7/12 Half-and-Half Pizza',hintPl:'Pizza daje dłuższą regenerację',hintEn:'Pizza grants longer recovery',runner:11.4,ai:2.65,cd:.93,brawlers:2,prop:'pizza',food:true,foodType:2,accent:'#c47b4f',tint:'sunset',supply:2},
    {id:'night',pl:'8/12 Nocna zmiana',en:'8/12 Night Shift',hintPl:'Noc przyspiesza tempo',hintEn:'Night raises the tempo',runner:11.1,ai:2.55,cd:.91,brawlers:2,prop:'night',food:true,foodType:2,accent:'#62779a',tint:'night',supply:2},
    {id:'kebab',pl:'9/12 Kebab ostatniej szansy',en:'9/12 Last-Chance Kebab',hintPl:'Kebab zmniejsza koszt kondycji',hintEn:'Kebab makes drinks cheaper',runner:10.8,ai:2.48,cd:.90,brawlers:2,prop:'kebab',food:true,foodType:3,accent:'#b48754',tint:'night',supply:2},
    {id:'patrol',pl:'10/12 Patrol na sygnale',en:'10/12 Patrol on the Radio',hintPl:'Patrol ucisza bójkę tylko na chwilę',hintEn:'Patrol calms things briefly',runner:10.6,ai:2.42,cd:.89,brawlers:2,prop:'patrol',food:true,foodType:3,accent:'#5f86a2',tint:'night',supply:2,patrol:true},
    {id:'closed',pl:'11/12 Monopolowy zamknięty',en:'11/12 Off-licence Closed',hintPl:'Zostaje tylko Nocny Express',hintEn:'Only Night Express remains',runner:9.7,ai:2.35,cd:.88,brawlers:3,prop:'closed',food:true,foodType:3,accent:'#855a58',tint:'late',supply:3,nightRunner:true},
    {id:'finale',pl:'12/12 Finał Wielkiej Płyty',en:'12/12 Concrete Finale',hintPl:'Pełna logistyka, pełny chaos',hintEn:'Full logistics, full chaos',runner:9.2,ai:2.22,cd:.84,brawlers:3,prop:'finale',food:true,foodType:3,accent:'#c39b64',tint:'finale',supply:3,nightRunner:true,finale:true}
  ];
  function active(g){return !!(g&&g.lv&&g.lv.special==='estate');}
  function makeSide(){return {cd:0,action:null,stamina:100,bottles:2,food:0,restT:0,mealT:0,regenBonus:0,costMul:1,notice:'',noticeT:0,combo:0,comboT:0};}
  function init(g){if(!active(g))return;g.trees=[];g.rocks=[];g.gagShown=true;g.gagT=1e9;
    g.estate={time:0,ai:4.4,segment:0,segmentFlash:2.2,brawlT:1.8,p:makeSide(),e:makeSide(),runners:[],bottles:[],glass:[],brawlers:[],delivered:0,hits:0};g.p.gold=g.e.gold=46;
  }
  function side(g,p){return g.estate[p?'p':'e'];}
  function count(g,p){return g.estate.runners.filter(function(r){return r.isP===p;}).length;}
  function segmentOf(g){return segments[Math.max(0,Math.min(segments.length-1,g.estate.segment||0))];}
  function setSegment(g,index,forTest){if(!active(g)||!g.estate)return false;index=Math.max(0,Math.min(segments.length-1,Number(index)||0));g.estate.segment=index;g.estate.time=index*SEGMENT_SECONDS+.05;g.estate.segmentFlash=2.2;g.estate.brawlT=.05;g.estate.brawlers=[];ensureBrawlers(g);
    if(forTest){[true,false].forEach(function(p){var st=side(g,p),c=p?g.p:g.e;st.stamina=100;st.bottles=5;st.food=segments[index].food?2:0;st.cd=0;st.restT=0;st.mealT=0;st.regenBonus=0;st.costMul=1;st.notice='';st.noticeT=0;st.combo=0;st.comboT=0;st.action=null;c.gold=240;});g.estate.runners=[];g.estate.bottles=[];}return true;}
  function syncSegment(g){var e=g.estate,next=Math.min(segments.length-1,Math.floor(e.time/SEGMENT_SECONDS));if(next!==e.segment){e.segment=next;e.segmentFlash=2.2;e.brawlT=.35;e.brawlers=[];}return segmentOf(g);}
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
  function anchor(g,p,fromHand){var c=p?g.p:g.e;return {x:c.x+c.w*(.5+(fromHand?(p?1:-1)*.195:0)),y:g.GY-c.h*(fromHand?179/260:.64)};}
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
  function brawler(ctx,x,y,scale,dir,type,phase){
    var shirts=['#805f50','#4f6d78','#6e6750','#76566f','#55715c'],skin=['#d0a27c','#b88a68','#dda982','#c99672','#bd8f6d'],shirt=shirts[type%shirts.length],face=skin[type%skin.length];
    ctx.save();ctx.translate(x,y);ctx.scale(dir*scale,scale);var hit=Math.sin(phase*2.4),duck=Math.max(0,Math.sin(phase*.72))*2;
    line(ctx,-3,-16,-5-hit*2,-2,'#28343a',5);line(ctx,4,-16,7+hit*2,-2,'#28343a',5);
    ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-8,-34+duck);ctx.lineTo(8,-34+duck);ctx.lineTo(10,-16);ctx.lineTo(-9,-16);ctx.closePath();ctx.fill();
    line(ctx,-6,-30+duck,-12-hit*5,-21,'#c89a76',5);line(ctx,6,-30+duck,13+hit*7,-25,'#c89a76',5);
    ctx.fillStyle=face;ctx.beginPath();ctx.ellipse(0,-41+duck,6.7,7.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=type%2?'#554339':'#343b3b';ctx.beginPath();ctx.ellipse(0,-46+duck,7,3.2,0,Math.PI,Math.PI*2);ctx.fill();
    if(type===2){ctx.fillStyle='#c6a258';ctx.fillRect(-8,-50+duck,16,3);}
    if(type===3){ctx.strokeStyle='#2d3839';ctx.lineWidth=1.2;ctx.strokeRect(-6,-44+duck,5,3);ctx.strokeRect(1,-44+duck,5,3);line(ctx,-1,-42.5,1,-42.5,'#2d3839',1);}
    ctx.restore();
  }
  function estateAtmosphere(ctx,g,seg){var y=g.GY,t=g.estate.time;ctx.save();
    var wash=seg.tint==='night'?'rgba(18,28,55,.24)':seg.tint==='late'?'rgba(34,25,48,.30)':seg.tint==='sunset'?'rgba(186,112,69,.10)':seg.tint==='grey'?'rgba(91,101,96,.10)':seg.tint==='finale'?'rgba(62,35,67,.20)':'rgba(255,235,187,.035)';ctx.fillStyle=wash;ctx.fillRect(0,0,g.W,y);
    // Lit windows make late segments feel alive without new sprites.
    if(seg.tint==='night'||seg.tint==='late'||seg.tint==='finale'){for(var i=0;i<9;i++){var wx=g.W*(.12+i*.095),wy=y*(.20+(i%3)*.08);ctx.globalAlpha=.3+.18*Math.sin(t*.7+i);ctx.fillStyle=i%2?'#e3c37a':'#9db6c8';ctx.fillRect(wx,wy,8,5);}ctx.globalAlpha=1;}
    // Slow foreground litter only in the dirtier middle chapters.
    if(seg.prop==='bins'||seg.prop==='kebab'||seg.prop==='closed'){ctx.fillStyle='rgba(225,218,190,.55)';for(var p=0;p<4;p++){var px=(p*173+t*(8+p*2))%(g.W+40)-20;ctx.fillRect(px,y-10-(p%2)*5,5,2);}}
    ctx.restore();}
  function streetProps(ctx,g,seg){
    var y=g.GY,mid=g.W*.5;ctx.save();
    if(seg.prop==='night'||seg.prop==='patrol'||seg.prop==='closed'||seg.prop==='finale'){ctx.fillStyle='rgba(18,27,47,.18)';ctx.fillRect(0,0,g.W,y);}
    if(seg.prop==='bench'||seg.prop==='queue'){ctx.fillStyle='#6d553b';ctx.fillRect(mid-48,y-19,96,8);ctx.fillRect(mid-43,y-11,5,11);ctx.fillRect(mid+38,y-11,5,11);}
    if(seg.prop==='queue'){ctx.strokeStyle='#e4d6b1';ctx.lineWidth=2;for(var q=-2;q<=2;q++){ctx.beginPath();ctx.moveTo(mid+q*18,y-42);ctx.lineTo(mid+q*18,y-5);ctx.stroke();}}
    if(seg.prop==='rack'){ctx.strokeStyle='#7b8580';ctx.lineWidth=5;ctx.strokeRect(mid-51,y-70,102,65);ctx.strokeStyle='#a75346';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(mid-44,y-55);ctx.lineTo(mid+38,y-20);ctx.stroke();}
    if(seg.prop==='bins'){for(var b=-1;b<=1;b++){ctx.fillStyle=b?'#4f6657':'#526a70';ctx.fillRect(mid+b*39-16,y-39,32,34);ctx.fillStyle='#2f4546';ctx.fillRect(mid+b*39-19,y-43,38,6);}}
    if(seg.prop==='patrol'){var px=(g.estate.time*54)%(g.W+120)-60;ctx.fillStyle='#465e72';ctx.fillRect(px-24,y-28,48,18);ctx.fillStyle='#d8d2b7';ctx.fillRect(px-16,y-34,25,9);ctx.fillStyle='#6fa3c5';ctx.fillRect(px-5,y-38,7,4);ctx.beginPath();ctx.arc(px-14,y-7,7,0,Math.PI*2);ctx.arc(px+15,y-7,7,0,Math.PI*2);ctx.fillStyle='#26343c';ctx.fill();}
    if(seg.prop==='balcony'){ctx.fillStyle='#8c7560';ctx.fillRect(mid-18,y-78,36,4);ctx.strokeStyle='#d8d1bd';ctx.lineWidth=1;for(var l=0;l<3;l++){ctx.beginPath();ctx.moveTo(mid-16+l*14,y-78);ctx.lineTo(mid-10+l*14,y-62);ctx.stroke();}}
    if(seg.prop==='snack'){ctx.fillStyle='#d18c48';ctx.fillRect(mid-48,y-59,96,17);ctx.fillStyle='#f5e2b4';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('ZAPIEKANKI',mid,y-47);ctx.fillStyle='#6b5140';ctx.fillRect(mid-38,y-42,76,37);}
    if(seg.prop==='pizza'){ctx.fillStyle='#a84e3f';ctx.fillRect(mid-44,y-58,88,16);ctx.fillStyle='#f0d68d';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('PIZZA 24',mid,y-47);ctx.fillStyle='#65544a';ctx.fillRect(mid-34,y-42,68,37);}
    if(seg.prop==='kebab'){ctx.fillStyle='#c79a59';ctx.fillRect(mid-42,y-58,84,16);ctx.fillStyle='#fff0ba';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('KEBAB',mid,y-47);ctx.fillStyle='#54493f';ctx.fillRect(mid-33,y-42,66,37);}
    if(seg.prop==='closed'){ctx.fillStyle='#4a4646';ctx.fillRect(mid-43,y-55,86,50);ctx.strokeStyle='#8b7770';ctx.lineWidth=3;for(var sh=0;sh<6;sh++){ctx.beginPath();ctx.moveTo(mid-41,y-49+sh*8);ctx.lineTo(mid+41,y-49+sh*8);ctx.stroke();}}
    if(seg.prop==='finale'){ctx.fillStyle='rgba(255,224,150,.35)';for(var f=0;f<8;f++)ctx.fillRect((f*137+g.estate.time*28)%g.W,20+(f%3)*18,3,3);var van=(g.estate.time*72)%(g.W+160)-80;ctx.fillStyle='#6c5368';ctx.fillRect(van-28,y-30,56,21);ctx.fillStyle='#d7c59b';ctx.fillRect(van-18,y-36,28,8);ctx.fillStyle='#26343c';ctx.beginPath();ctx.arc(van-16,y-7,7,0,Math.PI*2);ctx.arc(van+17,y-7,7,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function drawBrawlers(ctx,g,unitScale){
    g.estate.brawlers.forEach(function(b,i){var center=g.W*(.44+i*.06),phase=(b.t+b.seed*.37)%6.2,clash=phase<3.7?1:0,sep=clash?(22-Math.sin(phase*1.8)*7):29;
      brawler(ctx,center-sep,g.GY,Math.max(.68,unitScale*.9),1,b.type,phase);
      brawler(ctx,center+sep,g.GY,Math.max(.68,unitScale*.9),-1,b.type+1,phase+1.4);
      if(!clash){ctx.save();ctx.fillStyle='#eee1bd';ctx.fillRect(center-7,g.GY-43,14,9);ctx.strokeStyle='#6c5b45';ctx.strokeRect(center-7,g.GY-43,14,9);ctx.restore();}
    });
  }
  function stageBadge(ctx,g,lang){var seg=segmentOf(g),showHint=g.estate.segmentFlash>0,alpha=showHint?1:.78,w=Math.min(320,g.W*.38),x=(g.W-w)/2,y=Math.max(46,Math.min(82,g.GY*.16));
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='rgba(31,41,46,.80)';ctx.fillRect(x,y,w,showHint?37:24);ctx.strokeStyle=seg.accent||'rgba(238,219,176,.55)';ctx.strokeRect(x+.5,y+.5,w-1,(showHint?36:23));
    ctx.fillStyle='#f3dfb5';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(lang==='en'?seg.en:seg.pl,g.W*.5,y+16);
    if(showHint){ctx.font='10px sans-serif';ctx.fillStyle='#cad4cf';ctx.fillText(lang==='en'?seg.hintEn:seg.hintPl,g.W*.5,y+30);}ctx.restore();
  }
  function base(ctx,c,ground){var sx=c.w/200,sy=c.h/260,team=c.isP?'#5084ab':'#b36559',damage=1-c.hp/c.max;
    ctx.save();if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*c.h*.25);}ctx.translate(c.x,ground);ctx.scale(sx,sy);
    var wall=ctx.createLinearGradient(0,0,200,0);wall.addColorStop(0,'#a8aaa0');wall.addColorStop(.6,'#d5d2bd');wall.addColorStop(1,'#aaa997');ctx.fillStyle=wall;ctx.fillRect(4,-260,192,260);
    ctx.fillStyle='#657473';ctx.fillRect(4,-267,192,8);ctx.fillStyle='#e1dbc7';ctx.fillRect(8,-263,184,3);
    for(var row=0;row<7;row++){var yy=-247+row*33;line(ctx,4,yy+29,196,yy+29,'#92998f',1);
      for(var col=0;col<4;col++){var xx=19+col*44;ctx.fillStyle=(row+col)%3===0?'#c5b987':'#526b70';ctx.fillRect(xx,yy,26,21);ctx.fillStyle='#eee6cf';ctx.fillRect(xx-2,yy-2,30,2);ctx.fillRect(xx+11,yy,2,21);ctx.fillRect(xx-2,yy+21,30,3);}
    }
    for(var j=1;j<4;j++)line(ctx,j*49,-260,j*49,0,'rgba(100,112,109,.35)',1);
    // The resident sits inside this recessed balcony; the sill occludes the torso.
    ctx.fillStyle='#263a40';ctx.fillRect(57,-224,86,97);ctx.fillStyle='#81958f';ctx.fillRect(55,-224,4,97);ctx.fillRect(141,-224,4,97);
    ctx.fillStyle=team;ctx.fillRect(5,-41,190,40);ctx.fillStyle='#344b4d';ctx.fillRect(78,-37,44,37);ctx.fillStyle='#b3c9c4';ctx.fillRect(83,-33,15,26);ctx.fillRect(102,-33,15,26);ctx.fillStyle='#ddd4bb';ctx.fillRect(72,-44,56,5);
    ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillStyle='#f6ead2';ctx.fillText(c.isP?'BLOK 1':'BLOK 2',100,-49);
    // Fixed seams and missing plaster grow with real HP, never random per frame.
    for(var k=0;k<Math.floor(damage*12);k++){var hx=15+(k*53)%166,hy=-48-(k*37)%185;
      ctx.fillStyle='#817e70';ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx+19,hy-4);ctx.lineTo(hx+25,hy+10);ctx.lineTo(hx+5,hy+15);ctx.closePath();ctx.fill();line(ctx,hx,hy,hx+7,hy+8,'#4c5652',1.5);line(ctx,hx+7,hy+8,hx+4,hy+16,'#4c5652',1.5);}
    ctx.restore();
  }
  function resident(ctx,g,p,img,drawFace){var c=p?g.p:g.e;if(c.collapseT)return;var st=side(g,p),a=st.action,t=a?a.t:0,dir=p?1:-1;
    ctx.save();ctx.translate(c.x+c.w*.5,g.GY);ctx.scale(c.w/200,c.h/260);
    ctx.beginPath();ctx.rect(-41,-222,82,92);ctx.clip();
    var lean=a&&t<1.05?Math.sin(Math.min(1,t/.7)*Math.PI*.5)*4:0;
    ctx.fillStyle=p?'#608cac':'#b66b5c';ctx.beginPath();ctx.moveTo(-27,-128);ctx.lineTo(-22,-173);ctx.quadraticCurveTo(0,-185,22,-173);ctx.lineTo(29,-128);ctx.closePath();ctx.fill();
    ctx.save();ctx.translate(dir*lean,-190);ctx.rotate(dir*lean*.025);
    if(img)drawFace(ctx,img,-25,-30,50,57,0);
    else{ctx.fillStyle='#d3aa85';ctx.beginPath();ctx.ellipse(0,-4,17,22,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#514238';ctx.beginPath();ctx.ellipse(0,-23,17,7,0,Math.PI,Math.PI*2);ctx.fill();line(ctx,-10,-7,-5,-7,'#26373b',2);line(ctx,5,-7,10,-7,'#26373b',2);ctx.fillStyle='#665044';ctx.fillRect(-9,5,18,4);}
    ctx.restore();
    var handX=dir*26,handY=-149;
    if(a){if(t<.85){var lift=Math.min(1,t/.3);handX=dir*(26-14*lift);handY=-149-41*lift;}
      else if(t<1.05){handX=-dir*30;handY=-190;}
      else{handX=dir*39;handY=-179+(t-1.05)*35;}}
    line(ctx,dir*20,-170,handX,handY,'#d3aa85',8);
    if(a&&!a.released)bottle(ctx,a.item,handX,handY-6,1.05,t<.85?-dir*1.9:dir*.5);
    ctx.restore();ctx.save();ctx.translate(c.x,g.GY);ctx.scale(c.w/200,c.h/260);ctx.fillStyle=p?'#7290a0':'#a07f71';ctx.fillRect(51,-137,98,14);ctx.fillStyle='#e7e1cf';ctx.fillRect(48,-141,104,5);ctx.restore();
  }
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate,seg=segmentOf(g);
    estateAtmosphere(ctx,g,seg);streetProps(ctx,g,seg);resident(ctx,g,true,pFace,drawFace);resident(ctx,g,false,eFace,drawFace);
    ctx.save();ctx.fillStyle='#73807a';ctx.fillRect(g.p.w,g.GY-5,g.W-g.p.w-g.e.w,12);ctx.fillStyle='#b7b8a3';ctx.fillRect(g.p.w,g.GY-6,g.W-g.p.w-g.e.w,2);ctx.restore();
    [true,false].forEach(function(p){var x=g.W*(p?.34:.66),s=Math.max(.7,unitScale*.95);ctx.save();ctx.translate(x,g.GY);ctx.scale(s,s);
      ctx.fillStyle='#d9c9a4';ctx.fillRect(-39,-53,78,53);ctx.fillStyle='#395b58';ctx.fillRect(-34,-34,34,30);ctx.fillStyle='#344a47';ctx.fillRect(6,-34,24,34);ctx.fillStyle='#b57658';ctx.fillRect(-42,-56,84,17);ctx.fillStyle='#fff1ce';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(seg.id==='closed'?(lang==='en'?'CLOSED':'ZAMKNIĘTY'):seg.id==='finale'?(lang==='en'?'NIGHT EXPRESS':'NOCNY EXPRESS'):(lang==='en'?'OFF-LICENCE':'MONOPOLOWY'),0,-44);
      for(var k=0;k<3;k++)bottle(ctx,choices[k],-27+k*10,-15,.55,0);if(seg.food)foodIcon(ctx,22,-16,.65,seg.foodType||0);ctx.restore();});
    e.runners.forEach(function(r){var q=r.t/r.duration,home=r.isP?g.p.x+g.p.w:g.e.x,shop=g.W*(r.isP?.34:.66),progress=q<.43?q/.43:q<.57?1:(1-q)/.43;person(ctx,home+(shop-home)*progress,g.GY,unitScale,r.isP?'#6a91ad':'#b97163',e.time*13+r.seed,q>.57?(r.kind==='food'?'food':true):false);});
    e.bottles.forEach(function(b){var q=Math.min(1,b.t/b.duration),a=anchor(g,b.isP,true),z=anchor(g,!b.isP);bottle(ctx,b.item,a.x+(z.x-a.x)*q,a.y+(z.y-a.y)*q-4*b.arc*q*(1-q),Math.max(.8,unitScale*.85),q*9*(b.isP?1:-1));});
    e.glass.forEach(function(s){var a=anchor(g,s.p);ctx.save();ctx.globalAlpha=1-s.t/.65;ctx.fillStyle=s.col;ctx.fillRect(a.x+s.vx*s.t,a.y+s.vy*s.t+120*s.t*s.t,3,5);ctx.restore();});
    (e.impacts||[]).forEach(function(v){ctx.save();ctx.globalAlpha=1-v.t/.55;ctx.strokeStyle=v.col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(v.x,v.y,6+v.t*34*v.power,0,Math.PI*2);ctx.stroke();ctx.restore();});
    drawBrawlers(ctx,g,unitScale);stageBadge(ctx,g,lang);
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
  root.CASTLE_ERA_ART.drawBase=function(ctx,c,ground,era,l,t){if(era==='modern'&&l===4){base(ctx,c,ground);return;}return oldBase(ctx,c,ground,era,l,t);};
  var oldBackdrop=root.CASTLE_ERA_ART.backdrop;
  root.CASTLE_ERA_ART.backdrop=function(ctx,w,gy,era,l){
    if(era!=='modern'||l!==4)return oldBackdrop(ctx,w,gy,era,l);
    ctx.save();ctx.globalAlpha=.28;
    for(var i=0;i<8;i++){var x=w*(.12+i*.10),bw=w*.075,h=gy*(.14+(i%4)*.028);ctx.fillStyle=i%2?'#667774':'#71807a';ctx.fillRect(x,gy-h,bw,h);
      ctx.fillStyle='#c3c4ac';for(var r=0;r<5;r++)for(var c=0;c<3;c++)ctx.fillRect(x+5+c*bw*.29,gy-h+8+r*h*.17,Math.max(2,bw*.13),h*.065);}
    ctx.fillStyle='rgba(91,105,96,.35)';ctx.fillRect(0,gy-5,w,5);ctx.restore();
  };
  root.CASTLE_ESTATE={active:active,init:init,buy:buy,eat:eat,status:status,tick:tick,draw:draw,buildCards:buildCards,updateCards:updateCards,choices:choices,foods:foods,segments:segments,segmentSeconds:SEGMENT_SECONDS,setSegment:setSegment,chooseDrink:chooseDrink,staminaCost:staminaCost};
})(window);
