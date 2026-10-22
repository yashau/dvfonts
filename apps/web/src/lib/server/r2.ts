// Serve objects from the STATIC R2 bucket (fonts/…, downloads/…) with edge
// caching, conditional requests and CORS. Everything binary on the site lives
// in R2; see fonts/scripts/r2_manifest.py for how it gets there.

import { error } from '@sveltejs/kit';
// SvelteKit 3 + adapter-cloudflare 8 pass no `platform` to handlers; bindings
// come from the Workers runtime module (the adapter shims it in `vite dev`).
import { env, waitUntil } from 'cloudflare:workers';

const TYPES: Record<string, string> = {
	woff2: 'font/woff2',
	woff: 'font/woff',
	ttf: 'font/ttf',
	otf: 'font/otf',
	zip: 'application/zip'
};

export interface ServeOptions {
	/** Force a download with this file name. */
	attachment?: string;
	/** Seconds browsers and the edge may cache the response. */
	maxAge?: number;
}

/** The Workers edge cache; absent in `vite dev`, which runs on Node. */
function edgeCache(): Cache | undefined {
	const c = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches;
	return c?.default;
}

export async function serveR2(
	request: Request,
	key: string,
	{ attachment, maxAge = 604800 }: ServeOptions = {}
): Promise<Response> {
	const bucket = env.STATIC;
	if (!bucket) error(503, 'Static storage is not configured');

	// Edge cache first: R2 reads cost more than cache hits and fonts never change
	// within a release.
	const cache = edgeCache();
	const cacheKey = new Request(new URL(request.url).toString(), { method: 'GET' });
	if (cache && request.method === 'GET' && !request.headers.has('if-none-match')) {
		const hit = await cache.match(cacheKey);
		if (hit) return hit;
	}

	const object = await bucket.get(key, { onlyIf: request.headers });
	if (!object) error(404, 'Not found');

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	const ext = key.slice(key.lastIndexOf('.') + 1).toLowerCase();
	headers.set('content-type', TYPES[ext] ?? 'application/octet-stream');
	headers.set('etag', object.httpEtag);
	headers.set('cache-control', `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 4}`);
	headers.set('access-control-allow-origin', '*');
	headers.set('timing-allow-origin', '*');
	if (attachment) headers.set('content-disposition', `attachment; filename="${attachment}"`);

	if (!('body' in object) || !object.body) return new Response(null, { status: 304, headers });
	headers.set('content-length', String(object.size));
	const response = new Response(object.body, { headers });
	if (cache && request.method === 'GET') {
		waitUntil(cache.put(cacheKey, response.clone()));
	}
	return response;
}
