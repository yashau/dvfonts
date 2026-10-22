<script lang="ts">
	import { onMount } from 'svelte';
	import CodeBlock from '#lib/components/code-block.svelte';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
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
</script>

<svelte:head>
	<title>Docs — dvfonts</title>
	<meta name="description" content="Embed Dhivehi fonts with one link tag, and add a Thaana keyboard to any input." />
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Docs</h1>
	<p class="mt-2 text-muted-foreground">
		Everything here is free to use. Building with an AI agent? Point it at
		<a class="underline underline-offset-4" href="/llms.txt">/llms.txt</a>; it has every recipe below plus the full font
		list.
	</p>

	<h2 id="embed" class="mt-10 mb-3 text-xl font-semibold tracking-tight">Embed a font</h2>
	<p class="mb-4 text-muted-foreground">
		The CSS API works like Google Fonts. Each family page builds the URL for you; this is the format.
	</p>
	<div class="flex flex-col gap-3">
		<CodeBlock
			title="HTML"
			code={`<link rel="stylesheet" href="${base}/css2?family=Faruma&family=Bolhu:wght@400;700&display=swap">\n\n<p dir="rtl" lang="dv" style="font-family: 'Faruma', system-ui, sans-serif">ދިވެހިރާއްޖެ</p>`}
		/>
	</div>
	<ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
		<li><code>family=Name</code> with spaces as <code>+</code>. Old names work too (<code>A_Waheed</code>).</li>
		<li><code>:wght@400;700</code> picks weights; without it you get the default weight.</li>
		<li>
			Fonts are split into Thaana and Latin subsets with <code>unicode-range</code>, so a Thaana page only downloads the
			Thaana part.
		</li>
		<li>Many Dhivehi fonts have no Latin letters, so always list a Latin fallback after the family.</li>
	</ul>

	<h2 id="keyboard" class="mt-12 mb-3 text-xl font-semibold tracking-tight">Thaana keyboard</h2>
	<p class="mb-4 text-muted-foreground">
		Most people don't have a Dhivehi keyboard installed. This one script turns Latin keystrokes into Thaana with the
		Divehi Phonetic layout (Microsoft's standard Dhivehi layout, used across Maldivian sites). Try it:
	</p>
	<div class="rounded-xl border p-4">
		<div class="mb-3 flex items-center gap-2">
			<Switch id="demo-on" bind:checked={demoOn} />
			<Label for="demo-on">Phonetic keyboard {demoOn ? 'on' : 'off'}</Label>
		</div>
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
	</div>
	<div class="mt-4 flex flex-col gap-3">
		<CodeBlock
			title="Zero-config"
			code={`<script type="module" src="${base}/thaana.js"><\/script>\n\n<input data-thaana>\n<textarea data-thaana></textarea>\n<div contenteditable data-thaana></div>`}
		/>
		<CodeBlock
			title="Programmatic"
			code={`import { attachKeyboard, transliterate } from '@yashau/thaana'; // or '${base}/thaana.js'\n\nlet dv = true; // e.g. bound to a DV/EN toggle\nconst detach = attachKeyboard(document.querySelector('#name'), { enabled: () => dv });\n\ntransliterate('divehi'); // "ދިވެހި"`}
		/>
	</div>
	<ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
		<li>Only typed characters change. Paste, IME composition, autocorrect and real Dhivehi keyboards pass through.</li>
		<li>
			Brackets are stored the right way round: type <code>(</code> before the text, like in English. Browsers mirror brackets
			in RTL text, so they display correctly and copy-paste cleanly. (Some older Dhivehi keymaps swap them, which makes them
			face outward.)
		</li>
		<li><code>,</code> <code>;</code> <code>?</code> type the Dhivehi forms ، ؛ ؟.</li>
		<li>Works with React, Vue and Svelte controlled inputs; native undo keeps working.</li>
	</ul>

	<h3 class="mt-6 mb-2 font-medium">Layout</h3>
	<div class="flex flex-col gap-1.5 overflow-x-auto pb-2">
		{#each keyRows as row, i (row)}
			<div class="flex gap-1.5" style:padding-left="{i * 1.25}rem">
				{#each row.split('') as k (k)}
					<div class="flex w-12 shrink-0 flex-col items-center rounded-md border py-1.5">
						<span class="text-xl leading-tight" dir="rtl" lang="dv"
							>{KEYMAP[k.toUpperCase()] ? KEYMAP[k.toUpperCase()] : ''}</span
						>
						<span class="text-2xl leading-tight" dir="rtl" lang="dv">{KEYMAP[k]}</span>
						<span class="text-[11px] text-muted-foreground uppercase">{k}</span>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<p class="text-sm text-muted-foreground">
		Top: with Shift. The raw map is at <a class="underline underline-offset-4" href="/keymap.json">/keymap.json</a>.
	</p>

	<h2 id="data" class="mt-12 mb-3 text-xl font-semibold tracking-tight">Font index</h2>
	<p class="text-muted-foreground">
		<a class="underline underline-offset-4" href="/fonts.json">/fonts.json</a> lists every family with its weights, license,
		ready-made CSS URL, download ZIP and individual WOFF2/TTF files.
	</p>
</article>
