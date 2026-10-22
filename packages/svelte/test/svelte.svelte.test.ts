import { describe, expect, it } from 'vitest';
import { flushSync, mount } from 'svelte';
import Harness from './Harness.svelte';

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
	it('types Thaana through bind:value and toggles with dv', () => {
		const props = $state({ dv: true });
		mount(Harness, { target: document.body, props });
		flushSync(); // actions attach in an effect
		const input = document.querySelector('input')!;
		expect(input.getAttribute('dir')).toBe('rtl');
		type(input, 'divehi');
		flushSync();
		expect(document.querySelector('output')!.textContent).toBe('ދިވެހި');
		props.dv = false;
		flushSync();
		type(input, ' ok');
		flushSync();
		expect(document.querySelector('output')!.textContent).toBe('ދިވެހި ok');
	});
});
