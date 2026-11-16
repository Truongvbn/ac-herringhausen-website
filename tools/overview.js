// Contact sheet of page screenshots. Usage: node tools/overview.js <dir> <out.jpg> <cols> <tileWidth> <suffix> name1 name2 ...
const { chromium } = require('playwright'); const path=require('path'), fs=require('fs');
const [dir,out,cols,tw,suffix,...names]=process.argv.slice(2);
(async()=>{ const html=`<body style="margin:0;background:#555;font:12px monospace;color:#fff"><div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:8px;padding:8px;align-items:start">`+
 names.map(n=>`<div><div>${n}</div><img src="file://${encodeURI(path.resolve(dir,n+suffix))}" style="width:100%;display:block"></div>`).join('')+`</div>`;
 const hp=path.resolve(dir,'_ov.html'); fs.writeFileSync(hp,html);
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:cols*(+tw+8)+8,height:600}}); await p.goto('file://'+encodeURI(hp));
 await p.screenshot({path:out,fullPage:true,type:'jpeg',quality:72}); await b.close(); })();
