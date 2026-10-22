// Font files and per-family zips, from R2: /fonts/<id>/<id>-<weight>.<ext>, /fonts/<id>/<id>.zip
import { error } from '@sveltejs/kit';
import { serveR2 } from '#lib/server/r2.js';
import type { RequestHandler } from './$types';

export const prerender = false;

const FILE_RE = /^[a-z0-9-]+(?:-\d{3})?(?:\.(?:thaana|latin))?\.(?:woff2|woff|ttf|otf|zip)$/;

export const GET: RequestHandler = ({ params, platform, request, url }) => {
	if (!FILE_RE.test(params.file) || !params.file.startsWith(`${params.id}`)) error(404, 'Not found');
	const download = url.searchParams.has('download') || params.file.endsWith('.zip');
	return serveR2(platform, request, `fonts/${params.id}/${params.file}`, {
		attachment: download ? (url.searchParams.get('download') || params.file) : undefined
	});
};
