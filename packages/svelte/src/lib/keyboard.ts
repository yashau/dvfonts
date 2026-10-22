import { attachKeyboard, type KeyboardOptions } from '@yashau/thaana';
import type { Action } from 'svelte/action';
import type { Attachment } from 'svelte/attachments';

export interface ThaanaOptions extends Omit<KeyboardOptions, 'enabled'> {
	/** Turn the phonetic keyboard on/off (e.g. a DV/EN toggle). Default: true. */
	enabled?: boolean;
}

/**
 * Action: make an input, textarea or contenteditable type Thaana.
 *
 *   <input use:thaana bind:value />
 *   <input use:thaana={{ enabled: dv }} bind:value />
 */
export const thaana: Action<HTMLElement, ThaanaOptions | undefined> = (el, options) => {
	let current = options ?? {};
	let detach = attachKeyboard(el, { ...current, enabled: () => current.enabled ?? true });
	return {
		update(next) {
			const prev = current;
			current = next ?? {};
			if (prev.setAttributes !== current.setAttributes) {
				detach();
				detach = attachKeyboard(el, { ...current, enabled: () => current.enabled ?? true });
			}
		},
		destroy: () => detach()
	};
};

/**
 * Attachment (Svelte 5.29+): same as the action, for {@attach}. Re-runs when
 * any state read inside `options` changes.
 *
 *   <input {@attach thaanaKeyboard({ enabled: dv })} bind:value />
 */
export function thaanaKeyboard(options: ThaanaOptions = {}): Attachment<HTMLElement> {
	return (el) => attachKeyboard(el, { ...options, enabled: () => options.enabled ?? true });
}
