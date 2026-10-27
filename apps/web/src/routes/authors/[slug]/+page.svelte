<script lang="ts">
	import { CATEGORIES } from '#lib/catalog.js';
	import { correctionsMailto, THAANA_NAME_CSS, THAANA_NAME_FONT } from '#lib/authors.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import MailIcon from '@lucide/svelte/icons/mail';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const bio = $derived(data.bio);
	const category = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
	const fontsHref = $derived(`/?author=${encodeURIComponent(bio.name)}`);
</script>

<svelte:head>
	<title>{bio.name} — fonts.mv</title>
	<meta name="description" content={bio.excerpt} />
	<link rel="stylesheet" href={THAANA_NAME_CSS} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
	<Button href="/authors" variant="ghost" size="sm" class="-ml-2 text-muted-foreground"
		><ArrowLeftIcon /> All authors</Button
	>

	<div class="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
		<!-- Info card first on small screens, beside the text on wide ones, like an encyclopedia infobox. -->
		<aside class="lg:order-2">
			<Card.Root class="gap-4 lg:sticky lg:top-20">
				<Card.Header class="items-center text-center">
					<Avatar.Root class="mx-auto size-40 rounded-lg">
						<Avatar.Fallback class="rounded-lg"><UserRoundIcon class="size-16 text-muted-foreground" /></Avatar.Fallback
						>
					</Avatar.Root>
					<Card.Title class="mt-3 text-lg">{bio.name}</Card.Title>
					{#if bio.thaana}
						<p class="text-2xl leading-snug" dir="rtl" lang="dv" style:font-family={THAANA_NAME_FONT}>{bio.thaana}</p>
					{/if}
				</Card.Header>
				<Card.Content class="px-0">
					<Table.Root>
						<Table.Body>
							<Table.Row>
								<Table.Head class="pl-6 align-top">Known as</Table.Head>
								<Table.Cell class="pr-6 whitespace-normal">{bio.role}</Table.Cell>
							</Table.Row>
							{#if bio.born}
								<Table.Row>
									<Table.Head class="pl-6 align-top">Born</Table.Head>
									<Table.Cell class="pr-6 whitespace-normal">{bio.born}</Table.Cell>
								</Table.Row>
							{/if}
							{#if bio.knownFor}
								<Table.Row>
									<Table.Head class="pl-6 align-top">Known for</Table.Head>
									<Table.Cell class="pr-6 whitespace-normal">{bio.knownFor}</Table.Cell>
								</Table.Row>
							{/if}
							<Table.Row>
								<Table.Head class="pl-6 align-top">On fonts.mv</Table.Head>
								<Table.Cell class="pr-6 whitespace-normal">
									<a class="underline underline-offset-4" href={fontsHref}
										>{data.families.length} {data.families.length === 1 ? 'family' : 'families'}</a
									>
								</Table.Cell>
							</Table.Row>
							{#if bio.website}
								<Table.Row>
									<Table.Head class="pl-6 align-top">Website</Table.Head>
									<Table.Cell class="pr-6 break-all whitespace-normal">
										<a class="underline underline-offset-4" href={bio.website} rel="noopener"
											>{bio.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a
										>
									</Table.Cell>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</aside>

		<article class="min-w-0 lg:order-1">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{bio.name}</h1>
			<div class="mt-4 flex max-w-prose flex-col gap-4 text-pretty">
				{#each bio.bio as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
			</div>

			{#if bio.links?.length}
				<div class="mt-6 flex flex-wrap gap-2">
					{#each bio.links as link (link.url)}
						<Button href={link.url} variant="outline" size="sm" rel="noopener">{link.label}</Button>
					{/each}
				</div>
			{/if}

			<h2 class="mt-10 text-xl font-semibold tracking-tight">Fonts</h2>
			<div class="mt-4 grid gap-3 sm:grid-cols-2">
				{#each data.families as f (f.id)}
					<Card.Root size="sm" class="relative transition-colors hover:bg-muted/40">
						<Card.Header>
							<Card.Title><a href="/fonts/{f.id}" class="after:absolute after:inset-0">{f.name}</a></Card.Title>
							<Card.Description>
								{category(f.category)} · {f.styles}
								{f.styles === 1 ? 'style' : 'styles'}{#if f.designer && f.designer !== bio.name}
									· {f.designer}{/if}
							</Card.Description>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>
			<Button href={fontsHref} variant="outline" size="sm" class="mt-4">Preview them all in the font list</Button>

			{#if bio.sources.length}
				<h2 class="mt-10 text-xl font-semibold tracking-tight">Sources</h2>
				<ol class="mt-3 flex list-decimal flex-col gap-1 pl-5 text-sm text-muted-foreground">
					{#each bio.sources as s (s.url)}
						<li><a class="break-words underline underline-offset-4" href={s.url} rel="noopener">{s.title}</a></li>
					{/each}
				</ol>
			{/if}

			<p class="mt-10 text-sm text-muted-foreground">
				Is something here wrong or missing?
				<a class="underline underline-offset-4" href={correctionsMailto(bio.name)}
					><MailIcon class="inline size-4" /> Email us</a
				>
				and we'll fix it.
			</p>
		</article>
	</div>
</div>
