<script lang="ts">
	import { page } from '$app/state';
	import { DOCS } from '#lib/docs-nav.js';
	import { Button } from '#lib/components/ui/button/index.js';

	// Side navigation for the docs area: every page with its sections. The section being
	// read is highlighted (the last heading scrolled past the top of the viewport).
	let { onnavigate }: { onnavigate?: () => void } = $props();

	let current = $state('');

	$effect(() => {
		const doc = DOCS.find((d) => d.href === page.url.pathname);
		if (!doc) return;
		const els = doc.sections.map((s) => document.getElementById(s.id)).filter((el) => el !== null);
		const update = () => {
			// 96px: below the sticky header, with a little room.
			let id = els[0]?.id ?? '';
			for (const el of els) if (el.getBoundingClientRect().top <= 96) id = el.id;
			current = id;
		};
		update();
		addEventListener('scroll', update, { passive: true });
		return () => removeEventListener('scroll', update);
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
					onclick={onnavigate}>{s.label}</Button
				>
			{/each}
		</div>
	{/each}
</nav>
