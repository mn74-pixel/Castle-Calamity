(function(root){
  'use strict';
  // All later fortresses share the medieval scale, outline and lighting language.
  // Cache only static architecture; portraits, damage and flags remain live.
  var cache=new Map(),INK='#26343e';
  function paint(ctx,era,player,level){
    var electric=era==='electric',steam=era==='industrial';
    var team=player?'#326db5':'#b3433d',light=player?'#9cc9ef':'#edb49a';
    var stone=electric?'#a0b7ba':steam?'#ad9272':'#c8b58d';
    var dark=electric?'#4f6872':steam?'#715b49':'#877658';
    var roof=electric?'#357c87':steam?'#456d72':player?'#426986':'#87504a';
    var gold=electric?'#bfd8ca':'#dbb572';
    ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=1.1;
    function poly(p,c,stroke){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(function(v){ctx.lineTo(v[0],v[1]);});ctx.closePath();ctx.fillStyle=c;ctx.fill();if(stroke!==false){ctx.strokeStyle=INK;ctx.lineWidth=1.1;ctx.stroke();}}
    function line(p,c,w){ctx.strokeStyle=c;ctx.lineWidth=w||1;ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);p.slice(1).forEach(function(v){ctx.lineTo(v[0],v[1]);});ctx.stroke();}
    function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);}
    function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.stroke();}
    function grad(x,w,c,d){var g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,c);g.addColorStop(.38,c);g.addColorStop(1,d);return g;}
    function masonry(x,y,w,h){
      rect(x,y,w,h,grad(x,w,stone,dark));
      ctx.save();ctx.beginPath();ctx.rect(x+1,y+1,w-2,h-2);ctx.clip();
      for(var row=0;row<h/11;row++){var yy=y+row*11;line([[x,yy],[x+w,yy]],'rgba(35,43,42,.27)',.7);line([[x,yy+1],[x+w,yy+1]],'rgba(255,244,211,.2)',.65);for(var xx=x+(row%2?12:0);xx<x+w;xx+=24)line([[xx,yy],[xx,yy+11]],'rgba(39,39,32,.24)',.65);}
      ctx.restore();
    }
    function ledge(x,y,w){rect(x,y,w,5,dark);rect(x-2,y-3,w+4,4,stone);line([[x-1,y-2],[x+w+1,y-2]],'#e0d5b4',.8);}
    function arch(x,y,w,h,c){ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,Math.PI*2);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.stroke();}
    function window(x,y,w,h){arch(x-2,y-2,w+4,h+4,dark);arch(x,y,w,h,'#263d48');line([[x+2,y+h-3],[x+w-2,y+h-3]],'#dcb777',2);line([[x+w/2,y+3],[x+w/2,y+h]],'#829897',1);line([[x+1,y+h*.55],[x+w-1,y+h*.55]],'#829897',1);}
    function battlement(x,y,w){ledge(x,y+7,w);for(var k=0;k<w-4;k+=14){rect(x+k,y,9,9,stone);line([[x+k+1,y+1],[x+k+8,y+1]],'#eddfb9',.8);}}
    function roofCap(x,y,w,h){poly([[x-5,y],[x+w*.5,y-h],[x+w+5,y]],roof);poly([[x+w*.5,y-h],[x+w*.66,y],[x+w+5,y]],'#304f60');line([[x-5,y+1],[x+w+5,y+1]],gold,2);for(var r=1;r<4;r++)line([[x-5+(w*.5+5)*r/4,y-h*r/4],[x+w+5-(w*.5+5)*r/4,y-h*r/4]],'rgba(10,30,40,.4)',.8);}
    function turret(x,y,w,h,cap){masonry(x,y,w,h);poly([[x+w-9,y],[x+w,y+4],[x+w,h+y],[x+w-9,h+y]],dark,false);ledge(x-1,y,w+2);ledge(x-1,y+h-10,w+2);window(x+w*.34,y+18,w*.26,19);if(h>105)window(x+w*.34,y+70,w*.26,22);if(cap)roofCap(x,y-3,w,22);else battlement(x-2,y-10,w+4);}
    // Rear silhouettes: varied height, unmistakable technology, no repeated office grid.
    if(steam){
      masonry(17,-269,21,158);rect(14,-273,27,8,dark);rect(16,-263,23,5,gold);
      masonry(158,-244,18,140);rect(155,-248,24,7,dark);
      for(var s=0;s<5;s++){rect(18,-252+s*24,19,3,'#78634e');}
      turret(60,-242,81,103,true);circle(101,-211,16,gold);circle(101,-211,12,'#ece2bd');line([[101,-220],[101,-211],[109,-206]],INK,1.8);
    }else if(electric){
      turret(64,-237,72,101,false);
      ctx.fillStyle=grad(69,62,'#71b0ac','#325965');ctx.beginPath();ctx.ellipse(100,-241,32,28,0,Math.PI,Math.PI*2);ctx.lineTo(132,-238);ctx.lineTo(68,-238);ctx.fill();ctx.strokeStyle=INK;ctx.stroke();
      line([[100,-269],[100,-289]],gold,2);circle(100,-290,4,'#c4e9d8');
      for(var d=-1;d<=1;d++)line([[100+d*7,-266],[100+d*20,-242]],'#90ccc2',1);
      for(var a=0;a<2;a++){var ax=a?171:29;rect(ax-4,-258,8,82,'#446471');for(var coil=0;coil<5;coil++){ctx.fillStyle=grad(ax-13,26,'#c5d0b1','#657f81');ctx.beginPath();ctx.ellipse(ax,-250+coil*9,13,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();}circle(ax,-265,7,'#9ecfc8');}
    }else{turret(62,-245,77,107,true);window(93,-229,15,24);battlement(71,-180,59);}
    // Main keep and projecting corner towers, with the portrait built into its face.
    masonry(29,-170,142,170);ledge(29,-170,142);battlement(36,-181,128);
    poly([[157,-165],[177,-155],[177,0],[157,0]],dark);
    if(steam){
      // Rounded riveted boiler gives the foundry a different silhouette from a stone fort.
      rect(2,-153,43,153,grad(2,43,"#88a29a","#3d646b"));
      ctx.fillStyle=grad(2,43,"#9bb0a0","#426971");ctx.beginPath();ctx.ellipse(23.5,-153,21.5,19,0,Math.PI,Math.PI*2);ctx.fill();ctx.strokeStyle=INK;ctx.stroke();
      for(var band=0;band<4;band++){var yy=-142+band*39;rect(1,yy,45,5,"#b49562");for(var rivet=0;rivet<4;rivet++)circle(6+rivet*11,yy+2.5,.8,"#ebd6a6");}
      rect(17,-119,13,46,"#2b4951");rect(21,-115,5,38,"#adc9b3");circle(24,-52,11,gold);circle(24,-52,8,"#ece2bd");line([[24,-52],[29,-57]],INK,1.3);
      turret(155,-163,43,163,false);roofCap(154,-170,45,12);
    }else{turret(2,-156,43,156,true);turret(155,-163,43,163,true);}
    if(electric){for(var fin=0;fin<2;fin++){var fx=fin?179:21;poly([[fx-11,-158],[fx,-185],[fx+11,-158]],"#5d9e9f");line([[fx,-181],[fx,-163]],"#bfe3c8",1.2);}}

    // Brass pipes / stone buttresses stay clear of the central heraldic recess.
    for(var side=0;side<2;side++){
      var bx=side?148:48;
      if(steam||electric){line([[bx,-149],[bx,-44],[bx+(side?-7:7),-37]],INK,6);line([[bx,-149],[bx,-44],[bx+(side?-7:7),-37]],electric?'#779aa5':'#c29963',3);for(var j=0;j<3;j++)line([[bx-3,-123+j*30],[bx+3,-123+j*30]],gold,1.7);}
      else{poly([[bx-4,0],[bx-4,-136],[bx+2,-145],[bx+7,-126],[bx+7,0]],stone);}
    }
    // Recessed heraldic banner: reserved for the player's own original photograph.
    poly([[61,-157],[139,-157],[139,-93],[100,-79],[61,-93]],dark);
    poly([[65,-155],[135,-155],[135,-96],[100,-84],[65,-96]],gold);
    poly([[68,-151],[132,-151],[132,-98],[100,-88],[68,-98]],team);
    line([[65,-156],[135,-156]],'#eee1b5',2);
    for(var stud=0;stud<2;stud++){circle(65+70*stud,-153,2,gold);circle(65+70*stud,-96,2,gold);}
    // Default heraldry is covered when an uploaded picture is present.
    poly([[100,-139],[107,-122],[124,-120],[111,-109],[114,-93],[100,-101],[86,-93],[89,-109],[76,-120],[93,-122]],light);
    // Gate vault with separate voussoirs, iron hardware and steps.
    arch(69,-76,62,76,dark);arch(74,-70,52,70,'#17272e');arch(79,-64,42,64,grad(79,42,steam?'#556269':'#82613f','#28343b'));
    for(var v=0;v<7;v++){var ang=Math.PI+v*Math.PI/6;line([[100+27*Math.cos(ang),-45+27*Math.sin(ang)],[100+33*Math.cos(ang),-45+33*Math.sin(ang)]],stone,5);}
    for(var sl=0;sl<5;sl++)line([[83+sl*8,-45],[83+sl*8,-5]],'#27323a',1.2);
    line([[80,-38],[120,-38]],'#b49a71',3);line([[80,-17],[120,-17]],'#b49a71',3);circle(111,-30,2,gold);
    for(var lamp=0;lamp<2;lamp++){var lx=lamp?139:61;rect(lx-3,-58,6,10,'#293b44');rect(lx-2,-56,4,6,electric?'#b9eee2':'#ffe2a0');line([[lx-4,-60],[lx+4,-60]],gold,1.6);}
    ledge(0,-6,200);rect(74,-4,52,4,'#938b73');
    // Level growth: discreet additions, never a larger obstruction on the field.
    if(level>=2){for(var b=0;b<2;b++){var xx=b?164:14;rect(xx,-66,21,17,team);line([[xx+3,-62],[xx+18,-62]],gold,1);}}
    if(level>=3){for(var gun=0;gun<2;gun++){var gx=gun?164:13;circle(gx+9,-157,5,'#283b45');poly([[gx,-160],[gx+22,-166],[gx+24,-160],[gx+3,-153]],'#526674');}}
    if(level>=4){line([[72,-247],[72,-270]],gold,1.3);poly([[73,-269],[92,-265],[73,-260]],team);}
  }
  function drawBase(ctx,c,ground,era,level,t){
    var key=era+':'+c.isP+':'+level,sprite=cache.get(key);
    if(!sprite){sprite=document.createElement('canvas');sprite.width=624;sprite.height=900;var sc=sprite.getContext('2d');sc.scale(3,3);sc.translate(4,296);paint(sc,era,c.isP,level);cache.set(key,sprite);if(cache.size>4)cache.delete(cache.keys().next().value);}
    ctx.save();
    if(c.collapseT){ctx.globalAlpha=Math.max(0,1-c.collapseT);ctx.translate(0,c.collapseT*c.h*.25);}
    var sx=c.w/200,sy=c.h/260;
    ctx.drawImage(sprite,c.x-4*sx,ground-296*sy,208*sx,300*sy);
    ctx.translate(c.x,ground);ctx.scale(sx,sy);
    // Short flag motion only; architecture remains pixel-stable.
    var color=c.isP?'#508cd3':'#cb5e54',wave=Math.sin(t*2.2)*2;
    ctx.strokeStyle='#cdb782';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(111,-268);ctx.lineTo(111,-295);ctx.stroke();
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(112,-295);ctx.quadraticCurveTo(125,-300+wave,139,-292+wave);ctx.lineTo(139,-281+wave);ctx.quadraticCurveTo(125,-288+wave,112,-283);ctx.closePath();ctx.fill();ctx.strokeStyle='#263c51';ctx.lineWidth=.7;ctx.stroke();
    if(c.hp<c.max*.65){ctx.strokeStyle='#384048';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(149,-121);ctx.lineTo(141,-105);ctx.lineTo(147,-94);ctx.lineTo(139,-82);ctx.stroke();}
    if(c.hp<c.max*.3){ctx.fillStyle='#34404a';ctx.beginPath();ctx.moveTo(12,-155);ctx.lineTo(19,-138);ctx.lineTo(30,-152);ctx.fill();}
    ctx.restore();
  }
  function clouds(ctx,items,gy,t,sc){
    var scale=Math.min(1,gy/590);
    ctx.save();
    items.forEach(function(cl,i){
      var x=cl.x,y=Math.min(gy*.5,cl.y*scale),w=cl.rw*.82*scale,h=cl.rh*scale;
      y+=Math.sin(t*.1+i)*scale;
      ctx.globalAlpha=sc.night?.075:.23;
      ctx.fillStyle=sc.night?'#c6d8e7':sc.dusk?'#f8d5b4':'#eff3de';
      // One opaque silhouette per cloud avoids overlapping transparent ellipse rings.
      ctx.beginPath();ctx.moveTo(x-w,y+h*.3);
      ctx.bezierCurveTo(x-w*1.2,y-h*.2,x-w*.7,y-h*.65,x-w*.48,y-h*.35);
      ctx.bezierCurveTo(x-w*.5,y-h*1.4,x+w*.08,y-h*1.5,x+w*.25,y-h*.65);
      ctx.bezierCurveTo(x+w*.55,y-h*.95,x+w*.75,y-h*.55,x+w*.74,y-h*.15);
      ctx.bezierCurveTo(x+w*1.15,y-h*.1,x+w*1.1,y+h*.5,x+w*.75,y+h*.55);
      ctx.bezierCurveTo(x+w*.15,y+h*.75,x-w*.8,y+h*.6,x-w,y+h*.3);ctx.closePath();ctx.fill();
    });ctx.restore();
  }
  function landscape(ctx,w,gy,era,level,sc){
    var scale=Math.min(1,gy/590),night=!!sc.night;
    ctx.save();
    for(var layer=0;layer<3;layer++){
      var top=gy-(145-layer*47)*scale,amplitude=(37-layer*8)*scale;
      var g=ctx.createLinearGradient(0,top-amplitude,0,gy);
      g.addColorStop(0,night?['#667995','#476275','#284c54'][layer]:['#8ba8ab','#628b87','#42695d'][layer]);g.addColorStop(1,night?'#293e4d':'#779781');
      ctx.fillStyle=g;ctx.globalAlpha=.45+layer*.12;ctx.beginPath();ctx.moveTo(-w*.1,gy);
      for(var k=-1;k<6;k++){var x=k*w*.22,yy=top+Math.sin(k*1.7+level*.8+layer)*amplitude;if(k===-1)ctx.lineTo(x,yy);ctx.bezierCurveTo(x+w*.08,yy-amplitude,x+w*.14,top+amplitude,x+w*.22,top+Math.sin((k+1)*1.7+level*.8+layer)*amplitude);}
      ctx.lineTo(w,gy);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
  function backdrop(ctx,w,gy,era,level){
    ctx.save();ctx.globalAlpha=.19;ctx.fillStyle=era==='electric'?'#548796':'#345d70';
    for(var i=0;i<7;i++){
      var x=w*(.15+i*.115),y=gy-23-(i%3)*9,h=24+((i*13+level*7)%31),bw=24+(i%3)*9;
      ctx.fillRect(x,y-h,bw,h);ctx.beginPath();ctx.moveTo(x-4,y-h);ctx.lineTo(x+bw*.5,y-h-14);ctx.lineTo(x+bw+4,y-h);ctx.fill();
      if(era==='industrial'&&i%2===0)ctx.fillRect(x+4,y-h-25,6,30);
      if(era==='electric'){ctx.beginPath();ctx.arc(x+bw*.5,y-h,bw*.45,Math.PI,Math.PI*2);ctx.fill();}
    }
    // Distant viaduct, varying with the battle, remains behind resource trees.
    if(level%2===0){ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(w*.26,gy-39);ctx.lineTo(w*.75,gy-39);ctx.stroke();for(var j=0;j<6;j++){var ax=w*(.26+j*.085);ctx.beginPath();ctx.arc(ax+22,gy-2,22,Math.PI,Math.PI*2);ctx.stroke();}}
    ctx.restore();
  }
  if(root.CASTLE_FUTURE){var s=root.CASTLE_FUTURE.scenes;Object.assign(s[0],{s1:'#386c90',s2:'#d4d8b1',g1:'#658650',g2:'#354d39'});Object.assign(s[1],{s1:'#455d85',s2:'#e5b482',g1:'#77814d',g2:'#3c5039'});Object.assign(s[2],{s1:'#142a4c',s2:'#6eafb5',g1:'#527a65',g2:'#283f42'});Object.assign(s[3],{s1:'#273660',s2:'#b29db9',g1:'#627d70',g2:'#30474c'});}
  root.CASTLE_ERA_ART={drawBase:drawBase,backdrop:backdrop,clouds:clouds,landscape:landscape,paint:paint};
})(window);
