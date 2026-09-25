(function(root){
  'use strict';
  var F=root.CASTLE_FUTURE,A=root.CASTLE_ERA_ART;
  function unit(n,c,h,a,ac,s,r,era,role,extra){return Object.assign({n:n,c:c,h:h,a:a,ac:ac,s:s,r:r,worker:false,cannon:false,spl:0,R:108,G:135,B:142,tier:3,future:true,nextEra:era,role:role},extra);}
  var units={
    assault:unit('Szturmowiec',26,155,20,18,42,29,'modern','assault',{siege:true}),
    carbine:unit('Karabinier',46,82,27,9,38,185,'modern','rifle',{musket:true}),
    combatmedic:unit('Medyk polowy',44,100,8,5,36,65,'modern','medic',{heal:true,healAmt:17,healRange:78}),
    fieldgun:unit('Działo polowe',108,150,27,68,0,9999,'modern','gun',{cannon:true,shots:4,spl:34}),
    sentinel:unit('Strażnik orbitalny',32,240,17,19,29,28,'orbital','shield',{siege:true,electric:true}),
    plasma:unit('Piechur plazmowy',49,76,32,9,39,178,'orbital','rifle',{musket:true,electric:true}),
    biomedic:unit('Biotechnik',46,88,8,5,40,65,'orbital','medic',{heal:true,healAmt:16,healRange:86,electric:true}),
    railgun:unit('Działo szynowe',116,132,26,70,0,9999,'orbital','gun',{cannon:true,shots:4,spl:23,electric:true})
  };
  Object.assign(F.units,units);
  function level(id,n,sc,profile,ai,ul,recommended,extra){return Object.assign({id:id,n:n,sc:sc,profile:profile,ai:ai,ul:ul,recommended:recommended,pH:1400+(id-1)*140,eH:1450+(id-1)*155,gm:1.17,passiveP:1.16,passiveE:1.24,ad:6500-(id-1)*300,treeCount:3,treeCap:3,treeRespawn:28,unitCap:8},extra);}
  F.levels.modern=[
    level(1,'Posterunek Zagubionej Anteny',19,'balanced',['drwal','assault','carbine'],['drwal','assault','carbine'],['assault','carbine']),
    level(2,'Most na Częstotliwości 404',20,'aggressive',['drwal','assault','carbine'],['drwal','assault','carbine','combatmedic'],['assault','combatmedic'],{ad:5700,passiveE:1.18}),
    level(3,'Radiostacja Ciszy Nocnej',19,'defensive',['drwal','carbine','combatmedic','mason'],['drwal','assault','carbine','combatmedic','fieldgun','mason'],['fieldgun','assault'],{treeCount:4,treeCap:4,treeRespawn:30}),
    level(4,'Fort Nieodebranych Meldunków',20,'siege',['drwal','assault','carbine','fieldgun'],['drwal','assault','carbine','combatmedic','fieldgun','mason'],['assault','carbine','combatmedic'],{eH:1820,ad:6000})
  ];
  F.levels.orbital=[
    level(1,'Lądowisko Nie Tej Planety',21,'balanced',['drwal','sentinel','plasma'],['drwal','sentinel','plasma'],['sentinel','plasma']),
    level(2,'Ogród w Stanie Nieważkości',22,'aggressive',['drwal','plasma','sentinel'],['drwal','sentinel','plasma','biomedic'],['sentinel','biomedic'],{ad:5500,passiveE:1.18}),
    level(3,'Przekaźnik Echa Własnego Głosu',21,'defensive',['drwal','sentinel','biomedic','mason'],['drwal','sentinel','plasma','biomedic','railgun','mason'],['plasma','railgun'],{treeCount:4,treeCap:4}),
    level(4,'Urząd do Spraw Kosmicznej Przerwy',22,'siege',['drwal','sentinel','plasma','railgun','biomedic'],['drwal','sentinel','plasma','biomedic','railgun','mason'],['sentinel','plasma','biomedic'],{eH:1870,ad:5900})
  ];
  F.scenes.push(
    {s1:'#426f9a',s2:'#d2dbb8',g1:'#7d945c',g2:'#3d5743',sun:'#ffdda0',sr:16},
    {s1:'#384c70',s2:'#d2a883',g1:'#78845b',g2:'#3c5044',sun:'#ffcc8b',sr:17,dusk:true},
    {s1:'#121d42',s2:'#7389aa',g1:'#6c8394',g2:'#343d59',sun:'#d5e8dc',sr:24,night:true},
    {s1:'#2b2350',s2:'#c29bbc',g1:'#8d809d',g2:'#4c415f',sun:'#e5d4ae',sr:22,night:true}
  );
  ['modern','orbital'].forEach(function(id,i){root.CASTLE_ERAS.packs[id]={id:id,enabled:true,unlockAfter:{eraId:i?'modern':'electric',completedLevels:4},levelIds:[1,2,3,4],castleStyle:i?'orbital-bastion':'radio-fort',unitSet:id,humorPool:id,campaign:{titleKey:'campaign.'+id,levelIds:[1,2,3,4],mapPoints:[[12,28],[37,70],[63,28],[88,70]]}};});
  // No medieval knight or steam hammer in a newer army's normal draft.
  F.levels.industrial.forEach(function(l){l.ai=l.ai.map(function(k){return k==='knight'?'rifleman':k;}).filter(function(k,i,a){return a.indexOf(k)===i;});});
  F.levels.electric.forEach(function(l){['ai','ul','recommended'].forEach(function(f){l[f]=l[f].map(function(k){return k==='riveter'||k==='steamguard'?'voltguard':k;}).filter(function(k,i,a){return a.indexOf(k)===i;});});});
  var names={assault:'Assault Trooper',carbine:'Carabineer',combatmedic:'Combat Medic',fieldgun:'Field Gun',sentinel:'Orbital Sentinel',plasma:'Plasma Trooper',biomedic:'Biotechnician',railgun:'Railgun'};
  var titles={modern:['Post of the Missing Antenna','Bridge on Frequency 404','Quiet Hours Radio Station','Fort of Unanswered Reports'],orbital:['Wrong Planet Landing Pad','Zero Gravity Garden','Relay of Your Own Echo','Office of Cosmic Coffee Breaks']};
  ['pl','en'].forEach(function(lang){var text=root.CASTLE_I18N[lang];Object.keys(units).forEach(function(k){text['unit.'+k]=lang==='pl'?units[k].n:names[k];});['modern','orbital'].forEach(function(era){F.levels[era].forEach(function(l,i){text[era+'.level.'+l.id]=lang==='pl'?l.n:titles[era][i];});});
    text['campaign.modern']=lang==='pl'?'V · SILNIKI I RADIO':'V · ENGINES AND RADIO';text['campaign.orbital']=lang==='pl'?'VI · WYPRAWA ORBITALNA':'VI · ORBITAL EXPEDITION';
    text['menu.tagline']=lang==='pl'?'34 BITWY • 6 EPOK • ZERO KOMPETENTNYCH DORADCÓW':'34 BATTLES • 6 ERAS • ZERO QUALIFIED ADVISERS';
    text['end.allWon']=lang==='pl'?'Wszystkie 34 bitwy ukończone! Wysłano meldunek na niewłaściwą planetę.':'All 34 battles complete! The report was sent to the wrong planet.';
  });
  var supportNames={
    'early-modern':{drwal:['Drwal cechowy','Guild Woodcutter'],mason:['Budowniczy fortu','Fort Builder'],monk:['Felczer','Barber Surgeon']},
    industrial:{drwal:['Robotnik tartaku','Sawmill Worker'],mason:['Murarz fabryczny','Foundry Builder'],monk:['Felczer fabryczny','Factory Medic']},
    electric:{drwal:['Operator piły','Saw Operator'],mason:['Monter','Technician']},
    modern:{drwal:['Drwal mechaniczny','Power Saw Operator'],mason:['Inżynier fortu','Fort Engineer']},
    orbital:{drwal:['Operator biokopuły','Biodome Operator'],mason:['Inżynier kolonii','Colony Engineer']}
  };
  function supportName(key,era,lang){return supportNames[era]&&supportNames[era][key]?supportNames[era][key][lang==='en'?1:0]:null;}
  function drawTroop(ctx,ud,x,y,dir,size,step,atk,moving,isP){
    var space=ud.nextEra==='orbital',role=ud.role,f=size/22,team=isP?'#4c89c0':'#bf5d54',ink='#263641';
    ctx.save();ctx.translate(x,y);ctx.scale(dir*f,f);ctx.lineJoin='round';ctx.lineCap='round';
    function poly(p,c){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(var i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=.9;ctx.stroke();}
    function line(p,c,w){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(var i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();}
    function oval(x,y,rx,ry,c){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.stroke();}
    var recoil=Math.sin(atk*Math.PI)*2,walk=moving?Math.sin(step)*4:0;
    var cloth=space?'#b9cdd0':'#718361',shadow=space?'#5a7c91':'#465541',trim=space?'#9ce8df':'#c6c49b';
    if(role==='gun'){
      poly([[-24,-5],[-21,-14],[13,-14],[24,-5],[20,1],[-20,1]],shadow);
      if(space){line([[-18,2],[18,2]],'#a3e6e0',2);poly([[-18,-1],[-14,4],[-8,4],[-4,-1]],'#4e7183');poly([[6,-1],[10,4],[16,4],[20,-1]],'#4e7183');}
      else for(var w=-1;w<=1;w+=2){oval(w*15,-2,7,7,ink);oval(w*15,-2,4.5,4.5,'#86917b');line([[w*15-3,-2],[w*15+3,-2]],ink,1);}
      poly([[-10,-15],[-8,-26],[5,-28],[13,-19],[12,-12]],cloth);line([[-7,-21],[7,-21]],team,3);
      poly([[-3-recoil,-24],[29-recoil,-27],[31-recoil,-23],[0-recoil,-19]],shadow);line([[2-recoil,-23],[28-recoil,-25]],trim,1.2);
      if(space)for(var coil=0;coil<4;coil++)line([[8+coil*4-recoil,-27],[9+coil*4-recoil,-20]],'#b4f1e6',1.4);
      ctx.restore();return;
    }
    // Rounded joints, a wider body and practical equipment replace medieval armour.
    poly([[-8,-30],[-13,-29],[-13,-17],[-6,-16]],shadow);
    for(var leg=-1;leg<=1;leg+=2){var foot=leg*(3+walk);line([[leg*3,-15],[leg*3+foot*.35,-8],[foot,-2]],ink,6);line([[leg*3,-15],[leg*3+foot*.35,-8],[foot,-2]],leg<0?shadow:cloth,4);poly([[foot-3,-4],[foot+3,-4],[foot+5,0],[foot-3,0]],ink);}
    var body=ctx.createLinearGradient(-9,-31,9,-12);body.addColorStop(0,cloth);body.addColorStop(1,shadow);
    poly([[-9,-29],[-3,-33],[6,-31],[10,-25],[7,-13],[-8,-13]],body);
    oval(-7,-28,4,4,cloth);oval(6,-27,4,4,cloth);
    line([[-8,-15],[7,-15]],ink,2.7);poly([[-6,-26],[5,-26],[5,-19],[-6,-19]],space?'#3c5e75':'#647452');line([[-5,-24],[4,-24]],team,2);
    if(!space){poly([[-6,-19],[-2,-19],[-2,-14],[-6,-14]],'#a8a07b');poly([[1,-19],[5,-19],[5,-14],[1,-14]],'#a8a07b');}
    oval(0,-36,5.8,6.3,space?'#d5e1df':'#d3aa80');
    if(space){poly([[-5,-39],[4,-40],[7,-37],[6,-33],[-4,-33]],'#2e546c');line([[-3,-38],[4,-38]],'#bce9e3',1.3);line([[-5,-30],[5,-30]],shadow,2);}
    else{ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,-38,7,Math.PI,Math.PI*2);ctx.lineTo(8,-36);ctx.lineTo(-7,-36);ctx.closePath();ctx.fill();ctx.stroke();line([[-7,-37],[8,-37]],cloth,1.5);oval(4,-34,.7,.8,ink);}
    if(role==='medic'){
      line([[-6,-28],[6,-16]],'#e0ddbe',2);poly([[8,-20],[17,-20],[18,-10],[8,-10]],space?'#d2dfd9':'#ccc4a5');line([[10,-15],[16,-15]],'#5b987b',2);line([[13,-18],[13,-12]],'#5b987b',2);line([[6,-26],[10,-20],[11,-18]],cloth,4);
    }else if(role==='shield'){
      line([[5,-26],[11,-22]],shadow,4);poly([[9,-29],[20,-31],[23,-24],[20,-10],[14,-7],[8,-12]],'#44667d');poly([[11,-27],[18,-28],[20,-23],[17,-12],[13,-11]],'#84c8cf');line([[14,-25],[14,-15]],'#d3f0df',1.4);
    }else if(role==='rifle'||role==='assault'){
      var thrust=role==='assault'?recoil*2:-recoil;
      poly([[2+thrust,-23],[9+thrust,-24],[13+thrust,-22],[29+thrust,-22],[29+thrust,-19],[10+thrust,-19],[6+thrust,-16],[2+thrust,-17]],shadow);
      line([[10+thrust,-23],[31+thrust,-23]],ink,2);line([[6,-26],[10,-19],[17+thrust,-20]],cloth,3.5);oval(17+thrust,-20,2,1.5,space?cloth:'#d3aa80');
      if(role==='assault')poly([[30+thrust,-23],[39+thrust,-24],[31+thrust,-21]],'#c6d6d6');
      if(space){line([[14+thrust,-22],[25+thrust,-22]],'#9eedeb',2);oval(-10,-24,2,4,'#8dd0cf');}
    }else{
      // Worker uses a saw; engineer uses a wrench. Same economic rules.
      line([[6,-26],[10,-19],[14,-19]],cloth,3.5);
      if(role==='worker'){poly([[8,-21],[19,-21],[22,-17],[18,-12],[8,-13]],space?'#7199ad':'#cba54e');poly([[18,-20],[31,-20],[34,-18],[31,-15],[18,-15]],'#b4c3bc');line([[22,-16],[30,-16]],space?'#a4f6e0':ink,1.5);}
      else{line([[12,-13],[17+recoil,-28]],'#c3cfcb',3);poly([[14+recoil,-28],[14+recoil,-33],[17+recoil,-30],[20+recoil,-33],[20+recoil,-28]],'#adbeb9');}
    }
    ctx.restore();
  }
  var previousDraw=F.drawUnit;F.drawUnit=function(ctx,ud,x,y,dir,size,step,atk,moving,isP){if(ud.nextEra)drawTroop(ctx,ud,x,y,dir,size,step,atk,moving,isP);else previousDraw(ctx,ud,x,y,dir,size,step,atk,moving,isP);};
  function drawSupport(ctx,key,era,x,y,dir,size,step,atk,moving,isP){
    if(!supportName(key,era,'pl'))return false;
    if(era==='early-modern'){F.drawInfantry(ctx,key==='drwal'?'drwal':key==='mason'?'sapper':'fieldmedic',x,y,dir,size,step,atk,moving,isP);return true;}
    drawTroop(ctx,{nextEra:era==='orbital'?'orbital':'modern',role:key==='drwal'?'worker':key==='mason'?'engineer':'medic'},x,y,dir,size,step,atk,moving,isP);return true;
  }
  // Separate fortified silhouettes; the common heraldic slot preserves uploaded portraits.
  var previousBase=A.drawBase,baseCache=new Map();
  function paintBase(ctx,space,isP,level){
    var ink='#283e4d',team=isP?'#4388c1':'#bd615e',light=space?'#c1d6d9':'#c3c1a0',shade=space?'#53758f':'#757f65';ctx.lineJoin='round';
    function poly(p,c){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(function(v){ctx.lineTo(v[0],v[1]);});ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.stroke();}
    function line(p,c,w){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(function(v){ctx.lineTo(v[0],v[1]);});ctx.strokeStyle=c;ctx.lineWidth=w||1;ctx.stroke();}
    function box(x,y,w,h,c){poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],c);}
    function oval(x,y,rx,ry,c){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();}
    var surface=ctx.createLinearGradient(0,-200,190,0);surface.addColorStop(0,light);surface.addColorStop(1,shade);
    if(space){
      poly([[51,-160],[58,-225],[78,-258],[126,-258],[144,-223],[151,-155]],surface);oval(101,-254,25,18,'#88b9c4');line([[101,-273],[101,-289]],light,2);oval(101,-289,3,3,team);
      for(var rib=0;rib<3;rib++)line([[65,-217+rib*16],[136,-217+rib*16]],'#83acbb',3);
      box(80,-244,42,19,'#36596c');line([[86,-237],[117,-237]],'#a9ebdf',3);
    }else{
      box(60,-226,82,82,surface);box(55,-230,92,8,shade);for(var win=0;win<3;win++)box(69+win*23,-215,17,16,'#3c6572');
      line([[98,-231],[98,-270]],ink,3);ctx.save();ctx.translate(98,-265);ctx.rotate(-.5);oval(0,0,25,7,'#91a59b');line([[0,0],[0,-18]],ink,2);ctx.restore();
      line([[143,-178],[164,-268]],ink,1.5);line([[164,-268],[178,-178]],ink,1.5);for(var rail=0;rail<4;rail++)line([[157-rail*3,-249+rail*20],[168+rail*3,-249+rail*20]],ink,1);
    }
    poly([[17,0],[12,-133],[35,-176],[163,-176],[188,-139],[182,0]],surface);
    poly([[163,-176],[188,-139],[182,0],[159,0]],shade);
    box(37,-175,126,9,ink);line([[40,-172],[159,-172]],team,3);
    for(var tower=0;tower<2;tower++){var tx=tower?159:0;poly([[tx,0],[tx,-149],[tx+9,-166],[tx+33,-166],[tx+42,-149],[tx+42,0]],surface);box(tx+5,-153,32,8,shade);box(tx+13,-133,16,24,ink);line([[tx+16,-120],[tx+26,-120]],space?'#a7e8de':'#dace9a',2);for(var seam=0;seam<5;seam++)line([[tx+3,-91+seam*18],[tx+39,-91+seam*18]],shade,.8);}
    for(var butt=0;butt<2;butt++){var bx=butt?146:45;poly([[bx,0],[bx,-142],[bx+8,-142],[bx+12,0]],shade);line([[bx+3,-134],[bx+7,-18]],light,1);}
    poly([[64,-156],[136,-156],[136,-95],[100,-81],[64,-95]],space?'#c9e2d8':'#d3b883');poly([[68,-151],[132,-151],[132,-98],[100,-88],[68,-98]],team);
    poly([[100,-140],[107,-122],[124,-120],[111,-109],[114,-94],[100,-102],[86,-94],[89,-109],[76,-120],[93,-122]],light);
    poly([[68,0],[68,-50],[78,-75],[123,-75],[133,-50],[133,0]],ink);poly([[77,0],[77,-49],[84,-66],[117,-66],[125,-49],[125,0]],shade);
    for(var door=0;door<6;door++)line([[80,-8-door*9],[122,-8-door*9]],'#344b56',1.3);line([[100,-62],[100,-3]],team,2);
    box(0,-5,201,5,shade);line([[1,-4],[199,-4]],light,1);
    if(level>=2){box(7,-66,27,12,team);box(167,-66,27,12,team);}
    if(level>=3){for(var vent=0;vent<3;vent++){box(6+vent*10,-88,6,12,ink);box(167+vent*10,-88,6,12,ink);}}
    if(level===4){line([[29,-166],[29,-204]],ink,2);oval(29,-205,12,3,space?'#a1dacf':'#b4ad84');}
  }
  A.drawBase=function(ctx,c,ground,era,level,t){
    if(era!=='modern'&&era!=='orbital')return previousBase(ctx,c,ground,era,level,t);
    var key=era+':'+c.isP+':'+level,sprite=baseCache.get(key);
    if(!sprite){sprite=document.createElement('canvas');sprite.width=624;sprite.height=900;var sc=sprite.getContext('2d');sc.scale(3,3);sc.translate(4,296);paintBase(sc,era==='orbital',c.isP,level);baseCache.set(key,sprite);if(baseCache.size>2)baseCache.delete(baseCache.keys().next().value);}
    var sx=c.w/200,sy=c.h/260;ctx.save();if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*c.h*.25);}ctx.drawImage(sprite,c.x-4*sx,ground-296*sy,208*sx,300*sy);
    if(c.hp<c.max*.65){ctx.strokeStyle='#31404a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(c.x+c.w*.73,ground-c.h*.5);ctx.lineTo(c.x+c.w*.69,ground-c.h*.42);ctx.lineTo(c.x+c.w*.73,ground-c.h*.36);ctx.stroke();}ctx.restore();
  };
  var previousBackdrop=A.backdrop;
  A.backdrop=function(ctx,w,gy,era,level){
    previousBackdrop(ctx,w,gy,era==='orbital'?'electric':era,level);
    if(era!=='orbital')return;
    var r=Math.max(14,Math.min(35,gy*.07)),x=w*.32,y=gy*.27;
    ctx.save();ctx.globalAlpha=.48;var planet=ctx.createLinearGradient(x-r,y-r,x+r,y+r);planet.addColorStop(0,'#c5b6d9');planet.addColorStop(1,'#627ba2');ctx.fillStyle=planet;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d9c8df';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,r*1.65,r*.36,-.3,0,Math.PI*2);ctx.stroke();ctx.restore();
  };
  function drawBiodomes(ctx,trees){
    ctx.save();trees.forEach(function(t){if(t.w<=0)return;var h=Math.round(54+Math.max(.05,t.w/t.max)*28);
      ctx.strokeStyle='rgba(158,219,223,.38)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(t.x,t.y-2,37,h+7,0,Math.PI,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#7692a1';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(t.x,t.y,37,4,0,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#a4e2ce';ctx.fillRect(t.x+30,t.y-7,3,3);
    });ctx.restore();
  }
  root.CASTLE_CONTENT.gags.push(
    {id:'modern-parachute-mistake',type:'airdrop',enabled:true,weight:1,eras:['modern'],levels:[2,4]},
    {id:'orbital-moon-cleaner',type:'moonjanitor',enabled:true,weight:1,eras:['orbital'],levels:[1,3]}
  );
  root.CASTLE_NEXT={drawBiodomes:drawBiodomes,ids:['modern','orbital'],units:units,supportName:supportName,drawSupport:drawSupport,drawTroop:drawTroop,
    counters:{assault:{carbine:1.25,fieldgun:1.2},carbine:{assault:1.15},sentinel:{plasma:1.18},plasma:{sentinel:1.28}}};
})(window);
