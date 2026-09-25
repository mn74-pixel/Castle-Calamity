// Visual contact sheet for the procedural infantry renderer.
const fs=require('fs'),vm=require('vm'),path=require('path');
const {createCanvas}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),window={CASTLE_ERAS:{packs:{}},CASTLE_I18N:{pl:{},en:{}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'content/future-eras.js'),'utf8'),{window});
const art=window.CASTLE_FUTURE,canvas=createCanvas(1440,780),c=canvas.getContext('2d');
c.fillStyle='#182731';c.fillRect(0,0,1440,780);
const rows=[['warrior','pikeman','crossbow','berserk','templar','drwal'],['pikeguard','musketeer','sapper'],['riveter','rifleman','steamguard'],['voltguard','pulser','fieldmedic']];
rows.forEach((keys,row)=>{c.fillStyle='#b7c8cb';c.font='16px sans-serif';c.fillText(['I · Stal i skóra','II · Proch i sukno','III · Para i żelazo','IV · Miedź i emalia'][row],22,28+row*190);keys.forEach((key,i)=>{const x=105+i*220,y=170+row*190;c.fillStyle='#233641';c.fillRect(x-78,y-127,174,141);art.drawInfantry(c,key,x,y,1,52,1,.0,true,true);c.fillStyle='#c9d6d5';c.font='13px sans-serif';c.fillText(key,x-45,y+30);});});
fs.mkdirSync(path.join(__dirname,'renders'),{recursive:true});fs.writeFileSync(path.join(__dirname,'renders/art-v72.png'),canvas.toBuffer('image/png'));
