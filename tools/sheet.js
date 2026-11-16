const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const dir=path.resolve(process.argv[2]), out=path.resolve(process.argv[3]);
(async()=>{ const files=fs.readdirSync(dir).filter(f=>/\.(jpe?g|png|gif)$/i.test(f)).sort();
 const b=await chromium.launch(); const per=48;
 for(let i=0;i*per<files.length;i++){ const part=files.slice(i*per,(i+1)*per);
  const html=`<body style="margin:0;background:#222;font:10px monospace;color:#fff"><div style="display:grid;grid-template-columns:repeat(8,1fr);gap:4px;padding:4px">`+
   part.map(f=>`<div style="min-width:0"><img src="file://${encodeURI(path.join(dir,f))}" style="width:100%;height:120px;object-fit:cover;display:block"><div style="overflow:hidden;white-space:nowrap">${f.slice(0,28)}</div></div>`).join('')+`</div>`;
  const hp=path.join(out,`sheet${i+1}.html`); fs.writeFileSync(hp,html);
  const p=await b.newPage({viewport:{width:1500,height:700}}); await p.goto('file://'+encodeURI(hp),{waitUntil:'load'});
  await p.screenshot({path:path.join(out,`sheet${i+1}.jpg`),fullPage:true,type:'jpeg',quality:70}); await p.close(); }
 await b.close(); })();
