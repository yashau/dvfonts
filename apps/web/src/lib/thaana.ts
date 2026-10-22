// The site uses the published @yashau/thaana package for all Thaana handling,
// so what visitors try here is exactly what the npm package does.
import { attachKeyboard, PANGRAMS as PANGRAMS_LIST } from '@yashau/thaana';

export {
	KEYMAP,
	transliterate,
	hasThaana,
	PANGRAMS,
	ARABIC_LETTERS_SAMPLE,
	LETTERS as LETTERS_NATIVE,
	ARABIC_LETTERS as LETTERS_ARABIC,
	FILI
} from '@yashau/thaana';

/** Sample for symbol fonts (Bismi): its glyphs live on ASCII keys. */
export const SYMBOL_SAMPLE = 'a b c d e f g h i j k l m n o p q r s t u v w x y z';

export const DIGITS_PUNCT = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'،',
	'؛',
	'؟',
	'.',
	'(',
	')',
	'!',
	'-',
	'ﷲ'
];

export function randomPangram(): string {
	return PANGRAMS_LIST[Math.floor(Math.random() * PANGRAMS_LIST.length)];
}

/** Wire the phonetic keyboard to an element whose on/off state lives elsewhere. */
export function thaanaKeyboard(el: HTMLElement, enabled: () => boolean) {
	// The site binds `dir` itself (resolveDirection), so no autoDirection here.
	return { destroy: attachKeyboard(el, { enabled, setAttributes: false, autoDirection: false }) };
}
