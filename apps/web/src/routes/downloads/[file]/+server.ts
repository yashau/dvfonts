// Download bundles from R2 (fonts/scripts/bundles.py): /downloads/dvfonts-<bundle>.zip
import { error } from '@sveltejs/kit';
import bundles from '#lib/data/bundles.json';
import { serveR2 } from '#lib/server/r2.js';
import type { RequestHandler } from './$types';

export const prerender = false;

const files = new Set(bundles.map((b) => b.file));

export const GET: RequestHandler = ({ params, request }) => {
	if (!files.has(params.file)) error(404, 'No such download');
	return serveR2(request, `downloads/${params.file}`, { attachment: params.file, maxAge: 86400 });
};
