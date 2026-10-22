import { createElement, type HTMLAttributes } from 'react';
import { isolateNumbers, resolveDirection } from '@yashau/thaana';

export interface ThaanaTextProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'dir'> {
	/** The text to show. Stored text stays as-is; isolation is display-only. */
	text: string;
	/** Element to render. Default: 'span'. */
	as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'li' | 'td' | 'label';
	/** Force a direction; by default any Thaana makes it RTL. */
	dir?: 'rtl' | 'ltr';
}

/**
 * Display Thaana correctly: right-to-left when it contains Thaana (even if it
 * starts with a Latin word), lang="dv", and numbers, phone numbers and
 * percentages isolated so "-5" or "+960 333-1234" don't scramble.
 */
export function ThaanaText({ text, as = 'span', dir, style, ...rest }: ThaanaTextProps): React.ReactElement {
	return createElement(
		as,
		{ ...rest, dir: resolveDirection(text, dir, 'rtl'), lang: 'dv', style: { unicodeBidi: 'isolate', ...style } },
		isolateNumbers(text)
	);
}
