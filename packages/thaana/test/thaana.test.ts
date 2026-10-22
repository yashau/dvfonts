// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
	attachKeyboard,
	autoAttach,
	convertLegacy,
	detectDirection,
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
	it('leaves brackets alone unless asked to swap them', () => {
		expect(transliterate('(bu)')).toBe('(ބު)');
		expect(transliterate('(bu)', { swapBrackets: true })).toBe(')ބު(');
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
		type(el, 'bu (hi) ra?');
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
	it('ships pangrams with every native letter', () => {
		for (const p of PANGRAMS) for (const l of LETTERS) expect(p).toContain(l);
	});
});
