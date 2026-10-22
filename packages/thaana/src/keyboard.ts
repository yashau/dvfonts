import { KEYMAP } from './keymap.js';
import { resolveDirection } from './text.js';

export interface KeyboardOptions {
	/** Return false to let keystrokes through untouched (e.g. a DV/EN toggle). Default: always on. */
	enabled?: () => boolean;
	/** Set dir="rtl", lang="dv" and disable autocorrect/autocapitalize/spellcheck
	 *  unless the element already sets them. Default: true. */
	setAttributes?: boolean;
	/** Keep `dir` in step with the text: RTL when it contains Thaana (or is
	 *  empty / has no letters), LTR only for pure Latin. Default: true. */
	autoDirection?: boolean;
}

type Editable = HTMLInputElement | HTMLTextAreaElement | HTMLElement;

/**
 * The Thaana character a `beforeinput` event should insert instead, or null to
 * let it through. For rich-text editors (Lexical, TipTap/ProseMirror, Slate…)
 * that own their own insertion: call this in the editor's beforeinput hook,
 * preventDefault, and insert the result through the editor's API.
 * Only single typed characters are mapped; IME composition, paste,
 * autocorrect and deletes return null.
 */
export function thaanaForInputEvent(event: InputEvent): string | null {
	if (event.inputType !== 'insertText' || event.isComposing) return null;
	const key = event.data && event.data.length === 1 ? event.data : undefined;
	if (!key) return null;
	return KEYMAP[key] ?? null;
}

/**
 * Make an <input>, <textarea> or contenteditable element type Thaana on any
 * keyboard. Only single typed characters are rewritten; paste, IME
 * composition, autocorrect, deletion and text from a real Dhivehi keyboard
 * pass through. Inserts via the browser's own editing command, so `input`
 * events fire (React/Vue/Svelte bindings keep working) and undo works.
 *
 * @returns a function that detaches the keyboard.
 */
export function attachKeyboard(el: Editable, options: KeyboardOptions = {}): () => void {
	const { enabled = () => true, setAttributes = true, autoDirection = true } = options;
	if (setAttributes) {
		const defaults: [string, string][] = [
			['dir', 'rtl'],
			['lang', 'dv'],
			['autocomplete', 'off'],
			['autocorrect', 'off'],
			['autocapitalize', 'none'],
			['spellcheck', 'false']
		];
		for (const [attr, value] of defaults) if (!el.hasAttribute(attr)) el.setAttribute(attr, value);
	}
	// execCommand fires its own beforeinput; don't transliterate our own insert.
	let inserting = false;
	const onBeforeInput = (e: Event) => {
		const ev = e as InputEvent;
		if (inserting || !enabled()) return;
		const mapped = thaanaForInputEvent(ev);
		if (!mapped) return;
		ev.preventDefault();
		inserting = true;
		try {
			// execCommand keeps the native undo stack; not every environment has it.
			if (typeof document.execCommand === 'function' && document.execCommand('insertText', false, mapped)) return;
			if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
				const start = el.selectionStart ?? el.value.length;
				el.setRangeText(mapped, start, el.selectionEnd ?? start, 'end');
				el.dispatchEvent(new Event('input', { bubbles: true }));
			}
		} finally {
			inserting = false;
		}
	};
	const fieldText = () =>
		el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : (el.textContent ?? '');
	const onInput = () => {
		el.dir = resolveDirection(fieldText(), null, 'rtl');
	};
	el.addEventListener('beforeinput', onBeforeInput);
	if (autoDirection) {
		el.addEventListener('input', onInput);
		onInput();
	}
	return () => {
		el.removeEventListener('beforeinput', onBeforeInput);
		el.removeEventListener('input', onInput);
	};
}

const attached = new WeakMap<Element, () => void>();

/**
 * Attach the keyboard to every `[data-thaana]` element under `root`, now and as
 * elements are added later. `data-thaana="off"` opts an element out.
 * @returns a function that stops watching (already-attached fields stay attached).
 */
export function autoAttach(root: ParentNode = document): () => void {
	const scan = () => {
		for (const el of root.querySelectorAll<HTMLElement>('[data-thaana]')) {
			if (attached.has(el) || el.dataset.thaana === 'off') continue;
			attached.set(el, attachKeyboard(el));
		}
	};
	scan();
	const observer = new MutationObserver(scan);
	observer.observe(root instanceof Document ? root.documentElement : (root as Node), {
		childList: true,
		subtree: true
	});
	return () => observer.disconnect();
}
