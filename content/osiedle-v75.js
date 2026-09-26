(function(root){
  'use strict';
  // One self-contained interlude. Positions use world fractions so rotation and
  // fullscreen never change a delivery route or an in-flight bottle's target.
  var level=root.CASTLE_FUTURE.levels.modern[3];
  Object.assign(level,{n:'Osiedle Wielkiej Awantury',special:'estate',ul:['drwal'],ai:[],recommended:[],pH:1250,eH:1250,passiveP:1.5,passiveE:1.25,treeCount:0,treeCap:0});
  root.CASTLE_I18N.pl['modern.level.4']=level.n;
  root.CASTLE_I18N.en['modern.level.4']='The Great Concrete Estate Feud';
  var choices=[
    {id:'beer',pl:'Piwo',en:'Beer',cost:12,damage:65,cd:3.8,col:'#957029'},
    {id:'wine',pl:'Wino',en:'Wine',cost:25,damage:150,cd:5.2,col:'#5b793e'},
    {id:'vodka',pl:'Wódka',en:'Vodka',cost:40,damage:255,cd:6.6,col:'#a9d5db'},
    {id:'runner',pl:'Dostawca',en:'Runner',cost:8,col:'#d3b16d'}
  ];
  function active(g){return !!(g&&g.lv&&g.lv.special==='estate');}
  function init(g){if(!active(g))return;g.trees=[];g.rocks=[];g.gagShown=true;g.gagT=1e9;
    g.estate={time:0,ai:5,p:{cd:0,action:null},e:{cd:0,action:null},runners:[],bottles:[],glass:[],delivered:0,hits:0};g.p.gold=g.e.gold=36;
  }
  function side(g,p){return g.estate[p?'p':'e'];}
  function count(g,p){return g.estate.runners.filter(function(r){return r.isP===p;}).length;}
  function status(g,id,p){var item=choices.filter(function(i){return i.id===id;})[0];if(!item||!active(g)||g.over)return {ok:false,reason:'end'};
    if(id==='runner'&&count(g,p)>=2)return {ok:false,reason:'limit'};
    if(id!=='runner'&&side(g,p).cd>0)return {ok:false,reason:'wait'};
    if((p?g.p:g.e).gold<item.cost)return {ok:false,reason:'gold'};
    return {ok:true,item:item};
  }
  function buy(g,id,p){var s=status(g,id,p);if(!s.ok)return false;var item=s.item;(p?g.p:g.e).gold-=item.cost;
    if(id==='runner')g.estate.runners.push({isP:p,t:0,duration:13,seed:g.estate.time});
    else{var st=side(g,p);st.cd=item.cd;st.action={item:item,t:0,released:false};}return true;
  }
  function anchor(g,p,fromHand){var c=p?g.p:g.e;return {x:c.x+c.w*(.5+(fromHand?(p?1:-1)*.195:0)),y:g.GY-c.h*(fromHand?179/260:.64)};}
  function launch(g,a,p){var e=g.estate;e.bottles.push({isP:p,item:a.item,t:0,duration:1.7,arc:Math.min(g.H*.18,100)});}
  function tick(g,dt,hit,reward){if(!active(g)||g.over)return;var e=g.estate;e.time+=dt;
    [true,false].forEach(function(p){var st=side(g,p);st.cd=Math.max(0,st.cd-dt);
      if(st.action){st.action.t+=dt;if(st.action.t>=1.05&&!st.action.released){st.action.released=true;launch(g,st.action,p);}if(st.action.t>=1.65)st.action=null;}
    });
    e.runners=e.runners.filter(function(r){r.t+=dt;if(r.t<r.duration)return true;var c=r.isP?g.p:g.e;c.gold=Math.min(9999,c.gold+34);if(r.isP){g.stats.goldEarned+=34;e.delivered++;}if(reward)reward(r.isP,34);return false;});
    e.bottles=e.bottles.filter(function(b){b.t+=dt;if(b.t<b.duration)return true;var target=anchor(g,!b.isP);hit(b.isP?g.e:g.p,b.item.damage,target.x,target.y,{estate:true});e.hits++;
      for(var i=0;i<7;i++)e.glass.push({p:!b.isP,t:0,vx:(i-3)*12,vy:-22-i*3,col:b.item.col});return false;});
    e.glass=e.glass.filter(function(s){s.t+=dt;return s.t<.65;});
    e.ai-=dt;if(e.ai<=0){e.ai=2.8;if(count(g,false)<1)buy(g,'runner',false);var id=g.e.gold>=40?'vodka':g.e.gold>=25?'wine':'beer';buy(g,id,false);}
  }
  function bottle(ctx,item,x,y,scale,angle){ctx.save();ctx.translate(x,y);ctx.rotate(angle||0);ctx.scale(scale,scale);ctx.lineWidth=1.3;ctx.strokeStyle='#283c3d';ctx.fillStyle=item.col;
    ctx.beginPath();ctx.moveTo(-2,-16);ctx.lineTo(2,-16);ctx.lineTo(2,-9);ctx.lineTo(5,-6);ctx.lineTo(5,8);ctx.quadraticCurveTo(5,11,2,11);ctx.lineTo(-3,11);ctx.quadraticCurveTo(-5,11,-5,8);ctx.lineTo(-5,-6);ctx.lineTo(-2,-9);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#eee0b8';ctx.fillRect(-4,-2,8,7);ctx.fillStyle=item.id==='wine'?'#944752':item.id==='vodka'?'#547dad':'#aa713b';ctx.fillRect(-2,0,4,3);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillRect(-3,-7,1,7);ctx.restore();
  }
  function line(ctx,x,y,xx,yy,col,w){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}
  function person(ctx,x,y,scale,team,step,carrying){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);var swing=Math.sin(step)*5;
    line(ctx,-4,-17,-6+swing,-2,'#283846',5);line(ctx,4,-17,6-swing,-2,'#283846',5);
    ctx.fillStyle=team;ctx.beginPath();ctx.moveTo(-7,-34);ctx.lineTo(7,-34);ctx.lineTo(9,-16);ctx.lineTo(-8,-16);ctx.closePath();ctx.fill();
    line(ctx,-6,-31,-10-swing*.6,-20,'#d5a77e',4);line(ctx,6,-31,11+swing*.6,-22,'#d5a77e',4);
    ctx.fillStyle='#e1b38b';ctx.beginPath();ctx.ellipse(0,-40,6,7,0,0,Math.PI*2);ctx.fill();line(ctx,2,-40,4,-40,'#38413c',1);line(ctx,-5,-31,0,-27,'#c3c6b3',2);line(ctx,0,-27,5,-31,'#c3c6b3',2);line(ctx,-6+swing,-2,-2+swing,-2,'#202d34',4);line(ctx,6-swing,-2,10-swing,-2,'#202d34',4);ctx.fillStyle='#59433c';ctx.beginPath();ctx.ellipse(0,-45,6,3,0,Math.PI,Math.PI*2);ctx.fill();
    if(carrying){ctx.fillStyle='#a47e45';ctx.fillRect(6,-23,14,11);for(var b=0;b<3;b++)bottle(ctx,choices[b],9+b*4,-25,.3,0);ctx.strokeStyle='#644f32';ctx.strokeRect(6,-23,14,11);}ctx.restore();
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
  function draw(ctx,g,pFace,eFace,drawFace,unitScale,lang){if(!active(g))return;var e=g.estate;
    resident(ctx,g,true,pFace,drawFace);resident(ctx,g,false,eFace,drawFace);
    ctx.save();ctx.fillStyle='#73807a';ctx.fillRect(g.p.w,g.GY-5,g.W-g.p.w-g.e.w,12);ctx.fillStyle='#b7b8a3';ctx.fillRect(g.p.w,g.GY-6,g.W-g.p.w-g.e.w,2);ctx.restore();
    [true,false].forEach(function(p){var x=g.W*(p?.34:.66),s=Math.max(.7,unitScale*.95);ctx.save();ctx.translate(x,g.GY);ctx.scale(s,s);
      ctx.fillStyle='#d9c9a4';ctx.fillRect(-39,-53,78,53);ctx.fillStyle='#395b58';ctx.fillRect(-34,-34,34,30);ctx.fillStyle='#344a47';ctx.fillRect(6,-34,24,34);ctx.fillStyle='#b57658';ctx.fillRect(-42,-56,84,17);ctx.fillStyle='#fff1ce';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(lang==='en'?'OFF-LICENCE':'MONOPOLOWY',0,-44);
      for(var k=0;k<3;k++)bottle(ctx,choices[k],-27+k*10,-15,.55,0);ctx.restore();});
    e.runners.forEach(function(r){var q=r.t/r.duration,home=r.isP?g.p.x+g.p.w:g.e.x,shop=g.W*(r.isP?.34:.66),progress=q<.43?q/.43:q<.57?1:(1-q)/.43;person(ctx,home+(shop-home)*progress,g.GY,unitScale,r.isP?'#6a91ad':'#b97163',e.time*13+r.seed,q>.57);});
    e.bottles.forEach(function(b){var q=Math.min(1,b.t/b.duration),a=anchor(g,b.isP,true),z=anchor(g,!b.isP);bottle(ctx,b.item,a.x+(z.x-a.x)*q,a.y+(z.y-a.y)*q-4*b.arc*q*(1-q),Math.max(.8,unitScale*.85),q*9*(b.isP?1:-1));});
    e.glass.forEach(function(s){var a=anchor(g,s.p);ctx.save();ctx.globalAlpha=1-s.t/.65;ctx.fillStyle=s.col;ctx.fillRect(a.x+s.vx*s.t,a.y+s.vy*s.t+120*s.t*s.t,3,5);ctx.restore();});
  }
  function buildCards(doc,g,lang,onBuy){var row=doc.getElementById('cds');row.innerHTML='';choices.forEach(function(item,i){var card=doc.createElement('button');card.type='button';card.className='cd';card.id='estate_'+item.id;card.dataset.hotkey=String(i+1);
    var title=lang==='en'?item.en:item.pl;card.setAttribute('aria-label',title);card.title=title+(item.damage?' · '+item.damage+' HP':' · +34 · 13 s');
    var kbd=doc.createElement('div');kbd.className='cdk';kbd.textContent=String(i+1);card.appendChild(kbd);
    var wrap=doc.createElement('div');wrap.className='iconWrap';var canvas=doc.createElement('canvas');canvas.width=56;canvas.height=56;var ctx=canvas.getContext('2d');if(item.id==='runner')person(ctx,24,54,1,'#6a91ad',0,true);else bottle(ctx,item,28,29,1.6,-.15);wrap.appendChild(canvas);
    var overlay=doc.createElement('div');overlay.className='cdState';overlay.id='estate_state_'+item.id;wrap.appendChild(overlay);card.appendChild(wrap);
    var name=doc.createElement('div');name.className='estateName';name.textContent=title;card.appendChild(name);var cost=doc.createElement('div');cost.className='cdc';cost.textContent=item.cost;card.appendChild(cost);card.addEventListener('click',function(){onBuy(item.id);});row.appendChild(card);
  });updateCards(doc,g,lang,false);}
  function updateCards(doc,g,lang,paused){choices.forEach(function(item){var el=doc.getElementById('estate_'+item.id);if(!el)return;var s=status(g,item.id,true),off=paused||!s.ok;el.disabled=off;el.setAttribute('aria-disabled',String(off));el.classList.toggle('unitUnavailable',off);
    var label=s.reason==='limit'?'2/2':s.reason==='wait'?Math.ceil(side(g,true).cd)+' s':s.reason==='gold'?(lang==='en'?'Funds':'Brak środków'):'';
    var badge=doc.getElementById('estate_state_'+item.id);if(badge){badge.textContent=label;badge.style.display=off?'flex':'none';}
  });}
  var oldBase=root.CASTLE_ERA_ART.drawBase;
  root.CASTLE_ERA_ART.drawBase=function(ctx,c,ground,era,l,t){if(era==='modern'&&l===4){base(ctx,c,ground);return;}return oldBase(ctx,c,ground,era,l,t);};
  var oldBackdrop=root.CASTLE_ERA_ART.backdrop;
  root.CASTLE_ERA_ART.backdrop=function(ctx,w,gy,era,l){
    if(era!=='modern'||l!==4)return oldBackdrop(ctx,w,gy,era,l);
    ctx.save();ctx.globalAlpha=.25;
    for(var i=0;i<7;i++){var x=w*(.18+i*.095),bw=w*.085,h=gy*(.15+(i%3)*.035);ctx.fillStyle='#647775';ctx.fillRect(x,gy-h,bw,h);
      ctx.fillStyle='#c3c4ac';for(var r=0;r<5;r++)for(var c=0;c<4;c++)ctx.fillRect(x+5+c*bw*.23,gy-h+8+r*h*.17,Math.max(2,bw*.12),h*.07);}
    ctx.restore();
  };
  root.CASTLE_ESTATE={active:active,init:init,buy:buy,status:status,tick:tick,draw:draw,buildCards:buildCards,updateCards:updateCards,choices:choices};
})(window);
