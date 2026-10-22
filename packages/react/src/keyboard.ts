import { useCallback, useEffect, useRef, type RefCallback } from 'react';
import { attachKeyboard, type KeyboardOptions } from '@yashau/thaana';

export interface UseThaanaKeyboardOptions extends Omit<KeyboardOptions, 'enabled'> {
	/** Turn the phonetic keyboard on/off (e.g. a DV/EN toggle). Default: true. */
	enabled?: boolean;
}

/**
 * Make any <input>, <textarea> or contenteditable type Thaana on a Latin keyboard.
 * Returns a ref to put on the element; works with controlled inputs.
 *
 *   const ref = useThaanaKeyboard();
 *   <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} />
 */
export function useThaanaKeyboard<T extends HTMLElement = HTMLInputElement>(
	options: UseThaanaKeyboardOptions = {}
): RefCallback<T> {
	const { enabled = true, setAttributes, swapBrackets } = options;
	const enabledRef = useRef(enabled);
	useEffect(() => {
		enabledRef.current = enabled;
	}, [enabled]);
	const detachRef = useRef<(() => void) | null>(null);
	return useCallback(
		(el: T | null) => {
			detachRef.current?.();
			detachRef.current = el
				? attachKeyboard(el, { enabled: () => enabledRef.current, setAttributes, swapBrackets })
				: null;
		},
		[setAttributes, swapBrackets]
	);
}

/** Merge several refs (yours + the keyboard's) into one. */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): RefCallback<T> {
	return (value: T | null) => {
		for (const ref of refs) {
			if (typeof ref === 'function') ref(value);
			else if (ref) (ref as React.RefObject<T | null>).current = value;
		}
	};
}
