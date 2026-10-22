<svelte:head>
	<title>About — dvfonts</title>
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">About</h1>
	<div class="mt-6 space-y-4 leading-relaxed text-muted-foreground">
		<p>
			Dhivehi fonts have been passed around the internet for decades: on dhivehi.mv, Hassan Hameed's site, the Thaana
			Type Foundry, thatmaldivesblog and dhivehifont.com, and in countless shared folders. Many of them are hard to use
			on the web. Some still put Thaana on Latin keys, some have broken line metrics that clip the fili, and most don't
			come in web formats.
		</p>
		<p>dvfonts collects them in one place and cleans them up:</p>
		<ul class="list-disc space-y-1 pl-5">
			<li>Pre-Unicode fonts are remapped to real Unicode Thaana, so they work with any keyboard and on the web.</li>
			<li>Where a modern Unicode version of an old A_ font exists, only the modern one is listed.</li>
			<li>Duplicates are merged and their other names kept as searchable aliases.</li>
			<li>Vertical metrics are repaired so text isn't clipped and line height matches on every platform.</li>
			<li>Every font ships as WOFF2, WOFF and TTF, with small Thaana/Latin subsets for the embed API.</li>
			<li>
				Glyph outlines are never changed. Fonts whose license forbids derivatives are shipped exactly as published.
			</li>
		</ul>
		<h2 id="takedown" class="pt-4 text-xl font-semibold tracking-tight text-foreground">Rights holders</h2>
		<p>
			These fonts are listed because they have circulated freely for years, with credit to their makers wherever the
			files or their sources name one. If you hold rights to a font here and want it credited differently, relicensed or
			removed, email <a class="underline underline-offset-4" href="mailto:ibrahim@yashau.com">ibrahim@yashau.com</a>.
			Removal requests are honoured without argument.
		</p>
	</div>
</article>
