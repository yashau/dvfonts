// /sitemap.xml for search engines, built from the catalogue: the site's pages, every
// listed family and every author page. Prerendered, so it follows the data on each build.
import { FEATURED_AUTHORS } from '#lib/authors.js';
import { DOCS } from '#lib/docs-nav.js';
import { families } from '#lib/server/catalog.js';
import { SITE_ORIGIN } from '#lib/site.js';

export const prerender = true;

export const GET = () => {
	const paths = [
		'/',
		...DOCS.map((d) => d.href),
		'/downloads',
		'/authors',
		'/about',
		...families.filter((f) => !f.hidden).map((f) => `/fonts/${f.id}`),
		...FEATURED_AUTHORS.map((a) => `/authors/${a.slug}`)
	];
	const urls = paths.map((p) => `\t<url><loc>${SITE_ORIGIN}${p}</loc></url>`).join('\n');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
};
