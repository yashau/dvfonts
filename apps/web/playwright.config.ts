import { defineConfig, devices } from '@playwright/test';

// Runs against the production build served by wrangler (the real Worker),
// so `pnpm build` must have run first.
export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: { baseURL: 'http://localhost:4174', trace: 'retain-on-failure' },
	// Always start a fresh Worker on its own port: reusing a stray `pnpm preview`
	// would silently test a stale build.
	webServer: {
		command: 'pnpm exec wrangler dev --port 4174',
		url: 'http://localhost:4174',
		reuseExistingServer: false,
		timeout: 120_000
	},
	// In CI use the Google Chrome preinstalled on GitHub's runners instead of
	// downloading a browser (`playwright install --with-deps` hangs on apt).
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.CI ? 'chrome' : undefined } },
		{ name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.CI ? 'chrome' : undefined } }
	]
});
