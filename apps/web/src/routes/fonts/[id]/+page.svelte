<script lang="ts">
	import { onMount } from 'svelte';
	import { CATEGORIES, WEIGHT_NAMES, credit, defaultStyle, fontUrl, formatBytes } from '#lib/catalog.js';
	import { registerFamily, previewFamily } from '#lib/fonts.js';
	import { tester } from '#lib/tester.svelte.js';
	import { DIGITS_PUNCT, FILI, LETTERS_ARABIC, LETTERS_NATIVE, ARABIC_LETTERS_SAMPLE } from '#lib/thaana.js';
	import { cssApiUrl, origin, SITE_ORIGIN } from '#lib/site.js';
	import TesterBar from '#lib/components/tester-bar.svelte';
	import FontPreview from '#lib/components/font-preview.svelte';
	import CodeBlock from '#lib/components/code-block.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const family = $derived(data.family);
	const symbols = $derived(family.category === 'symbols');
	const main = $derived(defaultStyle(family));
	const by = $derived(credit(family));
	const category = $derived(CATEGORIES.find((c) => c.id === family.category)?.label);

	$effect(() => registerFamily(family));

	let base = $state(SITE_ORIGIN);
	onMount(() => (base = origin()));

	let selected = $state<string[]>([]);
	$effect(() => {
		selected = family.styles.map((s) => String(s.weight));
	});
	const weights = $derived(selected.length ? selected.map(Number) : [main.weight]);
	const href = $derived(cssApiUrl(base, [{ name: family.name, weights }]));
	const linkSnippet = $derived(`<link rel="stylesheet" href="${href}">`);
	const importSnippet = $derived(`@import url('${href}');`);
	const cssSnippet = $derived(`font-family: '${family.name}', sans-serif;`);

	const changes = $derived.by(() => {
		const out: string[] = [];
		if (family.unmodified) {
			out.push('Distributed exactly as published: the license does not allow derivatives. Only wrapped as WOFF/WOFF2.');
			return out;
		}
		const legacy = family.styles.find((s) => s.legacyLayout)?.legacyLayout;
		if (legacy)
			out.push(
				`Remapped from the pre-Unicode ${legacy === 'typewriter' ? 'typewriter (A_ font)' : 'phonetic'} encoding to Unicode Thaana, so it works with any Dhivehi keyboard and on the web.`
			);
		if (family.styles.some((s) => s.metrics.repaired))
			out.push('Repaired broken vertical metrics that clipped fili and lines in browsers.');
		out.push('Consistent line height across Windows, macOS and Linux (hhea, typo and win metrics aligned).');
		out.push('Fili marked as combining marks so they stack correctly over letters.');
		out.push('Cleaned names and weights so all styles install as one family.');
		if (!symbols) out.push('Split into small Thaana and Latin subsets for faster loading on the web.');
		return out;
	});

	const glyphSets = $derived([
		{ title: 'Letters', chars: LETTERS_NATIVE },
		{ title: 'Arabic-derived letters', chars: LETTERS_ARABIC },
		{ title: 'Fili', chars: FILI.map((f) => 'އ' + f) },
		{ title: 'Digits & punctuation', chars: DIGITS_PUNCT }
	]);
</script>

<svelte:head>
	<title>{family.name} — dvfonts</title>
	<meta
		name="description"
		content="{family.name}: free Dhivehi font{family.styles.length > 1
			? ` in ${family.styles.length} styles`
			: ''}. Preview, download, or embed it on the web."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
	<Button href="/" variant="ghost" size="sm" class="-ml-2 text-muted-foreground"><ArrowLeftIcon /> All fonts</Button>

	<header class="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="min-w-0">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{family.name}</h1>
			<p class="mt-1 text-muted-foreground">{by ?? family.source ?? 'Unknown designer'}</p>
			<div class="mt-3 flex flex-wrap items-center gap-2">
				<Badge variant="secondary">{category}</Badge>
				<Badge variant="outline">{family.license}</Badge>
				<span class="text-sm text-muted-foreground"
					>{family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'}</span
				>
				{#if family.aliases.length}
					<span class="text-sm text-muted-foreground">· also known as {family.aliases.join(', ')}</span>
				{/if}
			</div>
		</div>
		<Button href="/fonts/{family.id}/{family.id}.zip" download="{family.name}.zip">
			<DownloadIcon /> Download family <span class="opacity-70">({formatBytes(family.zipSize)})</span>
		</Button>
	</header>

	<div class="mt-8 rounded-xl border p-6 sm:p-10">
		<FontPreview {family} weight={main.weight} size={Math.max(tester.size, 48)} />
	</div>

	<section class="mt-10">
		<h2 class="mb-4 text-xl font-semibold tracking-tight">Styles</h2>
		<TesterBar />
		<div class="mt-2 divide-y">
			{#each family.styles as style (style.weight)}
				<div class="py-5">
					<div class="mb-2 flex flex-wrap items-center justify-between gap-2">
						<p class="text-sm text-muted-foreground">
							{WEIGHT_NAMES[style.weight]}
							{style.weight}
						</p>
						<div class="flex items-center gap-1">
							{#each Object.keys(style.sizes).filter((k) => k !== 'woff') as kind (kind)}
								<Button
									href="{fontUrl(family, style.weight, kind)}?download={encodeURIComponent(
										`${family.name.replace(/\s+/g, '')}-${WEIGHT_NAMES[style.weight]}.${kind}`
									)}"
									variant="ghost"
									size="xs"
									aria-label="Download {family.name} {WEIGHT_NAMES[style.weight]} as {kind.toUpperCase()}"
								>
									<DownloadIcon />
									{kind.toUpperCase()}
								</Button>
							{/each}
						</div>
					</div>
					<FontPreview {family} weight={style.weight} />
				</div>
			{/each}
		</div>
	</section>

	{#if !symbols}
		<section class="mt-10">
			<h2 class="mb-4 text-xl font-semibold tracking-tight">Glyphs</h2>
			{#each glyphSets as set (set.title)}
				<h3 class="mt-6 mb-2 text-sm font-medium text-muted-foreground">{set.title}</h3>
				<div
					class="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-px overflow-hidden rounded-lg border bg-border"
				>
					{#each set.chars as ch (ch)}
						<div
							class="flex aspect-square items-center justify-center bg-background text-4xl"
							dir="rtl"
							style:font-family="'{previewFamily(family)}', 'dv-ui', sans-serif"
							style:font-weight={main.weight}
						>
							{ch}
						</div>
					{/each}
				</div>
			{/each}
			<div class="mt-6 rounded-lg border p-5">
				<FontPreview {family} weight={main.weight} size={28} text={ARABIC_LETTERS_SAMPLE} />
			</div>
		</section>
	{/if}

	<section class="mt-10 grid gap-8 lg:grid-cols-2">
		<div>
			<h2 class="mb-1 text-xl font-semibold tracking-tight">Use on the web</h2>
			<p class="mb-4 text-sm text-muted-foreground">
				Pick the weights you need. The stylesheet loads only the Thaana or Latin parts a page actually uses.
			</p>
			{#if family.styles.length > 1}
				<ToggleGroup.Root type="multiple" variant="outline" size="sm" bind:value={selected} class="mb-4 flex-wrap">
					{#each family.styles as style (style.weight)}
						<ToggleGroup.Item value={String(style.weight)} class="px-3">{style.weight}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			{/if}
			<div class="flex flex-col gap-3">
				<CodeBlock title="In <head>" code={linkSnippet} />
				<CodeBlock title="Or in CSS" code={importSnippet} />
				<CodeBlock title="Then use" code={cssSnippet} />
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-xl font-semibold tracking-tight">About this font</h2>
			<dl class="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-sm">
				{#if family.designer}<dt class="text-muted-foreground">Designer</dt>
					<dd>{family.designer}</dd>{/if}
				{#if family.manufacturer}<dt class="text-muted-foreground">Manufacturer</dt>
					<dd class="break-words">{family.manufacturer}</dd>{/if}
				{#if family.copyright}<dt class="text-muted-foreground">Copyright</dt>
					<dd class="break-words">{family.copyright}</dd>{/if}
				<dt class="text-muted-foreground">License</dt>
				<dd class="break-words">
					{family.license}{#if family.licenseText && family.license !== 'OFL-1.1'}
						<span class="block text-muted-foreground">{family.licenseText}</span>{/if}
				</dd>
				{#if family.source}<dt class="text-muted-foreground">Source</dt>
					<dd>
						{#if family.upstream}<a
								class="inline-flex items-center gap-1 underline underline-offset-4"
								href={family.upstream}
								rel="noopener noreferrer"
								target="_blank">{family.source} <ExternalLinkIcon class="size-3.5" /></a
							>{:else}{family.source}{/if}
					</dd>{/if}
				{#if family.version}<dt class="text-muted-foreground">Version</dt>
					<dd class="break-words">{family.version}</dd>{/if}
			</dl>
			{#if family.notes}<p class="mt-4 text-sm">{family.notes}</p>{/if}

			<h3 class="mt-6 mb-2 font-medium">What dvfonts changed</h3>
			<ul class="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
				{#each changes as c (c)}<li>{c}</li>{/each}
			</ul>

			<h3 class="mt-6 mb-2 font-medium">Files</h3>
			<ul class="space-y-1 text-sm">
				{#each family.styles as s (s.weight)}
					<li class="flex flex-wrap items-baseline gap-x-3">
						<span class="w-28 text-muted-foreground">{WEIGHT_NAMES[s.weight]}</span>
						{#each Object.entries(s.sizes) as [kind, size] (kind)}
							<a class="underline underline-offset-4" href={fontUrl(family, s.weight, kind)} download
								>{kind.toUpperCase()}</a
							>
							<span class="text-xs text-muted-foreground">{formatBytes(size)}</span>
						{/each}
					</li>
				{/each}
			</ul>
		</div>
	</section>
</div>
