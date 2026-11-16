// Crawl the built site: every internal link and anchor must resolve, every image must load.
const { chromium } = require('playwright');
const base=process.argv[2];
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1280,height:900}});
 const seen=new Set(['/']), queue=['/'], ids={}, links=[], bad=[]; let imgs=0;
 while(queue.length){ const p=queue.shift(); const pg=await ctx.newPage();
  const r=await pg.goto(base+p,{waitUntil:'load'}); if(!r||r.status()!==200){bad.push(`PAGE ${r&&r.status()} ${p}`); await pg.close(); continue;}
  const d=await pg.evaluate(async()=>{ document.querySelectorAll('img').forEach(i=>i.loading='eager');
    await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;})));
    return {ids:[...document.querySelectorAll('[id]')].map(e=>e.id),
      a:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),
      broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src')), n:document.images.length,
      lang:document.documentElement.lang, hre:[...document.querySelectorAll('link[hreflang]')].length, title:document.title, desc:document.querySelector('meta[name=description]')?.content?.length||0,
      h1:document.querySelectorAll('h1').length}; });
  ids[p]=new Set(d.ids); imgs+=d.n; d.broken.forEach(s=>bad.push(`IMG ${p} ${s}`));
  if(d.h1!==1) bad.push(`H1 count ${d.h1} on ${p}`); if(d.hre!==3) bad.push(`hreflang ${d.hre} on ${p}`); if(d.desc<50) bad.push(`short description on ${p}`);
  for(const h of d.a){ if(/^(https?:|mailto:|tel:)/.test(h)) continue; const u=new URL(h,base+p); const path=u.pathname, hash=u.hash.slice(1);
    links.push([p,path,hash]); if(!/\.(pdf|jpg|png|gif|xml)$/.test(path)&&!seen.has(path)){seen.add(path);queue.push(path);} }
  await pg.close(); }
 for(const [from,path,hash] of links){ if(/\.(pdf|jpg|png|gif|xml)$/.test(path)){ continue; }
   if(!ids[path]) bad.push(`LINK ${from} -> ${path} (no such page)`); else if(hash&&!ids[path].has(hash)) bad.push(`ANCHOR ${from} -> ${path}#${hash}`); }
 const files=[...new Set(links.filter(l=>/\.(pdf|jpg|png|gif|xml)$/.test(l[1])).map(l=>l[1]))];
 for(const f of files){ const r=await ctx.request.get(base+f); if(r.status()!==200) bad.push(`FILE ${r.status()} ${f}`); }
 console.log(`pages ${seen.size}, internal links ${links.length}, linked files ${files.length}, images ${imgs}`);
 console.log([...new Set(bad)].join('\n')||'no problems'); await b.close(); })();
