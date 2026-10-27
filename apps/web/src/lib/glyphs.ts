// The font page's glyph list: every character a family draws, grouped. Built from the
// family's own character map (the font pipeline's `chars` and `keyGlyphs`), so it shows
// exactly what the font has and nothing it borrows from a fallback.
import { FILI, LETTERS_ARABIC, LETTERS_NATIVE } from '#lib/thaana.js';

export interface GlyphCell {
	/** What to draw: the character, or a fili on alifu. */
	text: string;
	/** Shown under the glyph: the key a drawing sits on. */
	label?: string;
	/** Needs a wide cell (a Bismillah, a ligature). */
	wide?: boolean;
}

export interface GlyphGroup {
	title: string;
	cells: GlyphCell[];
}

const WIDE = new Set(['﷽', 'ﷺ', 'ﷻ']);

const between = (c: string, lo: number, hi: number) => {
	const cp = c.codePointAt(0)!;
	return cp >= lo && cp <= hi;
};

export function glyphGroups(chars: string, keyGlyphs: string, symbols: boolean): GlyphGroup[] {
	const all = [...chars];
	// Symbol fonts put a drawing on each key: show every key with its label.
	if (symbols) return [{ title: 'Characters', cells: all.map((c) => ({ text: c, label: c, wide: true })) }];

	const keys = new Set(keyGlyphs);
	const left = new Set(all.filter((c) => !keys.has(c)));
	const take = (pick: (c: string) => boolean) => {
		const out = [...left].filter(pick);
		for (const c of out) left.delete(c);
		return out;
	};
	const ordered = (list: readonly string[]) => {
		const out = list.filter((c) => left.has(c));
		for (const c of out) left.delete(c);
		return out;
	};
	const cells = (list: string[]) => list.map((c) => ({ text: c, wide: WIDE.has(c) }));

	const groups: GlyphGroup[] = [
		{ title: 'Letters', cells: cells(ordered(LETTERS_NATIVE)) },
		{ title: 'Arabic-derived letters', cells: cells(ordered(LETTERS_ARABIC)) },
		{ title: 'Fili', cells: ordered(FILI).map((f) => ({ text: 'އ' + f })) },
		{ title: 'Other Thaana', cells: cells(take((c) => between(c, 0x0780, 0x07bf))) },
		{ title: 'Digits', cells: cells(take((c) => /\p{Nd}/u.test(c))) },
		{ title: 'Arabic', cells: cells(take((c) => between(c, 0x0600, 0x06ff))) },
		{
			title: 'Arabic ligatures',
			cells: cells(take((c) => between(c, 0xfb50, 0xfdff) || between(c, 0xfe70, 0xfeff)))
		},
		{ title: 'Latin', cells: cells(take((c) => /\p{Script=Latin}/u.test(c))) },
		{ title: 'Punctuation and symbols', cells: cells(take(() => true)) },
		{
			title: 'Drawn on keyboard keys',
			cells: [...keys].filter((c) => chars.includes(c)).map((c) => ({ text: c, label: c, wide: true }))
		}
	];
	return groups.filter((g) => g.cells.length);
}
