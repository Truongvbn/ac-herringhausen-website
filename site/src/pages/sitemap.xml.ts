import type { APIRoute } from 'astro';
import { routes } from '../i18n/routes';

// Machine sitemap with both language versions of every page.
export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const urls = Object.values(routes).flatMap((r) => (['de', 'en'] as const).map((l) =>
    `<url><loc>${abs(r[l])}</loc><xhtml:link rel="alternate" hreflang="de" href="${abs(r.de)}"/><xhtml:link rel="alternate" hreflang="en" href="${abs(r.en)}"/></url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } });
};
