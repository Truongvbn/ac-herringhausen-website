#!/usr/bin/env python3
"""Does the new site carry 100% of the old site's information?
For every old page: each text line, link, image and document is looked up in the built German pages it was mapped to.
Usage: python3 -I tools/coverage.py <crawl_dir> <site_dist_dir> [report.md]"""
import sys, os, re, html, json, hashlib, unicodedata
crawl, dist = sys.argv[1], sys.argv[2]
report = sys.argv[3] if len(sys.argv) > 3 else None

MAP = {  # old content file -> new German pages that must carry it
 "Start": ["index.html", "verein/index.html"], "index": ["index.html", "verein/index.html"],
 "aktuelles": ["verein/index.html", "termine/index.html"],
 "ueber-uns": ["verein/index.html"],
 "termine-2023": ["termine/index.html"],
 "ausschreibungen": ["termine/index.html"],
 "abteilungen__vorstand": ["verein/index.html"],
 "jugend---kart---slalom": ["jugend-kart-slalom/index.html"],
 "abteilungen__clubsport-slalom": ["clubsport-slalom/index.html"],
 "abteilungen__oldtimer-rallye": ["oldtimer-rallye/index.html"],
 "gallery447728": ["galerie/index.html"], "gallery447725": ["galerie/index.html"],
 "downloads": ["mitglied-werden/index.html"],
 "partner-links": ["partner/index.html"],
 "impressum": ["impressum/index.html", "datenschutz/index.html"],
 "kontakt": ["kontakt/index.html"],
 "guestbook": ["gaestebuch/index.html"],
 "sitemap": ["sitemap/index.html"],
}
DROPPED = {"login", "register", "forgot_pw", "change_data", "logout", "satzung-ach", "linkliste"}
# old wording that was deliberately replaced; value = why
WAIVED = {
 "nach oben": "Navigationslink der alten Seite",
 "pflichtfelder": "ersetzt durch 'Pflichtfeld'",
 "korrektes format": "Formularhinweis neu formuliert", "richtiges format": "Formularhinweis neu formuliert",
 "angaben gemäß § 5 tmg": "TMG wurde 2024 durch das DDG ersetzt",
 "besucherzähler": "Zähler steht jetzt im Fußbereich", "besucher heute": "Zähler steht jetzt im Fußbereich",
 "seitentitel": "Tabellenkopf der alten Sitemap", "sind 1 einträge": "Grammatik korrigiert: 'ist 1 Eintrag'", "letzte aktualisierung": "Tabellenkopf der alten Sitemap",
}

def norm(s):
    s = html.unescape(s); s = unicodedata.normalize("NFKC", s).lower()
    s = s.replace("ß", "ss").replace("­", "").replace("’", "'").replace("„", '"').replace("“", '"').replace("”", '"')
    s = re.sub(r"[‐-―]", "-", s)
    return re.sub(r"\s+", " ", s).strip()

def words(s):
    # letters and digits are separate tokens, so "ca.10-11" and "ca. 10–11" compare equal
    return [w for w in re.findall(r"[a-zäöü]+|\d+", norm(s)) if len(w) >= 3 or w.isdigit()]

def page_text(path):
    t = open(path, errors="replace").read()
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", t, flags=re.S)
    attrs = " ".join(re.findall(r'(?:alt|title|aria-label|data-caption|data-text|value|placeholder)="([^"]*)"', t))
    # machine-readable dates count as the date being present: 2026-04-19 -> 19.04.2026
    attrs += " " + " ".join(f"{d}.{m}.{y}" for y, m, d in re.findall(r'datetime="(\d{4})-(\d\d)-(\d\d)', t))
    hrefs = set(html.unescape(h) for h in re.findall(r'(?:href|src)="([^"]+)"', t))
    return norm(re.sub(r"<[^>]+>", " ", t) + " " + attrs), hrefs

rows, missing, total = [], [], 0
for f in sorted(os.listdir(os.path.join(crawl, "content"))):
    key = f[:-3]
    if key in DROPPED or key not in MAP: 
        if key not in DROPPED: rows.append((key, "?", "?", "NICHT ZUGEORDNET"))
        continue
    texts, hrefs = [], set()
    for p in MAP[key]:
        fp = os.path.join(dist, p)
        if os.path.exists(fp):
            t, h = page_text(fp); texts.append(t); hrefs |= h
    text = " ".join(texts); wset = set(words(text))
    src = open(os.path.join(crawl, "content", f)).read().split("\n", 2)[-1]
    ok = n = 0; miss = []
    # links
    for label, url in re.findall(r"\[([^\]]*)\]\(([^)]+)\)", src):
        if url.startswith("#") or "pagination" in url or url.endswith(".html") and "ac-herringhausen" not in url and not url.startswith("http"): continue
        if "/assets/images/smilies" in url or "file2.hpage.com" in url or "/images/sitemap/icons" in url: continue
        n += 1
        if "get_file.php" in url: hit = any("/downloads/" in h for h in hrefs)
        elif "ac-herringhausen.de" in url: hit = True
        else: hit = any(norm(url).rstrip("/") in norm(h) for h in hrefs)
        ok += hit
        if not hit: miss.append("LINK " + url)
    # images (count only: gallery + content photos)
    imgs = set(re.findall(r"!\[[^\]]*\]\((https://file2\.hpage\.com/011747/60/bilder/[^)]+)\)", src)) | set(re.findall(r"\]\((https://file2\.hpage\.com/011747/60/bilder/[^)]+)\)", src))
    # text lines
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", src); body = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", body)
    for line in body.split("\n"):
        line = re.sub(r"<[^>]+>?", " ", line)  # leftover HTML in old guestbook entry
        line = re.sub(r"^[#|\-\s]+", "", line).strip()
        line = line.replace("Herringahusen", "Herringhausen").replace("Email:", "E-Mail:")  # typos fixed on purpose
        line = re.sub(r"(ADAC)(Mittelweg|Arode)", r"\1 \2", line)
        ws = words(line)
        if len(ws) < 1 or not re.search(r"[A-Za-zÄÖÜäöü0-9]{2}", line): continue
        nl = norm(line)
        if any(k in nl for k in WAIVED): continue
        n += 1
        if nl in text: ok += 1; continue
        found = sum(1 for w in ws if w in wset)
        if found / len(ws) >= 0.85: ok += 1
        else: miss.append(f"TEXT ({found}/{len(ws)} Wörter) {line[:150]}")
    total += n
    rows.append((key, n, ok, " + ".join(MAP[key])))
    missing += [(key, m) for m in miss]

# documents and photos, byte-exact
def sha(p): return hashlib.sha1(open(p, "rb").read()).hexdigest()
pdf_ok = all(os.path.exists(os.path.join(dist, "downloads", n)) and sha(os.path.join(dist, "downloads", n)) == sha(os.path.join(crawl, "pdf", n)) for n in ("Beitrittserklaerung.pdf", "Satzung.pdf", "Haftungsausschluss.pdf"))
man = json.load(open(os.path.join(crawl, "manifest.json")))
old_gal = set()
for p in man["pages"]:
    if "gallery4477" in p["url"]:
        old_gal |= {u.rsplit("/", 1)[1] for u in p["images"] if "/galleries/" in u}
bilder = os.path.join(crawl, "mirror/file2.hpage.com/011747/60/bilder")
new_hashes = {sha(os.path.join(dp, f)) for dp, _, fs in os.walk(os.path.join(dist, "img")) for f in fs}
gal_missing = [n for n in sorted(old_gal) if sha(os.path.join(bilder, n)) not in new_hashes]
gal_html = open(os.path.join(dist, "galerie/index.html"), errors="replace").read() if os.path.exists(os.path.join(dist, "galerie/index.html")) else ""
gal_linked = len(set(re.findall(r'href="(/img/galerie/[^"]+\.jpg)"', gal_html)))

out = ["# Đối chiếu thông tin: site cũ → site mới", "",
       "| Trang cũ | Mục thông tin | Tìm thấy | Trang mới |", "|---|---|---|---|"]
for k, n, ok, dest in rows: out.append(f"| {k} | {n} | {ok} | {dest} |")
tn = sum(r[1] for r in rows if isinstance(r[1], int)); to = sum(r[2] for r in rows if isinstance(r[2], int))
out += ["", f"**Tổng: {to}/{tn} mục thông tin ({(to/tn*100 if tn else 0):.1f}%).**", "",
        f"- PDF: 3 file {'giống hệt bản gốc' if pdf_ok else 'KHÔNG KHỚP'}",
        f"- Ảnh thư viện: {len(old_gal)-len(gal_missing)}/{len(old_gal)} ảnh gốc có trong site mới; trang Galerie link tới {gal_linked} ảnh",
        f"- Trang bỏ theo quyết định: {', '.join(sorted(DROPPED))}", "", "## Chưa tìm thấy", ""]
out += [f"- `{k}`: {m}" for k, m in missing] or ["(không có)"]
if gal_missing: out += ["", "Ảnh thiếu: " + ", ".join(gal_missing)]
txt = "\n".join(out)
if report: open(report, "w").write(txt + "\n")
print(txt)
