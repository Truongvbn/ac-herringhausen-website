#!/usr/bin/env python3
"""Join proto/host.html + proto/d-*.html fragments into proto/index.html and lint the contract.
Usage: python3 -I tools/assemble.py <proto_dir>"""
import sys, os, re
d = sys.argv[1]
keys = ["broadcast", "heritage", "pitboard", "technik"]
host = open(os.path.join(d, "host.html")).read()
fonts, frags, problems = ['<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">'], [], []
for k in keys:
    p = os.path.join(d, f"d-{k}.html")
    if not os.path.exists(p):
        problems.append(f"{k}: MISSING"); continue
    s = open(p).read()
    m = re.match(r"\s*<!--\s*fonts:\s*(.*?)\s*-->", s)
    if m:
        q = m.group(1).replace(" ", "+").replace("&display=swap", "")
        fonts.append(f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{q}&display=swap">')
        s = s[m.end():]
    else:
        problems.append(f"{k}: no fonts line")
    # lint
    css = "".join(re.findall(r"<style[^>]*>(.*?)</style>", s, re.S))
    flat = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    for sel in re.findall(r"(?:^|[{}])\s*([^{}@]+?)\s*\{", flat):
        for part in sel.split(","):
            part = part.strip()
            if not part or re.match(r"^(from|to|\d+(\.\d+)?%)$", part): continue
            if not part.startswith(f".d-{k}"):
                problems.append(f"{k}: unscoped selector: {part[:60]}")
    for bad in ("position:fixed", "position: fixed", "100vh", "<iframe", "mailto:", "alert(", "http://"):
        if bad in s: problems.append(f"{k}: contains {bad!r} x{s.count(bad)}")
    if f'id="dir-{k}"' not in s: problems.append(f"{k}: section id missing")
    if "dir:show" not in s: problems.append(f"{k}: no dir:show handler")
    if "prefers-reduced-motion" not in s: problems.append(f"{k}: no reduced-motion")
    if "data-lang-toggle" not in s: problems.append(f"{k}: no lang toggle")
    imgs = set(re.findall(r"img/([A-Za-z0-9_.\-]+)", s))
    for i in sorted(imgs):
        if not os.path.exists(os.path.join(d, "img", i)): problems.append(f"{k}: missing image {i}")
    # hide by default so there is no flash before the host script runs
    s = s.replace(f'id="dir-{k}"', f'id="dir-{k}" hidden', 1) if f'id="dir-{k}" hidden' not in s else s
    frags.append(f"<!-- ===== {k} ===== -->\n{s.strip()}\n")
    print(f"{k}: {len(s.splitlines())} lines, {len(s)//1024} KB, images={len(imgs)}, data-en={s.count('data-en=')}")
out = host.replace("<!--FONTS-->", "\n".join(fonts)).replace("<!--FRAGMENTS-->", "\n".join(frags))
open(os.path.join(d, "index.html"), "w").write(out)
used = sorted(set(re.findall(r"img/([A-Za-z0-9_.\-]+)", out)))
open(os.path.join(d, "used-images.txt"), "w").write("\n".join(used))
print("index.html", len(out)//1024, "KB; images used:", len(used))
print("\n".join(problems) if problems else "lint: clean")
