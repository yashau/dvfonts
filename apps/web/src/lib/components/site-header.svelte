<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '#lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import ThemeMenu from '#lib/components/theme-menu.svelte';
	import Logo from '#lib/components/logo.svelte';
	import { REPO_URL } from '#lib/site.js';
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
		<a href="/" class="shrink-0" aria-label="fonts.mv home">
			<Logo class="h-7 w-auto" />
		</a>
		<NavigationMenu.Root class="ml-auto hidden md:flex" viewport={false}>
			<NavigationMenu.List>
				{#each links as link (link.href)}
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href={link.href}
							active={active(link.href)}
							class={navigationMenuTriggerStyle()}
							aria-current={active(link.href) ? 'page' : undefined}>{link.label}</NavigationMenu.Link
						>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>
		<div class="ml-auto flex items-center gap-1 md:ml-0">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button {...props} href={REPO_URL} variant="ghost" size="icon-sm" aria-label="Source code on GitHub">
							<!-- GitHub mark (Lucide dropped brand icons) -->
							<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
								><path
									d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
								/></svg
							>
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>Source code on GitHub</Tooltip.Content>
			</Tooltip.Root>
			<ThemeMenu />
			<Sheet.Root bind:open>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props: tip })}
							<Sheet.Trigger {...tip}>
								{#snippet child({ props })}
									<Button {...props} variant="ghost" size="icon-sm" class="md:hidden" aria-label="Menu">
										<MenuIcon />
									</Button>
								{/snippet}
							</Sheet.Trigger>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Menu</Tooltip.Content>
				</Tooltip.Root>
				<Sheet.Content side="right" class="w-64">
					<Sheet.Header>
						<Sheet.Title>fonts.mv</Sheet.Title>
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
