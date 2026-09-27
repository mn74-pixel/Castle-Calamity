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
  function anchor(g,p,fromHand){var c=p?g.p:g.e,seg=segmentOf(g);
    if(seg.arena==='balcony_canyon')return {x:c.x+c.w*(.5+(fromHand?(p?1:-1)*.195:0)),y:g.GY-c.h*(fromHand?179/260:.64)};
    var fx=p?c.x+c.w*.77:c.x+c.w*.23;return {x:fx+(fromHand?(p?8:-8):0),y:g.GY-(fromHand?63:55)};}
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
  function paintArenaBackdrop(ctx,w,gy,seg){
    var night=seg.tint==='night'||seg.tint==='late'||seg.tint==='finale',sunset=seg.tint==='sunset';
    var skyG=ctx.createLinearGradient(0,0,0,gy);if(night){skyG.addColorStop(0,seg.tint==='finale'?'#20162f':'#17273a');skyG.addColorStop(.58,seg.tint==='finale'?'#4a344c':'#41566a');skyG.addColorStop(1,'#77706b');}else if(sunset){skyG.addColorStop(0,'#6d6680');skyG.addColorStop(.42,'#b66d68');skyG.addColorStop(1,'#e4b37c');}else{skyG.addColorStop(0,'#6d99ad');skyG.addColorStop(.55,'#9fb7b4');skyG.addColorStop(1,'#d1c5a4');}ctx.fillStyle=skyG;ctx.fillRect(0,0,w,gy);
    // soft city haze
    var hz=ctx.createLinearGradient(0,gy*.30,0,gy);hz.addColorStop(0,'rgba(225,227,214,0)');hz.addColorStop(1,night?'rgba(24,32,42,.28)':'rgba(217,205,174,.28)');ctx.fillStyle=hz;ctx.fillRect(0,gy*.25,w,gy*.75);
    // three urban depth layers
    var layers=seg.arena==='night_gate'?[.12,.42,.66]:[.07,.39,.72];for(var li=0;li<3;li++){ctx.globalAlpha=.22+li*.13;var baseY=gy*(.77+li*.055),bh=gy*(.18+li*.045);for(var i=0;i<5;i++){var bw=w*(.10+(i%3)*.025),x=(i*.245+layers[li])%1*w-bw*.5,h=bh*(.74+((i+li)%3)*.13);panelWall(ctx,x,baseY-h,bw,h,night?['#59656d','#4a5964','#414c54'][li]:['#8b9185','#737f75','#657168'][li],5,3,night);}}ctx.globalAlpha=1;
    // arena-specific silhouette composition
    if(seg.arena==='balcony_canyon'){panelWall(ctx,-w*.02,gy*.18,w*.27,gy*.60,'#858c82',8,4,night);panelWall(ctx,w*.75,gy*.14,w*.27,gy*.64,'#8b8580',8,4,night);}
    else if(seg.arena==='shopfront'){materialRect(ctx,0,gy*.58,w*.70,gy*.20,'#8f866e','#675f50','#514b42');for(var sh=0;sh<4;sh++){glassPanel(ctx,w*.06+sh*w*.14,gy*.63,w*.10,gy*.09,night);}}
    else if(seg.arena==='rack_yard'){for(var g=0;g<6;g++){materialRect(ctx,g*w/6,gy*.59,w/6-3,gy*.21,'#847f77','#66625c','#4e4b47');metalShutter(ctx,g*w/6+7,gy*.65,w/6-17,gy*.12);}}
    else if(seg.arena==='bin_alley'){materialRect(ctx,0,gy*.61,w,gy*.18,'#777d77','#5e655f','#4b514d');}
    else if(seg.arena==='closed_arcade'){materialRect(ctx,0,gy*.56,w,gy*.24,'#635c59','#494445','#363235');for(var s=0;s<5;s++)metalShutter(ctx,s*w/5+7,gy*.63,w/5-14,gy*.14);}
    if(night){ctx.fillStyle='rgba(246,224,157,.78)';ctx.beginPath();ctx.arc(w*.78,gy*.14,seg.tint==='finale'?13:9,0,Math.PI*2);ctx.fill();}
    // trees / lamp silhouettes provide scale
    if(seg.arena==='bench_square'||seg.arena==='bin_alley'){drawTreeUrban(ctx,w*.12,gy*.80,1.15,night);drawTreeUrban(ctx,w*.88,gy*.81,.95,night);}
    if(seg.arena==='night_gate'||seg.arena==='parking_patrol'||seg.arena==='closed_arcade'){lamp(ctx,w*.12,gy*.82,true);lamp(ctx,w*.86,gy*.82,true);}
  }
  function drawArenaBackdrop(ctx,w,gy,seg){var key=seg.arena+':'+Math.round(w/40)+':'+Math.round(gy/30),sprite=ART_CACHE.get(key);if(!sprite){var sc=document.createElement('canvas'),dpr=2;sc.width=Math.max(1,Math.round(w*dpr));sc.height=Math.max(1,Math.round(gy*dpr));var sctx=sc.getContext('2d');sctx.scale(dpr,dpr);paintArenaBackdrop(sctx,w,gy,seg);sprite=sc;ART_CACHE.set(key,sprite);if(ART_CACHE.size>18)ART_CACHE.delete(ART_CACHE.keys().next().value);}ctx.drawImage(sprite,0,0,w,gy);}
  function graffiti(ctx,x,y,text,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.globalAlpha=.62;ctx.fillStyle=col||'#734e63';ctx.font='bold 10px sans-serif';ctx.fillText(text,0,0);ctx.restore();}
  function puddle(ctx,x,y,w){ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#b8d1d2';ctx.beginPath();ctx.ellipse(x,y,w,3.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.22;ctx.fillStyle='#f5df9e';ctx.fillRect(x-w*.35,y-1,w*.3,1);ctx.restore();}
  function trash(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#d8d0b7';ctx.rotate(-.18);ctx.fillRect(-5,-2,10,4);ctx.restore();}
  function bollard(ctx,x,y){ctx.fillStyle='#575c5b';ctx.fillRect(x-3,y-19,6,19);ctx.fillStyle='#d7c55d';ctx.fillRect(x-3,y-15,6,4);}
  function neonGlow(ctx,x,y,w,h,col){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=col;for(var n=4;n>0;n--)ctx.fillRect(x-n*2,y-n*2,w+n*4,h+n*4);ctx.restore();}
  function drawArenaScene(ctx,g,seg){
    var y=g.GY,mid=g.W*.5,t=g.estate.time;ctx.save();
    // Spójna, bardziej przestrzenna nawierzchnia: cień budynków, krawężnik i perspektywa.
    var gg=ctx.createLinearGradient(0,y-95,0,y+8);gg.addColorStop(0,seg.tint==='night'||seg.tint==='late'||seg.tint==='finale'?'#4b5057':'#85847b');gg.addColorStop(1,seg.tint==='night'||seg.tint==='late'||seg.tint==='finale'?'#30353a':'#5f625c');ctx.fillStyle=gg;ctx.fillRect(0,y-95,g.W,103);
    ctx.fillStyle='rgba(238,232,207,.28)';ctx.fillRect(0,y-7,g.W,2);ctx.fillStyle='rgba(15,18,18,.22)';ctx.fillRect(0,y-4,g.W,5);
    ctx.strokeStyle='rgba(235,226,199,.13)';ctx.lineWidth=1;for(var pv=0;pv<7;pv++){ctx.beginPath();ctx.moveTo(mid,y-94);ctx.lineTo(pv*g.W/6,y);ctx.stroke();}
    ctx.strokeStyle='rgba(20,23,23,.16)';for(var crack=0;crack<9;crack++){var cx=(crack*137+37)%g.W,cy=y-18-(crack%4)*14;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+8,cy+4);ctx.lineTo(cx+3,cy+9);ctx.stroke();}
    for(var tr=0;tr<5;tr++)trash(ctx,(tr*193+71)%g.W,y-7-(tr%2)*3,.7+(tr%3)*.12);
    // small architecture shared across arenas, never crossing the combat silhouettes
    if(seg.arena!=='night_gate'){for(var bb=0;bb<4;bb++)bollard(ctx,g.W*(.23+bb*.18),y-1);}
    if(seg.arena==='shopfront'||seg.arena==='closed_arcade'){poster(ctx,mid-150,y-125,38,54,'#c66c55','#6d3941','PROMO');poster(ctx,mid+118,y-116,34,48,'#608095','#384a55','INFO');}
    if(seg.arena==='bench_square'){drawTreeUrban(ctx,mid-185,y,1.05,false);drawTreeUrban(ctx,mid+188,y,.92,false);}

    if(seg.arena==='balcony_canyon'){ctx.strokeStyle='#b7b29f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(g.W*.18,y-110);ctx.lineTo(g.W*.82,y-95);ctx.stroke();for(var l=0;l<5;l++){ctx.fillStyle=l%2?'#b34f4b':'#dfd2b8';ctx.fillRect(g.W*.28+l*g.W*.09,y-106+l*2,20,10);}}
    else if(seg.arena==='shopfront'){kiosk(ctx,mid,y,170,80,'MONOPOLOWY','#6b6557','#a64e3f');for(var q=0;q<5;q++)person(ctx,mid-110+q*30,y,.94,'#6f7568',q+t,false,q<2?1:-1);}
    else if(seg.arena==='bench_square'){ctx.fillStyle='#6a4f3f';ctx.fillRect(mid-90,y-22,180,9);ctx.fillRect(mid-82,y-13,7,13);ctx.fillRect(mid+75,y-13,7,13);ctx.fillStyle='#909985';ctx.fillRect(mid-8,y-74,16,52);ctx.strokeStyle='#c9d0c0';ctx.lineWidth=2;ctx.strokeRect(mid-30,y-110,60,36);}
    else if(seg.arena==='snack_kiosk'){neonGlow(ctx,mid-90,y-110,180,18,'#d58c43');kiosk(ctx,mid,y,180,92,'ZAPIEKANKI','#75543c','#d58c43');ctx.fillStyle='rgba(245,235,205,.35)';for(var st=0;st<4;st++){ctx.beginPath();ctx.arc(mid-30+st*18,y-105-(st%2)*8,8+st*3,0,Math.PI*2);ctx.fill();}}
    else if(seg.arena==='rack_yard'){ctx.strokeStyle='#808a84';ctx.lineWidth=6;ctx.strokeRect(mid-72,y-100,144,94);ctx.fillStyle='#9f4e48';ctx.fillRect(mid-58,y-88,116,70);ctx.strokeStyle='#e1bf73';ctx.lineWidth=3;for(var cp=0;cp<6;cp++){ctx.beginPath();ctx.moveTo(mid-55,y-82+cp*11);ctx.lineTo(mid+55,y-68+cp*11);ctx.stroke();}}
    else if(seg.arena==='bin_alley'){ctx.fillStyle='#4f6258';for(var bin=-2;bin<=2;bin++){ctx.fillRect(mid+bin*47-19,y-52,38,47);ctx.fillStyle='#34443d';ctx.fillRect(mid+bin*47-22,y-57,44,7);ctx.fillStyle='#4f6258';}ctx.fillStyle='#725f51';ctx.fillRect(mid+95,y-30,60,25);ctx.fillStyle='#806c59';ctx.fillRect(mid+103,y-46,44,18);}
    else if(seg.arena==='pizza_pavilion'){neonGlow(ctx,mid-95,y-106,190,18,'#c95343');kiosk(ctx,mid,y,190,88,'PIZZA 24','#604b46','#b94d3f');for(var sc=0;sc<3;sc++)car(ctx,mid-105+sc*105,y-8,.50,sc%2?'#4d6473':'#79605a');}
    else if(seg.arena==='night_gate'){puddle(ctx,mid-90,y-9,38);puddle(ctx,mid+105,y-6,27);ctx.fillStyle='#313944';ctx.fillRect(mid-125,y-150,250,150);ctx.fillStyle='#151b22';ctx.beginPath();ctx.arc(mid,y-15,75,Math.PI,0);ctx.lineTo(mid+75,y);ctx.lineTo(mid-75,y);ctx.closePath();ctx.fill();lamp(ctx,mid-115,y-5,true);lamp(ctx,mid+95,y-5,true);}
    else if(seg.arena==='kebab_corner'){neonGlow(ctx,mid-82,y-112,165,18,'#d4a35b');kiosk(ctx,mid,y,165,94,'KEBAB 24','#54463d','#c89a55');ctx.fillStyle='#d9b36a';ctx.fillRect(mid-7,y-77,14,50);ctx.fillStyle='#8a4c38';for(var k=0;k<5;k++)ctx.fillRect(mid-5,y-72+k*9,10,6);ctx.fillStyle='#b8a27a';for(var ch=-1;ch<=1;ch+=2){ctx.fillRect(mid+ch*78,y-20,28,4);ctx.fillRect(mid+ch*82,y-16,4,16);}}
    else if(seg.arena==='parking_patrol'){for(var bo=-2;bo<=2;bo++)bollard(ctx,mid+bo*72,y-3);for(var cc=0;cc<4;cc++)car(ctx,mid-170+cc*112,y-8,.62,cc%2?'#657889':'#7b655c');var px=(t*70)%(g.W+130)-65;car(ctx,px,y-8,.72,'#486b88');ctx.fillStyle='#7db8da';ctx.fillRect(px-4,y-42,10,5);}
    else if(seg.arena==='closed_arcade'){graffiti(ctx,mid-92,y-100,'TU BYŁEM','#8a596a',-.08);graffiti(ctx,mid+62,y-115,'24/7?','#686f84',.05);ctx.fillStyle='#504a49';ctx.fillRect(mid-125,y-92,250,87);ctx.fillStyle='#333236';ctx.fillRect(mid-105,y-79,210,68);ctx.strokeStyle='#776a65';ctx.lineWidth=4;for(var rr=0;rr<8;rr++){ctx.beginPath();ctx.moveTo(mid-103,y-73+rr*8);ctx.lineTo(mid+103,y-73+rr*8);ctx.stroke();}ctx.fillStyle='#e6d8b2';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',mid,y-45);}
    else{puddle(ctx,mid-120,y-8,42);puddle(ctx,mid+140,y-10,32);var van=(t*55)%(g.W+220)-110;ctx.fillStyle='#6e4c70';ctx.fillRect(van-48,y-48,96,38);ctx.fillStyle='#d8c18c';ctx.fillRect(van-32,y-61,48,14);ctx.fillStyle='#f3dfa9';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('NOCNY EXPRESS',van,y-51);ctx.fillStyle='#222b31';ctx.beginPath();ctx.arc(van-28,y-7,9,0,Math.PI*2);ctx.arc(van+29,y-7,9,0,Math.PI*2);ctx.fill();for(var fl=0;fl<14;fl++){ctx.fillStyle=fl%2?'#efc56f':'#cf6a68';ctx.beginPath();ctx.arc(g.W*.20+fl*g.W*.045,y-135-(fl%2)*5,2.5,0,Math.PI*2);ctx.fill();}}
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
    if(seg.arena==='balcony_canyon'){var bh=h;panelWall(ctx,x+4,ground-bh,w-8,bh,isP?'#a6ab9e':'#afa199',7,4,seg.tint==='night');materialRect(ctx,x+5,ground-42,w-10,37,shade(team,1.08),team,shade(team,.58));for(var br=0;br<4;br++){ctx.fillStyle='#59696b';ctx.fillRect(x+12+br*(w-24)/4,ground-bh*.67,Math.max(17,w*.13),31);ctx.fillStyle='rgba(230,231,218,.65)';ctx.fillRect(x+15+br*(w-24)/4,ground-bh*.64,Math.max(11,w*.08),3);}damageScratches(ctx,c,x+4,ground-bh,w-8,bh);}
    else if(seg.arena==='shopfront'){contactShadow(ctx,x+w/2,ground,w*.48,.26);materialRect(ctx,x+5,ground-118,w-10,113,'#918975','#6e6658','#4f4a42');awning(ctx,x+2,ground-131,w-4,23,team,shade(team,1.35));ctx.fillStyle='#f3e3b8';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(isP?'PAWILON A':'PAWILON B',x+w/2,ground-116);glassPanel(ctx,x+18,ground-95,w-36,72,false);damageScratches(ctx,c,x+8,ground-105,w-16,90);}
    else if(seg.arena==='bench_square'){ctx.fillStyle='#8b8a78';ctx.fillRect(x+8,ground-52,w-16,47);ctx.fillStyle=team;ctx.fillRect(x+8,ground-58,w-16,9);ctx.fillStyle='#6b4f3e';ctx.fillRect(x+24,ground-87,w-48,8);ctx.fillRect(x+30,ground-79,6,27);ctx.fillRect(x+w-36,ground-79,6,27);damageScratches(ctx,c,x+8,ground-52,w-16,47);}
    else if(seg.arena==='snack_kiosk'){contactShadow(ctx,x+w/2,ground,w*.46,.28);materialRect(ctx,x+8,ground-105,w-16,100,'#845f47','#644634','#423027');awning(ctx,x+4,ground-124,w-8,22,'#d58c43','#f0d29b');glassPanel(ctx,x+22,ground-82,w-44,48,false);ctx.fillStyle='#dfb56f';ctx.fillRect(x+18,ground-31,w-36,5);damageScratches(ctx,c,x+8,ground-105,w-16,100);}
    else if(seg.arena==='rack_yard'){ctx.fillStyle='#77736c';ctx.fillRect(x+6,ground-94,w-12,89);ctx.strokeStyle='#545451';ctx.lineWidth=3;for(var g=0;g<5;g++){ctx.beginPath();ctx.moveTo(x+13,ground-82+g*16);ctx.lineTo(x+w-13,ground-82+g*16);ctx.stroke();}ctx.fillStyle=team;ctx.fillRect(x+8,ground-101,w-16,9);damageScratches(ctx,c,x+6,ground-94,w-12,89);}
    else if(seg.arena==='bin_alley'){ctx.fillStyle='#53665c';ctx.fillRect(x+10,ground-72,w-20,67);ctx.fillStyle='#33443e';ctx.fillRect(x+6,ground-80,w-12,10);ctx.fillStyle=team;ctx.fillRect(x+18,ground-88,w-36,8);damageScratches(ctx,c,x+10,ground-72,w-20,67);}
    else if(seg.arena==='pizza_pavilion'){ctx.fillStyle='#66514c';ctx.fillRect(x+6,ground-103,w-12,98);ctx.fillStyle='#b94d3f';ctx.fillRect(x+2,ground-122,w-4,21);ctx.fillStyle='#f0d590';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(isP?'PIZZA A':'PIZZA B',x+w/2,ground-108);ctx.fillStyle='#273334';ctx.fillRect(x+22,ground-82,w-44,51);damageScratches(ctx,c,x+6,ground-103,w-12,98);}
    else if(seg.arena==='night_gate'){ctx.fillStyle='#4b545c';ctx.fillRect(x+5,ground-155,w-10,150);ctx.fillStyle='#171d23';ctx.beginPath();ctx.arc(x+w/2,ground-5,w*.28,Math.PI,0);ctx.lineTo(x+w*.78,ground-5);ctx.lineTo(x+w*.22,ground-5);ctx.closePath();ctx.fill();ctx.fillStyle=team;ctx.fillRect(x+7,ground-163,w-14,9);damageScratches(ctx,c,x+5,ground-155,w-10,150);}
    else if(seg.arena==='kebab_corner'){ctx.fillStyle='#55483e';ctx.fillRect(x+9,ground-108,w-18,103);ctx.fillStyle='#c89a55';ctx.fillRect(x+4,ground-127,w-8,21);ctx.fillStyle='#fff0bd';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(isP?'KEBAB A':'KEBAB B',x+w/2,ground-113);ctx.fillStyle='#2b3434';ctx.fillRect(x+26,ground-87,w-52,52);damageScratches(ctx,c,x+9,ground-108,w-18,103);}
    else if(seg.arena==='parking_patrol'){car(ctx,x+w/2,ground-5,Math.max(.75,w/165),isP?'#5a7284':'#81655f');ctx.fillStyle=team;ctx.fillRect(x+18,ground-57,w-36,7);damageScratches(ctx,c,x+14,ground-48,w-28,42);}
    else if(seg.arena==='closed_arcade'){contactShadow(ctx,x+w/2,ground,w*.47,.30);materialRect(ctx,x+5,ground-108,w-10,103,'#625c59','#454243','#343133');metalShutter(ctx,x+17,ground-91,w-34,74);materialRect(ctx,x+8,ground-119,w-16,10,shade(team,1.15),team,shade(team,.6));damageScratches(ctx,c,x+5,ground-108,w-10,103);}
    else{ctx.fillStyle='#56505a';ctx.fillRect(x+10,ground-65,w-20,60);ctx.fillStyle=team;ctx.fillRect(x+12,ground-73,w-24,8);ctx.fillStyle='#d2bd8a';for(var box=0;box<3;box++)ctx.fillRect(x+24+box*32,ground-48-(box%2)*10,24,18);damageScratches(ctx,c,x+10,ground-65,w-20,60);}
    ctx.restore();
  }
  function resident(ctx,g,p,img,drawFace,unitScale){var c=p?g.p:g.e,seg=segmentOf(g);if(c.collapseT)return;var st=side(g,p),a=st.action,t=a?a.t:0,dir=p?1:-1;
    if(seg.arena==='balcony_canyon'){var hpPctB=Math.max(0,Math.min(1,c.hp/Math.max(1,c.max))),weakB=Math.max(0,(.62-hpPctB)/.62),swayB=Math.sin(g.estate.time*(2.2+weakB*3))*weakB*5;ctx.save();ctx.translate(c.x+c.w*.5+swayB,g.GY);ctx.rotate(swayB*.006);ctx.scale(c.w/200,c.h/260);ctx.beginPath();ctx.rect(-41,-222,82,92);ctx.clip();var lean=a&&t<1.05?Math.sin(Math.min(1,t/.7)*Math.PI*.5)*4:0;
      ctx.fillStyle=p?'#608cac':'#b66b5c';ctx.beginPath();ctx.moveTo(-27,-128);ctx.lineTo(-22,-173);ctx.quadraticCurveTo(0,-185,22,-173);ctx.lineTo(29,-128);ctx.closePath();ctx.fill();ctx.save();ctx.translate(dir*lean,-190);if(img)drawFace(ctx,img,-31,-35,62,70,0);else{ctx.fillStyle='#d3aa85';ctx.beginPath();ctx.ellipse(0,-4,17,22,0,0,Math.PI*2);ctx.fill();}ctx.restore();
      var hx=dir*26,hy=-149;if(a){if(t<.85){var lift=Math.min(1,t/.3);hx=dir*(26-14*lift);hy=-149-41*lift;}else if(t<1.05){hx=-dir*30;hy=-190;}else{hx=dir*39;hy=-179+(t-1.05)*35;}}line(ctx,dir*20,-170,hx,hy,'#d3aa85',8);if(a&&!a.released)bottle(ctx,a.item,hx,hy-6,1.05,t<.85?-dir*1.9:dir*.5);ctx.restore();return;}
    var x=p?c.x+c.w*.77:c.x+c.w*.23,scale=Math.min(2.68,Math.max(1.42,unitScale*1.40)),hpPct=Math.max(0,Math.min(1,c.hp/Math.max(1,c.max))),weak=Math.max(0,(.62-hpPct)/.62),wobble=Math.sin(g.estate.time*(2.4+weak*3.2)+(p?0:1.3))*weak*7,bob=Math.sin(g.estate.time*2+(p?0:1))*(.7+weak*1.8),lean=wobble,turn=wobble*.018;
    if(a){var throwLean=0,throwTurn=0;if(t<.72){throwLean=-Math.sin(t/.72*Math.PI*.5)*4;throwTurn=-.06*Math.sin(t/.72*Math.PI*.5);}else if(t<1.05){throwLean=-4+(t-.72)/.33*8;throwTurn=-.06+(t-.72)/.33*.17;}else{throwLean=4*Math.max(0,1-(t-1.05)/.5);throwTurn=.11*Math.max(0,1-(t-1.05)/.5);}lean+=throwLean;turn+=throwTurn;}
    ctx.save();ctx.translate(x+dir*lean*scale,g.GY+bob);ctx.rotate(dir*turn);ctx.scale(dir*scale,scale);
    ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(0,2,14,3.6,0,0,Math.PI*2);ctx.fill();
    var knee=weak*4.5;line(ctx,-4,-19+knee*.25,-6,-3+knee,'#263139',6);line(ctx,4,-19+knee*.25,7,-3+knee*.7,'#263139',6);var heroCol=p?'#557f9d':'#a35f59',heroG=ctx.createLinearGradient(-12,-44,12,-17);heroG.addColorStop(0,shade(heroCol,1.22));heroG.addColorStop(.58,heroCol);heroG.addColorStop(1,shade(heroCol,.58));ctx.fillStyle=heroG;ctx.strokeStyle='rgba(22,28,31,.78)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-10,-42+knee*.35);ctx.lineTo(10,-42+knee*.35);ctx.lineTo(12,-18+knee*.45);ctx.lineTo(-12,-18+knee*.45);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.moveTo(-7,-39+knee*.30);ctx.lineTo(-3,-41+knee*.30);ctx.lineTo(-5,-21+knee*.42);ctx.lineTo(-8,-21+knee*.42);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(231,210,151,.42)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-40+knee*.32);ctx.lineTo(0,-20+knee*.44);ctx.stroke();
    var armX=15,armY=-30;if(a){if(t<.75){armX=8;armY=-49;}else if(t<1.05){armX=-15;armY=-52;}else{armX=22;armY=-43;}}line(ctx,8,-37,armX,armY,'#d3aa85',7);
    ctx.save();ctx.translate(0,-51+knee*.38);if(img)drawFace(ctx,img,-14,-16,28,32,0);else{ctx.fillStyle='#d6a984';ctx.beginPath();ctx.ellipse(0,0,8,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4a4039';ctx.beginPath();ctx.ellipse(0,-6,8,3,0,Math.PI,Math.PI*2);ctx.fill();}ctx.restore();
    if(a&&!a.released)bottle(ctx,a.item,armX,armY-3,.88,.45);ctx.restore();
  }
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate,seg=segmentOf(g);
    drawArenaScene(ctx,g,seg);resident(ctx,g,true,pFace,drawFace,unitScale);resident(ctx,g,false,eFace,drawFace,unitScale);
    e.runners.forEach(function(r){var q=r.t/r.duration,home=r.isP?anchor(g,true,false).x:anchor(g,false,false).x,shop=g.W*(r.isP?.35:.65),progress=q<.43?q/.43:q<.57?1:(1-q)/.43,outbound=q<.57,dir=outbound?(r.isP?1:-1):(r.isP?-1:1);
      person(ctx,home+(shop-home)*progress,g.GY,unitScale*1.28,r.isP?'#6a91ad':'#b97163',e.time*13+r.seed,q>.57?(r.kind==='food'?'food':true):false,dir);});
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
