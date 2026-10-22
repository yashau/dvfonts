<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { isolateNumbers, resolveDirection } from '@yashau/thaana';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'dir'> {
		/** The text to show. Stored text stays as-is; isolation is display-only. */
		text: string;
		/** Element to render. Default: 'span'. */
		as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'li' | 'td' | 'label';
		/** Force a direction; by default any Thaana makes it RTL. */
		dir?: 'rtl' | 'ltr';
	}

	let { text, as = 'span', dir, ...rest }: Props = $props();
</script>

<!--
	Display Thaana correctly: right-to-left when it contains Thaana (even if it
	starts with a Latin word), lang="dv", and numbers, phone numbers and
	percentages isolated so "-5" or "+960 333-1234" don't scramble.
-->
<svelte:element this={as} {...rest} dir={resolveDirection(text, dir, 'rtl')} lang="dv" style:unicode-bidi="isolate"
	>{isolateNumbers(text)}</svelte:element
>
