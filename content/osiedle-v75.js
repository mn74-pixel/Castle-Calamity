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
    {id:'balcony',pl:'1/12 Balkonowe otwarcie',en:'1/12 Balcony Opening',hintPl:'Poznaj rzut i dostawę',hintEn:'Learn throw and supply',runner:13,ai:3.2,cd:1,brawlers:0,prop:'balcony',landmark:'loggia',arena:'balcony_canyon',scene:0,food:false,accent:'#d4c188',supply:2},
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
  function active(g){return !!(g&&g.lv&&g.lv.special==='estate');}
  function makeSide(){return {cd:0,action:null,stamina:100,bottles:2,food:0,restT:0,mealT:0,regenBonus:0,costMul:1,notice:'',noticeT:0,combo:0,comboT:0};}
  function init(g){if(!active(g))return;g.trees=[];g.rocks=[];g.gagShown=true;g.gagT=1e9;
    g.estate={time:0,ai:4.4,segment:0,testSegment:null,segmentFlash:2.2,brawlT:1.8,p:makeSide(),e:makeSide(),runners:[],bottles:[],glass:[],brawlers:[],delivered:0,hits:0};visualSegment=0;g.lv.sc=segments[0].scene;g.p.gold=g.e.gold=46;
  }
  function side(g,p){return g.estate[p?'p':'e'];}
  function count(g,p){return g.estate.runners.filter(function(r){return r.isP===p;}).length;}
  function segmentOf(g){return segments[Math.max(0,Math.min(segments.length-1,g.estate.segment||0))];}
  function setSegment(g,index,forTest){if(!active(g)||!g.estate)return false;index=Math.max(0,Math.min(segments.length-1,Number(index)||0));g.estate.segment=index;g.estate.testSegment=forTest?index:null;g.estate.time=index*SEGMENT_SECONDS+.05;visualSegment=index;g.lv.sc=segments[index].scene;g.estate.segmentFlash=2.2;g.estate.brawlT=.05;g.estate.brawlers=[];ensureBrawlers(g);
    if(forTest){[true,false].forEach(function(p){var st=side(g,p),c=p?g.p:g.e;st.stamina=100;st.bottles=5;st.food=segments[index].food?2:0;st.cd=0;st.restT=0;st.mealT=0;st.regenBonus=0;st.costMul=1;st.notice='';st.noticeT=0;st.combo=0;st.comboT=0;st.action=null;c.gold=240;});g.estate.runners=[];g.estate.bottles=[];}return true;}
  function syncSegment(g){var e=g.estate,next=e.testSegment!==null?e.testSegment:Math.min(segments.length-1,Math.floor(e.time/SEGMENT_SECONDS));if(next!==e.segment){e.segment=next;e.segmentFlash=2.2;e.brawlT=.35;e.brawlers=[];}visualSegment=e.segment;g.lv.sc=segments[e.segment].scene;return segmentOf(g);}
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
  function anchor(g,p,fromHand){var c=p?g.p:g.e,drawW=c.w*1.56,drawH=c.h*1.56,drawX=p?c.x-18:c.x+c.w-drawW+18,inner=drawX+drawW*.5;return {x:inner+(fromHand?(p?drawW*.12:-drawW*.12):0),y:g.GY-drawH*(fromHand?.53:.47)};}
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
  function lamp(ctx,x,y,on){ctx.strokeStyle='#4c5353';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-90);ctx.lineTo(x+18,y-90);ctx.stroke();ctx.fillStyle=on?'#f1d58b':'#9aa1a0';ctx.beginPath();ctx.ellipse(x+22,y-89,9,5,0,0,Math.PI*2);ctx.fill();}
  function car(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);contactShadow(ctx,0,1,31,.28);var body=ctx.createLinearGradient(-28,-26,28,-5);body.addColorStop(0,shade(col,1.16));body.addColorStop(.55,col);body.addColorStop(1,shade(col,.62));ctx.fillStyle=body;ctx.strokeStyle='#242b2e';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-29,-16);ctx.lineTo(-20,-17);ctx.lineTo(-9,-29);ctx.lineTo(15,-29);ctx.lineTo(26,-18);ctx.lineTo(30,-15);ctx.lineTo(27,-5);ctx.lineTo(-27,-5);ctx.closePath();ctx.fill();ctx.stroke();glassPanel(ctx,-7,-27,20,9,true);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(-25,-14,44,2);wheel(ctx,-18,-5,7);wheel(ctx,19,-5,7);ctx.restore();}
  function kiosk(ctx,x,y,w,h,sign,body,accent){var left=x-w/2;contactShadow(ctx,x,y,w*.60,.44);ctx.save();ctx.fillStyle='rgba(0,0,0,.28)';rounded(ctx,left+9,y-h+10,w,h,4,'rgba(0,0,0,.28)');ctx.restore();
    materialRect(ctx,left,y-h,w,h,shade(body,1.20),body,shade(body,.50));ctx.fillStyle=shade(body,.62);ctx.beginPath();ctx.moveTo(left+w*.83,y-h);ctx.lineTo(left+w,y-h+9);ctx.lineTo(left+w,y);ctx.lineTo(left+w*.83,y);ctx.closePath();ctx.fill();
    ctx.fillStyle='#303b3d';ctx.fillRect(left-5,y-h-25,w+10,8);awning(ctx,left-4,y-h-18,w+8,19,accent,shade(accent,1.35));
    rounded(ctx,x-w*.31,y-h-32,w*.62,20,3,shade(accent,.78),'#26343a');ctx.fillStyle='#fff0c4';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(sign,x,y-h-18);
    glassPanel(ctx,left+w*.09,y-h*.69,w*.55,h*.43,false);ctx.fillStyle='#c99d61';ctx.fillRect(left+w*.07,y-h*.27,w*.61,6);ctx.fillStyle='rgba(255,255,255,.20)';ctx.fillRect(left+w*.14,y-h*.64,w*.15,h*.34);
    rectPanel(ctx,left+w*.72,y-h*.68,w*.20,h*.68,shade(body,.72));glassPanel(ctx,left+w*.75,y-h*.60,w*.14,h*.24,false);ctx.fillStyle='#d7c6a2';ctx.fillRect(left+w*.77,y-h*.25,w*.10,2);ctx.fillStyle='#293336';ctx.fillRect(left-2,y-5,w+4,5);
  }
  function rectPanel(ctx,x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#27363b';ctx.lineWidth=1.2;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
  var ESTATE_SKYLINE_LAYOUTS=[
    [{x:-.05,w:.24,h:.88,step:.22,utility:.72,type:1},{x:.23,w:.17,h:.62,step:0,utility:.25,type:2},{x:.47,w:.28,h:1,step:.18,utility:.62,type:0},{x:.82,w:.20,h:.71,step:0,utility:.40,type:2}],
    [{x:-.09,w:.22,h:.65,step:0,utility:.34,type:0},{x:.17,w:.31,h:.94,step:.16,utility:.68,type:2},{x:.56,w:.19,h:.72,step:0,utility:.22,type:1},{x:.79,w:.29,h:.83,step:.20,utility:.52,type:0}],
    [{x:-.04,w:.18,h:.72,step:.18,utility:.58,type:2},{x:.24,w:.25,h:.58,step:0,utility:.18,type:1},{x:.58,w:.29,h:.89,step:.14,utility:.76,type:0},{x:.91,w:.13,h:.63,step:0,utility:.31,type:2}]
  ];
  function estateBackgroundBlock(ctx,w,baseY,maxH,b,c1,c2,night,detail){var x=b.x*w,bw=b.w*w,h=maxH*b.h,y=baseY-h,step=b.step*bw;
    var gr=ctx.createLinearGradient(x,y,x+bw,y+h);gr.addColorStop(0,c1);gr.addColorStop(1,c2);ctx.fillStyle=gr;ctx.fillRect(x,y,bw,h);if(step){ctx.fillStyle=shade(c1,.94);ctx.fillRect(x+bw-step,y-h*.10,step,h*.10);}
    ctx.fillStyle='rgba(24,38,42,.13)';ctx.fillRect(x+bw*.82,y,bw*.18,h);ctx.strokeStyle='rgba(231,234,215,.10)';ctx.lineWidth=1;for(var seam=1;seam<5;seam++){ctx.beginPath();ctx.moveTo(x,y+h*seam/5);ctx.lineTo(x+bw,y+h*seam/5);ctx.stroke();}
    var glow=night?'#ddc77e':'#aebeba',rows=Math.max(2,Math.floor(h/34));ctx.fillStyle=glow;
    if(b.type===1){for(var br=0;br<rows;br++){var by=y+10+br*(h-18)/rows;ctx.fillStyle='rgba(35,47,49,.30)';ctx.fillRect(x+bw*.10,by,bw*.72,7);ctx.fillStyle=glow;for(var bc=0;bc<3;bc++)ctx.fillRect(x+bw*(.14+bc*.22),by+1,Math.max(3,bw*.07),4);}}
    else if(b.type===2){ctx.fillStyle='rgba(29,49,56,.42)';ctx.fillRect(x+bw*.42,y+4,bw*.20,h-8);ctx.fillStyle=glow;for(var sr=0;sr<rows;sr++)ctx.fillRect(x+bw*.46,y+10+sr*(h-20)/rows,bw*.12,Math.max(3,h/rows*.10));for(var sw=0;sw<rows;sw++)ctx.fillRect(x+bw*.12,y+12+sw*(h-22)/rows,Math.max(3,bw*.07),Math.max(3,h/rows*.10));}
    else{var cols=Math.max(2,Math.floor(bw/38));for(var rr=0;rr<rows;rr++)for(var cc=0;cc<cols;cc++){if((rr*3+cc+detail)%4===1)continue;ctx.fillRect(x+9+cc*(bw-18)/cols,y+11+rr*(h-22)/rows,Math.max(3,bw/cols*.18),Math.max(3,h/rows*.11));}}
    var ux=x+bw*b.utility,roof=y-(step&&b.utility>1-b.step?h*.10:0);ctx.fillStyle=shade(c2,.78);ctx.fillRect(ux-8,roof-8,16,8);ctx.strokeStyle=shade(c2,.62);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ux,roof-8);ctx.lineTo(ux,roof-25);ctx.stroke();ctx.beginPath();ctx.arc(ux,roof-27,3,0,Math.PI*2);ctx.stroke();
  }
  function urbanEstateLayer(ctx,w,baseY,maxH,c1,c2,alpha,layout,night){ctx.save();ctx.globalAlpha=alpha;ESTATE_SKYLINE_LAYOUTS[layout].forEach(function(b,i){estateBackgroundBlock(ctx,w,baseY,maxH,b,c1,c2,night,i+layout);});ctx.restore();}
  function paintArenaBackdrop(ctx,w,gy,seg){
    var night=seg.scene>=2,scale=Math.min(1,gy/590);
    // Era 1 discipline: three readable depth bands, now made from specific housing-estate forms.
    urbanEstateLayer(ctx,w,gy-76*scale,390*scale,night?'#5c7080':'#839f9d',night?'#405667':'#68887b',.38,0,night);
    urbanEstateLayer(ctx,w,gy-34*scale,302*scale,night?'#435b6c':'#5e827c',night?'#2e4656':'#496e61',.54,1,night);
    urbanEstateLayer(ctx,w,gy,214*scale,night?'#2c4957':'#40685b',night?'#223943':'#344f47',.72,2,night);
    // Low service pavilions interrupt the slab blocks instead of forming wallpaper.
    ctx.save();ctx.globalAlpha=night?.54:.46;materialRect(ctx,w*.07,gy-55*scale,w*.17,55*scale,night?'#50606a':'#87918a',night?'#34434b':'#646f68','#34434b');materialRect(ctx,w*.73,gy-43*scale,w*.21,43*scale,night?'#4b5660':'#827b70',night?'#303a40':'#625d56','#343a3c');ctx.restore();
    ctx.save();ctx.globalAlpha=night?.52:.42;drawTreeUrban(ctx,w*.13,gy-3,.90,night);drawTreeUrban(ctx,w*.52,gy-3,1.02,night);drawTreeUrban(ctx,w*.86,gy-3,.82,night);ctx.restore();
    ctx.save();ctx.globalAlpha=night?.68:.34;lamp(ctx,w*.19,gy-2,night);lamp(ctx,w*.78,gy-2,night);ctx.restore();
  }
  function drawArenaBackdrop(ctx,w,gy,seg){var key=seg.arena+':'+seg.scene+':'+Math.round(w/40)+':'+Math.round(gy/30),sprite=ART_CACHE.get(key);if(!sprite){var sc=document.createElement('canvas'),dpr=2;sc.width=Math.max(1,Math.round(w*dpr));sc.height=Math.max(1,Math.round(gy*dpr));var sctx=sc.getContext('2d');sctx.scale(dpr,dpr);paintArenaBackdrop(sctx,w,gy,seg);sprite=sc;ART_CACHE.set(key,sprite);if(ART_CACHE.size>18)ART_CACHE.delete(ART_CACHE.keys().next().value);}ctx.drawImage(sprite,0,0,w,gy);}
  function graffiti(ctx,x,y,text,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.globalAlpha=.62;ctx.fillStyle=col||'#734e63';ctx.font='bold 10px sans-serif';ctx.fillText(text,0,0);ctx.restore();}
  function puddle(ctx,x,y,w){ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#b8d1d2';ctx.beginPath();ctx.ellipse(x,y,w,3.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.22;ctx.fillStyle='#f5df9e';ctx.fillRect(x-w*.35,y-1,w*.3,1);ctx.restore();}
  function trash(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#d8d0b7';ctx.rotate(-.18);ctx.fillRect(-5,-2,10,4);ctx.restore();}
  function bollard(ctx,x,y){ctx.fillStyle='#575c5b';ctx.fillRect(x-3,y-19,6,19);ctx.fillStyle='#d7c55d';ctx.fillRect(x-3,y-15,6,4);}
  function neonGlow(ctx,x,y,w,h,col){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=col;for(var n=4;n>0;n--)ctx.fillRect(x-n*2,y-n*2,w+n*4,h+n*4);ctx.restore();}
  function landmarkOutline(ctx){ctx.strokeStyle='#27363b';ctx.lineWidth=1.4;ctx.lineJoin='round';ctx.lineCap='round';}
  function drawArenaScene(ctx,g,seg){
    var y=g.GY,mid=g.W*.5,t=g.estate.time,night=seg.scene>=2;ctx.save();
    // Narrow urban ground plane; the scenery, not a grey parking lot, owns the frame.
    var ground=ctx.createLinearGradient(0,y-112,0,y+4);ground.addColorStop(0,night?'#50595f':'#747368');ground.addColorStop(1,night?'#2e3538':'#4c554c');ctx.fillStyle=ground;ctx.fillRect(0,y-112,g.W,116);
    ctx.fillStyle=night?'#2b3a34':'#55734c';ctx.fillRect(0,y,g.W,17);ctx.fillStyle='rgba(239,228,195,.34)';ctx.fillRect(0,y-4,g.W,2);ctx.fillStyle='rgba(27,34,31,.22)';ctx.fillRect(0,y+2,g.W,4);
    ctx.fillStyle=night?'#3d5548':'#6f8b5c';for(var grass=0;grass<18;grass++){var gx=(grass*97+31)%g.W;ctx.fillRect(gx,y+4+(grass%3),2,5+(grass%4));}
    ctx.strokeStyle='rgba(35,42,41,.18)';ctx.lineWidth=1;for(var crack=0;crack<7;crack++){var cx=(crack*167+51)%g.W,cy=y-8-(crack%3)*13;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+8,cy+3);ctx.lineTo(cx+3,cy+8);ctx.stroke();}
    ctx.fillStyle=night?'#85847b':'#aaa596';for(var curb=0;curb<9;curb++)ctx.fillRect(curb*g.W/9+4,y-111,Math.max(12,g.W/9-13),4);
    ctx.strokeStyle='rgba(224,220,199,.22)';for(var bay=0;bay<6;bay++){ctx.beginPath();ctx.moveTo(bay*g.W/6+22,y-83);ctx.lineTo(bay*g.W/6+37,y-106);ctx.stroke();}
    landmarkOutline(ctx);

    // One large, iconic modern-estate landmark per stage.
    ctx.save();ctx.translate(mid,y);ctx.scale(1.72,1.72);ctx.translate(-mid,-y);contactShadow(ctx,mid,y-1,112,.34);landmarkOutline(ctx);
    if(seg.arena==='balcony_canyon'){
      materialRect(ctx,mid-86,y-92,172,87,'#aaa28f','#746e64','#27363b');ctx.fillStyle='#293b42';ctx.fillRect(mid-58,y-82,116,55);glassPanel(ctx,mid+13,y-77,38,42,false);ctx.fillStyle='#b2534d';ctx.fillRect(mid-53,y-76,58,42);ctx.fillStyle='#7d8a85';ctx.fillRect(mid-64,y-32,128,9);ctx.fillStyle='#e5d9b8';ctx.fillRect(mid-67,y-36,134,4);for(var lr=0;lr<7;lr++)ctx.fillRect(mid-57+lr*19,y-32,2,9);
    }else if(seg.arena==='shopfront'){
      kiosk(ctx,mid,y,190,92,'MONOPOLOWY','#65594a','#aa5140');for(var q=0;q<4;q++)person(ctx,mid-58+q*38,y,.64,'#69746e',q+t,false,q<2?1:-1);
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
      ctx.fillStyle='rgba(226,220,194,.26)';ctx.fillRect(mid-132,y-42,48,3);ctx.fillRect(mid+84,y-42,48,3);car(ctx,mid-114,y-7,.48,'#6e655d');car(ctx,mid+114,y-7,.48,'#586b77');var px=mid+Math.sin(t*.82)*28;car(ctx,px,y-7,1.16,'#456b8a');ctx.save();ctx.globalAlpha=.16;ctx.fillStyle='#75bce5';ctx.beginPath();ctx.arc(px-7,y-47,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#df6d68';ctx.beginPath();ctx.arc(px+7,y-47,8,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle='#7fc0df';ctx.fillRect(px-14,y-49,14,5);ctx.fillStyle='#d56762';ctx.fillRect(px,y-49,14,5);ctx.fillStyle='#e8ddd0';ctx.fillRect(px-29,y-28,58,6);ctx.fillStyle='#35556e';ctx.font='bold 7px sans-serif';ctx.textAlign='center';ctx.fillText('PATROL',px,y-23);
    }else if(seg.arena==='closed_arcade'){
      materialRect(ctx,mid-114,y-101,228,96,'#69615d','#443f40','#302e30');ctx.fillStyle='#303638';ctx.fillRect(mid-118,y-106,236,10);metalShutter(ctx,mid-96,y-82,192,72);rounded(ctx,mid-54,y-88,108,22,2,'#3d4142','#252b2d');ctx.fillStyle='#eadab5';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('ZAMKNIĘTE',mid,y-72);poster(ctx,mid-108,y-78,18,30,'#82534e','#573938','24H');
    }else{
      var van=mid+Math.sin(t*.56)*25;contactShadow(ctx,van,y-2,94,.42);materialRect(ctx,van-82,y-75,120,67,'#85618c','#543b5b','#26343a');ctx.fillStyle='#6c4b73';ctx.strokeStyle='#26343a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(van+38,y-59);ctx.lineTo(van+61,y-55);ctx.lineTo(van+78,y-35);ctx.lineTo(van+76,y-8);ctx.lineTo(van+38,y-8);ctx.closePath();ctx.fill();ctx.stroke();glassPanel(ctx,van+46,y-51,20,18,true);ctx.fillStyle='#e8d7b0';ctx.fillRect(van-68,y-62,73,25);ctx.strokeStyle='#3a3240';for(var hatch=0;hatch<3;hatch++){ctx.beginPath();ctx.moveTo(van-64,y-57+hatch*7);ctx.lineTo(van+1,y-57+hatch*7);ctx.stroke();}ctx.fillStyle='#d8c28d';ctx.fillRect(van-68,y-96,130,22);ctx.strokeStyle='#26343a';ctx.strokeRect(van-67.5,y-95.5,129,21);ctx.fillStyle='#f4e0ad';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('NOCNY EXPRESS',van-3,y-81);rounded(ctx,van+11,y-68,23,16,2,'#3b3341','#26343a');ctx.fillStyle='#f0d899';ctx.font='bold 8px sans-serif';ctx.fillText('24H',van+22,y-57);ctx.fillStyle='#f3dfaa';ctx.fillRect(van+68,y-27,8,7);ctx.fillStyle='#30383b';ctx.fillRect(van-87,y-14,10,6);ctx.fillRect(van+74,y-14,9,6);wheel(ctx,van-52,y-7,11);wheel(ctx,van+52,y-7,11);
    }
    ctx.restore(); // landmark scale
    ctx.restore();
  }
  function stageBadge(ctx,g,lang){
    if(g.estate.segmentFlash<=.75)return;var seg=segmentOf(g),life=Math.min(1,(g.estate.segmentFlash-.75)/.85),w=Math.min(300,g.W*.34),x=(g.W-w)/2,y=Math.max(108,Math.min(150,g.GY*.25));
    ctx.save();ctx.globalAlpha=life;rounded(ctx,x,y,w,34,5,'rgba(23,31,34,.84)',seg.accent||'#d8c49c');ctx.fillStyle='#f2dfb6';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(lang==='en'?seg.en:seg.pl,g.W*.5,y+14);ctx.font='9px sans-serif';ctx.fillStyle='#cad3cb';ctx.fillText(lang==='en'?seg.hintEn:seg.hintPl,g.W*.5,y+27);ctx.restore();
  }
  function damageScratches(ctx,c,x,y,w,h){var d=Math.max(0,1-c.hp/c.max),n=Math.floor(d*8);ctx.strokeStyle='rgba(43,51,51,.72)';ctx.lineWidth=1.4;for(var i=0;i<n;i++){var px=x+8+(i*31)%Math.max(12,w-20),py=y+10+(i*19)%Math.max(12,h-18);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+7,py+7);ctx.lineTo(px+3,py+14);ctx.stroke();}}
  var ESTATE_BASE_CACHE=new Map(),ESTATE_INK='#26343e';
  var ESTATE_BASE_GRAMMAR=['apartment-mass','side-wings','stair-core','entrance-steps','hero-loggia','window-bays','flat-roof-services'];
  function paintApartmentBlock(ctx,player){
    var team=player?'#3977a8':'#ad5149',light=player?'#a8d3ee':'#efb69b',concrete='#d2c9af',concreteDark='#716a5d',metal='#455d63';
    ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=1.4;
    function rect(x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle=ESTATE_INK;ctx.lineWidth=1.35;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
    function line(x1,y1,x2,y2,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
    function grad(x,w,a,b){var g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,a);g.addColorStop(.42,a);g.addColorStop(1,b);return g;}
    function concreteBlock(x,y,w,h){rect(x,y,w,h,grad(x,w,concrete,concreteDark));ctx.save();ctx.beginPath();ctx.rect(x+1,y+1,w-2,h-2);ctx.clip();for(var row=1;row<h/18;row++)line(x,y+row*18,x+w,y+row*18,'rgba(42,47,44,.18)',.7);for(var col=1;col<w/34;col++)line(x+col*34,y,x+col*34,y+h,'rgba(42,47,44,.13)',.7);ctx.restore();}
    function window(x,y,w,h){rect(x-2,y-2,w+4,h+4,metal);var wg=ctx.createLinearGradient(x,y,x+w,y+h);wg.addColorStop(0,'#b7d0d0');wg.addColorStop(.55,'#627f82');wg.addColorStop(1,'#38585d');rect(x,y,w,h,wg);ctx.fillStyle='rgba(255,255,255,.20)';ctx.beginPath();ctx.moveTo(x+2,y+2);ctx.lineTo(x+w*.40,y+2);ctx.lineTo(x+w*.15,y+h-2);ctx.lineTo(x+2,y+h-2);ctx.closePath();ctx.fill();}
    function ledge(x,y,w){rect(x,y,w,5,concreteDark);rect(x-2,y-3,w+4,4,concrete);line(x-1,y-2,x+w+1,y-2,'#e8dfc6',.8);}
    function roofRail(x,y,w){line(x,y,x+w,y,metal,1.7);for(var k=0;k<=w;k+=18)line(x+k,y,x+k,y+7,metal,1.1);}
    function windowBay(x,y,cols,rows,gapX,gapY){for(var rr=0;rr<rows;rr++)for(var cc=0;cc<cols;cc++)window(x+cc*gapX,y+rr*gapY,12,18);}
    function loggiaBay(x,y,w,h){rect(x,y,w,h,'#39484b');glassPanel(ctx,x+4,y+4,w-8,h-12,false);ctx.fillStyle='#8d9792';ctx.fillRect(x-2,y+h-12,w+4,9);ctx.fillStyle='#e6dcc2';ctx.fillRect(x-3,y+h-15,w+6,3);for(var rail=0;rail<3;rail++)ctx.fillRect(x+5+rail*(w-10)/2,y+h-12,1.5,9);}
    // One wide slab owns the silhouette. The side wings are shallow facade returns, not vertical accents.
    concreteBlock(0,-178,200,178);ledge(0,-178,200);
    ctx.strokeStyle=ESTATE_INK;ctx.lineWidth=2.2;ctx.strokeRect(1,-177,198,176);
    // Shallow facade returns make the slab substantial without producing separate vertical silhouettes.
    rect(0,-147,49,147,grad(0,49,shade(concrete,.92),shade(concreteDark,.90)));rect(153,-140,47,140,grad(153,47,shade(concrete,1.02),shade(concreteDark,.72)));
    ctx.fillStyle='rgba(67,72,68,.24)';ctx.fillRect(48,-174,6,168);ctx.fillRect(149,-174,6,168);ctx.fillStyle='rgba(238,229,205,.22)';ctx.fillRect(55,-171,92,4);
    windowBay(9,-133,2,3,18,35);windowBay(163,-128,2,3,18,35);loggiaBay(157,-169,38,30);
    // The stair core is a vertical glass stripe inside the slab and never breaks the flat roofline.
    rect(12,-171,38,171,'#4d5552');glassPanel(ctx,17,-166,28,31,false);glassPanel(ctx,17,-124,28,31,false);glassPanel(ctx,17,-82,28,27,false);ctx.fillStyle='rgba(232,219,187,.26)';ctx.fillRect(18,-132,26,3);ctx.fillRect(18,-90,26,3);
    // Deep rectangular loggia with a sliding door, side window and solid balcony front.
    rect(57,-159,94,67,concreteDark);rect(63,-153,82,56,'#283b40');glassPanel(ctx,108,-149,32,47,false);window(68,-145,21,30);rect(63,-104,82,11,team);line(66,-108,142,-108,'#e5d8b5',2);
    ctx.fillStyle='#57734f';for(var pot=0;pot<2;pot++){ctx.fillRect(71+pot*62,-113,9,5);ctx.beginPath();ctx.arc(75+pot*62,-116,5,Math.PI,Math.PI*2);ctx.fill();}
    // Glazed entrance and broad steps establish a residential front door at ground level.
    rect(8,-53,46,53,concreteDark);rect(14,-47,34,44,'#25373d');glassPanel(ctx,17,-43,12,36,false);glassPanel(ctx,33,-43,12,36,false);line(31,-43,31,-7,ESTATE_INK,1);rect(4,-9,54,6,'#8f8878');rect(0,-4,63,6,'#aaa18c');
    for(var lamp=0;lamp<2;lamp++){var lx=lamp?59:5;rect(lx-3,-47,6,10,'#293b44');rect(lx-2,-45,4,6,'#ffe2a0');}
    ledge(0,-6,200);
    // Low vents, one short safety rail and a slim aerial keep the flat roof contemporary and horizontal.
    roofRail(7,-184,66);rect(22,-195,34,11,'#778488');for(var vent=0;vent<3;vent++)line(27,-192+vent*3,51,-192+vent*3,'#39484b',1);
    rect(142,-194,34,13,'#6f7f80');rect(148,-199,22,6,'#879493');line(160,-199,160,-226,'#4a5554',1.5);line(151,-218,169,-218,'#4a5554',1.1);line(155,-211,165,-225,'#4a5554',1);
    ctx.strokeStyle=metal;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(111,-190,9,.2,Math.PI*1.35);ctx.stroke();line(111,-190,118,-197,metal,1.8);
    for(var ac=0;ac<2;ac++){var ax=ac?166:64;rect(ax,-83,20,15,'#778488');ctx.strokeStyle='#39484b';ctx.beginPath();ctx.arc(ax+10,-75,5,0,Math.PI*2);ctx.stroke();}
    // Address and team color are facade signage, not a roof crown.
    rect(104,-82,31,14,team);ctx.fillStyle=light;ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText(player?'BLOK A':'BLOK B',119,-72);
  }
  function estateApartmentBase(ctx,c,ground){
    var key='estate:'+c.isP,sprite=ESTATE_BASE_CACHE.get(key);if(!sprite){sprite=document.createElement('canvas');sprite.width=624;sprite.height=900;var sc=sprite.getContext('2d');sc.scale(3,3);sc.translate(4,296);paintApartmentBlock(sc,c.isP);ESTATE_BASE_CACHE.set(key,sprite);}
    ctx.save();if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*c.h*.25);}var drawW=c.w*1.56,drawH=c.h*1.56,sx=drawW/200,sy=drawH/260,drawX=c.isP?c.x-18:c.x+c.w-drawW+18;ctx.drawImage(sprite,drawX-4*sx,ground-296*sy,208*sx,300*sy);
    // Dynamic damage remains pixel-stable and sparse.
    ctx.translate(drawX,ground);ctx.scale(sx,sy);var damage=Math.max(0,1-c.hp/c.max);ctx.strokeStyle='#384048';ctx.lineWidth=1.5;for(var d=0;d<Math.floor(damage*8);d++){var dx=31+(d*43)%136,dy=-74-(d*29)%118;ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+6,dy+8);ctx.lineTo(dx+2,dy+15);ctx.stroke();}ctx.restore();
  }
  function arenaBase(ctx,c,ground){estateApartmentBase(ctx,c,ground);}
  function resident(ctx,g,p,img,drawFace,unitScale){
    var c=p?g.p:g.e;if(c.collapseT)return;var st=side(g,p),a=st.action,t=a?a.t:0,dir=p?1:-1,drawW=c.w*1.56,drawH=c.h*1.56,sx=drawW/200,sy=drawH/260,drawX=p?c.x-18:c.x+c.w-drawW+18,sway=Math.sin(g.estate.time*2.0+(p?0:1))*.8;
    // The resident is clipped by the same rectangular loggia opening painted into the facade.
    ctx.save();ctx.translate(drawX,g.GY);ctx.scale(sx,sy);ctx.beginPath();ctx.rect(63,-153,82,56);ctx.clip();
    ctx.translate(sway,0);
    var body=p?'#4f7c9d':'#9e5b55';ctx.fillStyle=body;ctx.strokeStyle=ESTATE_INK;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(82,-94);ctx.lineTo(84,-121);ctx.quadraticCurveTo(100,-134,116,-121);ctx.lineTo(118,-94);ctx.closePath();ctx.fill();ctx.stroke();
    var hx=100+dir*19,hy=-109;if(a){if(t<.70){var lift=Math.min(1,t/.70);hx=100+dir*(19-8*lift);hy=-109-25*lift;}else if(t<1.05){hx=100-dir*24;hy=-138;}else{hx=100+dir*32;hy=-127+(t-1.05)*24;}}
    line(ctx,100+dir*12,-117,hx,hy,'#d3aa85',6);
    ctx.save();ctx.translate(100,-139);if(img)drawFace(ctx,img,-16,-18,32,36,0);else{ctx.fillStyle='#d5aa85';ctx.beginPath();ctx.ellipse(0,0,10,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#49403a';ctx.beginPath();ctx.ellipse(0,-8,10,4,0,Math.PI,Math.PI*2);ctx.fill();}ctx.restore();
    if(a&&!a.released)bottle(ctx,a.item,hx,hy-4,.74,t<.75?-dir*1.45:dir*.45);ctx.restore();
    // Loggia rail sits in front of the character and belongs to the facade.
    ctx.save();ctx.translate(drawX,g.GY);ctx.scale(sx,sy);ctx.fillStyle='#7d8a85';ctx.fillRect(63,-104,82,11);ctx.fillStyle='#e5d9b8';ctx.fillRect(60,-108,88,4);for(var rail=0;rail<6;rail++)ctx.fillRect(68+rail*14,-104,2,11);ctx.restore();
  }
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate,seg=segmentOf(g);
    drawArenaScene(ctx,g,seg);resident(ctx,g,true,pFace,drawFace,unitScale);resident(ctx,g,false,eFace,drawFace,unitScale);
    e.runners.forEach(function(r){var q=r.t/r.duration,home=r.isP?anchor(g,true,false).x:anchor(g,false,false).x,shop=g.W*(r.isP?.35:.65),progress=q<.43?q/.43:q<.57?1:(1-q)/.43,outbound=q<.57,dir=outbound?(r.isP?1:-1):(r.isP?-1:1);
      person(ctx,home+(shop-home)*progress,g.GY,unitScale*.96,r.isP?'#6a91ad':'#b97163',e.time*13+r.seed,q>.57?(r.kind==='food'?'food':true):false,dir);});
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
  root.CASTLE_ESTATE={active:active,init:init,buy:buy,eat:eat,status:status,tick:tick,draw:draw,buildCards:buildCards,updateCards:updateCards,choices:choices,foods:foods,segments:segments,segmentSeconds:SEGMENT_SECONDS,setSegment:setSegment,chooseDrink:chooseDrink,staminaCost:staminaCost,currentVisual:function(){return visualSegment;},arenaKinds:segments.map(function(s){return s.arena;}),landmarkKinds:segments.map(function(s){return s.landmark;}),artCache:function(){return ART_CACHE.size;},styleVersion:'8.2.4',baseGrammar:ESTATE_BASE_GRAMMAR.slice(),baseCache:function(){return ESTATE_BASE_CACHE.size;}};
})(window);
