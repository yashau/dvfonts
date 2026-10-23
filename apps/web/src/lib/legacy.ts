// Pre-Unicode (A_) fonts we may not remap keep their Thaana on Latin keys, so
// typed Unicode text would only show fallback glyphs. Previews write the sample
// in the font's own encoding instead: the inverse of convertLegacy().
import { LEGACY_LAYOUTS, type LegacyLayout } from '@yashau/thaana';
import type { Family } from '#lib/catalog.js';

const inverse = Object.fromEntries(
	(Object.keys(LEGACY_LAYOUTS) as LegacyLayout[]).map((layout) => {
		const map: Record<string, string> = {};
		for (const [key, thaana] of Object.entries(LEGACY_LAYOUTS[layout])) map[thaana] ??= key;
		return [layout, map];
	})
) as Record<LegacyLayout, Record<string, string>>;

/** The encoding a family's files still use, or null for Unicode fonts. */
export function legacyEncoding(family: Family): LegacyLayout | null {
	return family.styles.find((s) => s.legacyEncoding)?.legacyEncoding ?? null;
}

/**
 * Unicode Thaana -> the keys a legacy font draws it from, in reading order.
 * Display it right to left with `unicode-bidi: bidi-override` (the keys are
 * Latin, so the browser would otherwise lay them out left to right); digit runs
 * are isolated left to right so numbers still read correctly.
 */
export function toLegacy(text: string, layout: LegacyLayout): string {
	const map = inverse[layout];
	return [...text]
		.map((c) => map[c] ?? c)
		.join('')
		.replace(/\d[\d.,:/-]*\d|\d/g, (m) => `\u2066${m}\u2069`);
}
