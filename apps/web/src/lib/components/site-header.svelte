<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import ThemeMenu from '#lib/components/theme-menu.svelte';
	import MenuIcon from '@lucide/svelte/icons/menu';

	const links = [
		{ href: '/', label: 'Fonts' },
		{ href: '/guide', label: 'Guide' },
		{ href: '/convert', label: 'Convert' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/downloads', label: 'Downloads' },
		{ href: '/about', label: 'About' }
	];

	let open = $state(false);
	const active = (href: string) => page.url.pathname === href;
</script>

<header class="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
		<a href="/" class="flex items-baseline gap-2 font-semibold tracking-tight">
			<span class="text-lg">dvfonts</span>
			<span class="text-base font-normal text-muted-foreground" dir="rtl" lang="dv">ޑީވީފޮންޓްސް</span>
		</a>
		<nav class="ml-auto hidden items-center gap-1 md:flex">
			{#each links as link (link.href)}
				<Button href={link.href} variant="ghost" size="sm" class={active(link.href) ? 'bg-muted' : ''}
					>{link.label}</Button
				>
			{/each}
		</nav>
		<div class="ml-auto flex items-center gap-1 md:ml-0">
			<ThemeMenu />
			<Sheet.Root bind:open>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon-sm" class="md:hidden" aria-label="Menu">
							<MenuIcon />
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-64">
					<Sheet.Header>
						<Sheet.Title>dvfonts</Sheet.Title>
					</Sheet.Header>
					<nav class="flex flex-col gap-1 px-4">
						{#each links as link (link.href)}
							<Button
								href={link.href}
								variant="ghost"
								class="justify-start {active(link.href) ? 'bg-muted' : ''}"
								onclick={() => (open = false)}>{link.label}</Button
							>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
