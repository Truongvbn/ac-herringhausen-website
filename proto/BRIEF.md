# Shared brief: AC Herringhausen homepage prototypes

Four agents each build ONE visual direction of the same homepage. The fragments are later
concatenated into one HTML page with a switcher, so the contract below is strict.

## The club (real content, use it verbatim, do not invent facts)

- Name: AC Herringhausen e.V. im ADAC (Automobilclub Herringhausen). Short: ACH. Ortsclub im ADAC Ostwestfalen-Lippe.
- Founded 01.08.1969, Herford / Hiddenhausen. Today is 15.11.2026.
- Logo: shield, black "ACH", red diagonal band "HERRINGHAUSEN E.V.", chequered flag field, yellow ADAC eagle roundel.
- Über uns (DE, original): "Der AC Herringhausen e.V. im ADAC wurde am 1. August 1969 gegründet und prägt seitdem die Motorsportgeschichte der Region. Durch unsere Jugendgruppe und die stark ausgeprägte Rallyeszene im Verein ist der Bestand des ACH für die kommenden Jahrzehnte gesichert. Unser Verein beherbergt auch Leute aus der Rundstrecken-, Motorrad- und Oldtimerszene. Mit unseren Veranstaltungen schaffen wir eine Plattform für Jung und Alt, um sich sportlich zu betätigen."
- Stats that are true: "seit 1969", "55. Clubsport-Slalom (2026)", "3 Abteilungen", "P1–P5: 8 bis 18 Jahre".
- Termine 2026 (all already over, season finished; say "Saison 2026 beendet · Termine 2027 folgen"):
  - 19.04.2026 ADAC Jugend-Kart-Slalom "AC Herringhausen", toom-Baumarkt Herringhausen
  - 14.06.2026 55. ADAC Automobil-Clubsport-Slalom "AC Herringhausen"
  - 06.09.2026 ADAC Automobil-Clubsport-Slalom "VG Kreis Herford"
  Each gets buttons "Ausschreibung" and "Ergebnisse" (href="#").
- The live, recurring thing to count down to: Kart-Training jeden Samstag 15:00 Uhr (außer in den Ferien), Gelände der Firma Goksch. Compute the next Saturday 15:00 in JS for any countdown.
- Vereinsleben: Versammlung am ersten Donnerstag im Monat, Clubabend am dritten Donnerstag, jeweils ab 19 Uhr.
- Clublokal: Zum Mittelpunkt bei Babi, Milchstraße 193, 32120 Hiddenhausen.
- Abteilungen:
  1. Jugend-Kart-Slalom: Breitensport-Kartsport für 8–18 Jahre, Viertakt-Karts, Pylonenkurs auf Parkplätzen gegen die Zeit, immer nur ein Fahrer auf der Strecke. Drei Läufe (ein Training, zwei Wertung). Pylonenfehler = 2 Strafsekunden, ausgelassene Aufgabe = 10 Strafsekunden. Klassen: P1 ca. 8–9, P2 ca. 10–11, P3 ca. 12–13, P4 ca. 14–15, P5 ca. 16–18 Jahre. Probetraining ab 7 Jahren: Vollvisier-Helm (kann gestellt werden), lange Kleidung, festes Schuhwerk. Ansprechpartner: Detlef Kollmeier, Uwe Ritter.
  2. Clubsport-Slalom: Automobil-Slalom mit dem eigenen Auto; der Club richtet 2026 den 55. ADAC Clubsport-Slalom aus. (Old site page is empty: keep copy short.)
  3. Oldtimer-Rallye: Team Jochen Gieselmann und Evelyn Erdmann, 1967er Ford Mustang Fastback.
- Vorstand: 1. Vorsitzender Hans-Joachim Kamphowe · 2. Vorsitzender Dietmar Babenhauserheide · Sportleiter Marcel Hellberg · Stellv. Sportleiter Nick Mai · Jugendleiter Detlef Kollmeier, Uwe Ritter, Sascha Wolff · Schatzmeisterin Melissa Hellberg · Schriftführerin Gabriele Dürkopp · Webmaster Dennis Schütze.
- Mitglied werden / Downloads: Beitrittserklärung (PDF), Satzung (PDF), Haftungsausschluss (PDF). href="#".
- Partner: ADAC Ostwestfalen-Lippe, Herforder Pils, DKS, Fahrschule Kronsbein, Optik Gössel, Weinrich Schokolade, Wachtmann. Plus "Sponsor werden? Sprechen Sie uns an."
- Kontakt: ac-herringhausen@gmx.de. Contact form UI: Name, E-Mail, Betreff, Nachricht, button "Nachricht senden". It must NOT submit anywhere: preventDefault and show an inline note "Demo: es wird nichts gesendet."
- Footer links: Impressum, Datenschutz. No cookie banner. No phone numbers or private e-mail addresses of people.
- Map: no iframe/embed is possible. Show a styled placeholder block with the address and a link "Route in OpenStreetMap öffnen" (https://www.openstreetmap.org/search?query=Milchstra%C3%9Fe%20193%2C%2032120%20Hiddenhausen).

## Photos (all in `img/`, max 1100px wide, amateur, 2016; reference as `img/<name>`)

Never show them larger than about 1100px wide; they get blurry. Prefer the helmeted action shots.
You may Read any of them (absolute dir: the `proto/img/` folder next to this file) to check crops.

| File | What it shows |
|---|---|
| img_1953.jpg | BEST. Side-on pan shot: yellow kart, driver in black helmet, pylons, dark green trees behind. 3:2 |
| img_1913.jpg, img_1915.jpg | Yellow kart cornering through orange pylons on grey asphalt, shot from distance. 3:2 |
| img_1958.jpg, img_1959.jpg | Yellow kart on slalom course, marshal flag and pylons, trees. 3:2 |
| img_1921.jpg | Kart on course with yellow parasol and pylons |
| img_1910.jpg | Two yellow karts waiting at the start, pylon |
| img_1842.jpg | Yellow kart parked under a red gazebo (pit), people around |
| img_1859.jpg | Yellow kart at the pit bench, front view |
| img_1845.jpg | Empty pylon lane on the car park, vans (course overview) |
| img_1849.jpg | Young driver with helmet and start number 114 sitting in a camping chair |
| img_1918.jpg | Team line-up: five young drivers in black/white race suits (faces visible, use small) |
| img_1881.jpg | Podium with three children holding certificates (faces visible, use small) |
| img_1874.jpg | Table full of gold trophies, ADAC flags behind |
| mustang2013.jpg | Red 1967 Ford Mustang Fastback, front three-quarter, with rally plate. 3:2 |
| img_0687.jpg | Same red Mustang side-on in a showroom |
| dsc_0265.jpg | Award ceremony, four adults on a stage (2011) |
| logo.png / logo.jpg | Club shield logo, 314x364, white background |
| adac.jpg, logo_herforder_pils.jpg, fahrschule_kronsbein.jpg, optik_goessel.jpg, weinrich.jpg, wachtmann.jpg | Sponsor graphics (mixed quality; plain text names are fine instead) |

## Output contract (strict)

Write exactly ONE file: `proto/d-<key>.html` (your key is given in your task). It is an HTML FRAGMENT with exactly three parts in this order, and nothing else (no doctype, html, head, body, title, link, meta):

1. First line: `<!-- fonts: <Google Fonts css2 query> -->`, e.g. `<!-- fonts: family=Anton&family=Inter:wght@400;600 -->`. Max 3 families, real Google Fonts names. I load them; you just use them in font-family with a fallback stack.
2. One `<style>` block. EVERY selector must start with `.d-<key>` (the section root). No `:root`, `html`, `body`, `*` or bare element selectors. Define your colour/type tokens as custom properties on `.d-<key>`. Prefix every `@keyframes` name with `<key>-`. Media/supports/container queries are fine.
3. One `<section class="dir d-<key>" id="dir-<key>">…</section>` holding the whole homepage, followed by one `<script>` that is an IIFE, queries only inside `document.getElementById('dir-<key>')`, and adds no globals.

Runtime facts:
- The page scrolls on `window` (the section is in normal flow, full width, no wrapper padding). A host bar is sticky at the top; its height is `var(--host-h)` (48px). Any sticky/fixed thing of yours must sit at `top: var(--host-h)`, never above it. Do not use `position: fixed` for full-screen layers.
- Only one direction is visible at a time; the others have the `hidden` attribute. Your section may be hidden at load. The host dispatches a `dir:show` event on your section each time it becomes visible: do all measuring / observer setup / scroll-handler start there (and make it idempotent). Stop rAF loops when the section is hidden.
- Language: write all visible copy in German. For every text element also add `data-en="English text"` on the element that directly contains the text (leaf elements only, no children inside those). The host swaps text. Add one button with attribute `data-lang-toggle` in your header showing "DE / EN"; the host wires it.
- No external libraries, no network requests, no iframes. Vanilla CSS/JS, inline SVG allowed. Forms: preventDefault. No `alert/confirm/prompt`. No `mailto:`/`tel:` links (show the address as text).
- Responsive down to 390px wide with NO horizontal page scroll (anything that pans sideways lives in its own overflow container). Inner wrappers use `padding-inline: max(16px, env(safe-area-inset-left, 0px))`-style gutters. Do not size the hero to 100vh: at most ~80vh minus host bar, and the next section must peek in.
- Everything readable must be visible at rest without scrolling-triggered reveals: animate FROM a visible state (transform shifts are fine; never leave content at opacity 0 waiting for an observer).
- Motion must respect `@media (prefers-reduced-motion: reduce)` (turn scroll/3D effects off).
- 3D/parallax: use CSS `perspective` + transforms driven by one rAF-throttled scroll/pointer handler (optionally CSS scroll-driven animations inside `@supports (animation-timeline: view())`). Animate transform/opacity only.
- Keyboard focus visible; images have alt text; buttons are real `<button>`/`<a>`.
- Required sections, in an order that suits your direction: header/nav · hero (with the next-training or season element) · Termine 2026 · 3 Abteilungen · Über uns + stats · Galerie (6–9 photos) · Mitglied werden (downloads) · Vereinsleben + Clublokal + map placeholder · Kontakt form · Partner · footer.
- Size: 350–600 lines. Quality bar: this is shown to a client as a real design proposal. It must look deliberately designed and clearly different from the other three directions, not a generic template. Avoid: purple gradients, emoji, everything-centred layouts, identical rounded cards everywhere.

When done, reply with 5 lines max: what the signature idea is, which fonts, anything you could not do.
