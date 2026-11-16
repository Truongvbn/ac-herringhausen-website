// Screenshot built pages of the new site. Usage: node tools/siteshots.js <baseUrl> <outDir> <path> [<path>...]
const { chromium } = require('playwright'); const fs=require('fs');
const [base,out,...paths]=process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
(async()=>{ const b=await chromium.launch();
 for(const [label,vp] of [['d',{width:1440,height:900}],['m',{width:390,height:844}]]){
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,hasTouch:label==='m',isMobile:label==='m'});
  for(const p of paths){ const pg=await ctx.newPage(); const errs=[];
   pg.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,140))}); pg.on('pageerror',e=>errs.push('PAGEERR '+e.message.slice(0,140)));
   const resp=await pg.goto(base+p,{waitUntil:'networkidle'}); await pg.waitForTimeout(400);
   const name=(p.replace(/^\/|\/$/g,'').replace(/\//g,'_')||'home');
   await pg.screenshot({path:`${out}/${name}.${label}.top.jpg`,type:'jpeg',quality:66});
   const h=await pg.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<h;y+=600){await pg.evaluate(y=>scrollTo(0,y),y);await pg.waitForTimeout(30);} await pg.evaluate(()=>scrollTo(0,0)); await pg.waitForTimeout(150);
   await pg.screenshot({path:`${out}/${name}.${label}.full.jpg`,type:'jpeg',quality:50,fullPage:true});
   const m=await pg.evaluate(()=>({o:document.documentElement.scrollWidth-innerWidth,h1:document.querySelector('h1')?.innerText.replace(/\s+/g,' '),ext:performance.getEntriesByType('resource').map(r=>new URL(r.name).host).filter(h=>h!==location.host)}));
   console.log(label,p,resp.status(),'overflow',m.o,'h',h,'h1:',m.h1,'ext:',[...new Set(m.ext)].join()||'-','errors',errs.length,errs.slice(0,2).join(' ; '));
   await pg.close(); }
  await ctx.close(); }
 await b.close(); })();
