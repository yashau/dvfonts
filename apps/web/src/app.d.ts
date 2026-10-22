// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
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
