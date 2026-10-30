<script lang="ts">
	import { authorHref } from '#lib/authors.js';
	import { authors, creditParts, leadAuthors, UNKNOWN_AUTHOR, type Family } from '#lib/catalog.js';

	// Each author name links somewhere: in the font list (`to="filter"`) to the list filtered
	// to that author, on a font's own page (`to="page"`) to the author's page. `raised` lifts
	// the links above a card's stretched link so they stay clickable.
	// `compact` (cards) shows only the main credited names, at most three, and "et al." when
	// anyone else is credited; the font's page shows the whole credit.
	let {
		family,
		raised = false,
		to = 'filter',
		compact = false
	}: { family: Family; raised?: boolean; to?: 'filter' | 'page'; compact?: boolean } = $props();

	const MAX_NAMES = 3;

	const href = (author: string) =>
		to === 'page' && author !== UNKNOWN_AUTHOR ? authorHref(author) : `/?author=${encodeURIComponent(author)}`;

	const parts = $derived.by(() => {
		const full = creditParts(family);
		if (!compact || !family.designer) return full;
		const lead = leadAuthors(family);
		const shown = lead.slice(0, MAX_NAMES);
		const out: { text: string; author?: string }[] = [];
		shown.forEach((name, i) => {
			if (i) out.push({ text: ', ' });
			out.push({ text: name, author: name });
		});
		if (authors(family).length > shown.length) out.push({ text: ' et al.' });
		return out;
	});
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
