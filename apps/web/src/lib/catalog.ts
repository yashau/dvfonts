import subsetRanges from '#lib/data/subsets.json';

export type Category = 'official' | 'modern' | 'artistic' | 'handwriting' | 'mono' | 'symbols';

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
	/** The pre-Unicode encoding dvfonts remapped this font from. */
	legacyLayout: 'typewriter' | 'phonetic' | null;
	/** Still in a pre-Unicode encoding (Thaana on Latin keys): a font we may not remap. */
	legacyEncoding: 'typewriter' | 'phonetic' | null;
	/** Vertical metrics in em (absent for fonts without usable ones). */
	metrics: { repaired: boolean } & Partial<MetricOverrides>;
	cssOverrides: MetricOverrides | null;
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
}

/** unicode-range values for the subset files, as emitted by scripts/build.py. */
export const SUBSET_RANGES = subsetRanges as Record<'thaana' | 'latin', string>;

export const CATEGORIES: { id: Category; label: string; thaana: string }[] = [
	{ id: 'official', label: 'Official', thaana: 'ރަސްމީ' },
	{ id: 'modern', label: 'Modern', thaana: 'މޮޑަން' },
	{ id: 'artistic', label: 'Artistic', thaana: 'ފަންނީ' },
	{ id: 'handwriting', label: 'Handwriting', thaana: 'އަތްލިޔުން' },
	{ id: 'mono', label: 'Monospace', thaana: 'މޮނޯ' },
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
export function previewLineHeight(s: Style | undefined): number {
	const m = s?.cssOverrides ?? s?.metrics;
	if (m?.ascent === undefined || m.descent === undefined) return PREVIEW_LINE_HEIGHT;
	const natural = m.ascent - m.descent + (m.lineGap ?? 0);
	// Plus a gap, so one line's fili don't crowd the next line's.
	return Math.max(PREVIEW_LINE_HEIGHT, Math.round((natural + PREVIEW_LINE_GAP) * 100) / 100);
}
