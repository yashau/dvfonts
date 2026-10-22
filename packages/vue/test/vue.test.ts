// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { ThaanaInput, ThaanaText } from '../src/index.js';

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
	it('types Thaana through v-model and toggles with dv', async () => {
		const value = ref('');
		const dv = ref(true);
		const App = defineComponent(
			() => () =>
				h(ThaanaInput, {
					modelValue: value.value,
					'onUpdate:modelValue': (v: string) => (value.value = v),
					dv: dv.value
				})
		);
		const host = document.createElement('div');
		document.body.append(host);
		createApp(App).mount(host);
		const input = host.querySelector('input')!;
		expect(input.getAttribute('dir')).toBe('rtl');
		type(input, 'divehi');
		await nextTick();
		expect(value.value).toBe('ދިވެހި');
		dv.value = false;
		await nextTick();
		type(input, ' ok');
		expect(value.value).toBe('ދިވެހި ok');
	});
});

describe('ThaanaText', () => {
	it('renders RTL with numbers isolated', () => {
		const host = document.createElement('div');
		document.body.append(host);
		createApp(() => h(ThaanaText, { text: 'ފިނިމިން -5', as: 'p' })).mount(host);
		const p = host.querySelector('p')!;
		expect(p.dir).toBe('rtl');
		expect(p.textContent).toBe('ފިނިމިން \u2066-5\u2069');
	});
});
