# CLAUDE.md – Stand des Projekts (Übergabe an den Mac mini, 16.11.2026)

Neubau der Website von **AC Herringhausen e.V. im ADAC** (alt: www.ac-herringhausen.de, hPage-Baukasten).
Der Auftraggeber spricht Vietnamesisch: Antworten auf Vietnamesisch, Seiteninhalte auf Deutsch (+ Englisch unter `/en/`).
"Bên mình cập nhật nội dung giúp CLB": wir pflegen die Inhalte später für den Verein.

## Was fertig ist
- **Crawl der alten Seite, 100 %** (`crawl/`, Bericht in `BAO-CAO.md`): 25 HTML-Seiten = 14 mit Inhalt, 5 außerhalb des Menüs,
  5 inaktive hPage-Seiten "Mitgliederbereich" (Login-Addon für Mitglieder, KEIN CMS-Login, nie benutzt), 1 Duplikat.
  Spiegel in `crawl/mirror/`, Text pro Seite in `crawl/content/*.md`, PDFs in `crawl/pdf/`, Screenshots in `crawl/shots/`.
- **Vier Designrichtungen** in `proto/` (Artifact: https://claude.ai/artifact/3A48baN9mY5AeBJx6LUWCr). Gewählt: **A „Startaufstellung“**
  (dunkle Rennübertragung) + aus **C** der Einstieg nach Zielgruppe (Karten „Ich bin 8–18…“, Klassenwähler P1–P5, Probetraining in 3 Schritten).
- **Komplette Website** in `site/` (Astro 5, statisch): 14 Seiten × DE/EN = 28 Seiten + 404 + sitemap.xml.
  Abgleich alt → neu: **194/194 Informationen** übernommen (`DOI-CHIEU.md`, Prüfskript `tools/coverage.py`).
  Artifact der ganzen Site: https://claude.ai/artifact/Wc7773AmNXjvkba4cZDU6C (Kopie mit relativen Links, gebaut mit `tools/artifact_build.py`).
- **GitHub**: https://github.com/Truongvbn/ac-herringhausen-website (public). Einladung an ai.account@scalecraft.de macht der Nutzer selbst im Web.

## Entscheidungen aus den Interviews (nicht neu verhandeln)
- ~10 zusammengelegte Seiten statt 25; Gästebuch und Sitemap-Seite bleiben.
- Weggelassen: die 5 Login-Seiten, `satzung-ach` (Duplikat), `linkliste`.
- Bewegung: stark auf der Startseite (Hero-Parallax, 3D-Coverflow-Galerie), mäßig auf Unterseiten (nur CSS scroll-driven).
  3D/Tilt/Parallax, Countdown und Gästebuch wurden vom Nutzer gewünscht – nicht entfernen.
- Fehlende Inhalte: von uns entworfen und markiert (`data-draft="Grund"`, gelber Rahmen; ausblenden mit `PUBLIC_SHOW_DRAFTS=0`).
- Kontaktformular, Gästebuch, Besucherzähler: Oberfläche fertig, **noch nicht angeschlossen**. Karte (OpenStreetMap) lädt erst nach Klick.
- Hosting: Astro auf Cloudflare Pages, `public/_redirects` leitet 24 alte Adressen um. Fonts selbst gehostet, keine Cookies → kein Cookie-Banner.

## Offen – braucht Antworten vom Verein (30 Entwurfsblöcke)
- Impressum (9) und Datenschutz (14): Entwürfe; DDG statt TMG, § 18 Abs. 2 MStV, Registergericht, USt-ID, zweiter Kontaktweg.
- Satzung: zwei Vorstände vertreten gemeinsam – altes Impressum nennt nur einen.
- Kart: Adresse des Trainingsplatzes; alte Seite sagt P1–P5 / Viertakt, ADAC OWL nutzt heute „Klasse 1–5“ nach Jahrgang und E-Karts.
- Clubsport-Erklärung, Mitgliedsbeitrag (fehlt), Link zu Ergebnissen 2026 ungeprüft, Moderation Gästebuch.
- Fotos 2016 mit Kindern (Siegerehrung): Einwilligung der Eltern klären. 7 Dateien wurden umbenannt, um einen Kindernamen zu entfernen.
- Englische Übersetzung ist nicht gegengelesen. adac-sport.com-Links blocken automatische Abrufe (403), manuell prüfen.

## Arbeiten
- Node 22 (Astro 5.18; neueste Astro-Version braucht Node ≥ 22.23.4, daher bewusst `astro@5`).
- `cd site && npm install && npm run dev` (Port 4321; `.claude/launch.json` Konfiguration `ach-site`). Build: `npm run build`.
- Prüfwerkzeuge (Playwright): `cd tools && npm install && npx playwright install chromium`, dann z. B.
  `NODE_PATH=tools/node_modules node tools/linkcheck.js`, `tools/check.js`, `tools/interact.js`, `tools/siteshots.js`; Abgleich: `python3 tools/coverage.py`.
- Fakten (Termine, Vorstand, Klassen, Downloads, Partner) NUR in `site/src/data/club.ts` ändern. Details: `site/README.md`, `site/AGENT-BRIEF.md`.
- Artifact neu bauen: `npm --prefix site run build && python3 -I tools/artifact_build.py site/dist artifact-build`
  (Ordner `_astro` → `assets`, weil `_`-Namen im Artifact reserviert sind; Karte im Artifact ausgeblendet, da Einbettungen blockiert).

## Nächste sinnvolle Schritte
1. Offene Punkte mit dem Verein klären, Entwürfe ersetzen, Markierungen ausblenden.
2. Formular/Gästebuch an einen Dienst anschließen (z. B. Cloudflare Pages Functions + E-Mail), Besucherzähler entscheiden.
3. Cloudflare Pages einrichten, Domain/DNS (liegt derzeit bei hPage, inkl. MX – E-Mail beim Umzug nicht verlieren, siehe `crawl/dns/dns.txt`).
