// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	/** True in builds for beta.fonts.mv (see vite.config.ts). */
	const __FONTS_MV_BETA__: boolean;
	/** Hash of src/lib/data, i.e. of what the font pipeline put in R2 (see vite.config.ts). */
	const __FONTS_MV_DATA__: string;

	namespace App {
		// Bindings come from `import { env } from 'cloudflare:workers'` (see
		// src/lib/server/r2.ts); SvelteKit 3's Cloudflare adapter passes no platform.
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
