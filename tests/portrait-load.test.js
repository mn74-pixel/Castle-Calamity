const assert=require('assert/strict');
const fs=require('fs');
const vm=require('vm');
const html=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const loader=html.slice(html.indexOf('var CREST_LOAD_SERIAL='),html.indexOf('function renderCrestPreview('));
const reset=html.slice(html.indexOf('function resetCrest('),html.indexOf('(function initCrestUI('));
const pending=new Map(),images=[],closed=[],busy=[];
let saves=0;
const scope={LANG:'pl',PLAYER_CREST:null,ENEMY_CREST:null,CREST_MAX_FILE_SIZE:1e6,
  isLikelyCrestFile:()=>true,setCrestBusy:(side,state)=>busy.push([side,state]),setCrestStatus:()=>{},
  decodeCrestFile:file=>new Promise((resolve,reject)=>pending.set(file.name,{resolve,reject})),
  extractFaceImage:source=>Promise.resolve({box:{name:source.name}}),
  confirmPortrait:(source)=>Promise.resolve({toDataURL:()=>source.name,faceRig:{version:1,mouth:{x:.5,y:.7}}}),
  Image:function(){images.push(this);},renderCrestPreview:()=>{},saveCrestToStorage:()=>saves++};
vm.createContext(scope);vm.runInContext(loader+'\n'+reset,scope);
const source=name=>({name,close:()=>closed.push(name)});
async function flush(){for(let i=0;i<8;i++)await Promise.resolve();}
(async()=>{
  scope.processCrestImage({name:'old',size:20},true);scope.processCrestImage({name:'new',size:20},true);
  pending.get('old').resolve(source('old'));await flush();assert.deepEqual(closed,['old']);assert.equal(images.length,0);
  pending.get('new').resolve(source('new'));await flush();assert.equal(images.length,1);images[0].onload();assert.equal(scope.PLAYER_CREST.src,'new');assert.equal(saves,1);
  scope.processCrestImage({name:'reset-later',size:20},true);pending.get('reset-later').resolve(source('reset-later'));await flush();scope.resetCrest(true);images[1].onload();assert.equal(scope.PLAYER_CREST,null);assert.equal(saves,2);
  scope.processCrestImage({name:'failed-old',size:20},false);scope.processCrestImage({name:'latest',size:20},false);const count=busy.length;pending.get('failed-old').reject(Error('old request'));await flush();assert.equal(busy.length,count,'stale failure must not unlock a newer request');
  pending.get('latest').resolve(source('latest'));await flush();images[2].onload();assert.equal(scope.ENEMY_CREST.src,'latest');
  console.log('OK Portrait loading: stale decodes/failures ignored, reset blocks late image application, both sides independent');
})().catch(error=>{console.error(error);process.exitCode=1;});
