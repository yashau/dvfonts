<script lang="ts">
	// A literal closing script tag would end this component's <script> block.
	const SCRIPT_END = '<\u002Fscript>';
	import { convertLegacy, isolateNumbers, normalizePunctuation, repairPdfText, fontStack } from '@yashau/thaana';
	import { registerFamily } from '#lib/fonts.js';
	import { thaanaKeyboard } from '#lib/thaana.js';
	import ThaanaDemo from '#lib/components/thaana-demo.svelte';
	import CodeBlock from '#lib/components/code-block.svelte';
	import { Input } from '#lib/components/ui/input/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$effect(() => {
		registerFamily(data.faruma);
		registerFamily(data.iyyu);
	});

	let goodInput = $state<HTMLInputElement | null>(null);
	$effect(() => {
		if (!goodInput) return;
		return thaanaKeyboard(goodInput, () => true).destroy;
	});

	const phone = 'ގުޅާލައްވާ: +960 333-1234';
	const temp = 'މިއަދުގެ ފިނިމިން -5 ޑިގްރީ';
	const messy = 'ކިހިނެއް ? ރަނގަޅު , ޝުކުރިއްޔާ .';
	// How an A_-font document stores ދިވެހި ބަސް: typewriter keys, in visual order.
	const legacy = 'cswb ihevid';
	const fromPdf = 'ތާރީޚް 2026/1/14';

	const toc = [
		['direction', 'Set direction and language'],
		['user-content', 'Text people type'],
		['numbers', 'Numbers and phone numbers'],
		['brackets', 'Brackets'],
		['punctuation', 'Punctuation'],
		['line-height', 'Line height'],
		['fallback', 'Latin fallback'],
		['italics', 'No italics'],
		['inputs', 'Inputs'],
		['canvas', 'Canvas and SVG'],
		['old-text', 'Old fonts and PDFs'],
		['pdf', 'Generating PDFs'],
		['storing', 'Storing and searching']
	] as const;
</script>

<svelte:head>
	<title>Displaying Thaana well — dvfonts</title>
	<meta
		name="description"
		content="Everything that goes wrong with Dhivehi (Thaana) on the web, and the fix for each: direction, numbers, brackets, punctuation, fonts, inputs, PDFs."
	/>
</svelte:head>

<article class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">Displaying Thaana well</h1>
	<p class="mt-2 max-w-2xl text-muted-foreground">
		Thaana is written right to left, its vowels are marks above and below the letters, and most Dhivehi fonts have no
		Latin letters. Here's everything that goes wrong because of that, with a live example and the fix. The
		<a class="underline underline-offset-4" href="/docs#packages">@yashau/thaana</a> packages and
		<a class="underline underline-offset-4" href="/thaana.css">thaana.css</a> handle most of it for you.
	</p>

	<nav class="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm">
		{#each toc as [id, label], i (id)}
			<a class="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href="#{id}"
				>{i + 1}. {label}</a
			>
		{/each}
	</nav>

	<section id="direction" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">1. Set direction and language</h2>
		<p class="mb-4 text-muted-foreground">
			Without <code>dir="rtl"</code> the browser lays Thaana out left to right: the text hugs the wrong edge and the
			full stop lands on the right. <code>lang="dv"</code> lets the browser and screen readers pick the right font and voice.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p>ދިވެހިރާއްޖެއަކީ ރީތި ޤައުމެކެވެ.</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">ދިވެހިރާއްޖެއަކީ ރީތި ޤައުމެކެވެ.</p>{/snippet}
		</ThaanaDemo>
		<div class="mt-3">
			<CodeBlock
				title="HTML"
				code={'<html lang="dv" dir="rtl">\n<!-- or on any element -->\n<p dir="rtl" lang="dv">…</p>'}
			/>
		</div>
	</section>

	<section id="user-content" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">2. Text people type</h2>
		<p class="mb-4 text-muted-foreground">
			<code>dir="auto"</code> picks the direction from the first letter, so a Dhivehi sentence that starts with a brand
			name turns left to right. If the text contains any Thaana, render it right to left (<code>resolveDirection()</code
			>), and use <code>unicode-bidi: plaintext</code> so each paragraph of a longer text decides for itself.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p dir="auto">Apple ގެ އާ ފޯނު ނެރެފިއެވެ!</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">Apple ގެ އާ ފޯނު ނެރެފިއެވެ!</p>{/snippet}
		</ThaanaDemo>
		<div class="mt-3">
			<CodeBlock
				title="JS"
				code={"import { resolveDirection } from '@yashau/thaana';\n\nel.dir = resolveDirection(text); // 'rtl' if there's any Thaana, else 'ltr'"}
			/>
		</div>
	</section>

	<section id="numbers" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">3. Numbers and phone numbers</h2>
		<p class="mb-4 text-muted-foreground">
			Inside right-to-left text, a phone number's groups swap places and a minus sign jumps to the wrong end. Wrap them
			in an isolate: <code>&lt;bdi dir="ltr"&gt;</code> in HTML, or <code>isolateNumbers()</code> for plain strings.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p dir="rtl" lang="dv">{phone}</p>
				<p dir="rtl" lang="dv">{temp}</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">{isolateNumbers(phone)}</p>
				<p dir="rtl" lang="dv">{isolateNumbers(temp)}</p>{/snippet}
		</ThaanaDemo>
		<div class="mt-3">
			<CodeBlock
				title="HTML or JS"
				code={'<p dir="rtl">ގުޅާލައްވާ: <bdi dir="ltr">+960 333-1234</bdi></p>\n\nimport { isolateNumbers, stripBidiControls } from \'@yashau/thaana\';\nlabel.textContent = isolateNumbers(text);   // display\nsave(stripBidiControls(label.textContent));  // store without the invisible marks'}
			/>
		</div>
	</section>

	<section id="brackets" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">4. Brackets</h2>
		<p class="mb-4 text-muted-foreground">
			Type and store brackets the way you would in English: <code>(</code> before the text. Browsers mirror brackets in right-to-left
			text, so they come out right. Some Dhivehi keyboard layouts (including Microsoft's) swap the pairs, which makes them
			face outward and breaks copy-paste.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p dir="rtl" lang="dv">ދިވެހިރާއްޖެ )ރާއްޖެ( ގައި</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">ދިވެހިރާއްޖެ (ރާއްޖެ) ގައި</p>{/snippet}
		</ThaanaDemo>
	</section>

	<section id="punctuation" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">5. Punctuation</h2>
		<p class="mb-4 text-muted-foreground">
			Dhivehi uses the Arabic comma <code>،</code>, semicolon <code>؛</code> and question mark <code>؟</code>; the full
			stop is the ordinary one. No space before punctuation. <code>normalizePunctuation()</code> fixes both.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p dir="rtl" lang="dv">{messy}</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">{normalizePunctuation(messy)}</p>{/snippet}
		</ThaanaDemo>
	</section>

	<section id="line-height" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">6. Line height</h2>
		<p class="mb-4 text-muted-foreground">
			Fili sit above and below the letters. A tight line height or <code>overflow: hidden</code> cuts them off, which shows
			up in buttons, badges and table cells. Give Thaana about 1.75.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<span
					dir="rtl"
					lang="dv"
					class="inline-block overflow-hidden rounded bg-muted px-2"
					style="line-height: 1">ބޫބީ ބޯބެ ކިޔުން</span
				>{/snippet}
			{#snippet right()}<span
					dir="rtl"
					lang="dv"
					class="inline-block overflow-hidden rounded bg-muted px-2"
					style="line-height: 1.75">ބޫބީ ބޯބެ ކިޔުން</span
				>{/snippet}
		</ThaanaDemo>
	</section>

	<section id="fallback" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">7. Latin fallback</h2>
		<p class="mb-4 text-muted-foreground">
			Most Dhivehi fonts have no Latin letters. Name only the Dhivehi font and English words fall back to the browser's
			default serif. Always add a Latin font after it; <code>fontStack()</code> also adds installed Thaana fonts.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p dir="rtl" lang="dv" style="font-family: 'dv-mv-iyyu', serif">
					ދިވެހި Fonts ގެ 2026 ވަނަ އަހަރު
				</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv" style="font-family: 'dv-mv-iyyu', system-ui, sans-serif">
					ދިވެހި Fonts ގެ 2026 ވަނަ އަހަރު
				</p>{/snippet}
		</ThaanaDemo>
		<div class="mt-3">
			<CodeBlock title="CSS" code={`font-family: ${fontStack('MV Iyyu')};`} />
		</div>
	</section>

	<section id="italics" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">8. No italics</h2>
		<p class="mb-4 text-muted-foreground">
			Thaana has no italics, and many Thaana fonts already lean. A browser-faked slant leans the wrong way for
			right-to-left text. Emphasise with weight or colour, and set <code>font-synthesis: none</code>.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p dir="rtl" lang="dv">މިއީ <em>މުހިންމު</em> ބަހެކެވެ.</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">
					މިއީ <strong class="text-emerald-600 dark:text-emerald-400">މުހިންމު</strong> ބަހެކެވެ.
				</p>{/snippet}
		</ThaanaDemo>
	</section>

	<section id="inputs" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">9. Inputs</h2>
		<p class="mb-4 text-muted-foreground">
			Most people have no Dhivehi keyboard installed. Give fields the phonetic keyboard, right-to-left direction, and
			turn off autocorrect and autocapitalise (they mangle Thaana on phones). Try typing <code>divehi</code> in both:
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<Input placeholder="ލިޔުއްވާ" class="text-lg" />{/snippet}
			{#snippet right()}<Input
					bind:ref={goodInput}
					placeholder="ލިޔުއްވާ"
					dir="rtl"
					lang="dv"
					class="text-lg"
				/>{/snippet}
		</ThaanaDemo>
		<div class="mt-3">
			<CodeBlock
				title="HTML"
				code={`<script type="module" src="https://dvfonts.yashau.com/thaana.js">${SCRIPT_END}\n<input data-thaana>`}
			/>
		</div>
		<p class="mt-2 text-sm text-muted-foreground">
			React, Svelte and Vue: see <a class="underline underline-offset-4" href="/docs#packages">the packages</a>.
		</p>
	</section>

	<section id="canvas" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">10. Canvas and SVG</h2>
		<p class="mb-4 text-muted-foreground">
			Canvas draws with whatever font is loaded <em class="not-italic">right now</em>: wait for the font first, and set
			the direction, or the text comes out in a fallback font, left to right. In SVG set <code>direction="rtl"</code>
			and
			<code>text-anchor="start"</code>.
		</p>
		<CodeBlock
			title="JS"
			code={"import { loadFonts } from '@yashau/thaana';\n\nawait loadFonts({ family: 'Faruma' });\nctx.font = \"32px 'Faruma'\";\nctx.direction = 'rtl';\nctx.textAlign = 'start';\nctx.fillText('ދިވެހިރާއްޖެ', canvas.width - 16, 48);"}
		/>
	</section>

	<section id="old-text" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">11. Old fonts and PDFs</h2>
		<p class="mb-4 text-muted-foreground">
			Documents typed with the old A_ fonts store Latin letters (<code>ihevid</code>) and only look like Thaana in that
			font. Text copied out of a PDF comes back with reversed dates and stray spaces. Both can be repaired:
			<code>convertLegacy()</code> and <code>repairPdfText()</code>, or paste it into the
			<a class="underline underline-offset-4" href="/convert">converter</a>.
		</p>
		<ThaanaDemo>
			{#snippet wrong()}<p>{legacy}</p>
				<p dir="rtl" lang="dv">{fromPdf}</p>{/snippet}
			{#snippet right()}<p dir="rtl" lang="dv">{convertLegacy(legacy)}</p>
				<p dir="rtl" lang="dv">{repairPdfText(fromPdf)}</p>{/snippet}
		</ThaanaDemo>
	</section>

	<section id="pdf" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">12. Generating PDFs</h2>
		<p class="mb-4 text-muted-foreground">
			PDF libraries' simple text functions don't shape Thaana: fili land in the wrong place. Shape the text with
			HarfBuzz (script <code>Thaa</code>, direction RTL), draw the resulting glyphs, and embed the full font. To keep
			the text selectable and searchable, write each run in logical order. For form fields, provide the appearance
			yourself rather than letting the viewer regenerate it; Acrobat and Preview reverse Thaana or drop marks.
			<a class="underline underline-offset-4" href="https://github.com/yashau/rihaPDF">rihaPDF</a> does all of this and documents
			why.
		</p>
	</section>

	<section id="storing" class="mt-12 scroll-mt-20">
		<h2 class="mb-2 text-xl font-semibold tracking-tight">13. Storing and searching</h2>
		<ul class="list-disc space-y-1 pl-5 text-muted-foreground">
			<li>
				Store text in logical order (the order it's typed), never pre-reversed. Strip bidi control characters before
				saving or comparing (<code>stripBidiControls()</code>).
			</li>
			<li>
				Keep the display-tidied version and the stored text separate: don't save what you only changed for display.
			</li>
			<li>Thaana has no case and no Unicode composition variants, so plain string comparison works for search.</li>
		</ul>
	</section>
</article>
