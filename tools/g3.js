const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.goto('http://localhost:4391/'); await p.waitForTimeout(400);
 const top=await p.evaluate(()=>document.querySelector('[data-gal3d]').getBoundingClientRect().top+scrollY);
 for(const [i,off] of [[1,60],[2,600],[3,1100]]){ await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top+off); await p.waitForTimeout(700);
  const m=await p.evaluate(()=>({hd:document.querySelector('.hd').getBoundingClientRect().top, st:document.querySelector('.gal-stage').getBoundingClientRect().top, y:scrollY}));
  console.log(i,JSON.stringify(m)); await p.screenshot({path:`site-check/x-gal3d-${i}.jpg`,type:'jpeg',quality:60}); }
 await b.close(); })();
