<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.js';
	import ThemeMenu from '#lib/components/theme-menu.svelte';

	const links = [
		{ href: '/', label: 'Fonts' },
		{ href: '/downloads', label: 'Downloads' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/about', label: 'About' }
	];
</script>

<header class="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
		<a href="/" class="flex items-baseline gap-2 font-semibold tracking-tight">
			<span class="text-lg">dvfonts</span>
			<span class="text-base font-normal text-muted-foreground" dir="rtl" lang="dv">ޑީވީފޮންޓްސް</span>
		</a>
		<nav class="ml-auto flex items-center gap-1">
			{#each links as link (link.href)}
				<Button href={link.href} variant="ghost" size="sm" class={page.url.pathname === link.href ? 'bg-muted' : ''}
					>{link.label}</Button
				>
			{/each}
			<ThemeMenu />
		</nav>
	</div>
</header>
