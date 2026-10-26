// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import {
	attachKeyboard,
	autoAttach,
	convertLegacy,
	detectDirection,
	fontCssUrl,
	fontFaceCss,
	loadFonts,
	isolate,
	KEYMAP,
	LETTERS,
	normalizePunctuation,
	PANGRAMS,
	stripBidiControls,
	transliterate
} from '../src/index.js';

/** Simulate one typed character the way browsers do: beforeinput, then the
 *  default insertion if not prevented. jsdom has no execCommand, so this also
 *  exercises the setRangeText fallback. */
function type(el: HTMLInputElement, text: string) {
	for (const ch of text) {
		const ev = new InputEvent('beforeinput', { data: ch, inputType: 'insertText', cancelable: true, bubbles: true });
		if (el.dispatchEvent(ev)) {
			const start = el.selectionStart ?? el.value.length;
			el.setRangeText(ch, start, el.selectionEnd ?? start, 'end');
		}
	}
}

describe('transliterate', () => {
	it('maps keystrokes in the Divehi Phonetic layout', () => {
		expect(transliterate('divehi')).toBe('ދިވެހި');
		expect(transliterate('raajje')).toBe('ރަަޖޖެ');
		expect(transliterate('rAqje')).toBe('ރާއްޖެ'.replace('އް', 'ް'));
		expect(transliterate('a,b;c?')).toBe('ަ،ބ؛ޗ؟');
	});
	it('swaps bracket pairs so RTL mirroring shows the key pressed', () => {
		// Typed as seen in RTL: ")" opens on the right. Stored in logical order.
		expect(transliterate(')bu( ]hi[ }ra{ >ka<')).toBe('(ބު) [ހި] {ރަ} <ކަ>');
	});
	it('covers every native letter', () => {
		const produced = new Set(Object.values(KEYMAP));
		for (const l of LETTERS) expect(produced.has(l)).toBe(true);
	});
});

describe('keyboard', () => {
	it('rewrites typed Latin into Thaana and sets RTL attributes', () => {
		const el = document.createElement('input');
		document.body.append(el);
		const detach = attachKeyboard(el);
		expect(el.getAttribute('dir')).toBe('rtl');
		expect(el.getAttribute('lang')).toBe('dv');
		type(el, 'bu )hi( ra?');
		expect(el.value).toBe('ބު (ހި) ރަ؟');
		el.value = 'Hello';
		el.dispatchEvent(new Event('input'));
		expect(el.dir).toBe('ltr'); // pure Latin follows the text
		el.value = 'Apple ގެ';
		el.dispatchEvent(new Event('input'));
		expect(el.dir).toBe('rtl'); // any Thaana: RTL, even when Latin comes first
		detach();
		type(el, 'x');
		expect(el.value.endsWith('x')).toBe(true);
	});
	it('lets an empty field go left-to-right while the keyboard is off', () => {
		const el = document.createElement('input');
		let on = true;
		attachKeyboard(el, { enabled: () => on });
		expect(el.dir).toBe('rtl');
		on = false;
		el.dispatchEvent(new Event('input'));
		expect(el.dir).toBe('ltr'); // about to type in the user's own (Latin) layout
		el.value = 'ދިވެހި';
		el.dispatchEvent(new Event('input'));
		expect(el.dir).toBe('rtl'); // Thaana still wins
	});
	it('respects enabled() and leaves Thaana keyboards alone', () => {
		const el = document.createElement('input');
		let on = false;
		attachKeyboard(el, { enabled: () => on });
		type(el, 'ab');
		on = true;
		type(el, 'ab');
		type(el, 'ދ');
		expect(el.value).toBe('abަބދ');
	});
	it('auto-attaches to [data-thaana] fields, including later ones', async () => {
		const stop = autoAttach();
		const el = document.createElement('input');
		el.dataset.thaana = '';
		document.body.append(el);
		await new Promise((r) => setTimeout(r, 0));
		type(el, 'kaa');
		expect(el.value).toBe('ކަަ');
		stop();
	});
});

describe('convertLegacy', () => {
	it('converts A_-font (typewriter) text in visual order', () => {
		expect(convertLegacy('ihevid')).toBe('ދިވެހި');
	});
	it('keeps numbers readable', () => {
		expect(convertLegacy('2026 ihevid')).toBe('ދިވެހި 2026');
	});
	it('handles the phonetic legacy fonts and multiple lines', () => {
		expect(convertLegacy('ihevid\nub', { layout: 'phonetic' })).toBe('ދިވެހި\nބު');
	});
	it('leaves lines that are already Unicode Thaana alone', () => {
		expect(convertLegacy('ދިވެހި 2026/1/14\nihevid')).toBe('ދިވެހި 2026/1/14\nދިވެހި');
	});
});

describe('text helpers', () => {
	it('detects direction from the first strong character', () => {
		expect(detectDirection('123 ދިވެހި')).toBe('rtl');
		expect(detectDirection('Hello ދިވެހި')).toBe('ltr');
		expect(detectDirection('123')).toBe('neutral');
	});
	it('isolates and strips', () => {
		const s = `ފޯނު ${isolate('+960 333-1234')}`;
		expect(stripBidiControls(s)).toBe('ފޯނު +960 333-1234');
	});
	it('normalizes punctuation', () => {
		expect(normalizePunctuation('ބަސް , ބުދަ ? ( ހި )')).toBe('ބަސް، ބުދަ؟ (ހި)');
	});
	it('ships pangrams that each use every native letter', () => {
		for (const p of PANGRAMS)
			expect(
				LETTERS.filter((l) => !p.includes(l)),
				p
			).toEqual([]);
	});
});

describe('fontCssUrl', () => {
	it('builds a css2 URL and only asks for size normalisation when requested', () => {
		expect(fontCssUrl({ family: 'MV Faseyha', weights: [700, 400] })).toBe(
			'https://fonts.mv/css2?family=MV+Faseyha:wght@400;700&display=swap'
		);
		expect(fontCssUrl({ family: 'Bolhu' }, { normalize: true })).toBe(
			'https://fonts.mv/css2?family=Bolhu&display=swap&normalize=1'
		);
	});
});

describe('own font files', () => {
	const own = { family: 'Faruma', files: { 400: '/fonts/faruma-400.woff2', 700: 'https://cdn.example/f-700.ttf?v=2' } };

	it('writes @font-face CSS for your own files', () => {
		const css = fontFaceCss({ ...own, sizeAdjust: 1.084 }, { normalize: true });
		expect(css).toContain(`font-family: "Faruma";`);
		expect(css).toContain(`src: url("/fonts/faruma-400.woff2") format('woff2');`);
		expect(css).toContain(`src: url("https://cdn.example/f-700.ttf?v=2") format('truetype');`);
		expect(css).toContain('size-adjust: 108.4%;');
		expect(fontFaceCss(own)).not.toContain('size-adjust');
		expect(fontFaceCss({ ...own, weights: [700] }).match(/@font-face/g)).toHaveLength(1);
		expect(() => fontFaceCss({ ...own, weights: [300] })).toThrow(/weight 300/);
	});

	it('loadFonts registers your files and fetches nothing from fonts.mv', async () => {
		const added: { family: string; source: string; weight?: string }[] = [];
		class FakeFontFace {
			constructor(
				public family: string,
				public source: string,
				public descriptors: FontFaceDescriptors
			) {}
			load() {
				return Promise.resolve(this);
			}
		}
		vi.stubGlobal('FontFace', FakeFontFace);
		Object.defineProperty(document, 'fonts', {
			configurable: true,
			value: {
				add: (f: FakeFontFace) => added.push({ family: f.family, source: f.source, weight: f.descriptors.weight })
			}
		});
		await loadFonts(own);
		await loadFonts(own); // registered once
		expect(added).toEqual([
			{ family: 'Faruma', source: `url("/fonts/faruma-400.woff2") format('woff2')`, weight: '400' },
			{ family: 'Faruma', source: `url("https://cdn.example/f-700.ttf?v=2") format('truetype')`, weight: '700' }
		]);
		expect(document.querySelector('link[data-dvfonts]')).toBeNull();
		vi.unstubAllGlobals();
	});
});
