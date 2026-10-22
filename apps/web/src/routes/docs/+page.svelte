<script lang="ts">
	// A literal closing script tag would end this component's <script> block.
	const SCRIPT_END = '<\u002Fscript>';
	import { onMount } from 'svelte';
	import CodeBlock from '#lib/components/code-block.svelte';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Kbd, KbdGroup } from '#lib/components/ui/kbd/index.js';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import { thaanaKeyboard, KEYMAP } from '#lib/thaana.js';
	import { origin, SITE_ORIGIN } from '#lib/site.js';

	let base = $state(SITE_ORIGIN);
	onMount(() => (base = origin()));

	let demoEl = $state<HTMLTextAreaElement | null>(null);
	let demoOn = $state(true);
	let demoText = $state('');
	$effect(() => {
		if (!demoEl) return;
		return thaanaKeyboard(demoEl, () => demoOn).destroy;
	});

	const keyRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

	const packages = $derived([
		{
			id: 'vanilla',
			label: 'Vanilla JS',
			install: 'npm i @yashau/thaana',
			code: `import { attachKeyboard, loadFonts, fontStack } from '@yashau/thaana';
import '@yashau/thaana/thaana.css'; // sane defaults for :lang(dv)

await loadFonts({ family: 'Faruma' });
const input = document.querySelector('#name');
input.style.fontFamily = fontStack('Faruma');

let dv = true; // e.g. bound to a DV/EN toggle
const detach = attachKeyboard(input, { enabled: () => dv });`
		},
		{
			id: 'react',
			label: 'React',
			install: 'npm i @yashau/thaana-react',
			code: `import { useState } from 'react';
import { ThaanaInput, useThaanaKeyboard, useDhivehiFont, fontStack } from '@yashau/thaana-react';

export function Form() {
  const [name, setName] = useState('');
  const [dv, setDv] = useState(true);
  useDhivehiFont('Faruma');
  const notes = useThaanaKeyboard<HTMLTextAreaElement>({ enabled: dv });

  return (
    <>
      <ThaanaInput dv={dv} value={name} onChange={(e) => setName(e.target.value)}
        style={{ fontFamily: fontStack('Faruma') }} />
      <textarea ref={notes} />
      <button onClick={() => setDv(!dv)}>{dv ? 'ދިވެހި' : 'EN'}</button>
    </>
  );
}`
		},
		{
			id: 'svelte',
			label: 'Svelte',
			install: 'npm i @yashau/thaana-svelte',
			code: `<script>
  import { ThaanaInput, thaana, thaanaKeyboard, loadFonts, fontStack } from '@yashau/thaana-svelte';

  let name = $state('');
  let dv = $state(true);
  loadFonts({ family: 'Faruma' });
${SCRIPT_END}

<ThaanaInput {dv} bind:value={name} style="font-family: {fontStack('Faruma')}" />

<!-- or on any element -->
<textarea use:thaana={{ enabled: dv }}></textarea>
<div contenteditable {@attach thaanaKeyboard({ enabled: dv })}></div>`
		},
		{
			id: 'vue',
			label: 'Vue',
			install: 'npm i @yashau/thaana-vue',
			code: `<script setup>
import { ref } from 'vue';
import { ThaanaInput, vThaana, useDhivehiFont, fontStack } from '@yashau/thaana-vue';

const name = ref('');
const dv = ref(true);
useDhivehiFont('Faruma');
${SCRIPT_END}

<template>
  <ThaanaInput v-model="name" :dv="dv" :style="{ fontFamily: fontStack('Faruma') }" />
  <textarea v-thaana="{ enabled: dv }"></textarea>
</template>

<!-- or globally: app.use(ThaanaPlugin) -->`
		}
	]);

	const helpers: [string, string][] = [
		[
			'attachKeyboard(el, { enabled })',
			'Phonetic keyboard on an input, textarea or contenteditable. Returns detach().'
		],
		['autoAttach() / import "@yashau/thaana/auto"', 'Attach to every [data-thaana] field, including ones added later.'],
		[
			'<ThaanaText text={…} />',
			'React/Svelte/Vue: show Thaana right-to-left with lang="dv" and numbers isolated, even when it starts with a Latin word.'
		],
		[
			'thaanaForInputEvent(event)',
			'For rich-text editors (Lexical, TipTap, ProseMirror): the Thaana character to insert, or null.'
		],
		['transliterate("divehi")', '"ދިވެހި": replays keystrokes in the Divehi Phonetic layout.'],
		['convertLegacy(text, { layout })', 'Text typed in old A_ / phonetic fonts → Unicode Thaana.'],
		['repairPdfText(text)', 'Fix Thaana copied out of PDFs: reversed dates and times, spacing, list markers.'],
		['normalizePunctuation(text)', 'Latin , ; ? → ، ؛ ؟ after Thaana; no space before punctuation or inside brackets.'],
		['isolateNumbers(text)', 'Keep -5, +960 333-1234, 9:00, 1,000, 50% intact inside RTL text (display only).'],
		['isolate(value, dir)', "Wrap a URL, email or name in a bidi isolate (when you can't use <bdi>)."],
		['stripBidiControls(text)', 'Remove invisible bidi marks before saving or comparing.'],
		['hasThaana · hasRtl · isMixedScript', 'Script detection.'],
		[
			'detectDirection(text) · resolveDirection(text, explicit, fallback)',
			'First-strong (like dir="auto") vs rihaPDF\'s rule: any Thaana → RTL; no letters → fallback.'
		],
		['loadFonts({ family, weights })', 'Load a dvfonts family; resolves when it can be drawn (canvas, SVG).'],
		['fontStack(family)', 'A font-family with a Latin fallback and installed Thaana fonts.'],
		['PANGRAMS · LETTERS · ARABIC_LETTERS · FILI', 'Sample text and the alphabet.']
	];
</script>

<svelte:head>
	<title>Docs — dvfonts</title>
	<meta
		name="description"
		content="Embed Dhivehi fonts with one link tag, add a Thaana keyboard to any input, and the @yashau/thaana packages for React, Svelte and Vue."
	/>
</svelte:head>

<article class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Docs</h1>
	<p class="mt-2 max-w-4xl text-pretty text-muted-foreground">
		Everything here is free to use. New to Thaana on the web? Read <a class="underline underline-offset-4" href="/guide"
			>Displaying Thaana well</a
		>. Building with an AI agent? Point it at <a class="underline underline-offset-4" href="/llms.txt">/llms.txt</a>.
	</p>

	<h2 id="embed" class="mt-10 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Embed a font</h2>
	<p class="mb-4 text-muted-foreground">
		The CSS API works like Google Fonts. Each font's page builds the URL for you; this is the format.
	</p>
	<CodeBlock
		title="HTML"
		code={`<link rel="stylesheet" href="${base}/css2?family=Faruma&family=Bolhu:wght@400;700&display=swap">\n\n<p dir="rtl" lang="dv" style="font-family: 'Faruma', system-ui, sans-serif">ދިވެހިރާއްޖެ</p>`}
	/>
	<ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
		<li><code>family=Name</code> with spaces as <code>+</code>. Old names work too (<code>A_Waheed</code>).</li>
		<li><code>:wght@400;700</code> picks weights; without it you get the default weight.</li>
		<li>Fonts are split into Thaana and Latin parts, so a Thaana-only page downloads only the Thaana part.</li>
		<li>Many Dhivehi fonts have no Latin letters, so always list a Latin fallback after the family.</li>
		<li>
			Self-hosting? Every font and collection is on the <a class="underline underline-offset-4" href="/downloads"
				>downloads</a
			> page.
		</li>
	</ul>

	<h2 id="keyboard" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Thaana keyboard</h2>
	<p class="mb-4 text-muted-foreground">
		Most people have no Dhivehi keyboard installed. One script turns Latin keystrokes into Thaana with the Divehi
		Phonetic layout (Microsoft's standard layout, used across Maldivian sites). Try it:
	</p>
	<Card.Root>
		<Card.Header>
			<Card.Title>Try it</Card.Title>
			<Card.Action class="flex items-center gap-2">
				<Switch id="demo-on" bind:checked={demoOn} />
				<Label for="demo-on">Phonetic keyboard {demoOn ? 'on' : 'off'}</Label>
			</Card.Action>
		</Card.Header>
		<Card.Content>
			<Textarea
				bind:ref={demoEl}
				bind:value={demoText}
				dir="rtl"
				lang="dv"
				rows={3}
				placeholder="Type “divehi” → ދިވެހި"
				class="text-lg [unicode-bidi:plaintext]"
				autocomplete="off"
				spellcheck={false}
			/>
		</Card.Content>
	</Card.Root>
	<div class="mt-4">
		<CodeBlock
			title="No build step"
			code={`<script type="module" src="${base}/thaana.js">${SCRIPT_END}\n\n<input data-thaana>\n<textarea data-thaana></textarea>\n<div contenteditable data-thaana></div>\n\n<!-- or a classic script: window.Thaana -->\n<script src="${base}/thaana.iife.js">${SCRIPT_END}`}
		/>
	</div>
	<ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
		<li>Only typed characters change. Paste, IME composition, autocorrect and real Dhivehi keyboards pass through.</li>
		<li>
			Brackets work like Microsoft's layout: press the key that looks right on screen (<code>)</code> to open on the
			right). The pairs are swapped, so the stored text keeps <code>(</code> before the enclosed text and browsers mirror
			it in RTL.
		</li>
		<li><code>,</code> <code>;</code> <code>?</code> type the Dhivehi forms ، ؛ ؟.</li>
		<li>Works with React, Vue and Svelte controlled inputs; native undo keeps working.</li>
	</ul>

	<h3 class="mt-6 mb-2 font-medium">Layout</h3>
	<ScrollArea orientation="horizontal" class="pb-3">
		<div class="flex flex-col gap-1.5">
			{#each keyRows as row, i (row)}
				<KbdGroup class="gap-1.5" style="padding-left: {i * 1.25}rem">
					{#each row.split('') as k (k)}
						<Kbd class="h-auto w-12 shrink-0 flex-col gap-0 py-1.5">
							<span class="text-lg leading-tight" dir="rtl" lang="dv">{KEYMAP[k.toUpperCase()] ?? ''}</span>
							<span class="text-2xl leading-tight text-foreground" dir="rtl" lang="dv">{KEYMAP[k]}</span>
							<span class="text-[11px] uppercase">{k}</span>
						</Kbd>
					{/each}
				</KbdGroup>
			{/each}
		</div>
	</ScrollArea>
	<p class="text-sm text-muted-foreground">
		Top: with Shift. The raw map is at <a class="underline underline-offset-4" href="/keymap.json">/keymap.json</a>.
	</p>

	<h2 id="packages" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Packages</h2>
	<p class="mb-4 text-muted-foreground">
		One install makes Thaana work in your app: keyboard, fonts, bidi and punctuation helpers. The framework packages
		include everything from <code>@yashau/thaana</code>.
	</p>
	<Tabs.Root value="vanilla">
		<Tabs.List>
			{#each packages as p (p.id)}
				<Tabs.Trigger value={p.id}>{p.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each packages as p (p.id)}
			<Tabs.Content value={p.id} class="mt-3 flex flex-col gap-3">
				<CodeBlock title="Install" code={p.install} />
				<CodeBlock title="Use" code={p.code} />
			</Tabs.Content>
		{/each}
	</Tabs.Root>

	<h2 id="helpers" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Helpers</h2>
	<Card.Root class="py-0">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="pl-4">Function</Table.Head>
					<Table.Head>What it's for</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each helpers as [fn, what] (fn)}
					<Table.Row>
						<Table.Cell class="pl-4 align-top font-mono text-[13px]">{fn}</Table.Cell>
						<Table.Cell class="whitespace-normal text-muted-foreground">{what}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Plus <code>@yashau/thaana/thaana.css</code>: right-to-left, a line height that doesn't clip fili, no fake italics,
		and per-paragraph direction for <code>:lang(dv)</code>. Also at
		<a class="underline underline-offset-4" href="/thaana.css">/thaana.css</a>.
	</p>

	<h2 id="data" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">For tools and agents</h2>
	<ul class="list-disc space-y-1 pl-5 text-muted-foreground">
		<li>
			<a class="underline underline-offset-4" href="/llms.txt">/llms.txt</a>: every recipe and the whole font list, for
			AI agents.
		</li>
		<li>
			<a class="underline underline-offset-4" href="/fonts.json">/fonts.json</a>: every family with weights, license,
			CSS URL and file URLs.
		</li>
		<li><a class="underline underline-offset-4" href="/keymap.json">/keymap.json</a>: the keyboard layout as data.</li>
	</ul>
</article>
