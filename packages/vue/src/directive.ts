import type { Directive } from 'vue';
import { attachKeyboard, type KeyboardOptions } from '@yashau/thaana';

export interface ThaanaDirectiveOptions extends Omit<KeyboardOptions, 'enabled'> {
	/** Turn the phonetic keyboard on/off (e.g. a DV/EN toggle). Default: true. */
	enabled?: boolean;
}

type State = { detach: () => void; options: ThaanaDirectiveOptions };
const states = new WeakMap<HTMLElement, State>();

/**
 * v-thaana: make an input, textarea or contenteditable type Thaana. Works with v-model.
 *
 *   <input v-thaana v-model="name" />
 *   <input v-thaana="{ enabled: dv }" v-model="name" />
 */
export const vThaana: Directive<HTMLElement, ThaanaDirectiveOptions | boolean | undefined> = {
	mounted(el, binding) {
		const options = normalize(binding.value);
		const state: State = {
			options,
			detach: attachKeyboard(el, { ...options, enabled: () => state.options.enabled ?? true })
		};
		states.set(el, state);
	},
	updated(el, binding) {
		const state = states.get(el);
		if (!state) return;
		const next = normalize(binding.value);
		const reattach = next.setAttributes !== state.options.setAttributes;
		state.options = next;
		if (reattach) {
			state.detach();
			state.detach = attachKeyboard(el, { ...next, enabled: () => state.options.enabled ?? true });
		}
	},
	unmounted(el) {
		states.get(el)?.detach();
		states.delete(el);
	}
};

function normalize(value: ThaanaDirectiveOptions | boolean | undefined): ThaanaDirectiveOptions {
	return typeof value === 'boolean' ? { enabled: value } : (value ?? {});
}
