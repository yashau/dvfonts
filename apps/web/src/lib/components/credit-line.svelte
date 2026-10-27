<script lang="ts">
	import { creditParts, UNKNOWN_AUTHOR, type Family } from '#lib/catalog.js';

	// Each author name links to the font list filtered to that author. `raised` lifts the
	// links above a card's stretched link so they stay clickable.
	let { family, raised = false }: { family: Family; raised?: boolean } = $props();

	const parts = $derived(creditParts(family));
</script>

{#each parts as part, i (i)}
	{#if part.author}
		<a
			href="/?author={encodeURIComponent(part.author)}"
			class={['underline-offset-4 hover:text-foreground hover:underline', raised && 'relative z-10']}
			title={part.author === UNKNOWN_AUTHOR ? 'All fonts whose author is unknown' : `All fonts by ${part.author}`}
			>{part.text}</a
		>
	{:else}{part.text}{/if}
{/each}
