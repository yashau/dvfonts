<script lang="ts">
	import { convertLegacy, repairPdfText, normalizePunctuation, stripBidiControls } from '@yashau/thaana';
	import { registerFamily } from '#lib/fonts.js';
	import * as ToggleGroup from '#lib/components/ui/toggle-group/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import CopyButton from '#lib/components/copy-button.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	$effect(() => registerFamily(data.faruma));

	type Mode = 'typewriter' | 'phonetic' | 'pdf';
	const modes: { id: Mode; label: string; hint: string; example: string }[] = [
		{
			id: 'typewriter',
			label: 'Old A_ font',
			hint: 'Text typed in A_Waheed, A_Faseyha, A_Randhoo and the other A_ fonts: it shows up as Latin letters without the font.',
			example: 'cswb ihevid'
		},
		{
			id: 'phonetic',
			label: 'Old phonetic font',
			hint: 'Text typed in older casual fonts such as Thaana, Akko, Athu Casual or Avas Thaana.',
			example: 'qsab ihevid'
		},
		{
			id: 'pdf',
			label: 'Copied from a PDF',
			hint: 'Thaana copied out of a PDF: fixes reversed dates and times, stray spaces and list markers.',
			example: 'ތާރީޚް 2026/1/14 ، ހެނދުނު 00:9 ގައި'
		}
	];

	let mode = $state<Mode>('typewriter');
	let input = $state('');
	let tidy = $state(true);

	const current = $derived(modes.find((m) => m.id === mode)!);
	const output = $derived.by(() => {
		const text = stripBidiControls(input);
		if (!text) return '';
		const converted = mode === 'pdf' ? repairPdfText(text) : convertLegacy(text, { layout: mode });
		return tidy ? normalizePunctuation(converted) : converted;
	});
</script>

<svelte:head>
	<title>Convert old Thaana text — dvfonts</title>
	<meta
		name="description"
		content="Turn text typed in old A_ fonts, or copied out of PDFs, into proper Unicode Thaana."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Convert old Thaana text</h1>
	<p class="mt-2 max-w-2xl text-muted-foreground">
		Paste text from an old document or a PDF and get proper Unicode Thaana you can use anywhere. Everything runs in your
		browser.
	</p>

	<ToggleGroup.Root
		type="single"
		variant="outline"
		value={mode}
		onValueChange={(v) => {
			if (v) mode = v as Mode;
		}}
		class="mt-6 flex-wrap"
		aria-label="Where the text came from"
	>
		{#each modes as m (m.id)}
			<ToggleGroup.Item value={m.id} class="px-3">{m.label}</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
	<p class="mt-2 text-sm text-muted-foreground">
		{current.hint}
		<button class="underline underline-offset-4 hover:text-foreground" onclick={() => (input = current.example)}
			>Try an example</button
		>
	</p>

	<div class="mt-6 grid gap-4 md:grid-cols-2">
		<div>
			<Label for="convert-in" class="mb-2">Paste here</Label>
			<Textarea
				id="convert-in"
				bind:value={input}
				rows={10}
				dir={mode === 'pdf' ? 'rtl' : 'ltr'}
				spellcheck={false}
				class="font-mono text-base"
			/>
		</div>
		<div>
			<div class="mb-2 flex items-center justify-between gap-2">
				<Label for="convert-out">Unicode Thaana</Label>
				<CopyButton text={output} />
			</div>
			<Textarea
				id="convert-out"
				value={output}
				readonly
				rows={10}
				dir="rtl"
				lang="dv"
				class="text-xl [unicode-bidi:plaintext]"
				style="font-family: 'dv-faruma', 'dv-ui', system-ui, sans-serif; line-height: 1.75"
			/>
		</div>
	</div>
	<div class="mt-3 flex items-center gap-2">
		<Switch id="tidy" bind:checked={tidy} />
		<Label for="tidy">Also tidy punctuation (، ؛ ؟ and spacing)</Label>
	</div>

	<p class="mt-8 text-sm text-muted-foreground">
		In code: <code>convertLegacy(text, {'{'} layout: 'typewriter' {'}'})</code> and <code>repairPdfText(text)</code>
		from
		<a class="underline underline-offset-4" href="/docs#helpers">@yashau/thaana</a>.
	</p>
</div>
