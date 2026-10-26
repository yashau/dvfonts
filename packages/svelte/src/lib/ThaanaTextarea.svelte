<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { resolveDirection } from '@yashau/thaana';
	import { thaana } from './keyboard.js';

	interface Props extends Omit<HTMLTextareaAttributes, 'value'> {
		value?: string;
		/** Latin keys type Thaana (Divehi Phonetic layout). Default: true. */
		dv?: boolean;
		ref?: HTMLTextAreaElement | null;
	}

	let { value = $bindable(''), dv = true, ref = $bindable(null), ...rest }: Props = $props();
</script>

<textarea
	dir={resolveDirection(value ?? '', null, dv ? 'rtl' : 'ltr')}
	lang="dv"
	{...rest}
	bind:this={ref}
	bind:value
	use:thaana={{ enabled: dv }}></textarea>
