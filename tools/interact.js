// Exercise the interactive parts of the built site.
const { chromium } = require('playwright'); const B=process.argv[2]; const out=process.argv[3];
const ok=(n,c,x='')=>console.log((c?'PASS ':'FAIL ')+n+(x?'  '+x:''));
(async()=>{ const b=await chromium.launch();
 // phone
 let ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}); let p=await ctx.newPage();
 await p.goto(B+'/'); await p.click('.hbtn.menu'); await p.waitForTimeout(150);
 ok('mobile menu opens', await p.isVisible('#sheet a')); await p.screenshot({path:out+'/x-menu.m.jpg',type:'jpeg',quality:65});
 await p.keyboard.press('Escape'); ok('menu closes on Escape', !(await p.isVisible('#sheet a')));
 ok('phone gallery is a swipe strip, not pinned', !(await p.evaluate(()=>document.querySelector('[data-gal3d]').classList.contains('is-3d'))));
 await p.goto(B+'/jugend-kart-slalom/#klassen'); await p.click('[data-cls] button:nth-of-type(3)');
 ok('class picker shows text', (await p.textContent('[data-cls-out]')).trim().length>10, JSON.stringify((await p.textContent('[data-cls-out]')).trim().slice(0,70)));
 await p.goto(B+'/kontakt/'); await p.click('[data-form] button[type=submit]'); await p.waitForTimeout(100);
 ok('empty form shows errors', (await p.locator('[data-form] .err:visible').count())>=4, 'visible errors: '+await p.locator('[data-form] .err:visible').count());
 await p.fill('[name=name]','Test Person'); await p.fill('[name=email]','test@example.com'); await p.fill('[name=betreff]','Probetraining'); await p.fill('[name=nachricht]','Hallo, dies ist ein Test.'); await p.check('[name=einwilligung]');
 const reqs=[]; p.on('request',r=>{ if(r.method()!=='GET') reqs.push(r.url()); });
 await p.click('[data-form] button[type=submit]'); await p.waitForTimeout(200);
 ok('valid form: honest "not connected" note, nothing sent', await p.isVisible('[data-form] .f-note') && reqs.length===0, (await p.textContent('[data-form] .f-note')).trim().slice(0,60));
 await p.screenshot({path:out+'/x-form.m.jpg',type:'jpeg',quality:65});
 await p.goto(B+'/galerie/'); await p.click('#jugend-kart .gal-grid a >> nth=4'); await p.waitForTimeout(400);
 ok('lightbox opens', await p.isVisible('.lb.open img'), (await p.textContent('.lb .n')).trim());
 await p.screenshot({path:out+'/x-lightbox.m.jpg',type:'jpeg',quality:65});
 await p.keyboard.press('ArrowRight'); await p.waitForTimeout(250); const n2=(await p.textContent('.lb .n')).trim();
 await p.keyboard.press('Escape'); await p.waitForTimeout(150); ok('lightbox next + close', /6/.test(n2) && !(await p.isVisible('.lb.open')), n2);
 await ctx.close();
 // desktop
 ctx=await b.newContext({viewport:{width:1440,height:900}}); p=await ctx.newPage(); const ext=[];
 p.on('request',r=>{ const h=new URL(r.url()).host; if(!h.startsWith('localhost')) ext.push(h); });
 await p.goto(B+'/'); await p.waitForTimeout(300);
 const is3d=await p.evaluate(()=>document.querySelector('[data-gal3d]').classList.contains('is-3d')); ok('desktop gallery is the 3D strip', is3d);
 await p.evaluate(()=>{const g=document.querySelector('[data-gal3d]'); scrollTo(0, g.getBoundingClientRect().top+scrollY+500);}); await p.waitForTimeout(500);
 await p.screenshot({path:out+'/x-gal3d.d.jpg',type:'jpeg',quality:65});
 ok('3D strip transforms photos', (await p.evaluate(()=>document.querySelector('.gal-track li').style.transform)).includes('rotateY'));
 ok('start lights follow scroll', (await p.locator('.lights i.on').count())>0);
 ok('no third-party request before map click', ext.length===0);
 await p.goto(B+'/verein/#aktuelles'); await p.click('[data-map-load]'); await p.waitForTimeout(2500);
 ok('map loads only after click', await p.isVisible('.map.loaded iframe'), 'hosts after click: '+[...new Set(ext)].join(','));
 await p.screenshot({path:out+'/x-map.d.jpg',type:'jpeg',quality:65});
 // reduced motion
 const c3=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}); const p3=await c3.newPage(); await p3.goto(B+'/');
 ok('reduced motion: no 3D strip', !(await p3.evaluate(()=>document.querySelector('[data-gal3d]').classList.contains('is-3d'))));
 // 360px
 const c4=await b.newContext({viewport:{width:360,height:740}}); const p4=await c4.newPage(); let worst=0,where='';
 for(const u of ['/','/termine/','/verein/','/jugend-kart-slalom/','/clubsport-slalom/','/oldtimer-rallye/','/galerie/','/mitglied-werden/','/partner/','/kontakt/','/gaestebuch/','/sitemap/','/impressum/','/datenschutz/']){ await p4.goto(B+u); const o=await p4.evaluate(()=>document.documentElement.scrollWidth-innerWidth); if(o>worst){worst=o;where=u;} }
 ok('no horizontal scroll at 360px on all 14 pages', worst===0, worst?('overflow '+worst+'px on '+where):'');
 await b.close(); })();
