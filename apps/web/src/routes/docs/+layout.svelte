<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import DocsNav from '#lib/components/docs-nav.svelte';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';

	let { children } = $props();
	let menuOpen = $state(false);

	// Going to a section (#id) scrolls it to the top. If it's already fully visible with the
	// page at the top, as on a short page, stay at the top instead of jumping.
	afterNavigate(({ to }) => {
		const id = to?.url.hash.slice(1);
		const el = id ? document.getElementById(id) : null;
		if (!el) return;
		const settle = () => {
			if (el.getBoundingClientRect().bottom + scrollY <= innerHeight) scrollTo({ top: 0, behavior: 'instant' });
		};
		// On a first load the browser's own jump to the anchor comes once the page has loaded.
		if (document.readyState === 'complete') requestAnimationFrame(settle);
		else addEventListener('load', () => requestAnimationFrame(settle), { once: true });
	});
</script>

<!-- The docs area: a sticky side navigation on wide screens, a sheet from the left on small ones. -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
	<aside class="hidden lg:block">
		<!-- Sticky on a wrapper: the scroll area sets its own position: relative. The padding
		     inside it leaves room for the links' 3px focus rings, which it would otherwise clip. -->
		<div class="sticky top-14">
			<ScrollArea class="h-[calc(100svh-3.5rem)] pr-2">
				<div class="p-1 py-6"><DocsNav /></div>
			</ScrollArea>
		</div>
	</aside>
	<div class="min-w-0">
		<div class="pt-6 lg:hidden">
			<Sheet.Root bind:open={menuOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm"><PanelLeftIcon /> Docs menu</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="left" class="w-72">
					<Sheet.Header>
						<Sheet.Title>Docs</Sheet.Title>
					</Sheet.Header>
					<ScrollArea class="h-[calc(100svh-5rem)] px-2 pb-6">
						<div class="p-1"><DocsNav onnavigate={() => (menuOpen = false)} /></div>
					</ScrollArea>
				</Sheet.Content>
			</Sheet.Root>
		</div>
		{@render children()}
	</div>
</div>
