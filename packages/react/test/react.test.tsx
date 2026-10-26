// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThaanaInput, ThaanaText, transliterate } from '../src/index.js';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function type(el: HTMLInputElement, text: string) {
	for (const ch of text) {
		const ev = new InputEvent('beforeinput', { data: ch, inputType: 'insertText', cancelable: true, bubbles: true });
		if (el.dispatchEvent(ev)) {
			const start = el.selectionStart ?? el.value.length;
			el.setRangeText(ch, start, el.selectionEnd ?? start, 'end');
			el.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}
}

describe('ThaanaInput', () => {
	it('types Thaana into a controlled input and can be toggled off', async () => {
		let seen = '';
		function App({ dv }: { dv: boolean }) {
			const [v, setV] = useState('');
			seen = v;
			return <ThaanaInput dv={dv} value={v} onChange={(e) => setV(e.target.value)} />;
		}
		const host = document.createElement('div');
		document.body.append(host);
		const root = createRoot(host);
		await act(async () => root.render(<App dv />));
		const input = host.querySelector('input')!;
		expect(input.dir).toBe('rtl');
		await act(async () => type(input, 'divehi'));
		expect(seen).toBe('ދިވެހި');
		await act(async () => root.render(<App dv={false} />));
		await act(async () => type(input, ' ok'));
		expect(seen).toBe('ދިވެހި ok');
	});
	it('starts left-to-right when empty and the keyboard is off', async () => {
		const host = document.createElement('div');
		const root = createRoot(host);
		await act(async () => root.render(<ThaanaInput dv={false} value="" onChange={() => {}} />));
		expect(host.querySelector('input')!.dir).toBe('ltr');
		await act(async () => root.render(<ThaanaInput dv value="" onChange={() => {}} />));
		expect(host.querySelector('input')!.dir).toBe('rtl');
		await act(async () => root.unmount());
	});
	it('re-exports the core helpers', () => {
		expect(transliterate('bu')).toBe('ބު');
	});
});

describe('ThaanaText', () => {
	it('renders RTL with numbers isolated, even when Latin comes first', async () => {
		const host = document.createElement('div');
		document.body.append(host);
		await act(async () => createRoot(host).render(<ThaanaText as="p" text="Apple ފޯނު +960 333-1234" />));
		const p = host.querySelector('p')!;
		expect(p.dir).toBe('rtl');
		expect(p.lang).toBe('dv');
		expect(p.textContent).toBe('Apple ފޯނު \u2066+960 333-1234\u2069');
	});
});
