<script lang="ts">
	import * as Alert from '#lib/components/ui/alert/index.js';
	import ShieldIcon from '@lucide/svelte/icons/shield-check';
	import { REPO_URL } from '#lib/site.js';
</script>

<svelte:head>
	<title>About — fonts.mv</title>
	<meta
		name="description"
		content="Why fonts.mv exists, what it does to the fonts and what it leaves alone. Free, non-profit and open source."
	/>
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<h1 class="text-3xl font-semibold tracking-tight">About</h1>
	<div class="mt-6 space-y-4 leading-relaxed text-muted-foreground">
		<p>
			Dhivehi fonts have been shared for decades: on dhivehi.mv, Hassan Hameed's site, the Thaana Type Foundry,
			thatmaldivesblog and dhivehifont.com, and in countless shared folders. Using them on the web has been hard. Some
			put Thaana on Latin keys, some clip the fili, the same design turns up under different names, and almost none come
			in web formats.
		</p>
		<p>
			fonts.mv brings them together in one place you can browse, embed and download, and makes Thaana work properly on
			the web:
		</p>
		<ul class="list-disc space-y-1 pl-5">
			<li>A Google Fonts–style embed API, plus downloads of every font, family and collection.</li>
			<li>
				The <code>@yashau/thaana</code> packages for plain JavaScript, React, Svelte and Vue: a phonetic keyboard, text that
				displays right to left correctly, and font loading, from fonts.mv or from your own copies.
			</li>
			<li>
				An <a class="underline underline-offset-4" href="/llms.txt">llms.txt</a> so AI agents can do all of this for you.
			</li>
		</ul>
		<h2 class="pt-4 text-xl font-semibold tracking-tight text-foreground">What happens to the fonts</h2>
		<p>Where a font's license and its designer allow it, fonts.mv fixes what gets in the way:</p>
		<ul class="list-disc space-y-1 pl-5">
			<li>Old fonts with Thaana on Latin keys and no Unicode version are remapped to real Unicode Thaana.</li>
			<li>Where a modern Unicode version of an old A_ font exists, only the modern one is listed.</li>
			<li>Duplicates are merged, and their other names kept as searchable aliases.</li>
			<li>Broken line metrics are repaired, so the fili aren't clipped and line height is the same everywhere.</li>
			<li>Fonts come as WOFF2, WOFF and TTF, with small Thaana and Latin parts for the embed API.</li>
		</ul>
		<p>
			Glyph outlines are never changed. Fonts whose license forbids changes, and those whose designer asks for it (all
			of Hassan Hameed's), are shipped exactly as published, only converted to web formats; any line-spacing fix is made
			in CSS instead. The original pre-Unicode files are kept untouched in the
			<a class="underline underline-offset-4" href="/downloads">Legacy</a> download, for opening old documents.
		</p>
		<p>
			fonts.mv is non-profit and free, and always will be. The site, the font pipeline and the packages are open source
			on GitHub at <a class="underline underline-offset-4" href={REPO_URL}>yashau/fonts.mv</a> under the MIT license; the
			fonts keep their own licenses. Issues and pull requests are welcome.
		</p>
		<p>
			The fonts.mv wordmark and favicon are set in
			<a class="underline underline-offset-4" href="/fonts/mv-neru-magu">MV Neru Magu</a>.
		</p>
		<Alert.Root id="takedown" class="scroll-mt-20">
			<ShieldIcon />
			<Alert.Title>Rights holders</Alert.Title>
			<Alert.Description>
				<p>
					These fonts are listed because they have circulated freely for years, with credit to their makers wherever the
					files or their sources name one. If you hold rights to a font here and want it credited differently,
					relicensed or removed, email
					<a class="underline underline-offset-4" href="mailto:ibrahim@yashau.com">ibrahim@yashau.com</a>. Removal
					requests are honoured without argument.
				</p>
			</Alert.Description>
		</Alert.Root>
	</div>
</article>
