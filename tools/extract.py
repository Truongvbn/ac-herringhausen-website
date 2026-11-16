#!/usr/bin/env python3
"""Turn mirrored hPage HTML into plain-text content files (text, links, images per page).
Usage: python3 -I tools/extract.py <mirror_site_dir> <out_dir>"""
import sys, os, re, html
from html.parser import HTMLParser
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
BLOCK = {"p","div","h1","h2","h3","h4","h5","h6","li","tr","br","table","ul","ol","hr"}
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.buf=[]; s.skip=0; s.href=None
    def handle_starttag(s,t,a):
        a=dict(a)
        if t in("script","style"): s.skip+=1
        if t in BLOCK: s.buf.append("\n")
        if t in("h1","h2","h3","h4"): s.buf.append("#"*int(t[1])+" ")
        if t=="li": s.buf.append("- ")
        if t in("td","th"): s.buf.append(" | ")
        if t=="a" and a.get("href"): s.href=a["href"]; s.buf.append("[")
        if t=="img": s.buf.append(f"\n![{a.get('alt','')}]({a.get('src') or a.get('data-src','')})\n")
        if t=="iframe": s.buf.append(f"\n[IFRAME {a.get('src','')}]\n")
    def handle_endtag(s,t):
        if t in("script","style"): s.skip=max(0,s.skip-1)
        if t=="a" and s.href is not None: s.buf.append(f"]({s.href})"); s.href=None
        if t in BLOCK: s.buf.append("\n")
    def handle_data(s,d):
        if not s.skip: s.buf.append(d.replace("\xa0"," "))
def content(txt):
    i=txt.find('<div class="content">'); j=txt.find('id="footer"')
    if i<0: i=txt.find("<body")
    return txt[i:j if j>i else None]
for dp,_,fs in os.walk(src):
    for f in sorted(fs):
        if not f.endswith(".html"): continue
        p=os.path.join(dp,f); txt=open(p,errors="replace").read()
        title=re.search(r"<title[^>]*>(.*?)</title>",txt,re.S|re.I)
        ps=P(); ps.feed(content(txt))
        body="".join(ps.buf)
        body=re.sub(r"[ \t]+"," ",body); body=re.sub(r"\n[ ]+","\n",body); body=re.sub(r"\n{3,}","\n\n",body).strip()
        rel=os.path.relpath(p,src)
        name=rel.replace("/","__")[:-5]+".md"
        open(os.path.join(out,name),"w").write(f"<!-- source: /{rel} | title: {html.unescape(title.group(1).strip()) if title else ''} -->\n\n{body}\n")
        print(f"{len(body):6d}  {rel}")
