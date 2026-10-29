// Font files and per-family zips, from R2: /fonts/<id>/<id>-<weight>.<ext>, /fonts/<id>/<id>.zip
import { error } from '@sveltejs/kit';
import { fontUrl } from '#lib/catalog.js';
import { families } from '#lib/server/catalog.js';
import { serveR2 } from '#lib/server/r2.js';
import type { RequestHandler } from './$types';

export const prerender = false;

// Only files the catalogue lists. R2 keeps the files of removed families (deploys only
// upload), so a pattern check alone would keep serving a font after it's taken down.
const FILES = new Set(
	families.flatMap((f) => [
		`/fonts/${f.id}/${f.id}.zip`,
		...f.styles.flatMap((s) => [
			...Object.keys(s.sizes).map((ext) => fontUrl(f, s.weight, ext)),
			...Object.keys(s.subsets).map((sub) => fontUrl(f, s.weight, `${sub}.woff2`))
		])
	])
);

export const GET: RequestHandler = ({ params, request, url }) => {
	if (!FILES.has(`/fonts/${params.id}/${params.file}`)) error(404, 'Not found');
	const download = url.searchParams.has('download') || params.file.endsWith('.zip');
	return serveR2(request, `fonts/${params.id}/${params.file}`, {
		attachment: download ? url.searchParams.get('download') || params.file : undefined
	});
};
