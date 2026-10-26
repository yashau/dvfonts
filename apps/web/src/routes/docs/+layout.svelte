<script lang="ts">
	import DocsNav from '#lib/components/docs-nav.svelte';
	import { ScrollArea } from '#lib/components/ui/scroll-area/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';

	let { children } = $props();
	let menuOpen = $state(false);
</script>

<!-- The docs area: a sticky side navigation on wide screens, a sheet from the left on small ones. -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
	<aside class="hidden lg:block">
		<!-- Sticky on a wrapper: the scroll area sets its own position: relative. -->
		<div class="sticky top-14">
			<ScrollArea class="h-[calc(100svh-3.5rem)] py-10 pr-2">
				<DocsNav />
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
						<DocsNav onnavigate={() => (menuOpen = false)} />
					</ScrollArea>
				</Sheet.Content>
			</Sheet.Root>
		</div>
		{@render children()}
	</div>
</div>
