const { chromium } = require('playwright'); const path=require('path'), fs=require('fs');
const idx='file://'+encodeURI(path.resolve(process.argv[2],'index.html')), out=path.resolve(process.argv[3]);
fs.mkdirSync(out,{recursive:true});
// wrap like the artifact skeleton does
(async()=>{ const b=await chromium.launch();
 for(const [label,vp] of [['d',{width:1440,height:900}],['m',{width:390,height:844}]]){
  for(const k of ['broadcast','heritage','pitboard','technik']){
   const p=await b.newPage({viewport:vp}); const errs=[];
   p.on('console',m=>{ if(m.type()==='error') errs.push(m.text().slice(0,160)); });
   p.on('pageerror',e=>errs.push('PAGEERR '+e.message.slice(0,160)));
   await p.goto(idx+'#'+k,{waitUntil:'networkidle'}); await p.waitForTimeout(700);
   await p.screenshot({path:`${out}/${k}.${label}.top.jpg`,type:'jpeg',quality:68});
   const m1=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth,h:document.documentElement.scrollHeight,
     vis:[...document.querySelectorAll('.dir')].filter(s=>!s.hidden).map(s=>s.id)}));
   // scroll through to trigger effects, then full page
   for(let y=0;y<m1.h;y+=500){ await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(40); }
   const mid=Math.round(m1.h*0.45); await p.evaluate(y=>scrollTo(0,y),mid); await p.waitForTimeout(300);
   await p.screenshot({path:`${out}/${k}.${label}.mid.jpg`,type:'jpeg',quality:68});
   await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(200);
   await p.screenshot({path:`${out}/${k}.${label}.full.jpg`,type:'jpeg',quality:55,fullPage:true});
   const h1de=await p.evaluate(k=>document.querySelector('#dir-'+k+' h1')?.innerText.replace(/\s+/g,' ').slice(0,60),k);
   await p.click('#host-lang'); await p.waitForTimeout(150);
   const h1en=await p.evaluate(k=>document.querySelector('#dir-'+k+' h1')?.innerText.replace(/\s+/g,' ').slice(0,60),k);
   const m2=await p.evaluate(()=>({sw:document.documentElement.scrollWidth}));
   console.log(label,k,'overflow',m1.sw-m1.iw,'/',m2.sw-m1.iw,'height',m1.h,'visible',m1.vis.join(),'| DE:',h1de,'| EN:',h1en,'| errors',errs.length,errs.slice(0,3).join(' ; '));
   await p.close(); } }
 await b.close(); })();
