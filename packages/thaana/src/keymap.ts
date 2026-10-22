/**
 * Latin key -> Thaana: Microsoft's "Divehi Phonetic" keyboard layout (kbddiv1),
 * the layout Maldivian websites use via aharen/thaana-keyboard
 * (h→ހ, a→ަ, q→ް sukun, w→އ alifu …).
 *
 * Bracket pairs are swapped, as in Microsoft's layout and rihaPDF. Browsers
 * mirror ( ) [ ] { } < > in RTL text, so a Dhivehi typist opens with the key
 * that looks right on screen (")"), which stores U+0028: the glyph matches the
 * key pressed and the stored text stays in logical order.
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
	'?': '؟',
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
export function transliterate(text: string): string {
	let out = '';
	for (const ch of text) out += KEYMAP[ch] ?? ch;
	return out;
}
