<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import CopyButton from '#lib/components/copy-button.svelte';
	import type { CodeLang } from '#lib/highlight.js';

	let { code, title, lang }: { code: string; title: string; lang: CodeLang } = $props();

	// The plain code is always rendered (prerendered HTML, no JS); the highlighted
	// version replaces it once Shiki has loaded, and only while it matches.
	let highlighted = $state<{ code: string; lang: CodeLang; html: string } | null>(null);
	$effect(() => {
		const request = { code, lang };
		let current = true;
		import('#lib/highlight.js')
			.then(({ highlight }) => highlight(request.code, request.lang))
			.then((html) => {
				if (current) highlighted = { ...request, html };
			})
			.catch(() => {});
		return () => {
			current = false;
		};
	});
	const html = $derived(highlighted?.code === code && highlighted.lang === lang ? highlighted.html : null);
</script>

<Card.Root size="sm" class="min-w-0 gap-0 py-0">
	<Card.Header class="border-b py-2 [.border-b]:pb-2">
		<Card.Title class="self-center text-sm">{title}</Card.Title>
		<Card.Action class="row-span-1 self-center">
			<CopyButton text={code} />
		</Card.Action>
	</Card.Header>
	<Card.Content class="px-0">
		<ScrollArea orientation="horizontal">
			<div class="code-block">
				{#if html}
					<!-- Shiki output for our own snippets. -->
					{@html html}
				{:else}
					<pre><code>{code}</code></pre>
				{/if}
			</div>
		</ScrollArea>
	</Card.Content>
</Card.Root>
