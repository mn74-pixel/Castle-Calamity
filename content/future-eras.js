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

  function drawUnit(ctx,ud,x,y,dir,size,step,atk,moving,isP){
    var f=size/22,team=isP?"#639ee4":"#e07568",dark="#202b35",metal=ud.electric?"#adbfc6":"#a68b60";
    ctx.save();ctx.translate(x,y);ctx.scale(dir*f,f);ctx.lineWidth=1.3;ctx.strokeStyle=dark;ctx.lineJoin="round";
    function box(x,y,w,h,col){ctx.fillStyle=col;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);ctx.fillStyle="rgba(255,255,255,.17)";ctx.fillRect(x+1,y+1,w-2,1);}
    if(ud.cannon){
      box(-17,-8,34,7,dark);
      for(var w=-1;w<=1;w+=2){ctx.fillStyle="#53616a";ctx.beginPath();ctx.arc(w*12,-2,6,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=metal;ctx.beginPath();ctx.arc(w*12,-2,2,0,Math.PI*2);ctx.fill();}
      ctx.save();ctx.translate(-2,-13);ctx.rotate(ud.electric?-.32:-.75);box(-7,-6,30,12,metal);
      for(var r=0;r<3;r++)box(r*7,-8,3,16,ud.electric?"#72d3db":"#56616a");ctx.restore();
    }else{
      var stride=moving?Math.sin(step)*3.3:0;
      ctx.lineWidth=4;ctx.strokeStyle=dark;ctx.beginPath();ctx.moveTo(-4,-13);ctx.lineTo(-4-stride,-1);ctx.moveTo(4,-13);ctx.lineTo(4+stride,-1);ctx.stroke();
      var wide=ud.role==="steam"?11:7;
      box(-wide,-30,wide*2,18,metal);box(-wide,-27,wide*2,5,team);
      ctx.fillStyle=ud.role==="steam"?"#b19a71":"#d2ac83";ctx.beginPath();ctx.arc(0,-36,5.5,0,Math.PI*2);ctx.fill();ctx.lineWidth=1.2;ctx.stroke();
      ctx.fillStyle="#dfbb92";ctx.beginPath();ctx.moveTo(4,-37);ctx.lineTo(8,-34);ctx.lineTo(4,-32);ctx.closePath();ctx.fill();
      ctx.fillStyle="#191f29";ctx.fillRect(3,-37,1.5,1.5);ctx.fillRect(-8-stride,-2,7,3);ctx.fillRect(1+stride,-2,7,3);
      ctx.strokeStyle="rgba(255,255,255,.32)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-wide+2,-28);ctx.lineTo(-wide+2,-14);ctx.stroke();
      ctx.fillStyle="#e3d4ad";for(var button=0;button<3;button++){ctx.beginPath();ctx.arc(0,-21+button*3,1,0,Math.PI*2);ctx.fill();}
      box(-7,-42,14,5,dark);box(1,-37,5,2,ud.electric?"#9ceded":"#c4d5cb");
      ctx.strokeStyle=dark;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(5,-26);ctx.lineTo(12+Math.sin(atk*Math.PI)*3,-22);ctx.stroke();
      if(ud.role==="steam"){
        box(-16,-31,5,19,"#626b6c");box(-15,-40,3,9,dark);box(10,-24,10,8,metal);
        ctx.fillStyle="#e3c569";ctx.beginPath();ctx.arc(0,-18,3,0,Math.PI*2);ctx.fill();
      }else if(ud.role==="hammer"){
        ctx.save();ctx.translate(11,-24);ctx.rotate(-.4+Math.sin(atk*Math.PI)*.9);box(0,-15,3,25,"#695035");box(-5,-20,14,9,metal);ctx.restore();
      }else if(ud.role==="shield"){
        box(8,-29,12,21,"#556b7c");box(12,-26,4,15,team);
      }else if(ud.role==="medic"){
        box(7,-19,12,10,"#e4dfbd");ctx.fillStyle="#368573";ctx.fillRect(12,-18,2,8);ctx.fillRect(9,-15,8,2);
      }else{
        box(4-(atk>.65?2:0),-25,24,5,dark);box(15,-26,10,2,ud.electric?"#86e4e5":"#afbfba");
        if(atk>.8){ctx.fillStyle=ud.electric?"#b6ffff":"#ffe6a0";ctx.beginPath();ctx.arc(30,-23,3,0,Math.PI*2);ctx.fill();}
      }
    }
    ctx.restore();
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
    box(x,y+h*.24,w,h*.76,metal);
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
    box(x+w*.08,y+h*.32,w*.84,h*.08,team);
    for(var row=0;row<3;row++)for(var col=0;col<3;col++){
      box(x+w*(.12+col*.28),y+h*(.48+row*.12),w*.16,h*.065,electric?"#99b8bf":"#ccac6e");
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
    ctx.save();ctx.globalAlpha=.17;ctx.fillStyle="#273441";
    for(var i=0;i<5;i++){var x=w*(.22+i*.14),h=28+(i%3)*12;ctx.fillRect(x,gy-h-12,28,h);if(era==="industrial")ctx.fillRect(x+18,gy-h-35,5,25);else{ctx.beginPath();ctx.arc(x+14,gy-h-16,15,Math.PI,0);ctx.fill();}}
    ctx.restore();
  }
  root.CASTLE_FUTURE={units:units,levels:levels,scenes:scenes,drawUnit:drawUnit,drawBase:drawBase,backdrop:backdrop};
})(window);
