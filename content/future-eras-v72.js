(function(root){
  "use strict";
  // Pakiety III–IV: dane i oprawa, bez kopii symulacji walki.
  function unit(n,c,h,a,ac,s,r,extra){
    return Object.assign({n:n,c:c,h:h,a:a,ac:ac,s:s,r:r,worker:false,cannon:false,spl:0,R:115,G:133,B:139,tier:3,future:true},extra);
  }
  var units={
    riveter:unit("Nitownik",24,135,18,15,37,28,{siege:true,role:"hammer"}),
    rifleman:unit("Strzelec",44,75,29,9,36,185,{musket:true,role:"rifle"}),
    steamguard:unit("Strażnik parowy",78,300,25,23,25,30,{siege:true,role:"steam"}),
    howitzer:unit("Haubica",105,145,25,65,0,9999,{cannon:true,mortar:true,shots:4,spl:38,role:"gun"}),
    voltguard:unit("Strażnik cewki",27,145,18,13,34,30,{electric:true,role:"shield"}),
    pulser:unit("Impulsowiec",48,72,30,10,39,175,{electric:true,musket:true,role:"pulse"}),
    fieldmedic:unit("Sanitariusz",44,95,9,5,36,65,{electric:true,heal:true,healAmt:16,healRange:78,role:"medic"}),
    coilgun:unit("Działo indukcyjne",112,135,24,67,0,9999,{electric:true,cannon:true,shots:4,spl:24,role:"coil"})
  };
  function level(id,n,sc,profile,ai,ul,recommended){
    return {id:id,n:n,sc:sc,profile:profile,ai:ai,ul:ul,recommended:recommended,
      pH:1250+(id-1)*230,eH:1300+(id-1)*250,gm:1.16+(id-1)*.025,
      passiveP:1.15,passiveE:1.25+(id-1)*.03,ad:7200-(id-1)*500,
      treeCount:id<3?3:4,treeCap:id<3?3:4,treeRespawn:27,unitCap:8};
  }
  var levels={
    industrial:[
      level(1,"Stacja Spóźnionej Pary",15,"balanced",["drwal","riveter","rifleman"],["drwal","riveter","rifleman","monk"],["riveter","rifleman"]),
      level(2,"Most Tysiąca Nitów",16,"aggressive",["drwal","riveter","knight","rifleman"],["drwal","riveter","rifleman","steamguard","monk"],["steamguard","rifleman"]),
      level(3,"Dolina Ciężkich Kroków",15,"defensive",["drwal","steamguard","rifleman","mason"],["drwal","riveter","rifleman","steamguard","howitzer","mason"],["howitzer","riveter"]),
      level(4,"Fabryka Wolnych Sobót",16,"siege",["drwal","steamguard","howitzer","rifleman"],["drwal","riveter","rifleman","steamguard","howitzer","monk","mason"],["riveter","howitzer","monk"])
    ],
    electric:[
      level(1,"Przedmieście Wysokiego Napięcia",17,"balanced",["drwal","voltguard","pulser"],["drwal","voltguard","pulser"],["voltguard","pulser"]),
      level(2,"Aleja Rozładowanych Baterii",18,"aggressive",["drwal","pulser","riveter","voltguard"],["drwal","voltguard","pulser","fieldmedic"],["voltguard","fieldmedic"]),
      level(3,"Przekaźnik Nieodebranych Rozkazów",17,"siege",["drwal","voltguard","coilgun","pulser"],["drwal","voltguard","pulser","fieldmedic","coilgun","mason"],["coilgun","fieldmedic"]),
      level(4,"Ministerstwo Krótkich Spięć",18,"defensive",["drwal","steamguard","pulser","coilgun","fieldmedic"],["drwal","voltguard","pulser","fieldmedic","coilgun","riveter","mason"],["riveter","coilgun","fieldmedic"])
    ]
  };
  var scenes=[
    {s1:"#57606b",s2:"#c5ac87",g1:"#656445",g2:"#393d30",sun:"#ebd6a4",sr:15,smoky:true},
    {s1:"#3a4157",s2:"#a97557",g1:"#65563d",g2:"#38332a",sun:"#edb971",sr:16,dusk:true},
    {s1:"#172d46",s2:"#617f91",g1:"#42595a",g2:"#26383e",sun:"#b7dfdf",sr:13,night:true},
    {s1:"#292947",s2:"#87728b",g1:"#4d5862",g2:"#29323f",sun:"#e4d9b5",sr:15,night:true}
  ];
  ["industrial","electric"].forEach(function(id,i){
    root.CASTLE_ERAS.packs[id]={id:id,enabled:true,unlockAfter:{eraId:i?"industrial":"early-modern",completedLevels:i?4:6},
      levelIds:[1,2,3,4],castleStyle:i?"coil-station":"iron-foundry",unitSet:id,humorPool:id,
      campaign:{titleKey:"campaign."+id,levelIds:[1,2,3,4],mapPoints:[[12,28],[37,70],[63,28],[88,70]]}};
  });
  var text={
    pl:{"campaign.industrial":"III · PARA I ŻELAZO","campaign.electric":"IV · WIEK ISKRY","campaign.previousLocked":"Ukończ poprzednią epokę, aby odblokować ten rozdział.","end.eraComplete":"Rozdział ukończony! Kolejna epoka czeka na mapie.","menu.tagline":"26 BITEW • 4 EPOKI • ZERO KOMPETENTNYCH DORADCÓW"},
    en:{"campaign.industrial":"III · STEAM AND IRON","campaign.electric":"IV · AGE OF SPARKS","campaign.previousLocked":"Complete the previous era to unlock this chapter.","end.eraComplete":"Chapter complete! Find the next era on the campaign map.","menu.tagline":"26 BATTLES • 4 ERAS • ZERO QUALIFIED ADVISERS"}
  };
  var enNames={riveter:"Riveter",rifleman:"Rifleman",steamguard:"Steam Guard",howitzer:"Howitzer",voltguard:"Coil Guard",pulser:"Pulse Trooper",fieldmedic:"Field Medic",coilgun:"Coil Cannon"};
  var enLevels={industrial:["Station of Late Steam","Bridge of a Thousand Rivets","Valley of Heavy Footsteps","Factory of Free Saturdays"],electric:["High Voltage Suburbs","Avenue of Flat Batteries","Relay of Unanswered Orders","Ministry of Short Circuits"]};
  Object.keys(units).forEach(function(k){text.pl["unit."+k]=units[k].n;text.en["unit."+k]=enNames[k];});
  Object.keys(levels).forEach(function(e){levels[e].forEach(function(l,i){text.pl[e+".level."+l.id]=l.n;text.en[e+".level."+l.id]=enLevels[e][i];});});
  Object.keys(text).forEach(function(lang){Object.assign(root.CASTLE_I18N[lang],text[lang]);});
  root.CASTLE_I18N.pl["end.allWon"]="Wszystkie 26 bitew ukończone! Królewski audyt nie znalazł niczego poza zgubionym guzikiem.";
  root.CASTLE_I18N.en["end.allWon"]="All 26 battles complete! The royal audit found nothing but a missing button.";

  // Small, shaded silhouettes. Shared joints, distinct costumes and equipment.
  function drawInfantry(ctx,key,x,y,dir,size,step,atk,moving,isP){
    var industrial=/riveter|rifleman|steamguard/.test(key),electric=/voltguard|pulser|fieldmedic/.test(key);
    var powder=/pikeguard|musketeer|sapper/.test(key),heavy=/steamguard|templar/.test(key);
    var f=size/22,team=isP?"#467eb3":"#b9554d",trim=isP?"#9dc9dc":"#efab89",ink="#202b32";
    var metal=electric?"#a8bdc4":industrial?"#8b9693":"#9baeb5",shade=electric?"#466574":"#495861";
    var cloth=electric?"#364d60":industrial?"#565449":powder?"#5e584b":"#616e76";
    var phase=moving?step:0,stride=moving?Math.sin(phase)*4:0,lift=moving?Math.max(0,Math.cos(phase))*1.8:0;
    var action=Math.sin(Math.max(0,Math.min(1,atk))*Math.PI),bob=moving?Math.abs(Math.sin(phase))* .6:0;
    ctx.save();ctx.translate(x,y);ctx.scale(dir*f,f);ctx.lineJoin="round";ctx.lineCap="round";ctx.lineWidth=.85;ctx.strokeStyle=ink;
    function shape(points,color,outline){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(var i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill();if(outline!==false){ctx.strokeStyle=ink;ctx.lineWidth=.85;ctx.stroke();}}
    function oval(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
    function line(points,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(var i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.stroke();}
    function limb(hip,foot,front){var knee=(hip+foot)*.5-1;line([[hip,-14],[knee,-8],[foot,-2-(front?lift:0)]],ink,5);line([[hip,-14],[knee,-8],[foot,-3-(front?lift:0)]],front?cloth:shade,3);shape([[foot-2,-5-(front?lift:0)],[foot+2,-4-(front?lift:0)],[foot+5,-1-(front?lift:0)],[foot+5,0-(front?lift:0)],[foot-2,0-(front?lift:0)]],"#2b3034");}
    limb(-3,-3-stride,false);
    // Back equipment and trailing fabric make the pose readable before weapon details.
    if(industrial){shape([[-7,-30],[-12,-29],[-13,-16],[-6,-15]],"#685b42");line([[-11,-28],[-11,-18]],"#bca57b",1);}
    if(electric){shape([[-7,-29],[-11,-27],[-10,-16],[-5,-17]],shade);line([[-9,-25],[-9,-20]],"#83c3c5",1.7);}
    if(/warrior|templar|pikeguard/.test(key))shape([[-5,-29],[-9,-27],[-12-Math.sin(phase)*1.5,-10],[-5,-13]],team);
    limb(3,3+stride,true);
    ctx.save();ctx.translate(action*1.1,-bob);
    var broad=heavy?10:7;
    shape([[-broad,-29],[-3,-32],[5,-30],[broad,-25],[broad-2,-17],[7,-11],[0,-13],[-7,-11],[-broad+1,-20]],cloth);
    if(powder){shape([[-7,-26],[-2,-27],[1,-15],[-7,-9],[-9,-11]],team);shape([[2,-27],[6,-26],[8,-11],[4,-12]],team);line([[-4,-27],[5,-15]],"#d9c9a2",1.6);}
    else if(!/drwal|berserk|fieldmedic/.test(key)){
      shape([[-6,-28],[1,-30],[7,-26],[6,-18],[0,-15],[-6,-18]],metal);
      shape([[1,-29],[6,-26],[5,-18],[0,-16]],shade,false);
      line([[-5,-27],[-1,-28],[0,-19]],"#d9e1d9",.8);
      shape([[-broad,-27],[-broad+4,-30],[-3,-27],[-4,-23],[-broad,-23]],metal);
    }
    if(key==="drwal"||key==="berserk"){shape([[-7,-29],[-3,-30],[-1,-15],[-7,-12]],key==="drwal"?"#b59b62":"#806249");line([[3,-28],[-4,-15]],"#d2b485",2);}
    line([[-7,-15],[7,-15]],"#362f28",2.5);shape([[0,-16.5],[3,-16.5],[3,-13.8],[0,-13.8]],"#c9aa69");
    if(key==="fieldmedic"){shape([[-7,-27],[-2,-30],[6,-27],[8,-12],[-6,-12]],"#ded6b6");line([[-5,-26],[7,-14]],"#5d725f",2);}
    // Neck, jaw, nose and brow are one profile, not a circle pasted above a box.
    shape([[-2,-32],[4,-33],[4,-29],[-2,-29]],"#ad7956");
    shape([[-5,-39],[-1,-42],[4,-40],[6,-37],[7.5,-35],[5,-34],[4,-31],[0,-30],[-4,-33]],"#d6ae84");
    shape([[-4,-38],[-1,-37],[-1,-32],[2,-31],[-1,-30],[-4,-33]],"#ad805f",false);
    line([[3,-37],[5,-37]],ink,.9);line([[4,-33],[5,-33]],"#77543f",.7);
    if(powder&&key!=="pikeguard"||key==="rifleman"){
      shape([[-7,-39],[-5,-44],[2,-44],[6,-40],[9,-40],[6,-37],[-7,-37],[-9,-39]],"#383b38");line([[-5,-40],[5,-40]],team,1.5);
      if(key==="musketeer"){line([[-5,-42],[-9,-48]],"#d8c8a3",1.5);}
    }else if(key==="drwal"||key==="berserk"||key==="riveter"){
      shape([[-6,-36],[-6,-40],[-3,-43],[2,-43],[5,-40],[5,-38],[0,-39]],key==="riveter"?"#9e7948":"#63482e");
      if(key==="berserk")shape([[-4,-34],[-1,-31],[4,-33],[3,-28],[-1,-27],[-5,-31]],"#91633d");
      if(key==="riveter"){line([[-4,-38],[5,-38]],ink,2);oval(2,-38,2,1.6,"#c7d6ca");}
    }else{
      shape([[-6,-35],[-7,-39],[-4,-43],[2,-44],[6,-40],[7,-37],[3,-38],[0,-37],[-2,-33]],metal);
      shape([[-6,-39],[-3,-42],[1,-43],[0,-39]],"#e2e5d8",false);
      line([[-6,-37],[6,-38]],shade,1.3);
      if(electric)line([[1,-37],[6,-37]],"#85d1d4",1.3);
      if(key==="pikeguard")shape([[-2,-43],[1,-48],[4,-43]],metal);
      if(key==="templar"||key==="steamguard"){shape([[0,-38],[6,-38],[6,-31],[1,-30]],metal);line([[2,-36],[6,-36]],ink,1.1);}
    }
    // Rear arm, elbow and glove support the weapon at actual grip points.
    line([[-4,-26],[0,-21],[9,-22]],ink,4.5);line([[-4,-26],[0,-21],[9,-22]],shade,3);
    var ranged=/rifleman|pulser|musketeer|crossbow/.test(key);
    if(ranged){
      var recoil=action*2;
      shape([[0-recoil,-24],[7-recoil,-25],[12-recoil,-23],[28-recoil,-23],[28-recoil,-20],[9-recoil,-20],[4-recoil,-17],[0-recoil,-18]],electric?shade:"#79583c");
      line([[8-recoil,-24],[31-recoil,-24]],ink,2.6);line([[10-recoil,-24.6],[30-recoil,-24.6]],metal,.9);
      if(electric){for(var r=0;r<3;r++)line([[15+r*4-recoil,-25],[15+r*4-recoil,-20]],"#83c6cc",1.2);}
      if(key==="crossbow"){line([[19,-31],[22,-24],[19,-17]],"#916c42",2);line([[19,-31],[15,-24],[19,-17]],"#cabfa5",.7);}
      line([[5,-26],[10,-19],[16,-22]],ink,4);line([[5,-26],[10,-19],[16,-22]],team,2.6);oval(16,-22,2,1.5,"#d5b087");
      if(atk>.82){shape([[31,-24],[38,-27],[35,-23],[38,-20]],electric?"#b4e8e5":"#f2d293",false);}
    }else if(key==="fieldmedic"){
      line([[5,-26],[9,-20],[11,-16]],team,3);shape([[8,-19],[17,-19],[19,-16],[18,-9],[8,-9]],"#7b8978");line([[12,-16],[16,-16]],"#e4e2c5",2);line([[14,-18],[14,-13]],"#e4e2c5",2);
    }else if(key==="voltguard"){
      shape([[8,-28],[17,-30],[21,-25],[19,-12],[14,-7],[8,-12]],shade);shape([[10,-26],[16,-27],[18,-23],[17,-13],[14,-10],[10,-14]],metal);line([[14,-24],[12,-18],[16,-18],[14,-13]],"#b5e7d8",1.4);
    }else if(key==="steamguard"){
      shape([[-12,-30],[-17,-30],[-17,-18],[-12,-15]],"#857758");line([[-15,-31],[-15,-39]],ink,3);oval(0,-22,3,3,"#d5b76b");line([[0,-22],[1,-24]],ink,.8);
      line([[7,-27],[13,-22],[13+action*6,-17]],shade,6);shape([[10+action*6,-21],[17+action*6,-21],[19+action*6,-15],[11+action*6,-14]],metal);
    }else{
      ctx.save();ctx.translate(10,-22);ctx.rotate(/pikeman|pikeguard/.test(key)?-.5:-.65+action*1.35);
      if(/pikeman|pikeguard/.test(key)){line([[-5,12],[25,-30]],"#86663e",2);shape([[23,-29],[30,-39],[28,-27]],metal);}
      else if(/drwal|berserk|riveter|sapper/.test(key)){line([[0,9],[0,-17]],"#82613f",2.3);shape(key==="sapper"?[[-4,-15],[4,-15],[5,-23],[0,-26],[-5,-23]]:[[-5,-21],[7,-21],[9,-14],[-5,-15]],metal);line([[-3,-20],[6,-20]],"#dce2d8",.8);}
      else{shape([[-1,0],[-2,-22],[0,-28],[2,-22],[1,0]],metal);line([[0,-24],[0,-2]],"#edf1de",.7);line([[-5,0],[5,0]],"#c5a56b",2);line([[0,1],[0,6]],"#63472f",2);}
      oval(0,5,2,2,"#cda37b");ctx.restore();
      line([[5,-26],[8,-20],[11,-20]],team,3.5);
      if(key==="warrior"||key==="templar"){shape([[-8,-25],[-1,-26],[2,-22],[0,-12],[-4,-8],[-9,-14]],team);line([[-7,-23],[-3,-24],[-1,-21],[-3,-13],[-4,-11]],trim,1);if(key==="templar"){line([[-5,-21],[-3,-21]],"#e0d9bd",1.5);line([[-4,-23],[-4,-16]],"#e0d9bd",1.5);}}
    }
    ctx.restore();ctx.restore();
  }
  function drawUnit(ctx,ud,x,y,dir,size,step,atk,moving,isP){
    if(!ud.cannon){var keys={hammer:"riveter",rifle:"rifleman",steam:"steamguard",shield:"voltguard",pulse:"pulser",medic:"fieldmedic"};drawInfantry(ctx,keys[ud.role],x,y,dir,size,step,atk,moving,isP);return;}
    var f=size/22,e=ud.electric,team=isP?"#467eb3":"#b9554d";
    ctx.save();ctx.translate(x,y);ctx.scale(dir*f,f);ctx.lineJoin="round";ctx.strokeStyle="#25343c";ctx.lineWidth=1;
    ctx.fillStyle="#455761";ctx.beginPath();ctx.moveTo(-20,-8);ctx.lineTo(-10,-17);ctx.lineTo(9,-17);ctx.lineTo(23,-5);ctx.lineTo(18,-2);ctx.lineTo(-19,-2);ctx.closePath();ctx.fill();ctx.stroke();
    for(var w=-1;w<=1;w+=2){ctx.fillStyle="#27363e";ctx.beginPath();ctx.arc(w*13,-3,7,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle="#8b999c";ctx.beginPath();ctx.arc(w*13,-3,4.8,0,Math.PI*2);ctx.fill();for(var k=0;k<6;k++){var a=k*Math.PI/3+step;ctx.beginPath();ctx.moveTo(w*13,-3);ctx.lineTo(w*13+Math.cos(a)*4.5,-3+Math.sin(a)*4.5);ctx.stroke();}ctx.fillStyle=team;ctx.beginPath();ctx.arc(w*13,-3,1.6,0,Math.PI*2);ctx.fill();}
    ctx.save();ctx.translate(-2-Math.sin(atk*Math.PI)*2,-15);ctx.rotate(e?-.25:-.65);
    var steel=ctx.createLinearGradient(0,-6,0,6);steel.addColorStop(0,"#c1cfcd");steel.addColorStop(.35,"#83989b");steel.addColorStop(1,"#344952");ctx.fillStyle=steel;
    ctx.beginPath();ctx.moveTo(-9,-6);ctx.lineTo(21,-4);ctx.lineTo(26,-5);ctx.lineTo(26,5);ctx.lineTo(21,4);ctx.lineTo(-9,6);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="#182d36";ctx.beginPath();ctx.ellipse(26,0,2,4.8,0,0,Math.PI*2);ctx.fill();
    for(var r=0;r<3;r++){ctx.strokeStyle=e?"#77b7bd":"#b79b65";ctx.lineWidth=e?2:1.4;ctx.beginPath();ctx.ellipse(2+r*6,0,2,6,0,0,Math.PI*2);ctx.stroke();}ctx.restore();ctx.restore();
  }
  function drawBase(ctx,c,ground,era,level,t){
    var electric=era==="electric",x=c.x,w=c.w,h=c.h,y=ground-h,team=c.isP?"#659be0":"#df7668",metal=electric?"#798d9b":"#8f7358";
    ctx.save();ctx.lineWidth=1.6;ctx.strokeStyle="#27303a";
    if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*h*.25);}
    function box(rx,ry,rw,rh,col){
      ctx.fillStyle=col;ctx.fillRect(rx,ry,rw,rh);
      var shade=ctx.createLinearGradient(rx,ry,rx+rw,ry+rh);shade.addColorStop(0,"rgba(255,255,255,.16)");shade.addColorStop(.45,"rgba(255,255,255,.02)");shade.addColorStop(1,"rgba(0,0,0,.24)");ctx.fillStyle=shade;ctx.fillRect(rx,ry,rw,rh);ctx.strokeRect(rx,ry,rw,rh);
      ctx.fillStyle="rgba(255,255,255,.18)";ctx.fillRect(rx+1,ry+1,rw-2,2);
    }
    // Separate side planes, plinth and recessed bays establish solid architecture.
    ctx.fillStyle="rgba(12,24,30,.24)";ctx.beginPath();ctx.ellipse(x+w*.5,ground+2,w*.58,7,0,0,Math.PI*2);ctx.fill();
    box(x,y+h*.24,w,h*.76,metal);
    box(x+w*.82,y+h*.24,w*.18,h*.76,electric?"#405665":"#584c42");
    box(x,y+h*.92,w,h*.08,electric?"#394c58":"#4c4841");
    if(!electric){
      ctx.strokeStyle="rgba(45,34,28,.23)";ctx.lineWidth=.7;
      for(var brick=0;brick<12;brick++){var by=y+h*(.28+brick*.055);ctx.beginPath();ctx.moveTo(x+4,by);ctx.lineTo(x+w*.8,by);ctx.stroke();for(var joint=0;joint<4;joint++){var jx=x+w*(.06+joint*.2+(brick%2)*.08);ctx.beginPath();ctx.moveTo(jx,by);ctx.lineTo(jx,by+h*.055);ctx.stroke();}}
    }

    ctx.strokeStyle="rgba(25,32,37,.24)";ctx.lineWidth=1;
    for(var plate=0;plate<6;plate++){var py=y+h*(.3+plate*.11);ctx.beginPath();ctx.moveTo(x,py);ctx.lineTo(x+w,py);ctx.stroke();}
    for(var rail=0;rail<2;rail++){var rx=x+w*(.03+rail*.91);box(rx,y+h*.24,w*.06,h*.76,electric?"#4d6574":"#57534e");for(var bolt=0;bolt<9;bolt++){ctx.fillStyle="#b8baa7";ctx.beginPath();ctx.arc(rx+w*.03,y+h*(.28+bolt*.08),1.2,0,Math.PI*2);ctx.fill();}}
    if(electric){
      ctx.fillStyle="#4a5d70";ctx.beginPath();ctx.moveTo(x,y+h*.25);ctx.lineTo(x+w*.2,y+h*.04);ctx.lineTo(x+w*.8,y+h*.04);ctx.lineTo(x+w,y+h*.25);ctx.closePath();ctx.fill();ctx.stroke();
      for(var k=0;k<2;k++){var ax=x+w*(.18+k*.64);box(ax-3,y,6,h*.3,"#445668");ctx.fillStyle=team;ctx.beginPath();ctx.ellipse(ax,y,9,5,0,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle="#6d8797";ctx.beginPath();ctx.ellipse(x+w*.5,y+h*.22,w*.3,h*.16,0,Math.PI,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.strokeStyle="#a3c7d2";ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x+w*.5,y+h*.22,w*.18,h*.16,0,Math.PI,Math.PI*2);ctx.stroke();
    }else{
      box(x+w*.12,y, w*.15,h*.3,"#555557");box(x+w*.65,y+h*.06,w*.16,h*.24,"#555557");
      for(var p=0;p<3;p++){ctx.fillStyle="rgba(202,193,176,.15)";ctx.beginPath();ctx.ellipse(x+w*.2+Math.sin(t*.5+p)*3,y-9-p*12,6+p*3,4+p*2,0,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle="#bbaa83";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+w*.1,y+h*.43);ctx.lineTo(x+w*.9,y+h*.43);ctx.stroke();
      ctx.fillStyle="#4c565c";ctx.beginPath();ctx.moveTo(x,y+h*.25);for(var tooth=0;tooth<3;tooth++){ctx.lineTo(x+w*(tooth/3+.25),y+h*.15);ctx.lineTo(x+w*(tooth/3+.25),y+h*.25);}ctx.lineTo(x+w,y+h*.25);ctx.closePath();ctx.fill();ctx.stroke();
    }
    box(x+w*.06,y+h*.31,w*.88,h*.10,electric?"#344e60":"#4a5051");
    box(x+w*.08,y+h*.32,w*.84,h*.06,team);
    ctx.fillStyle=electric?"#beded8":"#d3c29a";ctx.font="bold "+Math.max(8,w*.08)+"px Georgia";ctx.textAlign="center";ctx.fillText(electric?"IV":"III",x+w*.5,y+h*.369);
    // Copper plumbing and power conduits stay on the outer bays, clear of the crest.
    ctx.strokeStyle=electric?"#486273":"#665642";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+w*.12,y+h*.44);ctx.lineTo(x+w*.12,y+h*.84);ctx.lineTo(x+w*.28,y+h*.84);ctx.stroke();
    ctx.strokeStyle=electric?"#8fbfc2":"#ba9866";ctx.lineWidth=2;ctx.stroke();

    for(var row=0;row<3;row++)for(var col=0;col<3;col++){
      var wx=x+w*(.12+col*.28),wy=y+h*(.48+row*.12),ww=w*.16,wh=h*.065;
      box(wx-2,wy-2,ww+4,wh+4,electric?"#405866":"#51493e");
      box(wx,wy,ww,wh,electric?"#89b4be":"#bfa271");
      ctx.strokeStyle=electric?"#456575":"#665743";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(wx+ww*.5,wy);ctx.lineTo(wx+ww*.5,wy+wh);ctx.moveTo(wx,wy+wh*.5);ctx.lineTo(wx+ww,wy+wh*.5);ctx.stroke();
    }
    box(x+w*.35,ground-h*.23,w*.3,h*.23,"#25323c");
    for(var slat=0;slat<6;slat++){ctx.strokeStyle="#5c6871";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+w*.36,ground-h*(.03+slat*.035));ctx.lineTo(x+w*.64,ground-h*(.03+slat*.035));ctx.stroke();}
    ctx.strokeStyle=team;ctx.lineWidth=2;ctx.strokeRect(x+w*.37,ground-h*.21,w*.26,h*.21);
    if(level>=2){box(x+w*.05,ground-h*.2,w*.16,h*.2,"#485660");box(x+w*.79,ground-h*.2,w*.16,h*.2,"#485660");}
    if(level>=3){ctx.strokeStyle=team;ctx.beginPath();ctx.arc(x+w*.5,y+h*.2,w*.1,0,Math.PI*2);ctx.stroke();}
    if(c.hp<c.max*.65){ctx.strokeStyle="#252329";ctx.beginPath();ctx.moveTo(x+w*.73,y+h*.46);ctx.lineTo(x+w*.62,y+h*.57);ctx.lineTo(x+w*.71,y+h*.7);ctx.stroke();}
    // Mały, nieruchomy absurd tylko w finale: komin z muszką / antena z parasolem.
    if(level===4){ctx.fillStyle="#c4b18b";ctx.beginPath();ctx.moveTo(x+w*.18,y+9);ctx.lineTo(x+w*.1,y+4);ctx.lineTo(x+w*.1,y+14);ctx.closePath();ctx.fill();}
    ctx.restore();
  }
  function backdrop(ctx,w,gy,era){
    var e=era==="electric";
    ctx.save();
    // Two quiet depth layers. No particles, randomness or new per-frame objects.
    for(var layer=0;layer<2;layer++){
      ctx.globalAlpha=layer?.19:.09;ctx.fillStyle=e?"#1d344b":"#383e43";
      for(var i=0;i<6;i++){
        var x=w*(.16+i*.135)+layer*21,h=(28+(i%3)*16)*(layer?1:1.3),base=gy-(layer?18:45),bw=w*.055;
        ctx.fillRect(x,base-h,bw,h);
        if(e){
          ctx.beginPath();ctx.ellipse(x+bw*.5,base-h,bw*.5,9,0,Math.PI,Math.PI*2);ctx.fill();
          ctx.fillRect(x+bw*.48,base-h-25,2,25);
        }else{
          ctx.beginPath();ctx.moveTo(x,base-h);ctx.lineTo(x+bw*.45,base-h-12);ctx.lineTo(x+bw*.45,base-h);ctx.lineTo(x+bw*.85,base-h-10);ctx.lineTo(x+bw,base-h);ctx.closePath();ctx.fill();ctx.fillRect(x+bw*.72,base-h-30,5,30);
        }
      }
    }
    ctx.globalAlpha=.22;ctx.strokeStyle=e?"#567b8d":"#53554e";ctx.lineWidth=2;
    var railY=gy-18;ctx.beginPath();ctx.moveTo(w*.24,railY);ctx.lineTo(w*.78,railY);ctx.moveTo(w*.24,railY+5);ctx.lineTo(w*.78,railY+5);ctx.stroke();
    for(var k=0;k<9;k++){var rx=w*(.24+k*.0675);ctx.beginPath();ctx.moveTo(rx,railY);ctx.lineTo(rx+12,gy-5);ctx.stroke();}
    if(e){
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*.29,gy-83);ctx.quadraticCurveTo(w*.5,gy-34,w*.71,gy-83);ctx.stroke();
      for(var pole=0;pole<2;pole++){var px=w*(.29+pole*.42);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,gy-5);ctx.lineTo(px,gy-87);ctx.moveTo(px-8,gy-81);ctx.lineTo(px+8,gy-81);ctx.stroke();}
    }
    ctx.restore();
  }
  root.CASTLE_FUTURE={units:units,levels:levels,scenes:scenes,drawUnit:drawUnit,drawInfantry:drawInfantry,drawBase:drawBase,backdrop:backdrop};
})(window);
