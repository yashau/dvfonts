# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. Read this before changing anything.

## What this is

- **`apps/web`**: the dvfonts site. SvelteKit 3 + Svelte 5 (runes) + Tailwind 4 + shadcn-svelte, deployed as a Cloudflare Worker. Pages are prerendered. The Worker serves `/css2` (Google-Fonts-style CSS API), `/fonts/<id>/<file>` and `/downloads/<file>` from the R2 bucket `dvfonts-static` (binding `STATIC`).
- **`packages/*`**: `@yashau/thaana` (core, zero deps), `@yashau/thaana-react`, `-svelte`, `-vue`. The site imports the core, so the site and the npm package behave identically.
- **`fonts/`**: the Python font pipeline (fontTools, run with uv). Turns `fonts/sources/*` into cleaned web fonts under `fonts/build/r2/` and the catalog JSON in `apps/web/src/lib/data/`.

## Commands

Toolchain is pinned in `mise.toml`. Use `mise run <task>` or the pnpm/uv equivalents.

| Need          | Command                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install       | `mise run install` (`pnpm install` + `uv sync --project fonts`)                                                                                   |
| Dev server    | `mise run r2:local` once (loads fonts into local R2), then `mise run dev`                                                                         |
| Unit tests    | `pnpm test` (Vitest in each package)                                                                                                              |
| Type-check    | `pnpm check`                                                                                                                                      |
| Lint / format | `pnpm lint` / `pnpm format` (oxlint + oxfmt); `uv run --project fonts ruff check fonts/scripts`                                                   |
| Build         | `pnpm build` (packages, then site)                                                                                                                |
| E2E           | `pnpm --filter @dvfonts/web test:e2e`: Playwright against the built Worker under `wrangler dev`; needs `pnpm build` and `mise run r2:local` first |
| Rebuild fonts | `mise run fonts`, then `mise run bundles`                                                                                                         |

Before you finish, run at least `pnpm lint`, `pnpm test` and `pnpm check`. Run the e2e suite if you touched the site, and `mise run fonts:check` if you touched `fonts/`.

## Rules

### Tooling

- **pnpm only** for JS, **uv only** for Python (`uv add`, `uv run`). Never use npm/yarn/pip or `python -m venv`.
- **oxlint + oxfmt**, not ESLint or Prettier. Config is in `.oxlintrc.json` and `.oxfmtrc.json` at the root.
- Keep dependencies on their latest versions. The exception is `packages/svelte`, which pins TypeScript 6 because `svelte-package`'s declaration emitter doesn't support TS 7 yet.

### Site (`apps/web`)

- **shadcn-svelte components come from the registry CLI** (`pnpm dlx shadcn-svelte@latest add <name>` in `apps/web`). Never hand-write or edit files in `src/lib/components/ui/`; they're excluded from lint and format on purpose. Build custom UI by composing them in `src/lib/components/`.
- Imports use SvelteKit 3 subpath imports **with explicit `.js` extensions**: `#lib/catalog.js`, `#lib/components/ui/button/index.js`. Use `$app/env`, not the deprecated `$app/environment`.
- Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`). No legacy stores or `export let`.
- Theme: light/dark/system via `mode-watcher`. Colours are tokens on `:root` / `.dark` in `src/routes/layout.css`. Don't add `prefers-color-scheme` rules: an explicit user choice must always win over the OS.
- **Generated files you must not edit by hand:** `src/lib/data/*.json` (from `fonts/scripts`) and `worker-configuration.d.ts` (`pnpm --filter @dvfonts/web gen`; regenerate after editing `wrangler.jsonc`).
- No font binaries in git or in `static/`. They live in R2. Add new static binaries to the pipeline's `fonts/build/r2/` output, not to `static/`.

### Thaana correctness (this is the point of the project)

- Thaana is RTL. Set `dir="rtl"` **and** `lang="dv"` on Thaana text and inputs; use `unicode-bidi: plaintext` for user-entered text.
- **Never swap bracket pairs** in stored text. Browsers mirror `( ) [ ] { } < >` in RTL. The keymap leaves brackets alone unless `swapBrackets` is explicitly requested (Microsoft's layout behaviour).
- The keyboard layout is **Divehi Phonetic** (Microsoft kbddiv1). Don't call it "Mahaa": that name was invented and has no external source.
- Dhivehi punctuation is `،` `؛` `؟` (U+060C, U+061B, U+061F); the full stop is ASCII.
- Isolate numbers, phone numbers, URLs and names inside Thaana with `isolateNumbers()` / `isolate()` / `<bdi>`, and strip bidi controls before saving.
- `repairPdfText()` is only for text copied out of PDFs. Running it on typed text would reverse dates.
- Most Dhivehi fonts have no Latin glyphs. Always give a fallback stack (`fontStack()`).
- Sample text comes from `PANGRAMS` in `packages/thaana/src/samples.ts`. Each must contain all 24 native letters; a unit test enforces this.

### Packages

- The core stays **zero-dependency and framework-agnostic**. Framework packages are thin wrappers that re-export the core.
- Single sources of truth: the keymap is `packages/thaana/src/keymap.ts`; the legacy font layouts are `packages/thaana/src/legacy-layouts.json`, which the Python pipeline also reads.
- Every behaviour change needs a test. The text helpers carry test vectors ported from rihaPDF; keep them passing.
- Framework packages depend on the core via `workspace:^`. The release workflow packs with pnpm (rewriting that spec) before `npm publish`, so don't publish by hand from a package directory.

### Fonts (`fonts/`)

- `fonts/catalog/families.toml` is the curated catalogue: families, weights, categories, aliases and the `[excluded]` list with reasons. Every file in `sources/` must be either used or excluded.
- **Licensing policy:**
  - CC BY-ND fonts are shipped byte-for-byte: no remap, no metrics changes, no subsetting.
  - OFL fonts get `OFL.txt` in their zip.
  - Don't add commercially licensed fonts (MV Boli, anything bundling Microsoft glyphs).
  - Glyph outlines are never modified.
- **Legacy policy:** an `A_`/pre-Unicode font is listed only if no modern Unicode version of the same design exists. Otherwise it goes in `[excluded]`, and its name becomes an alias on the modern family.
- The build must stay **byte-reproducible**: no timestamps, dates or random ordering in output (`recalcTimestamp=False`, fixed zip times). CI rebuilds it and diffs `apps/web/src/lib/data`.
- `fonts/scripts/research/` holds the one-off tools that recovered the legacy layouts and found duplicates. They're useful when adding fonts, but they're not part of the build.

## Releases and deploys

- Don't deploy or publish from a laptop. Releases happen by pushing tags:
  - `mise run release:site` tags `site-v*`, which triggers `.github/workflows/deploy.yml`.
  - `mise run release:packages` tags `packages-v*`, which triggers `.github/workflows/release-packages.yml`.
- Versions are CalVer: `YYYY.MMDD.N`.
- Workflows pin actions by SHA and pin the mise version. Jobs that hold credentials (Cloudflare, npm OIDC) run with caching disabled. Keep it that way.

## Gotchas already hit

- **No `event.platform` in SvelteKit 3 on Cloudflare.** adapter-cloudflare 8 passes no platform object. Read bindings with `import { env, waitUntil } from 'cloudflare:workers'` (the adapter shims it in `vite dev`), and treat `caches.default` as optional, since it doesn't exist under Node.
- `wrangler types` writes an import of the built `_worker.js` into `worker-configuration.d.ts`; the site's tsconfig therefore sets `checkJs: false`.
- `pnpm preview` (port 4173) and the e2e server (port 4174, always started fresh by Playwright) are plain `wrangler dev` from `apps/web`, so both use the local R2 state in `apps/web/.wrangler` that `mise run r2:local` fills.
- mise runs task `depends` in parallel: `bundles` depends on `fonts`, not both on a third task.
- Svelte actions attach in an effect: tests that `mount()` must `flushSync()` before interacting.
- Chrome's Private Network Access blocks public origins from fetching `localhost`; cross-origin e2e tests use a different loopback origin.
