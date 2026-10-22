import { expect, test } from '@playwright/test';

test('catalogue lists fonts and previews the typed Thaana', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Open Dhivehi fonts' })).toBeVisible();
	await expect(page.getByRole('link', { name: /Faruma/ }).first()).toBeVisible();

	const input = page.getByRole('textbox', { name: 'Preview text' });
	await input.click();
	await page.keyboard.type('divehi )bu(?,');
	// Divehi Phonetic keymap; brackets typed as seen, stored in logical order.
	await expect(input).toHaveValue('ދިވެހި (ބު)؟،');
	await expect(page.locator('p[lang="dv"]').first()).toHaveText('ދިވެހި (ބު)؟،');
	expect(errors).toEqual([]);
});

test('EN mode leaves Latin keys alone', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Dhivehi phonetic keyboard' }).click();
	const input = page.getByRole('textbox', { name: 'Preview text' });
	await input.click();
	await page.keyboard.type('hello');
	await expect(input).toHaveValue('hello');
});

test('search filters the list', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('textbox', { name: 'Search' }).fill('A_Waheed');
	await expect(page.getByRole('link', { name: 'MV A Waheed', exact: true })).toBeVisible();
	await expect(page.getByText(/^1 families$/)).toBeVisible();
});

test('family page has styles, glyphs and a working embed URL', async ({ page, request }) => {
	await page.goto('/fonts/bolhu');
	await expect(page.getByRole('heading', { name: 'Bolhu', level: 1 })).toBeVisible();
	await expect(page.getByText('Thin 100')).toBeVisible();
	const css = await request.get('/css2?family=Bolhu:wght@400;700&display=swap');
	expect(css.ok()).toBe(true);
	const body = await css.text();
	expect(body).toContain("font-family: 'Bolhu'");
	expect(body).toContain('unicode-range: U+0780-07BF');
	const font = await request.get('/fonts/bolhu/bolhu-400.thaana.woff2');
	expect(font.headers()['access-control-allow-origin']).toBe('*');
});

test('CSS API rejects unknown families with a helpful message', async ({ request }) => {
	const res = await request.get('/css2?family=Nope');
	expect(res.status()).toBe(400);
	expect(await res.text()).toContain('Unknown family');
});

test('agent and package endpoints are served', async ({ request }) => {
	for (const path of ['/llms.txt', '/fonts.json', '/keymap.json', '/thaana.js', '/thaana.iife.js', '/thaana.css']) {
		const res = await request.get(path);
		expect(res.ok(), path).toBe(true);
		// Without an explicit charset browsers decode the Thaana in these as Windows-1252.
		expect(res.headers()['content-type'], path).toMatch(/; charset=utf-8$/);
	}
	const llms = await (await request.get('/llms.txt')).text();
	expect(llms).toContain('ދިވެހި');
	const fonts = await (await request.get('/fonts.json')).json();
	expect(fonts.families.length).toBeGreaterThan(100);
});

test('/thaana.js can be loaded cross-origin', async ({ request }) => {
	const res = await request.get('/thaana.js', { headers: { origin: 'https://example.com' } });
	expect(res.ok()).toBe(true);
	expect(res.headers()['access-control-allow-origin']).toBe('*');
	expect(res.headers()['content-type']).toContain('javascript');
});

test('/thaana.js works as a drop-in module', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	await page.goto('/robots.txt');
	await page.setContent(
		'<!doctype html><meta charset="utf-8"><input data-thaana id="f"><script type="module" src="/thaana.js"></script>'
	);
	await expect(page.locator('#f')).toHaveAttribute('dir', 'rtl');
	await page.locator('#f').click();
	await page.keyboard.type('raajje');
	await expect(page.locator('#f')).toHaveValue('ރަަޖޖެ');
	expect(errors).toEqual([]);
});

// From small phones up to 2160p: no page may ever scroll sideways.
const WIDTHS = [320, 360, 390, 768, 1024, 1366, 1920, 2560, 3840];
const PAGES = ['/', '/fonts/faruma', '/fonts/bolhu', '/guide', '/convert', '/docs', '/downloads', '/about'];

test('no horizontal scrolling at any width', async ({ page, isMobile }) => {
	test.skip(isMobile, 'widths are set explicitly; run once');
	test.setTimeout(180_000);
	const problems: string[] = [];
	for (const width of WIDTHS) {
		await page.setViewportSize({ width, height: 900 });
		for (const path of PAGES) {
			await page.goto(path);
			await page.evaluate(() => document.fonts.ready);
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
			if (overflow > 0) problems.push(`${path} @ ${width}px: ${overflow}px too wide`);
		}
	}
	expect(problems).toEqual([]);
});

test('screenshots at the extremes (320px and 2160p)', async ({ page, isMobile }) => {
	test.skip(isMobile, 'widths are set explicitly; run once');
	for (const [width, height] of [
		[320, 700],
		[3840, 2160]
	] as const) {
		await page.setViewportSize({ width, height });
		for (const path of ['/', '/fonts/faruma', '/guide', '/docs']) {
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			await page.evaluate(() => document.fonts.ready);
			const name = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
			await page.screenshot({ path: `screenshots/w${width}-${name}.png` });
		}
	}
});

test('fonts and downloads are served from R2', async ({ request }) => {
	const woff2 = await request.get('/fonts/faruma/faruma-400.woff2');
	expect(woff2.ok()).toBe(true);
	expect(woff2.headers()['content-type']).toBe('font/woff2');
	expect(woff2.headers()['access-control-allow-origin']).toBe('*');

	const style = await request.get('/fonts/bolhu/bolhu-700.ttf?download=Bolhu-Bold.ttf');
	expect(style.headers()['content-disposition']).toBe('attachment; filename="Bolhu-Bold.ttf"');

	const family = await request.get('/fonts/faruma/faruma.zip');
	expect(family.headers()['content-type']).toBe('application/zip');

	const bundle = await request.get('/downloads/dvfonts-essentials.zip');
	expect(bundle.ok()).toBe(true);
	expect(bundle.headers()['content-disposition']).toContain('dvfonts-essentials.zip');

	expect((await request.get('/fonts/faruma/../../secret')).status()).toBe(404);
	expect((await request.get('/downloads/nope.zip')).status()).toBe(404);
});

test('downloads page lists the bundles', async ({ page }) => {
	await page.goto('/downloads');
	await expect(page.locator('a[href="/downloads/dvfonts-essentials.zip"]')).toBeVisible();
	await expect(page.locator('a[href="/downloads/dvfonts-full.zip"]')).toBeVisible();
});

test('guide renders its demos', async ({ page }) => {
	await page.goto('/guide');
	await expect(page.getByRole('heading', { name: 'Displaying Thaana well' })).toBeVisible();
	// Each demo has a Wrong and a Right pane (.guide-sample); check the Right one.
	const right = (section: string) => page.locator(`#${section} .guide-sample`).nth(1).locator('p');
	await expect(right('numbers').first()).toHaveText(/\u2066\+960 333-1234\u2069/);
	await expect(right('old-text').first()).toHaveText('ދިވެހި ބަސް');
	await expect(right('old-text').nth(1)).toHaveText('ތާރީޚް 14/1/2026');
});

test('converter turns old A_ text and PDF text into Unicode', async ({ page }) => {
	await page.goto('/convert');
	await page.getByLabel('Paste here').fill('cswb ihevid');
	await expect(page.getByLabel('Unicode Thaana')).toHaveValue('ދިވެހި ބަސް');
	await page.getByRole('tab', { name: 'PDF text' }).click();
	await page.getByLabel('Paste here').fill('ތާރީޚް 2026/1/14');
	await expect(page.getByLabel('Unicode Thaana')).toHaveValue('ތާރީޚް 14/1/2026');
});

test('mobile menu opens and navigates', async ({ page, isMobile }) => {
	test.skip(!isMobile, 'mobile only');
	await page.goto('/');
	await page.getByRole('button', { name: 'Menu' }).click();
	await page.getByRole('link', { name: 'Guide' }).click();
	await expect(page).toHaveURL(/\/guide$/);
});

// Visual record for review (uploaded as a CI artifact): key pages, light and dark.
for (const theme of ['light', 'dark'] as const) {
	test(`screenshots (${theme})`, async ({ page }, info) => {
		await page.emulateMedia({ colorScheme: theme });
		for (const path of ['/', '/fonts/faruma', '/guide', '/convert', '/docs', '/downloads']) {
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			await page.evaluate(() => document.fonts.ready);
			const name = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
			await page.screenshot({ path: `screenshots/${info.project.name}-${theme}-${name}.png`, fullPage: false });
		}
	});
}

// The type tester must handle punctuation, brackets, numbers and mixed text.
// Each case: keys typed on the phonetic keyboard (or pasted in EN mode), the
// stored text, and what the first preview must show (\u2066/\u2069 isolates).
const TESTER_CASES: [mode: 'dv' | 'en', keys: string, stored: string, preview: string, dir: 'rtl' | 'ltr'][] = [
	['dv', 'divehi )bu( 2026.', 'ދިވެހި (ބު) 2026.', 'ދިވެހި (ބު) \u20662026\u2069.', 'rtl'],
	['dv', 'gulAlwvA: +960 333-1234', 'ގުލާލއވާ: +960 333-1234', 'ގުލާލއވާ: \u2066+960 333-1234\u2069', 'rtl'],
	['dv', 'fini -5, 50%', 'ފިނި -5، 50%', 'ފިނި \u2066-5\u2069، \u206650%\u2069', 'rtl'],
	['dv', '"bu"? ]bu )hi([', '"ބު"؟ [ބު (ހި)]', '"ބު"؟ [ބު (ހި)]', 'rtl'],
	['dv', 'gwRi 9:00; 14/1/2026', 'ގއޜި 9:00؛ 14/1/2026', 'ގއޜި \u20669:00\u2069؛ \u206614/1/2026\u2069', 'rtl'],
	['en', 'Apple ގެ އާ ފޯނު!', 'Apple ގެ އާ ފޯނު!', 'Apple ގެ އާ ފޯނު!', 'rtl'],
	['en', 'Hello world (2026).', 'Hello world (2026).', 'Hello world (2026).', 'ltr']
];

test('type tester: punctuation, brackets, numbers and mixed text', async ({ page }) => {
	await page.goto('/');
	const input = page.getByRole('textbox', { name: 'Preview text' });
	const preview = page.locator('p.preview-text').first();
	for (const [mode, keys, stored, shown, dir] of TESTER_CASES) {
		const keyboard = page.getByRole('button', { name: 'Dhivehi phonetic keyboard' });
		if (((await keyboard.getAttribute('aria-pressed')) === 'true') !== (mode === 'dv')) await keyboard.click();
		await expect(keyboard).toHaveAttribute('aria-pressed', String(mode === 'dv'));
		await input.fill('');
		if (mode === 'dv') {
			await input.click();
			await page.keyboard.type(keys);
		} else {
			await input.fill(keys);
		}
		await expect(input, keys).toHaveValue(stored);
		await expect(input, keys).toHaveAttribute('dir', dir);
		await expect(preview, keys).toHaveAttribute('dir', dir);
		await expect(preview, keys).toHaveText(shown);
	}
});
