import { WEIGHT_NAMES, defaultStyle, fontUrl, type Family } from '#lib/catalog.js';
import { cssApiUrl, SITE_ORIGIN } from '#lib/site.js';
import { families } from '#lib/server/catalog.js';

/** Machine-readable family record for /fonts.json and /llms.txt. */
export function apiFamily(f: Family) {
	const weights = f.styles.map((s) => s.weight);
	return {
		id: f.id,
		name: f.name,
		aliases: f.aliases,
		category: f.category,
		license: f.license,
		firstReleased: f.firstYear,
		thisVersion: f.versionYear,
		designer: f.designer ?? f.manufacturer ?? null,
		hasLatin: f.styles.some((s) => s.latin > 0),
		/** Shipped exactly as published (only converted to WOFF/WOFF2): no subsets, line spacing fixed in CSS. */
		unmodified: f.unmodified,
		scriptCoverage: f.category === 'symbols' ? 'symbols on ASCII keys' : 'Thaana (U+0780–U+07BF)',
		defaultWeight: defaultStyle(f).weight,
		weights,
		page: `${SITE_ORIGIN}/fonts/${f.id}`,
		css: cssApiUrl(SITE_ORIGIN, [{ name: f.name, weights }]),
		/** Scale (CSS size-adjust) that makes the Thaana letters look as big as Faruma's; applied by &normalize=1. */
		sizeAdjust: defaultStyle(f).sizeAdjust,
		cssNormalized: cssApiUrl(SITE_ORIGIN, [{ name: f.name, weights }], { normalize: true }),
		cssFamily: f.name,
		download: `${SITE_ORIGIN}/fonts/${f.id}/${f.id}.zip`,
		files: f.styles.map((s) => ({
			weight: s.weight,
			style: WEIGHT_NAMES[s.weight],
			...Object.fromEntries(Object.keys(s.sizes).map((k) => [k, SITE_ORIGIN + fontUrl(f, s.weight, k)]))
		}))
	};
}

export const apiFamilies = () => families.map(apiFamily);
