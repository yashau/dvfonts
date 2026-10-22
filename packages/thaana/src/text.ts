/**
 * Putting Thaana on screen correctly: script detection, direction, bidi
 * isolation, punctuation clean-up and repair of text copied out of PDFs.
 *
 * Much of this is ported from rihaPDF (github.com/yashau/rihaPDF), where each
 * rule was added for a real document; the tests pin the same cases.
 */

/** Strong right-to-left code points: Hebrew, Arabic, Syriac, Thaana, NKo, Arabic
 *  presentation forms and the historic RTL scripts. */
function isRtlCodePoint(cp: number): boolean {
	return (
		(cp >= 0x0590 && cp <= 0x08ff) ||
		(cp >= 0xfb1d && cp <= 0xfdff) ||
		(cp >= 0xfe70 && cp <= 0xfefe) ||
		(cp >= 0x10800 && cp <= 0x10fff) ||
		(cp >= 0x1e800 && cp <= 0x1efff)
	);
}

/** Strong left-to-right letters (Latin, Greek, Cyrillic). Digits and
 *  punctuation are direction-neutral and deliberately not included. */
function isLtrLetter(cp: number): boolean {
	return (
		(cp >= 0x41 && cp <= 0x5a) ||
		(cp >= 0x61 && cp <= 0x7a) ||
		(cp >= 0xc0 && cp <= 0x2af && cp !== 0xd7 && cp !== 0xf7) ||
		(cp >= 0x370 && cp <= 0x3ff) ||
		(cp >= 0x400 && cp <= 0x4ff)
	);
}

const THAANA_RE = /[ހ-޿]/u;

/** True if the string contains any Thaana. */
export function hasThaana(text: string): boolean {
	return THAANA_RE.test(text);
}

/** True if the string contains any right-to-left letter (Thaana, Arabic, Hebrew…). */
export function hasRtl(text: string): boolean {
	for (const ch of text) if (isRtlCodePoint(ch.codePointAt(0)!)) return true;
	return false;
}

/** True if the string mixes right-to-left letters with Latin/Greek/Cyrillic
 *  letters. Digits, spaces and punctuation don't count, so "ދިވެހި 123" is not mixed. */
export function isMixedScript(text: string): boolean {
	let rtl = false;
	let ltr = false;
	for (const ch of text) {
		const cp = ch.codePointAt(0)!;
		if (isRtlCodePoint(cp)) rtl = true;
		else if (isLtrLetter(cp)) ltr = true;
		if (rtl && ltr) return true;
	}
	return false;
}

/** Direction of the first strong character, the same rule as dir="auto". */
export function detectDirection(text: string): 'rtl' | 'ltr' | 'neutral' {
	for (const ch of text) {
		const cp = ch.codePointAt(0)!;
		if (isRtlCodePoint(cp)) return 'rtl';
		if (isLtrLetter(cp)) return 'ltr';
	}
	return 'neutral';
}

/**
 * Direction to render a piece of text with. An explicit choice always wins;
 * otherwise any right-to-left letter makes it RTL. This suits Dhivehi UIs
 * better than dir="auto", which turns "Apple ގެ ފޯނު" left-to-right because
 * the first letter is Latin.
 */
export function resolveDirection(text: string, explicit?: 'rtl' | 'ltr' | null): 'rtl' | 'ltr' {
	if (explicit) return explicit;
	return hasRtl(text) ? 'rtl' : 'ltr';
}

/** Unicode bidi isolates. Prefer the HTML <bdi> element when you control markup. */
export const LRI = '⁦';
export const RLI = '⁧';
export const FSI = '⁨';
export const PDI = '⁩';

/**
 * Wrap a value in a directional isolate so it can't scramble the sentence
 * around it: phone numbers, URLs, emails, code or user names inside Thaana
 * text. For plain strings (titles, notifications, canvas, SVG) where you can't
 * use <bdi> or dir="ltr".
 */
export function isolate(value: string, direction: 'ltr' | 'rtl' | 'auto' = 'ltr'): string {
	return (direction === 'ltr' ? LRI : direction === 'rtl' ? RLI : FSI) + value + PDI;
}

// A number-like token. Either an international phone number ("+960 333-1234",
// spaces allowed, isolated as ONE unit, or an RTL paragraph would swap its
// groups), or an optionally signed number with internal . , : / - separators and
// an optional %. Tokens start and end on a digit (or %), so a trailing comma or
// full stop stays outside and keeps flowing with the sentence.
const NUMBER_TOKEN_RE = /(^|[\s\p{P}\p{S}])(\+\d[\d -]*\d|[+\-\u2212]?\d(?:[\d.,:/-]*\d)?%?)(?=$|[\s\p{P}\p{S}])/gu;

/**
 * Wrap numbers in right-to-left text in left-to-right isolates, so "-5",
 * "+960 333-1234", "9:00", "1,000" and "50%" keep their order inside Thaana.
 * Brackets around a number stay outside the isolate (putting them inside makes
 * the closing bracket jump). No-op for text without right-to-left letters.
 * Strip the controls again with stripBidiControls() before saving.
 */
export function isolateNumbers(text: string, rtl: boolean = hasRtl(text)): string {
	if (!rtl) return text;
	return text.replace(NUMBER_TOKEN_RE, (_m, prefix: string, token: string) => `${prefix}${LRI}${token}${PDI}`);
}

const BIDI_CONTROLS = /[؜‎‏‪-‮⁦-⁩]/gu;

/** Remove bidi control characters (before saving, searching or comparing text). */
export function stripBidiControls(text: string): string {
	return text.replace(BIDI_CONTROLS, '');
}

const RTL_OR_DIGIT = '[\\d\\u0590-\\u08FF\\uFB1D-\\uFDFF\\uFE70-\\uFEFE]';
const OPENER_RE = /^[\p{Ps}\p{Pi}]$/u;
const OPENER_GAP_RE = new RegExp(`(\\p{P})\\s+(?=${RTL_OR_DIGIT})`, 'gu');
const BEFORE_PUNCT_GAP_RE = new RegExp(`(${RTL_OR_DIGIT})\\s+(\\p{P})`, 'gu');

export interface NormalizePunctuationOptions {
	/** Turn Latin , ; ? that follow Thaana into ، ؛ ؟. Default: true. */
	arabicPunctuation?: boolean;
}

/**
 * Tidy spacing and punctuation in Thaana text:
 *   "ބަސް ، ބުދަ ؛ އެއް ؟ ނޫން !"  →  "ބަސް، ބުދަ؛ އެއް؟ ނޫން!"
 *   "ދުވަސް ( ބުރުނު ) [ 8 ]"      →  "ދުވަސް (ބުރުނު) [8]"
 * Spaces before punctuation go, spaces just inside opening brackets/quotes go,
 * and the space before an opening bracket is kept.
 */
export function normalizePunctuation(text: string, options: NormalizePunctuationOptions = {}): string {
	const { arabicPunctuation = true } = options;
	let out = text;
	if (arabicPunctuation) {
		out = out
			.replace(/([ހ-޿])(\s*),/gu, '$1$2،')
			.replace(/([ހ-޿])(\s*);/gu, '$1$2؛')
			.replace(/([ހ-޿])(\s*)\?/gu, '$1$2؟');
	}
	return out
		.split('\n')
		.map((line) =>
			line
				.replace(OPENER_GAP_RE, (match, punct: string) => (OPENER_RE.test(punct) ? punct : match))
				.replace(BEFORE_PUNCT_GAP_RE, (match, lead: string, punct: string) =>
					OPENER_RE.test(punct) ? match : `${lead}${punct}`
				)
		)
		.join('\n');
}

/**
 * Repair Thaana text copied out of a PDF. PDFs store right-to-left text in
 * visual order, so after copy/paste dates and times come out reversed
 * ("2026/1/14" for 14/1/2026, "00:9" for 9:00), punctuation picks up stray
 * spaces, numbered-list markers jump to the end ("1 ބައި." for ".1 ބައި") and
 * "1.2" section markers arrive as ".12". Only lines containing Thaana are
 * touched. Do NOT run this on text people typed: it would reverse their dates.
 */
export function repairPdfText(text: string): string {
	return text
		.split('\n')
		.map((line) => {
			if (!hasThaana(line)) return line;
			let out = line.replace(/([/:])\s+(?=\d)/gu, '$1');
			out = out.replace(/\d+(?:[/:]\d+)+/gu, (group) => {
				const seps = new Set(group.match(/[/:]/gu));
				if (seps.size !== 1) return group;
				const [sep] = seps;
				return group.split(sep).toReversed().join(sep);
			});
			out = normalizePunctuation(out, { arabicPunctuation: false });
			out = out.replace(
				/^(\s*)\.(\d)(\d)(\s+)/u,
				(_m, lead: string, major: string, minor: string, gap: string) => `${lead}${minor}-${major}${gap}`
			);
			const list = /^(\s*)(\d+)(\s+)([\s\S]*?)(\s*)\.$/u.exec(out);
			if (list && hasThaana(list[4])) {
				const [, lead, marker, gap, body, tail] = list;
				out = `${lead}.${marker}${gap}${body}${tail}`;
			}
			return out;
		})
		.join('\n');
}

/** Thaana fonts installed on common systems, used as a fallback for glyphs a
 *  web font lacks: MV Boli ships with Windows, Noto Sans Thaana with Android
 *  and most Linux desktops. */
export const SYSTEM_THAANA_FONTS: readonly string[] = ['Noto Sans Thaana', 'MV Boli'];

/**
 * A font-family value that keeps both scripts readable: most Dhivehi fonts have
 * no Latin letters, so Latin falls through to the system UI font, and missing
 * Thaana falls through to an installed Thaana font.
 *
 *   fontStack('Faruma')  →  "'Faruma', system-ui, 'Noto Sans Thaana', 'MV Boli', sans-serif"
 */
export function fontStack(family: string, { latin = 'system-ui' }: { latin?: string } = {}): string {
	return [family, latin, ...SYSTEM_THAANA_FONTS, 'sans-serif'].map(quoteFamily).join(', ');
}

/** Generic families (system-ui, sans-serif) stay bare; names get quoted. */
function quoteFamily(f: string): string {
	return /^[a-z-]+$/.test(f) ? f : `'${f}'`;
}
