// One-line installers: /install/<bundle>.sh (macOS, Linux) and /install/<bundle>.ps1
// (PowerShell). Served by the Worker rather than prerendered, so they go out as
// text/plain: static assets would give .ps1 a binary type that `irm | iex` can't run.
import { error } from '@sveltejs/kit';
import { INSTALLABLE, ps1Script, shScript } from '#lib/install.js';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = ({ params }) => {
	const m = /^([a-z0-9-]+)\.(sh|ps1)$/.exec(params.script);
	const bundle = m && INSTALLABLE.find((b) => b.id === m[1]);
	if (!m || !bundle) error(404, 'No such installer');
	return new Response(m[2] === 'sh' ? shScript(bundle) : ps1Script(bundle), {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600',
			'access-control-allow-origin': '*'
		}
	});
};
