<script lang="ts">
	import { authorBio, CORRECTIONS_EMAIL, correctionsMailto, THAANA_NAME_CSS, THAANA_NAME_FONT } from '#lib/authors.js';
	import { UNKNOWN_AUTHOR } from '#lib/catalog.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import MailIcon from '@lucide/svelte/icons/mail';
	import XIcon from '@lucide/svelte/icons/x';

	// Replaces the site intro on the font list while an author is selected.
	let { name, count, onclear }: { name: string; count: number; onclear: () => void } = $props();

	const bio = $derived(authorBio(name));
	const unknown = $derived(name === UNKNOWN_AUTHOR);
	const askMailto = `mailto:${CORRECTIONS_EMAIL}?subject=${encodeURIComponent('fonts.mv: who designed these fonts?')}`;
</script>

<svelte:head>
	<link rel="stylesheet" href={THAANA_NAME_CSS} />
</svelte:head>

<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">Author</p>
<div class="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
	<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{unknown ? 'Unknown author' : name}</h1>
	{#if bio?.thaana}
		<span class="text-2xl sm:text-3xl" dir="rtl" lang="dv" style:font-family={THAANA_NAME_FONT}>{bio.thaana}</span>
	{/if}
</div>
{#if unknown}
	<p class="mt-1 text-sm text-muted-foreground">{count} {count === 1 ? 'family' : 'families'}</p>
	<p class="mt-3 max-w-5xl text-pretty text-muted-foreground">
		These fonts don't name their designer. If you know who made any of them, tell us and we'll credit them.
	</p>
{:else if bio}
	<p class="mt-1 text-sm text-muted-foreground">{bio.role} · {count} {count === 1 ? 'family' : 'families'}</p>
	<p class="mt-3 max-w-5xl text-pretty text-muted-foreground">{bio.excerpt}</p>
{:else}
	<p class="mt-1 text-sm text-muted-foreground">{count} {count === 1 ? 'family' : 'families'}</p>
	<p class="mt-3 max-w-5xl text-pretty text-muted-foreground">
		We don't know much about {name} yet beyond the credits in their fonts. If you can tell us more, we'd like to hear it.
	</p>
{/if}
<div class="mt-4 flex flex-wrap gap-2">
	{#if bio?.page}
		<Button href="/authors/{bio.slug}" size="sm">Read the full bio <ArrowRightIcon /></Button>
	{/if}
	<Button href={unknown ? askMailto : correctionsMailto(name)} variant="outline" size="sm">
		<MailIcon />
		{unknown ? 'Tell us who made them' : bio ? 'Suggest a correction' : 'Tell us about them'}
	</Button>
	<Button variant="ghost" size="sm" onclick={onclear}><XIcon /> All fonts</Button>
</div>
