import layouts from './legacy-layouts.json' with { type: 'json' };
import { hasThaana } from './text.js';

export type LegacyLayout = 'typewriter' | 'phonetic';

/** ASCII -> Unicode maps for pre-Unicode Thaana fonts.
 *  typewriter: the "A_" fonts (A_Waheed, A_Faseyha, A_Randhoo, A_Haleem …).
 *  phonetic:   a few older casual fonts (Thaana, Akko, Athu Casual, Avas Thaana …). */
export const LEGACY_LAYOUTS: Readonly<Record<LegacyLayout, Readonly<Record<string, string>>>> = layouts;

export interface ConvertLegacyOptions {
	/** Which legacy font family the text was typed for. Default: 'typewriter' (A_ fonts). */
	layout?: LegacyLayout;
	/** Legacy documents store each line in visual (left-to-right) order. Reverse
	 *  lines back to logical order. Default: true. */
	reverse?: boolean;
}

/**
 * Convert text typed in a pre-Unicode Thaana font (it looks like Latin
 * gibberish such as "ihevid" once the font is gone) into Unicode Thaana.
 * Each line is reversed into logical order, characters are mapped, and digit
 * groups are put back in reading order. Lines that already contain Unicode
 * Thaana are not legacy text and are returned unchanged.
 */
export function convertLegacy(text: string, options: ConvertLegacyOptions = {}): string {
	const { layout = 'typewriter', reverse = true } = options;
	const map = LEGACY_LAYOUTS[layout];
	return text
		.split(/(\r?\n)/)
		.map((line) => {
			if (line === '\n' || line === '\r\n' || hasThaana(line)) return line;
			const chars = reverse ? [...line].toReversed() : [...line];
			let out = chars.map((c) => map[c] ?? c).join('');
			// Numbers were typed left-to-right; un-reverse each digit group.
			if (reverse) out = out.replace(/\d[\d.,:/-]*\d|\d/g, (m) => [...m].toReversed().join(''));
			return out;
		})
		.join('');
}
