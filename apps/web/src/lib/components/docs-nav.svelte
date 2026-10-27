<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { DOCS } from '#lib/docs-nav.js';
	import { currentSection, scrollToSection } from '#lib/docs-scroll.js';
	import { Button } from '#lib/components/ui/button/index.js';

	// Side navigation for the docs area: every page with its sections. The section being
	// read is highlighted.
	let { onnavigate }: { onnavigate?: () => void } = $props();

	let current = $state('');

	// Same-page section links scroll to the section's own position (see docs-scroll.ts), so
	// the one clicked is the one highlighted, even near the bottom of the page.
	function goTo(e: MouseEvent, href: string, id: string) {
		onnavigate?.();
		if (page.url.pathname !== href || !scrollToSection(href, id)) return;
		e.preventDefault();
		replaceState(`#${id}`, page.state);
		current = id;
	}

	$effect(() => {
		const path = page.url.pathname;
		const update = () => (current = currentSection(path));
		update();
		addEventListener('scroll', update, { passive: true });
		addEventListener('resize', update, { passive: true });
		return () => {
			removeEventListener('scroll', update);
			removeEventListener('resize', update);
		};
	});
</script>

<nav aria-label="Docs" class="flex flex-col gap-6">
	{#each DOCS as doc (doc.href)}
		{@const here = page.url.pathname === doc.href}
		<div class="flex flex-col gap-0.5">
			<Button
				href={doc.href}
				variant="ghost"
				size="sm"
				class="justify-start font-semibold {here ? 'text-foreground' : 'text-muted-foreground'}"
				aria-current={here && !current ? 'page' : undefined}
				onclick={onnavigate}>{doc.title}</Button
			>
			{#each doc.sections as s (s.id)}
				{@const on = here && current === s.id}
				<Button
					href="{doc.href}#{s.id}"
					variant="ghost"
					size="sm"
					class="h-auto min-h-8 justify-start py-1.5 pl-5 text-left font-normal whitespace-normal {on
						? 'bg-muted text-foreground'
						: 'text-muted-foreground'}"
					aria-current={on ? 'location' : undefined}
					onclick={(e: MouseEvent) => goTo(e, doc.href, s.id)}>{s.label}</Button
				>
			{/each}
		</div>
	{/each}
</nav>
