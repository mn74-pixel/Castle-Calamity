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
  function buy(g,id,p){var st=side(g,p),s=status(g,id,p);if(!s.ok){notice(st,s.reason);return false;}var item=s.item,seg=segmentOf(g);
    if(id==='food'&&s.action==='eat'){eat(g,p);return true;}
    (p?g.p:g.e).gold-=item.cost;
    if(id==='runner')g.estate.runners.push({isP:p,t:0,duration:seg.runner,seed:g.estate.time,kind:'supply',scooter:!!seg.nightRunner});
    else if(id==='food')g.estate.runners.push({isP:p,t:0,duration:Math.max(5.8,seg.runner*.64),seed:g.estate.time+.3,kind:'food',scooter:!!seg.nightRunner});
    else{var need=staminaCost(g,item,p);if(st.stamina<need&&st.food>0)eat(g,p);st.stamina=Math.max(0,st.stamina-need);st.bottles--;st.cd=item.cd*seg.cd;st.action={item:item,t:0,released:false};st.comboT=Math.max(st.comboT,2.6);}
    return true;
  }
  function eat(g,p){var st=side(g,p);if(st.food<1)return false;st.food--;applyFood(g,p);return true;}
  function anchor(g,p,fromHand){var c=p?g.p:g.e,inner=p?c.x+c.w*.73:c.x+c.w*.27;return {x:inner+(fromHand?(p?7:-7):0),y:g.GY-c.h*(fromHand?.58:.52)};}
  function launch(g,a,p){g.estate.bottles.push({isP:p,item:a.item,t:0,duration:1.7,arc:Math.min(g.H*.18,100)});}
  function finishRunner(g,r,reward){var st=side(g,r.isP),c=r.isP?g.p:g.e,seg=segmentOf(g);if(r.kind==='food'){st.food=Math.min(2,st.food+1);notice(st,'food');if(!r.isP&&st.stamina<38)eat(g,false);return;}
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
    ctx.fillStyle='#bd8565';ctx.beginPath();ctx.moveTo(5,-51);ctx.lineTo(10,-48.5);ctx.lineTo(5,-47.5);ctx.closePath();ctx.fill();
    ctx.fillStyle='#293236';ctx.beginPath();ctx.arc(3,-51,1.1,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#443a35';ctx.beginPath();ctx.moveTo(-7,-52);ctx.quadraticCurveTo(-4,-61,4,-59);ctx.quadraticCurveTo(9,-57,7,-51);ctx.quadraticCurveTo(1,-56,-7,-52);ctx.fill();
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
    else{var skin=ctx.createRadialGradient(-2,-52+duck,1,0,-52+duck,9);skin.addColorStop(0,'#efc3a0');skin.addColorStop(1,'#b97f61');ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-52+duck,7.4,8.3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=style===3?'#343649':'#443a34';ctx.beginPath();ctx.moveTo(-7,-54+duck);ctx.quadraticCurveTo(-4,-62+duck,4,-61+duck);ctx.quadraticCurveTo(9,-58+duck,7,-52+duck);ctx.fill();}
    if(style===3){ctx.strokeStyle='#1f282c';ctx.lineWidth=1;ctx.strokeRect(-6,-55+duck,5,3);ctx.strokeRect(1,-55+duck,5,3);line(ctx,-1,-53.5+duck,1,-53.5+duck,'#1f282c',1);}
    ctx.restore();
  }
  function drawBrawlers(ctx,g,unitScale,drawFace){
    g.estate.brawlers.forEach(function(b,i){var center=g.W*(.42+i*.08),phase=(b.t+b.seed*.37)%6.2,clash=phase<3.7?1:0,sep=clash?(22-Math.sin(phase*1.8)*7):29;
      var aSlot=i%2,zSlot=(i+1)%2;
      brawler(ctx,center-sep,g.GY,unitScale,1,b.type,phase,menelFace(aSlot),drawFace,menelStyle(aSlot,b.type%4));
      brawler(ctx,center+sep,g.GY,unitScale,-1,b.type+1,phase+1.4,menelFace(zSlot),drawFace,menelStyle(zSlot,(b.type+1)%4));
      if(!clash){ctx.save();ctx.fillStyle='#eee1bd';ctx.fillRect(center-8,g.GY-45,16,10);ctx.strokeStyle='#6c5b45';ctx.strokeRect(center-8,g.GY-45,16,10);
        var an=menelName(aSlot),zn=menelName(zSlot);ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#f0dfb8';if(an)ctx.fillText(an,center-sep,g.GY-58);if(zn)ctx.fillText(zn,center+sep,g.GY-58);ctx.restore();}
    });
  }
  function sky(ctx,w,gy,top,bottom){var gr=ctx.createLinearGradient(0,0,0,gy);gr.addColorStop(0,top);gr.addColorStop(1,bottom);ctx.fillStyle=gr;ctx.fillRect(0,0,w,gy);}
  function distantBlock(ctx,x,gy,w,h,lit){ctx.fillStyle=lit?'#58646c':'#778078';ctx.fillRect(x,gy-h,w,h);ctx.fillStyle=lit?'#d6bd78':'#b9baa7';for(var r=0;r<5;r++)for(var q=0;q<3;q++)ctx.fillRect(x+6+q*(w-12)/3,gy-h+10+r*(h-18)/5,Math.max(3,w*.12),Math.max(3,h*.055));}
  function lamp(ctx,x,y,on){ctx.strokeStyle='#4c5353';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-90);ctx.lineTo(x+18,y-90);ctx.stroke();ctx.fillStyle=on?'#f1d58b':'#9aa1a0';ctx.beginPath();ctx.ellipse(x+22,y-89,9,5,0,0,Math.PI*2);ctx.fill();}
  function car(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);contactShadow(ctx,0,1,31,.28);var body=ctx.createLinearGradient(-28,-26,28,-5);body.addColorStop(0,shade(col,1.16));body.addColorStop(.55,col);body.addColorStop(1,shade(col,.62));ctx.fillStyle=body;ctx.strokeStyle='#242b2e';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-29,-16);ctx.lineTo(-20,-17);ctx.lineTo(-9,-29);ctx.lineTo(15,-29);ctx.lineTo(26,-18);ctx.lineTo(30,-15);ctx.lineTo(27,-5);ctx.lineTo(-27,-5);ctx.closePath();ctx.fill();ctx.stroke();glassPanel(ctx,-7,-27,20,9,true);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(-25,-14,44,2);wheel(ctx,-18,-5,7);wheel(ctx,19,-5,7);ctx.restore();}
  function kiosk(ctx,x,y,w,h,sign,body,accent){contactShadow(ctx,x,y,w*.52,.34);ctx.save();ctx.fillStyle='rgba(0,0,0,.25)';rounded(ctx,x-w/2+8,y-h+9,w,h,4,'rgba(0,0,0,.25)');ctx.restore();materialRect(ctx,x-w/2,y-h,w,h,shade(body,1.18),body,shade(body,.55));awning(ctx,x-w/2-4,y-h-19,w+8,20,accent,shade(accent,1.35));ctx.fillStyle='#fff0c4';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(sign,x,y-h-5);glassPanel(ctx,x-w*.34,y-h*.68,w*.68,h*.42,false);ctx.fillStyle='#c99d61';ctx.fillRect(x-w*.36,y-h*.27,w*.72,5);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x-w*.31,y-h*.64,w*.18,h*.34);}
  function citySilhouette(ctx,w,gy,y,amp,col,alpha,seed,night){
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-20,gy);
    var step=Math.max(54,w/11),x=-step;
    while(x<w+step){var idx=Math.floor((x+step)/step),h=amp*(.58+((idx*7+seed*3)%5)*.11),bw=step*(.72+((idx+seed)%3)*.08);ctx.lineTo(x,y);ctx.lineTo(x,y-h);if((idx+seed)%4===0){ctx.lineTo(x+bw*.5,y-h-10);ctx.lineTo(x+bw,y-h);}else{ctx.lineTo(x+bw,y-h);}ctx.lineTo(x+bw,y);x+=step;}
    ctx.lineTo(w+20,gy);ctx.closePath();ctx.fill();
    if(alpha>.42){ctx.globalAlpha=alpha*.55;ctx.fillStyle=night?'#e0c477':'#b8c7bb';for(var i=0;i<9;i++){var wx=w*(.04+i*.115),wy=y-amp*(.22+((i+seed)%3)*.12);ctx.fillRect(wx,wy,5,4);}}
    ctx.restore();
  }
  function paintArenaBackdrop(ctx,w,gy,seg){
    var night=seg.tint==='night'||seg.tint==='late'||seg.tint==='finale',sunset=seg.tint==='sunset',finale=seg.tint==='finale';
    var sky=ctx.createLinearGradient(0,0,0,gy);
    if(night){sky.addColorStop(0,finale?'#171523':'#18293a');sky.addColorStop(.58,finale?'#4e3b55':'#526a79');sky.addColorStop(1,'#8a8274');}
    else if(sunset){sky.addColorStop(0,'#66607a');sky.addColorStop(.48,'#b87570');sky.addColorStop(1,'#e6c18d');}
    else{sky.addColorStop(0,'#76a6b8');sky.addColorStop(.57,'#b8ccca');sky.addColorStop(1,'#e3d3aa');}
    ctx.fillStyle=sky;ctx.fillRect(0,0,w,gy);

    // Large, soft clouds: same calm read as the first era, no office-grid wallpaper.
    ctx.save();ctx.globalAlpha=night?.06:.18;ctx.fillStyle=night?'#d1dce1':'#f2f0df';
    for(var cl=0;cl<4;cl++){var cx=w*(.13+cl*.25),cy=gy*(.12+(cl%2)*.08),rw=w*(.08+(cl%2)*.018);ctx.beginPath();ctx.ellipse(cx,cy,rw,gy*.026,0,0,Math.PI*2);ctx.ellipse(cx+rw*.45,cy+2,rw*.58,gy*.021,0,0,Math.PI*2);ctx.fill();}
    ctx.restore();

    // Urban equivalent of medieval hills: three continuous silhouettes.
    citySilhouette(ctx,w,gy,gy*.70,gy*.13,night?'#60717a':'#98a99f',.24,1,night);
    citySilhouette(ctx,w,gy,gy*.76,gy*.18,night?'#485c68':'#748c80',.34,3,night);
    citySilhouette(ctx,w,gy,gy*.82,gy*.23,night?'#334b58':'#526f63',.50,5,night);

    // Tree line / lamps provide human scale without filling the screen with rectangles.
    ctx.save();ctx.globalAlpha=night?.55:.42;
    for(var t=0;t<5;t++){var tx=w*(.15+t*.18),ty=gy*.83;drawTreeUrban(ctx,tx,ty,.60+(t%2)*.08,night);}
    ctx.restore();
    if(night){lamp(ctx,w*.24,gy*.84,true);lamp(ctx,w*.76,gy*.84,true);}
    ctx.save();ctx.globalAlpha=.16;ctx.fillStyle=night?'#0f1b22':'#d9cda8';ctx.fillRect(0,gy*.82,w,gy*.18);ctx.restore();
  }
  function drawArenaBackdrop(ctx,w,gy,seg){var key=seg.arena+':'+Math.round(w/40)+':'+Math.round(gy/30),sprite=ART_CACHE.get(key);if(!sprite){var sc=document.createElement('canvas'),dpr=2;sc.width=Math.max(1,Math.round(w*dpr));sc.height=Math.max(1,Math.round(gy*dpr));var sctx=sc.getContext('2d');sctx.scale(dpr,dpr);paintArenaBackdrop(sctx,w,gy,seg);sprite=sc;ART_CACHE.set(key,sprite);if(ART_CACHE.size>18)ART_CACHE.delete(ART_CACHE.keys().next().value);}ctx.drawImage(sprite,0,0,w,gy);}
  function graffiti(ctx,x,y,text,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.globalAlpha=.62;ctx.fillStyle=col||'#734e63';ctx.font='bold 10px sans-serif';ctx.fillText(text,0,0);ctx.restore();}
  function puddle(ctx,x,y,w){ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#b8d1d2';ctx.beginPath();ctx.ellipse(x,y,w,3.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.22;ctx.fillStyle='#f5df9e';ctx.fillRect(x-w*.35,y-1,w*.3,1);ctx.restore();}
  function trash(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#d8d0b7';ctx.rotate(-.18);ctx.fillRect(-5,-2,10,4);ctx.restore();}
  function bollard(ctx,x,y){ctx.fillStyle='#575c5b';ctx.fillRect(x-3,y-19,6,19);ctx.fillStyle='#d7c55d';ctx.fillRect(x-3,y-15,6,4);}
  function neonGlow(ctx,x,y,w,h,col){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=col;for(var n=4;n>0;n--)ctx.fillRect(x-n*2,y-n*2,w+n*4,h+n*4);ctx.restore();}
  function drawArenaScene(ctx,g,seg){
    var y=g.GY,mid=g.W*.5,t=g.estate.time,night=seg.tint==='night'||seg.tint==='late'||seg.tint==='finale';ctx.save();
    // Clear playing strip, like the ground plane in the first era.
    var ground=ctx.createLinearGradient(0,y-112,0,y+4);ground.addColorStop(0,night?'#586066':'#827f72');ground.addColorStop(1,night?'#353c40':'#5d6257');ctx.fillStyle=ground;ctx.fillRect(0,y-112,g.W,116);
    ctx.fillStyle=night?'#2f3b34':'#607455';ctx.fillRect(0,y,g.W,14);ctx.fillStyle='rgba(245,232,194,.20)';ctx.fillRect(0,y-3,g.W,2);
    // Perspective paving is restrained and always points at the focal object.
    ctx.strokeStyle=night?'rgba(220,226,217,.08)':'rgba(232,224,198,.13)';ctx.lineWidth=1;
    for(var pv=0;pv<6;pv++){ctx.beginPath();ctx.moveTo(mid,y-104);ctx.lineTo(pv*g.W/5,y);ctx.stroke();}
    for(var row=1;row<4;row++){var yy=y-104+row*26;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(g.W,yy);ctx.stroke();}

    // One central landmark per stage. This is the visual "castle" of the segment.
    if(seg.arena==='balcony_canyon'){
      ctx.fillStyle='#6a513e';ctx.fillRect(mid-78,y-23,156,9);ctx.fillRect(mid-68,y-14,7,14);ctx.fillRect(mid+61,y-14,7,14);
      ctx.strokeStyle='#a8a69a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(mid,y-25);ctx.lineTo(mid,y-78);ctx.stroke();
      ctx.fillStyle='#d8cfb0';ctx.fillRect(mid-26,y-74,52,4);
    }else if(seg.arena==='shopfront'){
      kiosk(ctx,mid,y,210,96,'MONOPOLOWY','#63594b','#a64f3f');
      for(var q=0;q<5;q++)person(ctx,mid-78+q*38,y,.72,'#68746d',q+t,false,q<2?1:-1);
    }else if(seg.arena==='bench_square'){
      drawTreeUrban(ctx,mid-118,y,.78,false);drawTreeUrban(ctx,mid+118,y,.70,false);
      ctx.fillStyle='#674d3b';ctx.fillRect(mid-92,y-25,184,10);ctx.fillRect(mid-83,y-15,7,15);ctx.fillRect(mid+76,y-15,7,15);
      ctx.fillStyle='#857b65';ctx.fillRect(mid-13,y-73,26,48);ctx.strokeStyle='#d9d0ac';ctx.lineWidth=2;ctx.strokeRect(mid-35,y-105,70,36);
    }else if(seg.arena==='snack_kiosk'){
      kiosk(ctx,mid,y,215,100,'ZAPIEKANKI','#6f503a','#d58d44');neonGlow(ctx,mid-108,y-119,216,19,'#d58d44');
    }else if(seg.arena==='rack_yard'){
      ctx.strokeStyle='#757f7a';ctx.lineWidth=7;ctx.strokeRect(mid-88,y-110,176,105);ctx.fillStyle='#974b47';ctx.fillRect(mid-70,y-94,140,74);
      ctx.strokeStyle='#dec176';ctx.lineWidth=3;for(var r=0;r<6;r++){ctx.beginPath();ctx.moveTo(mid-65,y-87+r*12);ctx.lineTo(mid+65,y-73+r*12);ctx.stroke();}
    }else if(seg.arena==='bin_alley'){
      for(var bi=-2;bi<=2;bi++){ctx.fillStyle=bi%2?'#53675c':'#475f64';ctx.fillRect(mid+bi*48-19,y-54,38,49);ctx.fillStyle='#31443f';ctx.fillRect(mid+bi*48-23,y-59,46,7);}
      ctx.fillStyle='#755e4b';ctx.fillRect(mid+113,y-32,58,27);
    }else if(seg.arena==='pizza_pavilion'){
      kiosk(ctx,mid,y,220,98,'PIZZA 24','#5e4944','#bb4e40');neonGlow(ctx,mid-110,y-117,220,18,'#c95343');
    }else if(seg.arena==='night_gate'){
      ctx.fillStyle='#313a44';ctx.fillRect(mid-135,y-158,270,158);ctx.fillStyle='#151b22';ctx.beginPath();ctx.arc(mid,y-8,82,Math.PI,0);ctx.lineTo(mid+82,y);ctx.lineTo(mid-82,y);ctx.closePath();ctx.fill();lamp(ctx,mid-115,y-2,true);lamp(ctx,mid+105,y-2,true);puddle(ctx,mid-86,y-8,38);puddle(ctx,mid+102,y-6,30);
    }else if(seg.arena==='kebab_corner'){
      kiosk(ctx,mid,y,205,102,'KEBAB 24','#50443b','#c79a58');neonGlow(ctx,mid-103,y-121,206,18,'#d4a35b');
      ctx.fillStyle='#cba35f';ctx.fillRect(mid-7,y-82,14,57);ctx.fillStyle='#874b37';for(var k=0;k<5;k++)ctx.fillRect(mid-5,y-76+k*10,10,7);
    }else if(seg.arena==='parking_patrol'){
      for(var cc=-1;cc<=1;cc++)car(ctx,mid+cc*120,y-8,.62,cc?'#6f655d':'#4e6575');
      var px=(t*72)%(g.W+150)-75;car(ctx,px,y-8,.73,'#456b8a');ctx.fillStyle='#7fc0df';ctx.fillRect(px-5,y-44,11,5);
    }else if(seg.arena==='closed_arcade'){
      materialRect(ctx,mid-125,y-104,250,99,'#5e5755','#423f40','#312f31');metalShutter(ctx,mid-105,y-86,210,78);
      ctx.fillStyle='#eadab5';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',mid,y-47);graffiti(ctx,mid-88,y-91,'TU BYŁEM','#8a596a',-.06);
    }else{
      var van=(t*58)%(g.W+230)-115;ctx.fillStyle='#6b4c70';ctx.fillRect(van-50,y-49,100,40);ctx.fillStyle='#d8c28d';ctx.fillRect(van-33,y-63,50,15);ctx.fillStyle='#f4e0ad';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('NOCNY EXPRESS',van,y-52);wheel(ctx,van-28,y-8,9);wheel(ctx,van+29,y-8,9);
      for(var fl=0;fl<12;fl++){ctx.fillStyle=fl%2?'#efc56f':'#cf6b68';ctx.beginPath();ctx.arc(g.W*.22+fl*g.W*.05,y-132-(fl%2)*4,2.5,0,Math.PI*2);ctx.fill();}
    }
    ctx.restore();
  }
  function stageBadge(ctx,g,lang){
    if(g.estate.segmentFlash<=.75)return;var seg=segmentOf(g),life=Math.min(1,(g.estate.segmentFlash-.75)/.85),w=Math.min(300,g.W*.34),x=(g.W-w)/2,y=Math.max(108,Math.min(150,g.GY*.25));
    ctx.save();ctx.globalAlpha=life;rounded(ctx,x,y,w,34,5,'rgba(23,31,34,.84)',seg.accent||'#d8c49c');ctx.fillStyle='#f2dfb6';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(lang==='en'?seg.en:seg.pl,g.W*.5,y+14);ctx.font='9px sans-serif';ctx.fillStyle='#cad3cb';ctx.fillText(lang==='en'?seg.hintEn:seg.hintPl,g.W*.5,y+27);ctx.restore();
  }
  function damageScratches(ctx,c,x,y,w,h){var d=Math.max(0,1-c.hp/c.max),n=Math.floor(d*8);ctx.strokeStyle='rgba(43,51,51,.72)';ctx.lineWidth=1.4;for(var i=0;i<n;i++){var px=x+8+(i*31)%Math.max(12,w-20),py=y+10+(i*19)%Math.max(12,h-18);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+7,py+7);ctx.lineTo(px+3,py+14);ctx.stroke();}}
  function estateTower(ctx,c,ground){
    var p=c.isP,team=p?'#4d82a8':'#aa6259',stone=p?'#aeb6ad':'#b7aaa0',dark=p?'#53666a':'#6c5a56',x=c.x,w=c.w,sx=w/200,sy=c.h/260,damage=Math.max(0,1-c.hp/c.max);
    ctx.save();if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*c.h*.24);}ctx.translate(x,ground);ctx.scale(sx,sy);
    contactShadow(ctx,100,2,96,.30);
    // Broad lower podium.
    materialRect(ctx,8,-92,184,92,shade(stone,1.05),stone,shade(dark,.72));ctx.fillStyle=team;ctx.fillRect(8,-92,184,13);ctx.fillStyle='rgba(255,255,255,.20)';ctx.fillRect(12,-88,176,2);
    // Two towers and central recessed balcony create a castle-like silhouette.
    panelWall(ctx,12,-242,54,150,stone,6,2,false);panelWall(ctx,134,-242,54,150,stone,6,2,false);
    materialRect(ctx,66,-206,68,114,shade(stone,1.03),stone,shade(dark,.72));
    ctx.fillStyle=dark;ctx.fillRect(72,-190,56,72);ctx.fillStyle='#283b40';ctx.fillRect(77,-184,46,58);
    ctx.fillStyle='#87958d';ctx.fillRect(73,-126,54,5);ctx.fillStyle='#e3d8bc';ctx.fillRect(70,-131,60,5);
    // Strong roof line / team band.
    ctx.fillStyle=team;ctx.fillRect(9,-250,182,12);ctx.fillStyle=shade(team,.62);ctx.fillRect(9,-238,182,4);
    for(var cap=0;cap<5;cap++){ctx.fillStyle=stone;ctx.fillRect(14+cap*42,-259,24,10);ctx.strokeStyle=shade(dark,.68);ctx.strokeRect(14+cap*42+.5,-258.5,23,9);}
    // Ground entrance.
    ctx.fillStyle='#2a3d40';ctx.fillRect(78,-67,44,67);ctx.fillStyle='#b6c4bd';ctx.fillRect(84,-59,13,46);ctx.fillRect(103,-59,13,46);ctx.fillStyle='#dfd0aa';ctx.fillRect(72,-74,56,6);
    // Few large windows, not a repeated office grid.
    for(var side=0;side<2;side++){var bx=side?145:24;for(var row=0;row<3;row++){glassPanel(ctx,bx,-224+row*42,30,22,false);}}
    ctx.fillStyle='#efe0b7';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(p?'BLOK A':'BLOK B',100,-80);
    // Damage is deterministic and sparse.
    ctx.strokeStyle='#424c49';ctx.lineWidth=1.5;for(var d=0;d<Math.floor(damage*9);d++){var dx=25+(d*47)%145,dy=-82-(d*31)%142;ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+7,dy+8);ctx.lineTo(dx+3,dy+16);ctx.stroke();}
    ctx.restore();
  }
  function arenaBase(ctx,c,ground){estateTower(ctx,c,ground);}
  function resident(ctx,g,p,img,drawFace,unitScale){
    var c=p?g.p:g.e;if(c.collapseT)return;var st=side(g,p),a=st.action,t=a?a.t:0,dir=p?1:-1,baseX=c.x+c.w*.5,baseY=g.GY-c.h*.49,sx=c.w/200,sy=c.h/260;
    var sway=Math.sin(g.estate.time*2.1+(p?0:1))*1.2;
    ctx.save();ctx.translate(baseX+sway,g.GY);ctx.scale(sx,sy);ctx.beginPath();ctx.rect(-25,-202,50,84);ctx.clip();
    // Torso sits behind the balcony rail, like a defender in the medieval castle.
    var body=p?'#527f9e':'#a15f58';ctx.fillStyle=body;ctx.strokeStyle='#26343a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-18,-125);ctx.lineTo(-15,-166);ctx.quadraticCurveTo(0,-178,15,-166);ctx.lineTo(18,-125);ctx.closePath();ctx.fill();ctx.stroke();
    var hx=dir*20,hy=-146;if(a){if(t<.68){var lift=Math.min(1,t/.68);hx=dir*(20-9*lift);hy=-146-34*lift;}else if(t<1.05){hx=-dir*25;hy=-182;}else{hx=dir*34;hy=-169+(t-1.05)*28;}}
    line(ctx,dir*13,-159,hx,hy,'#d3aa85',6);
    ctx.save();ctx.translate(0,-185);if(img)drawFace(ctx,img,-17,-20,34,39,0);else{ctx.fillStyle='#d5aa85';ctx.beginPath();ctx.ellipse(0,0,11,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#49403a';ctx.beginPath();ctx.ellipse(0,-9,11,4,0,Math.PI,Math.PI*2);ctx.fill();}ctx.restore();
    if(a&&!a.released)bottle(ctx,a.item,hx,hy-5,.82,t<.75?-dir*1.5:dir*.45);
    ctx.restore();
    // Re-draw balcony rail above the body for correct depth.
    ctx.save();ctx.translate(c.x,g.GY);ctx.scale(sx,sy);ctx.fillStyle='#7e8d87';ctx.fillRect(72,-131,56,8);ctx.fillStyle='#e1d7bc';ctx.fillRect(69,-135,62,4);ctx.restore();
  }
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate,seg=segmentOf(g);
    drawArenaScene(ctx,g,seg);resident(ctx,g,true,pFace,drawFace,unitScale);resident(ctx,g,false,eFace,drawFace,unitScale);
    e.runners.forEach(function(r){var q=r.t/r.duration,home=r.isP?anchor(g,true,false).x:anchor(g,false,false).x,shop=g.W*(r.isP?.35:.65),progress=q<.43?q/.43:q<.57?1:(1-q)/.43,outbound=q<.57,dir=outbound?(r.isP?1:-1):(r.isP?-1:1);
      person(ctx,home+(shop-home)*progress,g.GY,unitScale*.92,r.isP?'#6a91ad':'#b97163',e.time*13+r.seed,q>.57?(r.kind==='food'?'food':true):false,dir);});
    e.bottles.forEach(function(b){var q=Math.min(1,b.t/b.duration),a=anchor(g,b.isP,true),z=anchor(g,!b.isP);bottle(ctx,b.item,a.x+(z.x-a.x)*q,a.y+(z.y-a.y)*q-4*b.arc*q*(1-q),Math.max(.8,unitScale*.85),q*9*(b.isP?1:-1));});
    e.glass.forEach(function(s){var a=anchor(g,s.p);ctx.save();ctx.globalAlpha=1-s.t/.65;ctx.fillStyle=s.col;ctx.fillRect(a.x+s.vx*s.t,a.y+s.vy*s.t+120*s.t*s.t,3,5);ctx.restore();});
    (e.impacts||[]).forEach(function(v){ctx.save();ctx.globalAlpha=1-v.t/.55;ctx.strokeStyle=v.col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(v.x,v.y,6+v.t*34*v.power,0,Math.PI*2);ctx.stroke();ctx.restore();});
    drawBrawlers(ctx,g,unitScale,drawFace);stageBadge(ctx,g,lang);
    var ps=side(g,true),barW=Math.min(145,g.W*.19),bx=g.W<720?10:Math.max(12,g.p.x+g.p.w+12),by=Math.max(52,g.GY-66),stam=ps.stamina;ctx.save();rounded(ctx,bx,by,barW,39,5,'rgba(24,32,35,.88)',seg.accent||'rgba(238,219,176,.45)');
    ctx.fillStyle='#e7d9b5';ctx.font='bold 9px sans-serif';ctx.textAlign='left';ctx.fillText((lang==='en'?'STAMINA ':'KONDYCJA ')+Math.round(stam)+'%',bx+6,by+11);ctx.fillStyle='#46534e';ctx.fillRect(bx+6,by+15,barW-12,6);ctx.fillStyle=stam<22?'#bd665b':stam<48?'#c7aa5e':'#91b56b';ctx.fillRect(bx+6,by+15,(barW-12)*stam/100,6);
    ctx.fillStyle='#ead7ad';ctx.fillText('🍾 '+ps.bottles+'    🍴 '+ps.food+(ps.combo>1?'    ×'+ps.combo:''),bx+6,by+34);if(ps.noticeT>0&&ps.notice){ctx.textAlign='left';ctx.fillStyle='#fff0b8';ctx.font='bold 9px sans-serif';ctx.fillText(noticeText(ps.notice,lang),bx,by-7);}ctx.restore();
  }
  function buildCards(doc,g,lang,onBuy){var row=doc.getElementById('cds');row.innerHTML='';choices.forEach(function(item,i){var card=doc.createElement('button');card.type='button';card.className='cd';card.id='estate_'+item.id;card.dataset.hotkey=String(i+1);
    var title=lang==='en'?item.en:item.pl;card.setAttribute('aria-label',title);card.title=title+(item.damage?' · '+item.damage+' HP':item.id==='food'?' · stamina':' · supply');
    var kbd=doc.createElement('div');kbd.className='cdk';kbd.textContent=String(i+1);card.appendChild(kbd);
    var wrap=doc.createElement('div');wrap.className='iconWrap';var canvas=doc.createElement('canvas');canvas.width=56;canvas.height=56;canvas.id='estate_icon_'+item.id;var ctx=canvas.getContext('2d');if(item.id==='runner')person(ctx,24,54,1,'#6a91ad',0,true);else if(item.id==='food')foodIcon(ctx,28,29,1.5,segmentOf(g).foodType||0);else bottle(ctx,item,28,29,1.6,-.15);wrap.appendChild(canvas);
    var overlay=doc.createElement('div');overlay.className='cdState';overlay.id='estate_state_'+item.id;wrap.appendChild(overlay);card.appendChild(wrap);
    var name=doc.createElement('div');name.className='estateName';name.id='estate_name_'+item.id;name.textContent=title;card.appendChild(name);var cost=doc.createElement('div');cost.className='cdc';cost.id='estate_cost_'+item.id;cost.textContent=item.cost;card.appendChild(cost);card.addEventListener('click',function(){onBuy(item.id);});row.appendChild(card);
  });updateCards(doc,g,lang,false);}
  function updateCards(doc,g,lang,paused){choices.forEach(function(item){var el=doc.getElementById('estate_'+item.id);if(!el)return;var s=status(g,item.id,true),off=paused||!s.ok;el.disabled=off;el.setAttribute('aria-disabled',String(off));el.classList.toggle('unitUnavailable',off);
    var label=s.reason==='limit'?'2/2':s.reason==='wait'?Math.ceil(side(g,true).cd)+' s':s.reason==='gold'?(lang==='en'?'FUNDS':'ŚRODKI'):s.reason==='bottles'?'🍾 0':s.reason==='hungry'?'🍴':s.reason==='locked'?(lang==='en'?'LATER':'OD 4/12'):s.reason==='full'?'2/2':s.reason==='rest'?(lang==='en'?'REST':'PRZERWA'):'';
    var badge=doc.getElementById('estate_state_'+item.id);if(badge){badge.textContent=label;badge.style.display=off?'flex':'none';}
    if(item.id==='food'){var cv=doc.getElementById('estate_icon_food'),cc=doc.getElementById('estate_cost_food'),nn=doc.getElementById('estate_name_food'),st=side(g,true),food=foodFor(g);if(cv){var cx=cv.getContext('2d');cx.clearRect(0,0,56,56);foodIcon(cx,28,29,1.5,segmentOf(g).foodType||0);}if(cc)cc.textContent=st.food>0?(lang==='en'?'EAT':'ZJEDZ'):item.cost;if(nn)nn.textContent=st.food>0?(lang==='en'?'Eat '+food.en:'Zjedz: '+food.pl):(lang==='en'?item.en:item.pl);}
  });}
  var oldBase=root.CASTLE_ERA_ART.drawBase;
  root.CASTLE_ERA_ART.drawBase=function(ctx,c,ground,era,l,t){if(era==='modern'&&l===4){arenaBase(ctx,c,ground);return;}return oldBase(ctx,c,ground,era,l,t);};
  var oldBackdrop=root.CASTLE_ERA_ART.backdrop;
  root.CASTLE_ERA_ART.backdrop=function(ctx,w,gy,era,l){if(era!=='modern'||l!==4)return oldBackdrop(ctx,w,gy,era,l);drawArenaBackdrop(ctx,w,gy,segments[visualSegment]||segments[0]);};
  root.CASTLE_ESTATE={active:active,init:init,buy:buy,eat:eat,status:status,tick:tick,draw:draw,buildCards:buildCards,updateCards:updateCards,choices:choices,foods:foods,segments:segments,segmentSeconds:SEGMENT_SECONDS,setSegment:setSegment,chooseDrink:chooseDrink,staminaCost:staminaCost,currentVisual:function(){return visualSegment;},arenaKinds:segments.map(function(s){return s.arena;}),artCache:function(){return ART_CACHE.size;}};
})(window);
