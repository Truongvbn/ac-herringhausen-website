import type { Lang } from '../data/club';

// One entry per page. `de` and `en` are the public paths; keep the trailing slash.
export const routes = {
  home:        { de: '/',                     en: '/en/' },
  termine:     { de: '/termine/',             en: '/en/events/' },
  verein:      { de: '/verein/',              en: '/en/club/' },
  kart:        { de: '/jugend-kart-slalom/',  en: '/en/youth-kart-slalom/' },
  clubsport:   { de: '/clubsport-slalom/',    en: '/en/clubsport-slalom/' },
  oldtimer:    { de: '/oldtimer-rallye/',     en: '/en/classic-rally/' },
  galerie:     { de: '/galerie/',             en: '/en/gallery/' },
  mitglied:    { de: '/mitglied-werden/',     en: '/en/join/' },
  partner:     { de: '/partner/',             en: '/en/partners/' },
  kontakt:     { de: '/kontakt/',             en: '/en/contact/' },
  gaestebuch:  { de: '/gaestebuch/',          en: '/en/guestbook/' },
  sitemap:     { de: '/sitemap/',             en: '/en/sitemap/' },
  impressum:   { de: '/impressum/',           en: '/en/legal-notice/' },
  datenschutz: { de: '/datenschutz/',         en: '/en/privacy/' },
} as const;

export type PageKey = keyof typeof routes;
export const href = (key: PageKey, lang: Lang, hash = '') => routes[key][lang] + hash;
export const other = (lang: Lang): Lang => (lang === 'de' ? 'en' : 'de');
