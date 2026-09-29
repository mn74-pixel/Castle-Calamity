(function(root){
  'use strict';
  var clamp=function(v,a,b){return Math.max(a,Math.min(b,v));};
  function valid(r){return !!(r&&r.version===1&&r.mouth&&Number.isFinite(r.mouth.x)&&Number.isFinite(r.mouth.y)&&r.mouth.x>=.1&&r.mouth.x<=.9&&r.mouth.y>=.3&&r.mouth.y<=.94);}
  function fallback(){return {version:1,mouth:{x:.5,y:.70},method:'estimate'};}
  // A local colour/contrast heuristic, NOT a landmark ML model. The editor
  // always exposes its estimate so profiles, beards and unusual light are correctable.
  function detect(source,doc){
    try{
      var c=doc.createElement('canvas');c.width=c.height=96;var ctx=c.getContext('2d');ctx.drawImage(source,0,0,96,96);
      var p=ctx.getImageData(0,0,96,96).data,best=0,bx=48,by=67;
      function lum(x,y){var i=(y*96+x)*4;return .299*p[i]+.587*p[i+1]+.114*p[i+2];}
      for(var y=53;y<=79;y++)for(var x=30;x<=66;x++){
        var score=0;
        for(var dx=-5;dx<=5;dx++){var i=(y*96+x+dx)*4;if(p[i+3]<220)continue;var contrast=(lum(x+dx,y-4)+lum(x+dx,y+4))*.5-lum(x+dx,y);score+=Math.max(0,contrast)+Math.max(0,p[i]-p[i+1]-12)*.35;}
        score*=1-Math.abs(x-48)/45;score*=1-Math.abs(y-67)/50;
        if(score>best){best=score;bx=x;by=y;}
      }
      return best>65?{version:1,mouth:{x:bx/96,y:by/96},method:'contrast'}:fallback();
    }catch(e){return fallback();}
  }
  function contour(ctx,size){ctx.beginPath();ctx.moveTo(size*.5,size*.025);ctx.bezierCurveTo(size*.13,-size*.01,size*.07,size*.22,size*.12,size*.48);ctx.bezierCurveTo(size*.14,size*.76,size*.30,size*.94,size*.5,size*.97);ctx.bezierCurveTo(size*.70,size*.94,size*.86,size*.76,size*.88,size*.48);ctx.bezierCurveTo(size*.93,size*.22,size*.87,-size*.01,size*.5,size*.025);ctx.closePath();}
  // Optional edge-connected colour key. Only colours sampled from the outer
  // perimeter are removable; a protected central face region is never erased.
  function removeBackdrop(canvas){
    var ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,data=ctx.getImageData(0,0,w,h),p=data.data,seeds=[],seen=new Uint8Array(w*h),queue=new Int32Array(w*h),head=0,tail=0;
    for(var y=0;y<h;y+=Math.max(1,Math.floor(h/16)))for(var x of [0,w-1]){var i=(y*w+x)*4;if(p[i+3]>240)seeds.push([p[i],p[i+1],p[i+2]]);}
    for(var x=0;x<w;x+=Math.max(1,Math.floor(w/16)))for(var y of [0,h-1]){var i=(y*w+x)*4;if(p[i+3]>240)seeds.push([p[i],p[i+1],p[i+2]]);}
    function offer(x,y){if(x<0||y<0||x>=w||y>=h)return;var n=y*w+x;if(seen[n])return;seen[n]=1;if(Math.pow((x/w-.5)/.27,2)+Math.pow((y/h-.52)/.38,2)<1)return;var i=n*4;if(p[i+3]>0&&!seeds.some(function(s){return Math.max(Math.abs(p[i]-s[0]),Math.abs(p[i+1]-s[1]),Math.abs(p[i+2]-s[2]))<27;}))return;queue[tail++]=n;}
    for(var x=0;x<w;x++){offer(x,0);offer(x,h-1);}for(var y=0;y<h;y++){offer(0,y);offer(w-1,y);}
    while(head<tail){var n=queue[head++],x=n%w,y=Math.floor(n/w);p[n*4+3]=0;offer(x-1,y);offer(x+1,y);offer(x,y-1);offer(x,y+1);}
    ctx.putImageData(data,0,0);
  }
  function mouth(img,angle,pulse,dir){var r=img&&valid(img.faceRig)?img.faceRig:fallback(),w=img&&(img.naturalWidth||img.width)||320,h=img&&(img.naturalHeight||img.height)||320,scale=Math.min(32/w,36/h),x=(r.mouth.x-.5)*w*scale,y=(r.mouth.y-.5)*h*scale;if(img&&pulse>.001){var q=(Math.floor(r.mouth.y*16)+.5)/16,curve=Math.sin(q*Math.PI);x-=dir*curve*pulse*1.8+r.mouth.x*w*scale*pulse*.05*curve;}return {x:100+x*Math.cos(angle)-y*Math.sin(angle),y:-139+x*Math.sin(angle)+y*Math.cos(angle)};}
  function grip(point,angle){return {x:point.x-16*.74*Math.sin(angle),y:point.y+16*.74*Math.cos(angle)+4};}
  // Sixteen strips give the photo itself a short squash/recoil, without
  // painting a second pair of eyes or a mouth over someone's real features.
  function react(ctx,img,drawFace,pulse,dir){
    if(pulse<=.001){drawFace(ctx,img,-16,-18,32,36,0);return;}
    var w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
    if(!w||!h){drawFace(ctx,img,-16,-18,32,36,0);return;}
    var scale=Math.min(32/w,36/h),dw=w*scale,dh=h*scale;
    for(var i=0;i<16;i++){var q=(i+.5)/16,shift=-dir*Math.sin(q*Math.PI)*pulse*1.8;ctx.drawImage(img,0,i*h/16,w,h/16,-dw/2+shift,-dh/2+i*dh/16,dw*(1-pulse*.05*Math.sin(q*Math.PI)),dh/16+.06);}
  }
  root.CASTLE_FACE_RIG={valid:valid,detect:detect,fallback:fallback,contour:contour,removeBackdrop:removeBackdrop,mouth:mouth,grip:grip,react:react};
})(window);
