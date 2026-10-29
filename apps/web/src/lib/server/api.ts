import { WEIGHT_NAMES, defaultStyle, fontUrl, type Family } from '#lib/catalog.js';
import { cssApiUrl, SITE_ORIGIN } from '#lib/site.js';
import { families } from '#lib/server/catalog.js';

/** Hash of the font pipeline's output (vite.config.ts): changes whenever any font file may have. */
export const DATA_VERSION = __FONTS_MV_DATA__;

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
		/** The same, with every @font-face limited to Thaana (THAANA_ONLY_RANGE in @yashau/thaana). */
		cssThaanaOnly: cssApiUrl(SITE_ORIGIN, [{ name: f.name, weights }], { thaanaOnly: true }),
		cssFamily: f.name,
		download: `${SITE_ORIGIN}/fonts/${f.id}/${f.id}.zip`,
		/** Per weight. File URLs carry ?v=<fonts.json version>, so they change whenever the files may have. */
		files: f.styles.map((s) => ({
			weight: s.weight,
			style: WEIGHT_NAMES[s.weight],
			...Object.fromEntries(
				Object.keys(s.sizes).map((k) => [k, `${SITE_ORIGIN}${fontUrl(f, s.weight, k)}?v=${DATA_VERSION}`])
			),
			/** Size in bytes of each format above, to check a download and skip unchanged files. */
			bytes: s.sizes,
			/** Line-spacing fixes in em (descent negative), for ascent-/descent-/line-gap-override.
			 *  /css2 applies them; pass them as `cssOverrides` to fontFaceCss/loadFonts when self-hosting. */
			cssOverrides: s.cssOverrides
				? { ascent: s.cssOverrides.ascent, descent: s.cssOverrides.descent, lineGap: s.cssOverrides.lineGap }
				: null,
			sizeAdjust: s.sizeAdjust
		}))
	};
}

export const apiFamilies = () => families.map(apiFamily);
