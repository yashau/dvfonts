// Google-Fonts-compatible CSS API:
//   /css2?family=Faruma&family=Bolhu:wght@400;700&display=swap
// Emits @font-face rules with unicode-range subsets (thaana / latin) so a page
// downloads only the parts of a font it renders. &subset=thaana limits every rule
// to Thaana (THAANA_ONLY_RANGE), so the font can go first in a site-wide stack.

import { error } from '@sveltejs/kit';
import { THAANA_ONLY_RANGE } from '@yashau/thaana';
import { WEIGHT_NAMES, defaultStyle, fontUrl, type Family, type Style } from '#lib/catalog.js';
import { catalog, findByName } from '#lib/server/catalog.js';
import type { RequestHandler } from './$types';

export const prerender = false;

const DISPLAY = new Set(['auto', 'block', 'swap', 'fallback', 'optional']);

function parseFamily(spec: string): { family: Family; styles: Style[] } {
	const [rawName, axes] = spec.split(':');
	const family = findByName(rawName.replace(/\+/g, ' '));
	if (!family) error(400, `Unknown family "${rawName}". See /fonts.json for the list.`);
	if (!axes) return { family, styles: [defaultStyle(family)] };
	const m = /^wght@([\d;.]+)$/.exec(axes);
	if (!m) error(400, `Unsupported axis spec "${axes}". Use family=Name:wght@400;700`);
	const styles = m[1].split(';').map((w) => {
		const s = family.styles.find((st) => st.weight === Number(w));
		if (!s) {
			const have = family.styles.map((st) => st.weight).join(', ');
			error(400, `${family.name} has no weight ${w} (available: ${have})`);
		}
		return s;
	});
	return { family, styles };
}

function faceRules(
	base: string,
	family: Family,
	style: Style,
	display: string,
	normalize: boolean,
	thaanaOnly: boolean
): string[] {
	const o = style.cssOverrides;
	const overrides =
		(o
			? `\n  ascent-override: ${(o.ascent * 100).toFixed(2)}%;\n  descent-override: ${(-o.descent * 100).toFixed(2)}%;\n  line-gap-override: ${(o.lineGap * 100).toFixed(2)}%;`
			: '') +
		// Opt-in: scale so the Thaana letters look as big as Faruma's. The font file is untouched.
		(normalize && style.sizeAdjust ? `\n  size-adjust: ${(style.sizeAdjust * 100).toFixed(1)}%;` : '');
	const head = (comment: string) =>
		`/* ${family.name} ${WEIGHT_NAMES[style.weight]}${comment} */\n@font-face {\n  font-family: '${family.name}';\n  font-style: normal;\n  font-weight: ${style.weight};\n  font-display: ${display};${overrides}`;
	const subsets = Object.keys(style.subsets) as ('thaana' | 'latin')[];
	if (thaanaOnly) {
		// Unmodified fonts have no subsets; the range still keeps the browser from using
		// the whole file for anything but Thaana.
		const file = subsets.includes('thaana') ? 'thaana.woff2' : 'woff2';
		return [
			`${head(' — thaana only')}\n  src: url(${base}${fontUrl(family, style.weight, file)}) format('woff2');\n  unicode-range: ${THAANA_ONLY_RANGE};\n}`
		];
	}
	if (!subsets.length) {
		return [`${head('')}\n  src: url(${base}${fontUrl(family, style.weight, 'woff2')}) format('woff2');\n}`];
	}
	// Latin first, Thaana last: where ranges overlap (digits, punctuation) the
	// later rule wins, so Thaana pages need only the Thaana file.
	return subsets
		.toSorted((a, b) => Number(b === 'latin') - Number(a === 'latin'))
		.map(
			(name) =>
				`${head(` — ${name}`)}\n  src: url(${base}${fontUrl(family, style.weight, `${name}.woff2`)}) format('woff2');\n  unicode-range: ${catalog.subsets[name]};\n}`
		);
}

export const GET: RequestHandler = ({ url }) => {
	const specs = url.searchParams.getAll('family');
	if (!specs.length) error(400, 'Missing ?family=. Example: /css2?family=Faruma&display=swap');
	const display = url.searchParams.get('display') ?? 'swap';
	if (!DISPLAY.has(display)) error(400, `Invalid display "${display}"`);
	const normalize = ['1', 'true'].includes(url.searchParams.get('normalize') ?? '');
	const subset = url.searchParams.get('subset');
	if (subset !== null && subset !== 'thaana') error(400, `Invalid subset "${subset}". Use &subset=thaana`);
	const thaanaOnly = subset === 'thaana';
	const rules = specs
		.flatMap((spec) => spec.split('|'))
		.flatMap((spec) => {
			const { family, styles } = parseFamily(spec);
			return styles.flatMap((s) => faceRules(url.origin, family, s, display, normalize, thaanaOnly));
		});
	return new Response(rules.join('\n\n') + '\n', {
		headers: {
			'content-type': 'text/css; charset=utf-8',
			'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
			'access-control-allow-origin': '*'
		}
	});
};
