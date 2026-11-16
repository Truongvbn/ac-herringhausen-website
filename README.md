# AC Herringhausen e.V. im ADAC – neue Website

Neubau der Vereinswebsite (alt: www.ac-herringhausen.de, hPage).

| Ordner | Inhalt |
|---|---|
| `site/` | Astro-Projekt der neuen Website (DE + `/en/`), siehe `site/README.md` |
| `crawl/` | Inhalte der alten Website: Texte pro Seite (`content/`), PDFs, Bildliste, DNS, Manifest |
| `proto/` | Die vier Designrichtungen (Prototypen) |
| `tools/` | Crawler, Prüf- und Screenshot-Skripte, Artifact-Build |
| `BAO-CAO.md` | Bericht zum Crawl der alten Seite |
| `DOI-CHIEU.md` | Abgleich alt → neu (194/194 Informationen übernommen) |

## Starten

```bash
cd site
npm install
npm run dev
```

Build: `npm run build` → `site/dist/` (statisch, für Cloudflare Pages).
Entwurfsmarkierungen ausblenden: `PUBLIC_SHOW_DRAFTS=0 npm run build`.

Nicht im Repo: `node_modules`, Build-Ausgaben (neu erzeugen mit `npm install` / `npm run build`). Projektstand und offene Punkte: `CLAUDE.md`.
