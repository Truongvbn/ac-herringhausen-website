# Brief for building page views (AC Herringhausen, Astro 5)

Project root: this folder (`site/`). You write ONLY the view files named in your task, in `src/views/`.
Do NOT edit shared files (`src/styles/global.css`, `src/layouts`, `src/components`, `src/data`, `src/i18n`, `src/scripts/site.ts`), do NOT run `astro build`/`dev`/`preview` (other agents share the output folder), do not start servers. If you need extra CSS or JS, put it inside your view (`<style>` is scoped by Astro; use `<style is:global>` only with a page-specific class prefix; `<script>` is bundled). Report missing shared needs instead of editing shared files.

## What exists (read these first)
- `src/views/Home.astro` : the finished home page. It is your pattern for structure, tone and the DE/EN approach.
- `src/styles/global.css` : the whole design system. Use its classes; do not reinvent them.
- `src/components/`: `PageHero` (every inner page starts with it), `SectionHead`, `EventRows`, `Downloads`, `MapBlock`, `ContactForm`, `Probe`.
- `src/data/club.ts` : all club facts (events2026, archiveDocs, board, kartClasses, kartContacts, downloads, partners, meetings, club). `src/data/galerie.json` : the two photo albums.
- `src/i18n/routes.ts` (`href(key, lang, '#hash')`), `src/i18n/ui.ts` (shared labels, page titles).
- Old site text, the source of truth: `../crawl/content/*.md` (one file per old page), PDFs as text in `../crawl/pdf/*.txt`, `../BAO-CAO.md` (crawl report, Vietnamese).
- Photos: `public/img/galerie/jugend-kart/<name>.jpg` (+ `-t.jpg` thumbs, 520px) and `public/img/galerie/youngster/`, `public/img/site/` (logo.png, mustang2013.jpg 800x532, img_0687.jpg 800x532 Mustang side-on, dsc_0265.jpg award ceremony 2011, 5.jpg ADAC OWL banner 348x132, 4.png small logo), `public/img/partner/`. All photos are amateur, max 1280px: never show one wider than ~640 CSS px; use `loading="lazy"`, real `width`/`height`, meaningful `alt` in the page language.
  Good kart photos (jugend-kart): img-1953 (best, side-on pan), img-1913, img-1915, img-1958, img-1959, img-1921, img-1910 (two karts at start), img-1842 (pit, red gazebo), img-1859 (kart at pit bench), img-1845 (empty pylon lane), img-1874 (trophies). Avoid using close-ups of children's faces as decoration (img-1849, img-1881, img-1918); they belong only in the gallery.

## View contract
```astro
---
import Base from '../layouts/Base.astro';
import PageHero from '../components/PageHero.astro';
import type { Lang } from '../data/club';
interface Props { lang: Lang; }
const { lang } = Astro.props;
const de = lang === 'de';
---
<Base lang={lang} page="<pageKey>" description={de ? '…' : '…'}>
  <PageHero lang={lang} page="<pageKey>" h1={[de ? 'Zeile eins' : 'Line one', de ? 'Zeile zwei' : 'line two']} lead={…} ghost="WORD" img="/img/…" alt={…} caption={…} />
  <section class="sec">…</section>
</Base>
```
- One view serves both languages. Write every visible string, alt text and aria-label as `{de ? 'Deutsch' : 'English'}` (or a small `const T = de ? {...} : {...}` object at the top for long pages). German is the original; English is your faithful translation. Proper names, German legal terms and addresses stay German.
- Internal links only through `href(key, lang, hash)`. External links: `class="tlink ext" rel="noopener"`, and tell English readers when the target is German.
- Anchors referenced by other pages MUST exist with exactly these ids: kart: `#probetraining`, `#eltern`, `#klassen`; termine: `#unterlagen`; verein: `#vorstand`, `#aktuelles`; galerie: `#jugend-kart`, `#youngster`; mitglied: `#downloads` (the `Downloads` component already sets this id); datenschutz: `#karte`.

## Design rules (decided after a design critique; follow them)
- Dark frame, cream for reading. Any block of running text longer than ~80 words goes on the cream surface: a full-width `<section class="sec paper">` or a `.paper-card`. Inside it use `.prose` (max 34em). Legal pages are entirely `.paper` below the hero.
- Display type (condensed italic caps: `.sh h2`, `.h3`, `.btn`, `.ph h1`) is ONLY for short headings, dates, numbers and buttons. Names of people, event titles, download labels and sentences use normal Barlow (`.h4`, `<b>`, plain text).
- Red `var(--red)` is for fills; red text on dark must be `var(--red-t)`; on cream `var(--red-d)`. Yellow `var(--yel)` only for times/penalty figures/dates-as-data. Meaningful borders use `var(--edge)`.
- No decorative numbering (no 01/02/03 labels) unless the content is a real sequence (then use `.steps`). No fake "live" elements. No emoji.
- Motion on inner pages: only what global.css already gives (hero drift, slide-in). Nothing pinned, no new scroll JS. Hover effects fine.
- Mobile first: must work at 360px with no horizontal scroll; tables go in an `overflow-x:auto` wrapper; long German words need `hyphens:auto` (already on headings).
- Every page ends with a sensible next step (links/buttons to related pages).

## Content rules (the client's requirement is: 100% of the old site's INFORMATION must survive)
- Every fact, name, number, date, link and document on the old pages assigned to you must appear on your new page(s). Re-read the old `.md` files line by line when you finish and check nothing is missing. Fix obvious typos silently (e.g. "Herringahusen", "seit" for "seid"), keep the meaning.
- You may reorganise, shorten repetition and write connective copy. Anything that states a FACT not found on the old site (or in the research notes given in your task) must be wrapped: `<div data-draft="kurzer Grund">…</div>` (it renders with a visible "Entwurf" marker for the client). Plain UI wording, headings and transitions do not need the marker.
- Never invent facts about the club (fees, addresses, history, results, people).

## When done
Reply (max 12 lines): files written; per page, the list of `data-draft` blocks you added and why; any old-site information you could NOT place; anything in shared files that needs changing.
