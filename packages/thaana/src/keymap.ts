/**
 * Latin key -> Thaana: Microsoft's "Divehi Phonetic" keyboard layout (kbddiv1),
 * the layout Maldivian websites use via aharen/thaana-keyboard
 * (h→ހ, a→ަ, q→ް sukun, w→އ alifu …).
 *
 * Brackets are not remapped here. Browsers mirror ( ) [ ] { } < > in RTL text,
 * so "(" typed before the enclosed text stays U+0028 and displays and copies
 * correctly. Microsoft's layout swaps the pairs so the glyph on screen matches
 * the key label; see BRACKET_SWAP / the `swapBrackets` keyboard option.
 */
export const KEYMAP: Readonly<Record<string, string>> = Object.freeze({
	q: 'ް',
	w: 'އ',
	e: 'ެ',
	r: 'ރ',
	t: 'ތ',
	y: 'ޔ',
	u: 'ު',
	i: 'ި',
	o: 'ޮ',
	p: 'ޕ',
	a: 'ަ',
	s: 'ސ',
	d: 'ދ',
	f: 'ފ',
	g: 'ގ',
	h: 'ހ',
	j: 'ޖ',
	k: 'ކ',
	l: 'ލ',
	z: 'ޒ',
	x: '×',
	c: 'ޗ',
	v: 'ވ',
	b: 'ބ',
	n: 'ނ',
	m: 'މ',
	Q: 'ޤ',
	W: 'ޢ',
	E: 'ޭ',
	R: 'ޜ',
	T: 'ޓ',
	Y: 'ޠ',
	U: 'ޫ',
	I: 'ީ',
	O: 'ޯ',
	P: '÷',
	A: 'ާ',
	S: 'ށ',
	D: 'ޑ',
	F: 'ﷲ',
	G: 'ޣ',
	H: 'ޙ',
	J: 'ޛ',
	K: 'ޚ',
	L: 'ޅ',
	Z: 'ޡ',
	X: 'ޘ',
	C: 'ޝ',
	V: 'ޥ',
	B: 'ޞ',
	N: 'ޏ',
	M: 'ޟ',
	',': '،',
	';': '؛',
	'?': '؟'
});

/** Microsoft Divehi Phonetic's bracket swap: the key labelled "(" inserts ")",
 *  which RTL mirroring then displays as "(". Matches Windows muscle memory, but
 *  typing "(" first (as in English) then stores the brackets reversed. */
export const BRACKET_SWAP: Readonly<Record<string, string>> = Object.freeze({
	'(': ')',
	')': '(',
	'[': ']',
	']': '[',
	'{': '}',
	'}': '{',
	'<': '>',
	'>': '<'
});

/**
 * Replay keystrokes in the Divehi Phonetic layout: maps character by character.
 * `transliterate('divehi')` → "ދިވެހި". This is not a romanisation converter;
 * pass what a user would type on the layout, not arbitrary English spellings.
 */
export function transliterate(text: string, { swapBrackets = false }: { swapBrackets?: boolean } = {}): string {
	let out = '';
	for (const ch of text) out += KEYMAP[ch] ?? (swapBrackets ? BRACKET_SWAP[ch] : undefined) ?? ch;
	return out;
}
