<script lang="ts">
	import { authorHref } from '#lib/authors.js';
	import { creditParts, UNKNOWN_AUTHOR, type Family } from '#lib/catalog.js';

	// Each author name links somewhere: in the font list (`to="filter"`) to the list filtered
	// to that author, on a font's own page (`to="page"`) to the author's page. `raised` lifts
	// the links above a card's stretched link so they stay clickable.
	let {
		family,
		raised = false,
		to = 'filter'
	}: { family: Family; raised?: boolean; to?: 'filter' | 'page' } = $props();

	const href = (author: string) =>
		to === 'page' && author !== UNKNOWN_AUTHOR ? authorHref(author) : `/?author=${encodeURIComponent(author)}`;

	const parts = $derived(creditParts(family));
</script>

{#each parts as part, i (i)}
	{#if part.author}
		<a
			href={href(part.author)}
			class={['underline-offset-4 hover:text-foreground hover:underline', raised && 'relative z-10']}
			title={part.author === UNKNOWN_AUTHOR
				? 'All fonts whose author is unknown'
				: to === 'page'
					? `About ${part.author}`
					: `All fonts by ${part.author}`}>{part.text}</a
		>
	{:else}{part.text}{/if}
{/each}
