<script lang="ts">
	import { authorBio, correctionsMailto, THAANA_NAME_CSS, THAANA_NAME_FONT } from '#lib/authors.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const initials = (name: string) =>
		name
			.split(/[\s.]+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();

	// Authors with a full bio get a large tile; everyone else a small one that opens their fonts.
	const featured = $derived(
		data.authors
			.map((a) => ({ ...a, bio: authorBio(a.name) }))
			.filter((a) => a.bio?.page)
			.toSorted((a, b) => b.families - a.families || a.name.localeCompare(b.name))
	);
	const others = $derived(data.authors.filter((a) => !authorBio(a.name)?.page));
</script>

<svelte:head>
	<title>Authors — fonts.mv</title>
	<meta name="description" content="The designers, calligraphers and studios behind the Dhivehi fonts on fonts.mv." />
	<link rel="stylesheet" href={THAANA_NAME_CSS} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Authors</h1>
	<p class="mt-2 max-w-3xl text-pretty text-muted-foreground">
		The designers, calligraphers and studios behind the fonts. Something missing or wrong?
		<a class="underline underline-offset-4" href={correctionsMailto('an author')}>Send us a note</a>.
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each featured as a (a.name)}
			<Card.Root class="relative transition-colors hover:bg-muted/40">
				<Card.Header class="flex items-center gap-4">
					<Avatar.Root class="size-14">
						<Avatar.Fallback class="text-base">{initials(a.name)}</Avatar.Fallback>
					</Avatar.Root>
					<div class="min-w-0">
						<Card.Title>
							<!-- Stretched link: the whole tile opens the page. -->
							<a href="/authors/{a.bio!.slug}" class="after:absolute after:inset-0">{a.name}</a>
						</Card.Title>
						{#if a.bio!.thaana}
							<p class="mt-1 text-left text-xl leading-snug" dir="rtl" lang="dv" style:font-family={THAANA_NAME_FONT}>
								{a.bio!.thaana}
							</p>
						{/if}
					</div>
				</Card.Header>
				<Card.Content class="flex flex-1 flex-col gap-3">
					<p class="text-sm text-muted-foreground">{a.bio!.role}</p>
					<p class="line-clamp-4 text-sm text-pretty">{a.bio!.excerpt}</p>
				</Card.Content>
				<Card.Footer>
					<Badge variant="secondary">{a.families} {a.families === 1 ? 'family' : 'families'}</Badge>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>

	<h2 class="mt-12 text-xl font-semibold tracking-tight">Also credited</h2>
	<p class="mb-4 text-sm text-muted-foreground">Their fonts are here; their stories aren't yet.</p>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each others as a (a.name)}
			<Card.Root size="sm" class="relative transition-colors hover:bg-muted/40">
				<Card.Header class="flex items-center gap-3">
					<Avatar.Root class="size-9">
						<Avatar.Fallback class="text-xs">{initials(a.name)}</Avatar.Fallback>
					</Avatar.Root>
					<div class="min-w-0">
						<Card.Title class="truncate text-sm">
							<a href="/?author={encodeURIComponent(a.name)}" class="after:absolute after:inset-0">{a.name}</a>
						</Card.Title>
						<Card.Description>{a.families} {a.families === 1 ? 'family' : 'families'}</Card.Description>
					</div>
				</Card.Header>
			</Card.Root>
		{/each}
	</div>
</div>
