// Every fact here comes from the old site (crawl of 15.11.2026). Change facts here, not in pages.
export type Lang = 'de' | 'en';
export type L = Record<Lang, string>;

export const club = {
  name: 'AC Herringhausen e.V. im ADAC',
  long: 'Automobilclub Herringhausen e.V. im ADAC',
  short: 'ACH',
  founded: '1969-08-01',
  email: 'ac-herringhausen@gmx.de',
  web: 'www.ac-herringhausen.de',
  seat: { label: { de: 'Vereinssitz', en: 'Registered office' }, street: 'Mittelweg 63', city: 'D-32051 Herford' },
  admin: { label: { de: 'Verwaltungssitz', en: 'Administrative office' }, street: 'Arode 11', city: 'D-32120 Hiddenhausen' },
  register: { court: 'Bad Oeynhausen', number: 'VR 21235' },
  represented: 'Hans-Joachim Kamphowe',
  clublokal: { name: 'Zum Mittelpunkt bei Babi', street: 'Milchstraße 193', city: '32120 Hiddenhausen',
    osm: 'https://www.openstreetmap.org/search?query=Milchstra%C3%9Fe%20193%2C%2032120%20Hiddenhausen' },
  training: { weekday: 6, hour: 15, minute: 0, place: { de: 'Gelände der Firma Goksch', en: 'Goksch company grounds' } },
  adacOwl: 'http://www.adac-owl.de/',
};

export const meetings: { title: L; when: L; time: L }[] = [
  { title: { de: 'Versammlung', en: 'Members’ meeting' }, when: { de: 'Erster Donnerstag im Monat', en: 'First Thursday of the month' }, time: { de: 'ab 19 Uhr', en: 'from 7 pm' } },
  { title: { de: 'Clubabend', en: 'Club evening' }, when: { de: 'Dritter Donnerstag im Monat', en: 'Third Thursday of the month' }, time: { de: 'ab 19 Uhr', en: 'from 7 pm' } },
];

export type Doc = { label: L; href: string; year?: number };
export type Event = { date: string; title: L; place?: L; note?: L; kind: 'kart' | 'slalom'; docs: Doc[] };

// Termine 2026 exactly as on the old "Termine" page. The old site has no 2026 document links.
export const events2026: Event[] = [
  { date: '2026-04-19', kind: 'kart',
    title: { de: 'ADAC Jugend-Kart-Slalom „AC Herringhausen“', en: 'ADAC Youth Kart Slalom “AC Herringhausen”' },
    place: { de: 'toom-Baumarkt Herringhausen', en: 'toom DIY store, Herringhausen' },
    note: { de: 'Achtung: Terminverschiebung vom 12.04.', en: 'Note: moved from 12 April.' }, docs: [] },
  { date: '2026-06-14', kind: 'slalom',
    title: { de: '55. ADAC Automobil-Clubsport-Slalom „AC Herringhausen“', en: '55th ADAC Automobile Clubsport Slalom “AC Herringhausen”' }, docs: [] },
  { date: '2026-09-06', kind: 'slalom',
    title: { de: 'ADAC Automobil-Clubsport-Slalom „VG Kreis Herford“', en: 'ADAC Automobile Clubsport Slalom “VG Kreis Herford”' }, docs: [] },
];

// Links the old site carried on "Aktuelles" and "Ausschreibungen" (all on adac-sport.com, season 2025).
export const archiveDocs: (Doc & { event: L })[] = [
  { year: 2025, event: { de: '54. ADAC Clubsport Slalom AC Herringhausen e.V. im ADAC', en: '54th ADAC Clubsport Slalom AC Herringhausen e.V. im ADAC' },
    label: { de: 'Ergebnisse', en: 'Results' },
    href: 'https://www.adac-sport.com/54_ADAC_Clubsport_Slalom_AC_Herringhaus_21430/TW_ON_Virtueller_Aushang.php' },
  { year: 2025, event: { de: '53. ADAC Clubsport Slalom AC Herringhausen e.V. im ADAC', en: '53rd ADAC Clubsport Slalom AC Herringhausen e.V. im ADAC' },
    label: { de: 'Virtueller Aushang', en: 'Online notice board' },
    href: 'https://www.adac-sport.com/53_ADAC_Clubsport_Slalom_AC_Herringhaus_21429/TW_ON_Virtueller_Aushang.php' },
  { year: 2025, event: { de: 'ADAC Jugend-Kart-Slalom AC Herringhausen', en: 'ADAC Youth Kart Slalom AC Herringhausen' },
    label: { de: 'Ausschreibung (PDF)', en: 'Regulations (PDF, German)' },
    href: 'https://www.adac-sport.com/ADAC_Jugend_Kart_Slalom_AC_Herringhausen_21419/docs/1_Ausschreibung_JKS_2025.pdf' },
];

export const board: { role: L; people: string[] }[] = [
  { role: { de: '1. Vorsitzender', en: 'Chairman' }, people: ['Hans-Joachim Kamphowe'] },
  { role: { de: '2. Vorsitzender', en: 'Vice chairman' }, people: ['Dietmar Babenhauserheide'] },
  { role: { de: 'Sportleiter', en: 'Sports director' }, people: ['Marcel Hellberg'] },
  { role: { de: 'Stellvertretender Sportleiter', en: 'Deputy sports director' }, people: ['Nick Mai'] },
  { role: { de: 'Jugendleiter', en: 'Youth leaders' }, people: ['Detlef Kollmeier', 'Uwe Ritter', 'Sascha Wolff'] },
  { role: { de: 'Schatzmeister', en: 'Treasurer' }, people: ['Melissa Hellberg'] },
  { role: { de: 'Kassenprüfer', en: 'Auditors' }, people: ['Evelyn Erdmann', 'Heike Hein'] },
  { role: { de: 'Sporthilfewart', en: 'Sports aid officer' }, people: ['Evelyn Erdmann'] },
  { role: { de: 'Verkehrsreferent', en: 'Road safety officer' }, people: ['Uwe Ritter'] },
  { role: { de: 'Schriftführer', en: 'Secretary' }, people: ['Gabriele Dürkopp'] },
  { role: { de: 'Pressewart', en: 'Press officer' }, people: ['Melissa Hellberg'] },
  { role: { de: 'Webmaster', en: 'Webmaster' }, people: ['Dennis Schütze'] },
  { role: { de: 'Festausschuss', en: 'Events committee' }, people: ['Sabine Kollmeier', 'Ute Schütze'] },
];

export const kartClasses: { code: string; age: L }[] = [
  { code: 'P1', age: { de: 'ca. 8–9 Jahre', en: 'ages 8–9' } },
  { code: 'P2', age: { de: 'ca. 10–11 Jahre', en: 'ages 10–11' } },
  { code: 'P3', age: { de: 'ca. 12–13 Jahre', en: 'ages 12–13' } },
  { code: 'P4', age: { de: 'ca. 14–15 Jahre', en: 'ages 14–15' } },
  { code: 'P5', age: { de: 'ca. 16–18 Jahre', en: 'ages 16–18' } },
];

// The old kart page publishes these contacts (name, mobile, e-mail) itself.
export const kartContacts = [
  { name: 'Detlef Kollmeier', mobile: '0175 2313944', email: 'detlef.kollmeier@gmx.de' },
  { name: 'Uwe Ritter', mobile: '0171 7817798', email: 'urihf@web.de' },
];

export const downloads: { file: string; title: L; info: L }[] = [
  { file: '/downloads/Beitrittserklaerung.pdf', title: { de: 'Beitrittserklärung AC Herringhausen', en: 'Membership application' },
    info: { de: 'PDF, 1 Seite: Beitritt, SEPA-Lastschriftmandat, Erklärung zum Datenschutz', en: 'PDF, 1 page, German: application, SEPA direct debit mandate, privacy declaration' } },
  { file: '/downloads/Satzung.pdf', title: { de: 'Satzung AC Herringhausen', en: 'Club statutes' },
    info: { de: 'PDF, 5 Seiten, Stand 2019', en: 'PDF, 5 pages, German, 2019 version' } },
  { file: '/downloads/Haftungsausschluss.pdf', title: { de: 'Haftungsausschluss', en: 'Liability waiver' },
    info: { de: 'PDF, 1 Seite: Haftungsausschluss für Teilnehmer an Veranstaltungen', en: 'PDF, 1 page, German: liability waiver for event participants' } },
];

export const partners: { name: string; href: string; logo: string; w: number; h: number }[] = [
  { name: 'ADAC Ostwestfalen-Lippe e.V.', href: 'http://www.adac-owl.de/', logo: '/img/partner/adac.jpg', w: 296, h: 392 },
  { name: 'Herforder Pils', href: 'https://www.herforder.de/cms/index.php', logo: '/img/partner/logo_herforder_pils.jpg', w: 378, h: 149 },
  { name: 'DKS', href: 'http://www.dks-hf.de/', logo: '/img/partner/logo-dks-m-strich.gif', w: 510, h: 168 },
  { name: 'Fahrschule Kronsbein', href: 'http://www.fahrschule-kronsbein.de/', logo: '/img/partner/fahrschule_kronsbein.jpg', w: 1280, h: 926 },
  { name: 'Optik Gössel', href: 'http://www.optik-goessel.de/', logo: '/img/partner/optik_goessel.jpg', w: 1220, h: 960 },
  { name: 'Weinrich Schokolade', href: 'http://www.weinrich-schokolade.de/de/startseite.html', logo: '/img/partner/weinrich.jpg', w: 668, h: 960 },
  { name: 'Wachtmann', href: 'http://wachtmann.eu/', logo: '/img/partner/wachtmann.jpg', w: 1280, h: 864 },
];
