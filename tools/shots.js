// Open every real page in Chromium: full-page screenshot (desktop + phone) and a log of every network request.
// Usage: node tools/shots.js <out_dir>
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2];
const B = 'https://www.ac-herringhausen.de';
const pages = ['/Start.html','/aktuelles.html','/ueber-uns.html','/termine-2023.html','/ausschreibungen.html',
 '/abteilungen/vorstand.html','/jugend---kart---slalom.html','/abteilungen/clubsport-slalom.html','/abteilungen/oldtimer-rallye.html',
 '/gallery447728.html','/gallery447725.html','/downloads.html','/partner-links.html','/impressum.html',
 '/kontakt.html','/guestbook.html','/sitemap.html','/login.html'];
(async () => {
  fs.mkdirSync(path.join(out,'shots'),{recursive:true});
  const browser = await chromium.launch();
  const net = {}, cookies = {};
  for (const [label, opts] of [['desktop',{viewport:{width:1440,height:900}}],['phone',devices['iPhone 13']]]) {
    const ctx = await browser.newContext(opts);
    for (const p of pages) {
      const page = await ctx.newPage();
      const reqs = [];
      page.on('response', r => reqs.push({url:r.url(), status:r.status(), type:r.request().resourceType(), method:r.request().method()}));
      page.on('requestfailed', r => reqs.push({url:r.url(), status:'FAILED '+(r.failure()||{}).errorText, type:r.resourceType(), method:r.method()}));
      const name = p.replace(/^\//,'').replace(/[\/]/g,'__').replace('.html','');
      try {
        await page.goto(B+p,{waitUntil:'networkidle',timeout:45000});
        await page.waitForTimeout(800);
        await page.screenshot({path:path.join(out,'shots',`${name}.${label}.jpg`),fullPage:true,type:'jpeg',quality:70});
      } catch(e){ reqs.push({url:B+p,status:'ERROR '+e.message.slice(0,120)}); }
      if (label==='desktop') net[p]=reqs;
      await page.close();
      console.log(label,p,reqs.length);
    }
    if (label==='desktop') cookies.all = await ctx.cookies();
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out,'network.json'),JSON.stringify({net,cookies},null,1));
  const hosts={};
  for (const [p,rs] of Object.entries(net)) for (const r of rs){ let h; try{h=new URL(r.url).host}catch{continue}; (hosts[h]=hosts[h]||new Set()).add(p); }
  for (const [h,s] of Object.entries(hosts)) console.log('HOST',h,s.size,'pages');
  console.log('COOKIES',cookies.all.map(c=>`${c.name}@${c.domain}`).join(', '));
})();
