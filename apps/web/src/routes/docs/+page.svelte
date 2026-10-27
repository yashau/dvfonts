<script lang="ts">
	// A literal closing script tag would end this component's <script> block.
	const SCRIPT_END = '<\u002Fscript>';
	import CodeBlock from '#lib/components/code-block.svelte';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import { Kbd, KbdGroup } from '#lib/components/ui/kbd/index.js';
	import { KEYMAP } from '#lib/thaana.js';
	import { thaanaKeyboard } from '@yashau/thaana-svelte';
	import { SITE_ORIGIN } from '#lib/site.js';

	let demoOn = $state(true);
	let demoText = $state('');

	const keyRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

	const packages = $derived([
		{
			id: 'vanilla',
			label: 'Vanilla JS',
			lang: 'javascript' as const,
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
			lang: 'jsx' as const,
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
			lang: 'svelte' as const,
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
			lang: 'vue' as const,
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
		[
			'loadFonts({ family, weights, files }, { normalize })',
			'Load a font; resolves when it can be drawn (canvas, SVG). Options: same size (above) and self-hosting (below).'
		],
		['fontStack(family)', 'A font-family with a Latin fallback and installed Thaana fonts.'],
		['PANGRAMS · LETTERS · ARABIC_LETTERS · FILI', 'Sample text and the alphabet.'],
		['fontFaceCss({ family, files })', '@font-face CSS for your own copies of the files (self-hosting).']
	];
</script>

<svelte:head>
	<title>Docs — fonts.mv</title>
	<meta
		name="description"
		content="Embed Dhivehi fonts with one link tag, add a Thaana keyboard to any input, and the @yashau/thaana packages for React, Svelte and Vue."
	/>
</svelte:head>

<article class="max-w-4xl min-w-0 py-10">
	<h1 class="text-3xl font-semibold tracking-tight">Docs</h1>
	<p class="mt-2 max-w-4xl text-pretty text-muted-foreground">
		Everything here is free to use. New to Thaana on the web? Read <a
			class="underline underline-offset-4"
			href="/docs/thaana">Displaying Thaana well</a
		>. Building with an AI agent? Point it at <a class="underline underline-offset-4" href="/llms.txt">/llms.txt</a>.
	</p>

	<h2 id="embed" class="mt-10 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Embed a font</h2>
	<p class="mb-4 text-muted-foreground">
		The CSS API works like Google Fonts. Each font's page builds the URL for you; this is the format.
	</p>
	<CodeBlock
		title="HTML"
		lang="html"
		code={`<link rel="stylesheet" href="${SITE_ORIGIN}/css2?family=Faruma&family=Bolhu:wght@400;700&display=swap">\n\n<p dir="rtl" lang="dv" style="font-family: 'Faruma', system-ui, sans-serif">ދިވެހިރާއްޖެ</p>`}
	/>
	<ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
		<li><code>family=Name</code> with spaces as <code>+</code>. Old names work too (<code>A_Waheed</code>).</li>
		<li><code>:wght@400;700</code> picks weights; without it you get the default weight.</li>
		<li>Fonts are split into Thaana and Latin parts, so a Thaana-only page downloads only the Thaana part.</li>
		<li>Many Dhivehi fonts have no Latin letters, so always list a Latin fallback after the family.</li>
		<li>
			Optional: <code>&amp;normalize=1</code> makes every font the same size (<a
				class="underline underline-offset-4"
				href="#same-size">below</a
			>).
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
			<Card.Description>
				Type <Kbd>divehi</Kbd> to get <span class="whitespace-nowrap" dir="rtl" lang="dv">ދިވެހި</span>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Textarea
				{@attach thaanaKeyboard({ enabled: demoOn })}
				bind:value={demoText}
				rows={3}
				placeholder="އަކުރުތައް ލިޔެ ބައްލަވާ…"
				class="min-h-24 resize-none text-lg"
				autocomplete="off"
				spellcheck={false}
			/>
		</Card.Content>
		<Card.Footer class="gap-2">
			<Switch id="demo-on" bind:checked={demoOn} />
			<Label for="demo-on" class="font-normal text-muted-foreground">Phonetic keyboard</Label>
		</Card.Footer>
	</Card.Root>
	<div class="mt-4">
		<CodeBlock
			title="No build step"
			lang="html"
			code={`<script type="module" src="${SITE_ORIGIN}/thaana.js">${SCRIPT_END}\n\n<input data-thaana>\n<textarea data-thaana></textarea>\n<div contenteditable data-thaana></div>\n\n<!-- or a classic script: window.Thaana -->\n<script src="${SITE_ORIGIN}/thaana.iife.js">${SCRIPT_END}`}
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
	<!-- Keys are sized from the container's width (cqw), so the ten-key row always fits:
	     no scrolling on phones, capped at a comfortable size on desktop. -->
	<div class="@container mb-3 max-w-2xl">
		<div class="flex flex-col gap-[1.2cqw]">
			{#each keyRows as row, i (row)}
				<KbdGroup class="gap-[1.2cqw]" style="padding-inline-start: {i * 4.4}cqw">
					{#each row.split('') as k (k)}
						<Kbd class="h-auto w-[8.92cqw] min-w-0 shrink-0 flex-col gap-0 rounded-[1.2cqw] px-0 py-[1cqw]">
							<span class="text-[clamp(10px,3.2cqw,18px)] leading-tight" dir="rtl" lang="dv"
								>{KEYMAP[k.toUpperCase()] ?? ''}</span
							>
							<span class="text-[clamp(14px,4.4cqw,26px)] leading-tight text-foreground" dir="rtl" lang="dv"
								>{KEYMAP[k]}</span
							>
							<span class="text-[clamp(9px,2.4cqw,12px)] uppercase">{k}</span>
						</Kbd>
					{/each}
				</KbdGroup>
			{/each}
		</div>
	</div>
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
				<CodeBlock title="Install" lang="bash" code={p.install} />
				<CodeBlock title="Use" lang={p.lang} code={p.code} />
			</Tabs.Content>
		{/each}
	</Tabs.Root>

	<h2 id="same-size" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Same size for every font</h2>
	<p class="mb-4 text-muted-foreground">
		Dhivehi fonts differ a lot in size at the same <code>font-size</code>: some draw their letters at half Faruma's
		size, others at nearly twice. Ask for <code>normalize</code> and each family is scaled with CSS
		<code>size-adjust</code> so its Thaana letters look as big as Faruma's. Switching fonts then keeps your text the same
		size. The font files are not changed, and it's off unless you ask for it.
	</p>
	<div class="flex flex-col gap-3">
		<CodeBlock
			title="HTML"
			lang="html"
			code={`<link rel="stylesheet" href="${SITE_ORIGIN}/css2?family=Bolhu&family=Faiy&display=swap&normalize=1">`}
		/>
		<CodeBlock
			title="JS"
			lang="javascript"
			code={`import { loadFonts, fontCssUrl } from '@yashau/thaana';\n\nawait loadFonts({ family: 'Bolhu' }, { normalize: true });\nfontCssUrl([{ family: 'Faiy' }], { normalize: true }); // just the URL`}
		/>
		<CodeBlock title="React / Vue" lang="jsx" code={`useDhivehiFont('Bolhu', [400], { normalize: true });`} />
	</div>
	<p class="mt-3 text-sm text-muted-foreground">
		Each font's page has a switch that adds it to the embed code. The scale per family is in
		<a class="underline underline-offset-4" href="/fonts.json">fonts.json</a> (<code>sizeAdjust</code>).
	</p>

	<h2 id="helpers" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Helpers</h2>
	<Card.Root class="py-0">
		<!-- A dense reference list: no group gap (gap-0! beats the group's own gap for
		     small items) and separators without margins, so the items' padding is the
		     same above and below every row, edges included. -->
		<Item.Group class="gap-0!">
			{#each helpers as [fn, what], i (fn)}
				{#if i > 0}<Item.Separator class="my-0" />{/if}
				<Item.Root size="sm">
					<Item.Content class="min-w-0">
						<Item.Title class="font-mono text-[13px] break-words">{fn}</Item.Title>
						<Item.Description class="line-clamp-none">{what}</Item.Description>
					</Item.Content>
				</Item.Root>
			{/each}
		</Item.Group>
	</Card.Root>
	<p class="mt-3 text-sm text-muted-foreground">
		Plus <code>@yashau/thaana/thaana.css</code>: right-to-left, a line height that doesn't clip fili, no fake italics,
		and per-paragraph direction for <code>:lang(dv)</code>. Also at
		<a class="underline underline-offset-4" href="/thaana.css">/thaana.css</a>.
	</p>

	<h2 id="self-hosting" class="mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">Self-hosting</h2>
	<p class="mb-4 text-muted-foreground">
		Every font and collection can be downloaded from its page or the
		<a class="underline underline-offset-4" href="/downloads">downloads</a> page, to serve from your own server.
	</p>

	<h3 id="own-files" class="mt-6 mb-3 scroll-mt-20 text-lg font-semibold tracking-tight">With the packages</h3>
	<p class="mb-4 text-muted-foreground">
		Pass the URLs of your copies by weight. The packages then register the font from your files and load nothing from
		fonts.mv. For <code>normalize</code>, also pass the family's <code>sizeAdjust</code> from
		<a class="underline underline-offset-4" href="/fonts.json">fonts.json</a>.
	</p>
	<div class="flex flex-col gap-3">
		<CodeBlock
			title="JS"
			lang="javascript"
			code={`import { loadFonts, fontFaceCss } from '@yashau/thaana';\n\nawait loadFonts({ family: 'Faruma', files: { 400: '/fonts/faruma-400.woff2' } });\n\n// Or the @font-face rules for your own stylesheet:\nfontFaceCss({ family: 'Bolhu', files: { 400: '/fonts/bolhu-400.woff2', 700: '/fonts/bolhu-700.woff2' } });`}
		/>
		<CodeBlock
			title="React / Vue"
			lang="jsx"
			code={`useDhivehiFont('Faruma', [400], { files: { 400: '/fonts/faruma-400.woff2' } });`}
		/>
	</div>

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
