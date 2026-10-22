<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { thaana } from './keyboard.js';

	interface Props extends Omit<HTMLTextareaAttributes, 'value'> {
		value?: string;
		/** Latin keys type Thaana (Divehi Phonetic layout). Default: true. */
		dv?: boolean;
		/** Swap brackets like Microsoft's Divehi Phonetic layout. Default: false. */
		swapBrackets?: boolean;
		ref?: HTMLTextAreaElement | null;
	}

	let { value = $bindable(''), dv = true, swapBrackets = false, ref = $bindable(null), ...rest }: Props = $props();
</script>

<textarea
	dir="rtl"
	lang="dv"
	style:unicode-bidi="plaintext"
	{...rest}
	bind:this={ref}
	bind:value
	use:thaana={{ enabled: dv, swapBrackets }}></textarea>
