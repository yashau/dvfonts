<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { resolveDirection } from '@yashau/thaana';
	import { thaana } from './keyboard.js';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		value?: string;
		/** Latin keys type Thaana (Divehi Phonetic layout). Default: true. */
		dv?: boolean;
		/** Swap brackets like Microsoft's Divehi Phonetic layout. Default: false. */
		swapBrackets?: boolean;
		ref?: HTMLInputElement | null;
	}

	let { value = $bindable(''), dv = true, swapBrackets = false, ref = $bindable(null), ...rest }: Props = $props();
</script>

<input
	dir={resolveDirection(value ?? '', null, 'rtl')}
	lang="dv"
	{...rest}
	bind:this={ref}
	bind:value
	use:thaana={{ enabled: dv, swapBrackets }}
/>
