#!/usr/bin/env python3
"""Turn site/dist into a copy that works from any base path (relative links), for publishing as an artifact.
Usage: python3 -I tools/artifact_build.py site/dist artifact-build"""
import sys, os, re, shutil, json
src, out = sys.argv[1], sys.argv[2]
shutil.rmtree(out, ignore_errors=True); shutil.copytree(src, out)
for junk in ("_redirects", "robots.txt", "sitemap.xml", "404.html"):
    p = os.path.join(out, junk)
    if os.path.exists(p): os.remove(p)
os.rename(os.path.join(out, "_astro"), os.path.join(out, "assets"))  # the artifact service reserves names starting with "_"
EXTRA = "<style>[data-map-load],.map .consent{display:none!important}</style>"  # other sites cannot be embedded in an artifact
def fix(m, prefix):
    attr, url = m.group(1), m.group(2)
    if url.startswith("//"): return m.group(0)
    path, _, frag = url.partition("#")
    path = path[1:]
    if path == "" or path.endswith("/"): path += "index.html"
    return f'{attr}="{prefix}{path}{"#" + frag if frag else ""}"'
files = {}
for dp, _, fs in os.walk(out):
    for f in fs:
        p = os.path.join(dp, f); rel = os.path.relpath(p, out)
        if f.endswith(".html"):
            depth = rel.count(os.sep); prefix = "../" * depth
            s = open(p).read()
            s = re.sub(r'\b(href|src|data-map-x)="(/[^"]*)"', lambda m: fix(m, prefix), s)
            s = s.replace("_astro/", "assets/").replace("</head>", EXTRA + "</head>", 1)
            if rel == "index.html":
                head = re.search(r"<head>(.*?)</head>", s, re.S).group(1)
                body = re.search(r"<body([^>]*)>(.*)</body>", s, re.S)
                title = re.search(r"<title>.*?</title>", head, re.S).group(0)
                keep = "".join(re.findall(r"<link rel=\"stylesheet\"[^>]*>|<style.*?</style>", head, re.S))
                cls = re.search(r'class="([^"]*)"', body.group(1)); lang = re.search(r'data-lang="([^"]*)"', body.group(1))
                boot = ("<script>(function(){var h=document.documentElement;h.lang='de';h.classList.add(" + json.dumps(cls.group(1) if cls else 'x') + ");"
                        "function b(){document.body.dataset.lang='de';document.body.dataset.page='home';}"
                        "if(document.body)b();else document.addEventListener('DOMContentLoaded',b);})();</script>")
                s = "<title>AC Herringhausen Website</title>\n" + keep + "\n" + boot + body.group(2)
            open(p, "w").write(s)
        elif f.endswith(".css"):
            s = open(p).read(); s = s.replace("url(/_astro/", "url("); open(p, "w").write(s)
        if rel != "index.html": files[rel] = rel
json.dump(files, open(os.path.join(out, "..", "artifact-files.json"), "w"))
tot = sum(os.path.getsize(os.path.join(out, f)) for f in files)
print(len(files), "files", round(tot / 1e6, 1), "MB; leftover absolute refs:",
      sum(len(re.findall(r'(?:href|src)="/[^/]', open(os.path.join(dp, f)).read())) for dp, _, fs in os.walk(out) for f in fs if f.endswith(".html")))
