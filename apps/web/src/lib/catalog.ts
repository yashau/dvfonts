import subsetRanges from '#lib/data/subsets.json';

export type Category = 'official' | 'modern' | 'artistic' | 'handwriting' | 'novelty' | 'symbols';

export interface MetricOverrides {
	ascent: number;
	descent: number;
	lineGap: number;
}

export interface Style {
	weight: number;
	source: string;
	desktopFile: string;
	sizes: Record<string, number>;
	subsets: Partial<Record<'thaana' | 'latin', number>>;
	upstream: string | null;
	/** The pre-Unicode encoding fonts.mv remapped this font from. */
	legacyLayout: 'typewriter' | 'phonetic' | null;
	/** Vertical metrics in em (absent for fonts without usable ones). */
	metrics: { repaired: boolean } & Partial<MetricOverrides>;
	cssOverrides: MetricOverrides | null;
	/** Optional scale (CSS size-adjust) that makes the Thaana letters look as big as Faruma's. */
	sizeAdjust: number | null;
	glyphs: number;
	thaana: number;
	latin: number;
	codepoints: number;
}

export interface Family {
	id: string;
	name: string;
	category: Category;
	aliases: string[];
	notes: string | null;
	/** Kept off the browse page (still has its own page, downloads and bundles). */
	hidden: boolean;
	license: string;
	unmodified: boolean;
	/** Why the files are shipped as published: their license, or the designer's terms. */
	unmodifiedReason: 'license' | 'designer' | null;
	source: string | null;
	upstream: string | null;
	attribution: string | null;
	copyright: string | null;
	designer: string | null;
	manufacturer: string | null;
	description: string | null;
	vendorUrl: string | null;
	designerUrl: string | null;
	licenseText: string | null;
	licenseUrl: string | null;
	version: string | null;
	styles: Style[];
	zipSize: number;
	/** For symbol fonts: the keys the testers show instead of a Thaana pangram. */
	sample: { heading?: string; subheading?: string; text?: string } | null;
	/** Every character the family draws, in code point order. */
	chars: string;
	/** Keyboard keys that carry a large drawing (a Bismillah on `, say) instead of their own symbol. */
	keyGlyphs: string;
	/** Year the design first came out, from the font files or families.toml; null when unknown. */
	firstYear: number | null;
	/** Year of the version shipped here; null when unknown. */
	versionYear: number | null;
}

/** unicode-range values for the subset files, as emitted by scripts/build.py. */
export const SUBSET_RANGES = subsetRanges as Record<'thaana' | 'latin', string>;

/** Selected when the browse page loads: the fonts people reach for most (text, display, handwriting). */
export const DEFAULT_CATEGORIES: Category[] = ['official', 'artistic', 'handwriting'];

export const CATEGORIES: { id: Category; label: string; thaana: string }[] = [
	{ id: 'official', label: 'Official', thaana: 'ރަސްމީ' },
	{ id: 'handwriting', label: 'Handwriting', thaana: 'އަތްލިޔުން' },
	{ id: 'artistic', label: 'Artistic', thaana: 'ފަންނީ' },
	{ id: 'modern', label: 'Modern', thaana: 'މޮޑަން' },
	{ id: 'novelty', label: 'Novelty', thaana: 'ތަފާތު' },
	{ id: 'symbols', label: 'Symbols', thaana: 'ނިޝާން' }
];

/** Families surfaced first on the home page (the rest follow alphabetically). */
export const FEATURED = [
	'modfaruma',
	'mv-ilham',
	'mv-faseyha',
	'mv-a-waheed',
	'mv-randhoo',
	'noto-sans-thaana',
	'bolhu',
	'kolhu',
	'theras',
	'mv-typewriter',
	'zaana-thedhu',
	'fanara-golhi',
	'mv-utheemu',
	'mv-raadhavalhi',
	'a-reethi',
	'mv-kelaa',
	'mv-vaadhoo',
	'fanara',
	'masnooee-mono'
];

export const WEIGHT_NAMES: Record<number, string> = {
	100: 'Thin',
	200: 'ExtraLight',
	300: 'Light',
	400: 'Regular',
	500: 'Medium',
	600: 'SemiBold',
	700: 'Bold',
	800: 'ExtraBold',
	900: 'Black'
};

/** The style a card previews: Regular if present, else the closest weight. */
export function defaultStyle(f: Family): Style {
	return f.styles.toSorted((a, b) => Math.abs(a.weight - 400) - Math.abs(b.weight - 400))[0];
}

/** Best-effort credit line: designer, else manufacturer, else copyright. */
export function credit(f: Family): string | null {
	return meaningful(f.designer) ?? meaningful(f.manufacturer) ?? meaningful(f.copyright);
}

/** The people (or studios) a designer credit names: each comma-separated designer, plus
 *  anyone credited in brackets (calligraphy by, assisted by, begun by, after, with). "Hassan Hameed (calligraphy by Abdulla Waheed, Eydhafushi)" names
 *  Hassan Hameed and Abdulla Waheed; places and notes in brackets are skipped. */
export function authors(f: Family): string[] {
	const out: string[] = [];
	for (const part of splitTopLevel(f.designer ?? '')) {
		const m = /^([^(]+?)\s*(?:\((.*)\))?$/.exec(part);
		if (!m) continue;
		out.push(m[1]);
		// "calligraphy by X", "assisted by X", "begun by X", "after X", "with X and Y";
		// anything after a comma is a place or a note.
		const credited = /^(?:(?:calligraphy|assisted|begun) by|after|with) ([^,;]+)/.exec(m[2] ?? '');
		if (credited) for (const name of credited[1].split(/ and /)) out.push(name.trim());
	}
	return [...new Set(out.filter(Boolean))];
}

/** Stands in for an author in the filter when a font names nobody. Sites and archives the
 *  font came from (dhivehi.mv, dhivehifont.com) aren't authors. */
export const UNKNOWN_AUTHOR = 'Unknown';

/** The family's authors, or [UNKNOWN_AUTHOR] when it names none. */
export function authorsOrUnknown(f: Family): string[] {
	const list = authors(f);
	return list.length ? list : [UNKNOWN_AUTHOR];
}

/** The credit line split into plain text and author names, for linking the names. */
export function creditParts(f: Family): { text: string; author?: string }[] {
	const line = meaningful(f.designer);
	if (!line) return [{ text: 'Unknown author', author: UNKNOWN_AUTHOR }];
	const parts: { text: string; author?: string }[] = [];
	let rest = line;
	for (const name of authors(f)) {
		const i = rest.indexOf(name);
		if (i < 0) continue;
		if (i) parts.push({ text: rest.slice(0, i) });
		parts.push({ text: name, author: name });
		rest = rest.slice(i + name.length);
	}
	if (rest) parts.push({ text: rest });
	return parts;
}

function splitTopLevel(s: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === '(') depth++;
		else if (s[i] === ')') depth--;
		else if (s[i] === ',' && depth === 0) {
			parts.push(s.slice(start, i).trim());
			start = i + 1;
		}
	}
	parts.push(s.slice(start).trim());
	return parts.filter(Boolean);
}

/** Drop font-editor boilerplate that some files carry instead of a real credit. */
function meaningful(s: string | null): string | null {
	return s && !/fontographer|fontlab|copyright info pending/i.test(s) ? s : null;
}

export function fontUrl(f: Family, weight: number, kind: string): string {
	return `/fonts/${f.id}/${f.id}-${weight}.${kind}`;
}

export function formatBytes(n: number): string {
	return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Default line height for previews; Thaana needs room for fili above and below. */
export const PREVIEW_LINE_HEIGHT = 1.6;
/** Space added between lines for fonts taller than that (in em). */
const PREVIEW_LINE_GAP = 0.2;

/**
 * Line height for previewing a style: the default, or the font's own height
 * (ascent + descent + gap, as the browser will use it) plus a little spacing
 * when that is taller.
 * Fonts with very tall fili, like Faiy, are otherwise clipped where previews
 * hide overflow (line clamping).
 */
export function previewLineHeight(s: Style | undefined, scale = 1): number {
	const m = s?.cssOverrides ?? s?.metrics;
	if (m?.ascent === undefined || m.descent === undefined) return PREVIEW_LINE_HEIGHT;
	// size-adjust scales the font's line box along with its glyphs.
	const natural = (m.ascent - m.descent + (m.lineGap ?? 0)) * scale;
	// Plus a gap, so one line's fili don't crowd the next line's.
	return Math.max(PREVIEW_LINE_HEIGHT, Math.round((natural + PREVIEW_LINE_GAP) * 100) / 100);
}
