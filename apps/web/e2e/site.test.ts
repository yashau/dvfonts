import { expect, test } from '@playwright/test';

test('catalogue lists fonts and previews the typed Thaana', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Open Dhivehi fonts' })).toBeVisible();
	await expect(page.getByRole('link', { name: /Faruma/ }).first()).toBeVisible();

	const input = page.getByRole('textbox', { name: 'Preview text' });
	await input.click();
	await page.keyboard.type('divehi (bu)?,');
	// Divehi Phonetic keymap, brackets kept in logical order.
	await expect(input).toHaveValue('ދިވެހި (ބު)؟،');
	await expect(page.locator('p[lang="dv"]').first()).toHaveText('ދިވެހި (ބު)؟،');
	expect(errors).toEqual([]);
});

test('EN mode leaves Latin keys alone', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('radio', { name: 'Your system keyboard' }).click();
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
	}
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

test('no horizontal overflow on the home page', async ({ page }) => {
	await page.goto('/');
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
	expect(overflow).toBeLessThanOrEqual(0);
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
	await expect(page.getByRole('heading', { name: 'Essentials', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Full suite', exact: true })).toBeVisible();
});
