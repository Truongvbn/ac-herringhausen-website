import type { Lang } from '../data/club';
import type { PageKey } from './routes';

// Shared interface texts. Page copy lives in the views.
export const ui = {
  de: {
    skip: 'Zum Inhalt springen',
    menu: 'Menü', close: 'Schließen', mainNav: 'Hauptnavigation',
    trial: 'Probetraining',
    nextTraining: 'Nächstes Training', saturday: 'Samstag', clock: '15:00 Uhr',
    trainingNote: 'außer in den Ferien',
    trainingPlace: 'Gelände der Firma Goksch',
    days: 'Tage', hrs: 'Std', min: 'Min', sec: 'Sek',
    weekly: 'wöchentlich', finished: 'gefahren', upcoming: 'geplant',
    ausschreibung: 'Ausschreibung', ergebnisse: 'Ergebnisse', docsFollow: 'Unterlagen folgen',
    langSwitch: 'English', langSwitchShort: 'EN', langLabel: 'Diese Seite auf Englisch',
    footClub: 'Verein', footSport: 'Motorsport', footInfo: 'Service',
    footLine: 'Ortsclub im ADAC Ostwestfalen-Lippe · gegründet 1969',
    clublokal: 'Clublokal', visitors: 'Besucher', visitorsPending: 'Zähler noch nicht verbunden',
    mapLoad: 'Karte laden', mapRoute: 'Route in OpenStreetMap öffnen',
    mapConsent: 'Beim Laden der Karte wird Ihre IP-Adresse an die OpenStreetMap Foundation übertragen. Mehr dazu in der Datenschutzerklärung.',
    pdf: 'PDF', home: 'Start',
  },
  en: {
    skip: 'Skip to content',
    menu: 'Menu', close: 'Close', mainNav: 'Main navigation',
    trial: 'Trial session',
    nextTraining: 'Next training', saturday: 'Saturday', clock: '3:00 pm',
    trainingNote: 'except during school holidays',
    trainingPlace: 'Goksch company grounds',
    days: 'days', hrs: 'hrs', min: 'min', sec: 'sec',
    weekly: 'weekly', finished: 'completed', upcoming: 'planned',
    ausschreibung: 'Regulations', ergebnisse: 'Results', docsFollow: 'Documents to follow',
    langSwitch: 'Deutsch', langSwitchShort: 'DE', langLabel: 'This page in German',
    footClub: 'Club', footSport: 'Motorsport', footInfo: 'Service',
    footLine: 'Local club in the ADAC Ostwestfalen-Lippe · founded 1969',
    clublokal: 'Clubhouse', visitors: 'Visitors', visitorsPending: 'Counter not connected yet',
    mapLoad: 'Load map', mapRoute: 'Open route in OpenStreetMap',
    mapConsent: 'Loading the map sends your IP address to the OpenStreetMap Foundation. See the privacy policy for details.',
    pdf: 'PDF', home: 'Home',
  },
} as const;

export const titles: Record<PageKey, Record<Lang, string>> = {
  home:        { de: 'Start', en: 'Home' },
  termine:     { de: 'Termine', en: 'Events' },
  verein:      { de: 'Verein', en: 'Club' },
  kart:        { de: 'Jugend-Kart-Slalom', en: 'Youth kart slalom' },
  clubsport:   { de: 'Clubsport-Slalom', en: 'Clubsport slalom' },
  oldtimer:    { de: 'Oldtimer-Rallye', en: 'Classic car rally' },
  galerie:     { de: 'Galerie', en: 'Gallery' },
  mitglied:    { de: 'Mitglied werden', en: 'Join the club' },
  partner:     { de: 'Partner', en: 'Partners' },
  kontakt:     { de: 'Kontakt', en: 'Contact' },
  gaestebuch:  { de: 'Gästebuch', en: 'Guestbook' },
  sitemap:     { de: 'Sitemap', en: 'Sitemap' },
  impressum:   { de: 'Impressum', en: 'Legal notice' },
  datenschutz: { de: 'Datenschutz', en: 'Privacy' },
};

// Short labels for the header navigation.
export const navLabels: Partial<Record<PageKey, Record<Lang, string>>> = {
  kart: { de: 'Kart-Jugend', en: 'Youth karting' },
  clubsport: { de: 'Clubsport', en: 'Clubsport' },
  oldtimer: { de: 'Oldtimer', en: 'Classics' },
};
export const mainNav: PageKey[] = ['termine', 'kart', 'clubsport', 'oldtimer', 'verein', 'galerie', 'mitglied', 'kontakt'];
export const label = (k: PageKey, lang: Lang) => navLabels[k]?.[lang] ?? titles[k][lang];
