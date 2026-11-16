const { chromium } = require('playwright'); const B='http://localhost:4477/artifact-build/';
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); const seen=new Set(['index.html']), q=['index.html']; const bad=[]; let n=0;
 while(q.length){ const rel=q.shift(); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('requestfailed',r=>errs.push('REQ '+r.url()));
  const r=await p.goto(B+rel,{waitUntil:'load'}); if(r.status()!==200){bad.push('PAGE '+rel);continue;}
  const d=await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager'); await Promise.all([...document.images].map(i=>i.complete||!i.src?0:new Promise(r=>{i.onload=i.onerror=r})));
   return {a:[...document.querySelectorAll('a[href]')].map(a=>a.href), broken:[...document.images].filter(i=>i.src&&!i.naturalWidth).length, font:getComputedStyle(document.querySelector('h1')).fontFamily, bg:getComputedStyle(document.body).backgroundColor, fontsOk:[...document.fonts].filter(f=>f.status==='loaded').length}});
  n++; if(d.broken) bad.push(`IMG x${d.broken} ${rel}`); if(errs.length) bad.push(`ERR ${rel} ${errs[0]}`); if(rel==='index.html') console.log('home:',d.bg,d.font.slice(0,30),'fonts loaded',d.fontsOk);
  for(const h of d.a){ if(!h.startsWith(B)) { if(h.startsWith('http://localhost')) bad.push(`ESCAPES ${rel} -> ${h}`); continue; } const u=h.slice(B.length).split('#')[0]; if(u.endsWith('.html')&&!seen.has(u)){seen.add(u);q.push(u);} }
  await p.close(); }
 console.log('pages reached',n, [...new Set(bad)].join('\n')||'no problems'); await b.close(); })();
