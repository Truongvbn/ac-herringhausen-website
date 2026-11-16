#!/usr/bin/env python3
"""Full mirror of ac-herringhausen.de: every page, every asset the pages reference
(CSS, JS, images, PDFs, incl. file2.hpage.com), plus response headers and a manifest.
Usage: python3 -I tools/crawl.py <out_dir>
"""
import sys, os, re, json, time, hashlib, html, subprocess
from urllib.parse import urljoin, urlsplit, urldefrag, unquote
from collections import deque

OUT = sys.argv[1]
START = "https://www.ac-herringhausen.de/"
SITE_HOSTS = {"www.ac-herringhausen.de", "ac-herringhausen.de"}
ASSET_HOSTS = SITE_HOSTS | {"file2.hpage.com", "file1.hpage.com", "file3.hpage.com", "www.hpage.com", "hpage.com"}
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/130.0 Safari/537.36")
DELAY = 0.25

os.makedirs(OUT, exist_ok=True)
manifest = {}          # url -> record
external_links = {}    # url -> [pages]
third_party = {}       # url -> [pages]  (resources loaded from hosts we do not mirror)


def local_path(url):
    s = urlsplit(url)
    path = unquote(s.path)
    if path.endswith("/") or path == "":
        path += "index.html"
    if s.query:
        path += "__q_" + hashlib.sha1(s.query.encode()).hexdigest()[:10]
        base, ext = os.path.splitext(unquote(s.path))
        if ext and not path.endswith(ext):
            path += ext
    safe = re.sub(r"[^A-Za-z0-9._/\-]", "_", path).lstrip("/")
    return os.path.join(OUT, "mirror", s.netloc, safe)


def fetch(url):
    dest = local_path(url)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    hdr = dest + ".headers"
    if os.path.exists(dest) and os.path.getsize(dest) > 0 and os.path.exists(hdr):
        h = open(hdr, errors="replace").read()
        st = re.findall(r"^HTTP/\S+ (\d+)", h, re.M)
        ct = re.findall(r"^content-type:\s*(.+)$", h, re.M | re.I)
        if st and st[-1] == "200":
            rec = {"url": url, "file": os.path.relpath(dest, OUT), "status": "200", "type": ct[-1].strip() if ct else "",
                   "bytes": os.path.getsize(dest), "final": url, "err": ""}
            manifest[url] = rec
            return rec, dest
    cmd = ["curl", "-g", "-sS", "-L", "--max-time", "60", "--retry", "2", "-A", UA,
           "-D", hdr, "-o", dest, "-w", "%{http_code}\t%{content_type}\t%{size_download}\t%{url_effective}", url]
    p = subprocess.run(cmd, capture_output=True, text=True)
    time.sleep(DELAY)
    parts = (p.stdout or "").split("\t")
    rec = {"url": url, "file": os.path.relpath(dest, OUT), "status": parts[0] if parts else "ERR",
           "type": parts[1] if len(parts) > 1 else "", "bytes": int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0,
           "final": parts[3] if len(parts) > 3 else "", "err": p.stderr.strip()[:200]}
    manifest[url] = rec
    return rec, dest


ATTR_RE = re.compile(r"""(?:href|src|data-src|data-original|data-href|poster|action)\s*=\s*(?:"([^"]*)"|'([^']*)')""", re.I)
SRCSET_RE = re.compile(r"""srcset\s*=\s*(?:"([^"]*)"|'([^']*)')""", re.I)
CSSURL_RE = re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""", re.I)
IMPORT_RE = re.compile(r"""@import\s+['"]([^'"]+)['"]""", re.I)
BARE_RE = re.compile(r"""https?://file\d?\.hpage\.com/[^\s"'<>)\\]+""", re.I)

PAGE_EXT = ("", ".html", ".htm", ".php")


def norm(base, ref):
    ref = html.unescape(ref.strip())
    if not ref or ref.startswith(("#", "mailto:", "tel:", "javascript:", "data:")) or "'+" in ref or "+'" in ref:
        return None
    u, _ = urldefrag(urljoin(base, ref))
    if not u.startswith(("http://", "https://")):
        return None
    sp = urlsplit(u)
    if sp.netloc in ASSET_HOSTS or sp.netloc == "ac-herringhausen.de":
        host = "www.ac-herringhausen.de" if sp.netloc == "ac-herringhausen.de" else sp.netloc
        u = "https://" + host + (sp.path or "/") + ("?" + sp.query if sp.query else "")
    return u


def is_page(url):
    s = urlsplit(url)
    return s.netloc in SITE_HOSTS and os.path.splitext(s.path)[1].lower() in PAGE_EXT


pages = deque([START])
seen_pages = {START}
assets = deque()
seen_assets = set()
page_info = []


def queue_ref(u, page, tag_is_link):
    host = urlsplit(u).netloc
    if host in SITE_HOSTS and is_page(u) and "get_statistics" not in u:
        if u not in seen_pages:
            seen_pages.add(u); pages.append(u)
    elif host in ASSET_HOSTS:
        if u not in seen_assets:
            seen_assets.add(u); assets.append(u)
    else:
        (external_links if tag_is_link else third_party).setdefault(u, []).append(page)


# sitemap + robots first
for extra in ("robots.txt", "sitemap.xml"):
    rec, dest = fetch(START + extra)
    if rec["status"] == "200":
        txt = open(dest, errors="replace").read()
        for loc in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", txt):
            u = norm(START, loc)
            if u and is_page(u) and u not in seen_pages:
                seen_pages.add(u); pages.append(u)

while pages:
    url = pages.popleft()
    rec, dest = fetch(url)
    print("PAGE", rec["status"], rec["bytes"], url, flush=True)
    if rec["status"] != "200" or "html" not in rec["type"]:
        continue
    txt = open(dest, errors="replace").read()
    title = re.search(r"<title[^>]*>(.*?)</title>", txt, re.I | re.S)
    info = {"url": url, "file": rec["file"], "title": html.unescape(title.group(1).strip()) if title else "",
            "links": [], "images": [], "external": []}
    for m in re.finditer(r"<(a|link|script|img|iframe|source|embed|object|form|video|audio)\b[^>]*>", txt, re.I):
        tag = m.group(1).lower()
        chunk = m.group(0)
        refs = [a or b for a, b in ATTR_RE.findall(chunk)]
        for a, b in SRCSET_RE.findall(chunk):
            refs += [p.strip().split(" ")[0] for p in (a or b).split(",")]
        for r in refs:
            u = norm(url, r)
            if not u:
                continue
            is_link = tag in ("a", "form")
            queue_ref(u, url, is_link)
            if tag == "img":
                info["images"].append(u)
            elif tag == "a":
                (info["links"] if urlsplit(u).netloc in ASSET_HOSTS else info["external"]).append(u)
    for r in CSSURL_RE.findall(txt):
        u = norm(url, r)
        if u: queue_ref(u, url, False)
    for u in BARE_RE.findall(txt):
        u = norm(url, u)
        if u: queue_ref(u, url, False)
    page_info.append(info)

print("pages done:", len(page_info), "assets queued:", len(assets), flush=True)

from concurrent.futures import ThreadPoolExecutor
def do_asset(url):
    rec, dest = fetch(url)
    found = []
    if rec["status"] != "200":
        print("ASSET", rec["status"], url, flush=True)
        return found
    if "css" in rec["type"] or dest.endswith(".css"):
        txt = open(dest, errors="replace").read()
        found = [norm(url, r) for r in CSSURL_RE.findall(txt) + IMPORT_RE.findall(txt)]
    elif "javascript" in rec["type"] or dest.endswith(".js"):
        txt = open(dest, errors="replace").read()
        found = [norm(url, u) for u in BARE_RE.findall(txt)]
    return [(u, url) for u in found if u]

with ThreadPoolExecutor(6) as ex:
    while assets:
        batch = list(assets); assets.clear()
        for found in ex.map(do_asset, batch):
            for u, src in found:
                queue_ref(u, src, False)
        print("batch done", len(batch), "next", len(assets), flush=True)

json.dump({"pages": page_info, "manifest": list(manifest.values()),
           "external_links": external_links, "third_party": third_party},
          open(os.path.join(OUT, "manifest.json"), "w"), indent=1, ensure_ascii=False)
ok = [r for r in manifest.values() if r["status"] == "200"]
bad = [r for r in manifest.values() if r["status"] != "200"]
print(f"DONE files={len(manifest)} ok={len(ok)} failed={len(bad)} bytes={sum(r['bytes'] for r in ok)}")
for r in bad:
    print("FAILED", r["status"], r["url"], r["err"])
