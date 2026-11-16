# AC Herringhausen: neue Website (Astro 5)

## Starten
```bash
npm install
npm run dev      # Vorschau auf http://localhost:4321
npm run build    # fertige Seiten in dist/
```
Benötigt Node 22. Hosting ist für Cloudflare Pages vorbereitet (`public/_redirects` leitet alle alten hPage-Adressen um).

## Wo steht was
- `src/data/club.ts`: alle Fakten (Termine, Vorstand, Klassen, Downloads, Partner). Termine und Namen NUR hier ändern.
- `src/data/galerie.json`: die zwei Fotoalben. Bilder liegen in `public/img/galerie/`.
- `src/views/*.astro`: je eine Seite, deutsch und englisch in einer Datei (`de ? '…' : '…'`).
- `src/i18n/routes.ts`: Adressen der Seiten (deutsch ohne Präfix, englisch unter `/en/`).
- `src/styles/global.css`: das Designsystem.
- `public/downloads/`: die drei PDFs (unverändert von der alten Seite).

## Entwürfe
Alles, was nicht von der alten Seite stammt, ist mit `data-draft="…"` markiert und wird gelb umrandet angezeigt.
Zum Ausblenden für die Veröffentlichung: `PUBLIC_SHOW_DRAFTS=0 npm run build`.

## Noch nicht angeschlossen
- Kontaktformular und Gästebuch: prüfen die Eingaben, senden aber nichts (kein Versanddienst gewählt).
- Besucherzähler im Fußbereich: nur Platzhalter.
- „gefahren“ bei Terminen wird beim Build aus dem Datum berechnet: nach jeder Veranstaltung neu bauen.
