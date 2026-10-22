<br />

<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.svg" />
    <img alt="dvfonts — ޑީވީފޮންޓްސް" src=".github/assets/banner-light.svg" width="600" />
  </picture>
</h1>

<p align="center">
  <b>Open Dhivehi fonts for the web, and one install that makes Thaana work everywhere.</b><br />
  136 font families, cleaned up, Unicode, web-ready, free to embed, plus a keyboard, bidi toolkit and agent guide.
</p>

<p align="center">
  <a href="https://github.com/yashau/dvfonts/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/yashau/dvfonts/ci.yml?branch=main&style=for-the-badge&label=CI&logo=githubactions&logoColor=white" /></a>
  <a href="https://github.com/yashau/dvfonts/actions/workflows/deploy.yml"><img alt="Deploy" src="https://img.shields.io/github/actions/workflow/status/yashau/dvfonts/deploy.yml?style=for-the-badge&label=deploy&logo=cloudflare&logoColor=white" /></a>
  <a href="https://dvfonts.yashau.com"><img alt="Fonts" src="https://img.shields.io/badge/fonts-136_families_·_194_styles-0e7c66?style=for-the-badge" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/code-MIT-blue?style=for-the-badge" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@yashau/thaana"><img alt="@yashau/thaana" src="https://img.shields.io/npm/v/@yashau/thaana?style=for-the-badge&logo=npm&label=%40yashau%2Fthaana&color=cb3837" /></a>
  <a href="https://www.npmjs.com/package/@yashau/thaana-react"><img alt="@yashau/thaana-react" src="https://img.shields.io/npm/v/@yashau/thaana-react?style=for-the-badge&logo=react&logoColor=white&label=react&color=149eca" /></a>
  <a href="https://www.npmjs.com/package/@yashau/thaana-svelte"><img alt="@yashau/thaana-svelte" src="https://img.shields.io/npm/v/@yashau/thaana-svelte?style=for-the-badge&logo=svelte&logoColor=white&label=svelte&color=ff3e00" /></a>
  <a href="https://www.npmjs.com/package/@yashau/thaana-vue"><img alt="@yashau/thaana-vue" src="https://img.shields.io/npm/v/@yashau/thaana-vue?style=for-the-badge&logo=vuedotjs&logoColor=white&label=vue&color=42b883" /></a>
  <a href="https://bundlejs.com/?q=@yashau/thaana"><img alt="size" src="https://img.shields.io/bundlejs/size/@yashau/thaana?style=for-the-badge&label=core%20gzip" /></a>
</p>

<p align="center">
  <img alt="SvelteKit" src="https://img.shields.io/badge/SvelteKit_3-ff3e00?style=for-the-badge&logo=svelte&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="shadcn-svelte" src="https://img.shields.io/badge/shadcn--svelte-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img alt="Cloudflare Workers" src="https://img.shields.io/badge/Workers_+_R2-f38020?style=for-the-badge&logo=cloudflare&logoColor=white" />
  <img alt="Python" src="https://img.shields.io/badge/fontTools-3776ab?style=for-the-badge&logo=python&logoColor=white" />
  <img alt="uv" src="https://img.shields.io/badge/uv-de5fe9?style=for-the-badge&logo=uv&logoColor=white" />
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-f69220?style=for-the-badge&logo=pnpm&logoColor=white" />
  <img alt="mise" src="https://img.shields.io/badge/mise-00a8e8?style=for-the-badge" />
  <img alt="Oxc" src="https://img.shields.io/badge/oxlint_+_oxfmt-1a1a1a?style=for-the-badge" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-6e9f18?style=for-the-badge&logo=vitest&logoColor=white" />
  <img alt="Playwright" src="https://img.shields.io/badge/Playwright-2ead33?style=for-the-badge&logo=playwright&logoColor=white" />
</p>

<p align="center">
  <a href="https://dvfonts.yashau.com"><b>Browse the fonts</b></a> ·
  <a href="https://dvfonts.yashau.com/docs"><b>Docs</b></a> ·
  <a href="https://dvfonts.yashau.com/downloads"><b>Downloads</b></a> ·
  <a href="https://dvfonts.yashau.com/llms.txt"><b>llms.txt</b></a>
</p>

<br />

## Why

Dhivehi fonts have been passed around for decades on dhivehi.mv, Hassan Hameed's site, the Thaana Type Foundry, thatmaldivesblog, dhivehifont.com and countless shared folders. Most are painful on the web:

- Some still put Thaana on Latin keys, so text looks like `ihevid` without the font.
- Many have broken line metrics that clip the fili.
- Duplicates circulate under different names.
- Almost none come in web formats.
- Getting RTL text, punctuation and brackets right is a maze.

dvfonts fixes all of that in one place.

## Quick start

**Use a font on any page.** It works like Google Fonts:

```html
<link rel="stylesheet" href="https://dvfonts.yashau.com/css2?family=Faruma&family=Bolhu:wght@400;700&display=swap" />

<p dir="rtl" lang="dv" style="font-family: 'Faruma', system-ui, sans-serif">ދިވެހިރާއްޖެ</p>
```

**Let people type Thaana on any keyboard,** with no build step:

```html
<script type="module" src="https://dvfonts.yashau.com/thaana.js"></script>

<input data-thaana placeholder="ލިޔުއްވާ" />
```

**In an app:**

```sh
npm i @yashau/thaana          # vanilla JS / any framework
npm i @yashau/thaana-react    # React 18/19
npm i @yashau/thaana-svelte   # Svelte 5
npm i @yashau/thaana-vue      # Vue 3
```

```tsx
import { ThaanaInput, useDhivehiFont, fontStack } from '@yashau/thaana-react';

useDhivehiFont('Faruma');
<ThaanaInput value={name} onChange={(e) => setName(e.target.value)} style={{ fontFamily: fontStack('Faruma') }} />;
```

**Building with an AI agent?** Point it at [`/llms.txt`](https://dvfonts.yashau.com/llms.txt). It has every recipe, the RTL rules and the full font list, with absolute URLs.

## What's inside

<table>
<tr>
<td width="50%" valign="top">

### 🔤 The fonts

- **136 families / 194 styles**: ModFaruma, Faruma, the MV classics, Thaana Type Foundry's modern families, dhivehifont.com, Zillon and more.
- **Search by any name.** Old names and duplicates are aliases (`A_Waheed` finds MV A Waheed).
- **Type tester** with live preview, like Google Fonts, that gets RTL, punctuation and brackets right.
- **Download anything:** single styles (TTF/OTF/WOFF2), whole families, or bundles (Essentials, Full suite, Unicode originals, Openly licensed, by category, webfont kits).

</td>
<td width="50%" valign="top">

### ⌨️ The toolkit (`@yashau/thaana`, ~3 KB)

- **Phonetic keyboard** for any input, textarea or contenteditable, using Microsoft's standard Divehi Phonetic layout. Works with controlled inputs, keeps undo, never touches IME or paste.
- **Bidi helpers:** keep `+960 333-1234`, `-5`, `9:00` and `50%` readable inside Thaana; isolate names and URLs.
- **Text repair:** convert old A_-font text to Unicode, fix Thaana copied out of PDFs, tidy punctuation.
- **Font loading and stacks,** plus CSS defaults that stop fili clipping.

</td>
</tr>
</table>

## What was done to the fonts

| Fix                                 | What changed                                                                                                                                                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔁&nbsp;**Unicode&nbsp;remapping**  | 24 pre-Unicode fonts had Thaana on Latin keys. Their two keyboard layouts were recovered by matching glyph outlines against Unicode twins of the same designs, then remapped. Where a modern Unicode version of an old `A_` font exists, only the modern one is listed. |
| 🧹&nbsp;**De&#8209;duplication**    | Identical designs under different names were found by comparing rasterised letters and merged, with the other names kept as aliases.                                                                                                                                    |
| 📏&nbsp;**Metrics&nbsp;repair**     | 43 fonts had broken vertical metrics (positive descenders, tiny line boxes) that clip fili in browsers. All fonts now have consistent hhea/typo/win metrics, so line height is the same on Windows, macOS and Linux.                                                    |
| 🎯&nbsp;**Fili&nbsp;as&nbsp;marks** | Vowel marks are classed as combining marks (GDEF) so shapers stack them correctly. Faruma's malformed GDEF is repaired too.                                                                                                                                             |
| 🏷️&nbsp;**Clean&nbsp;names**        | Names and weights are normalised so families install as one family on desktop.                                                                                                                                                                                          |
| 📦&nbsp;**Web&nbsp;formats**        | WOFF2, WOFF and TTF, plus Thaana/Latin `unicode-range` subsets: a Thaana-only page downloads only the Thaana part.                                                                                                                                                      |
| ⚖️&nbsp;**Licenses&nbsp;respected** | Glyph outlines are never changed. CC BY-ND fonts ship byte-for-byte. OFL fonts include `OFL.txt`. Every download carries its credits.                                                                                                                                   |
| ♻️&nbsp;**Reproducible**            | The build is byte-reproducible: whenever its inputs change, CI rebuilds it and checks the result against the repo.                                                                                                                                                      |

## Repository

```
apps/web/              SvelteKit 3 site on a Cloudflare Worker (pages, /css2 API, R2 for fonts + downloads)
packages/thaana/       @yashau/thaana: core toolkit, framework-agnostic, zero deps
packages/react/        @yashau/thaana-react
packages/svelte/       @yashau/thaana-svelte
packages/vue/          @yashau/thaana-vue
fonts/                 font pipeline (Python + fontTools, run with uv)
  sources/             the original font files
  catalog/             families.toml (curated catalogue), bundles.toml, sources.tsv (attribution)
  scripts/             build.py · bundles.py · r2_manifest.py · research/ (how layouts and duplicates were found)
.github/workflows/     CI · site deploy · npm release
```

## Development

Everything is pinned with [mise](https://mise.jdx.dev):

```sh
mise install            # node, pnpm, uv
mise run install        # pnpm install + uv sync
mise run r2:local       # build fonts + bundles and load them into local R2 (once)
mise run dev            # http://localhost:5173
```

| Task                                  | What it does                                            |
| ------------------------------------- | ------------------------------------------------------- |
| `mise run test`                       | Unit tests for all packages (Vitest)                    |
| `mise run check`                      | Type-check packages and site                            |
| `mise run lint` / `format`            | oxlint + oxfmt (JS/TS/Svelte), ruff (Python)            |
| `mise run fonts`                      | Rebuild the font library from `fonts/sources`           |
| `mise run bundles`                    | Build the download zips                                 |
| `pnpm --filter @dvfonts/web test:e2e` | Playwright against the real Worker under `wrangler dev` |

**Adding a font:**

1. Drop the file in `fonts/sources/`.
2. Add a family to `fonts/catalog/families.toml`, plus a row in `sources.tsv` for attribution.
3. Run `mise run bundles`.
4. Commit the updated `apps/web/src/lib/data`.

## Releasing

| Command                     | Tag                     | Workflow                                                                                     |
| --------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `mise run release:site`     | `site-vYYYY.MMDD.N`     | Builds the site, uploads fonts and bundles to R2, deploys the Worker, smoke-tests production |
| `mise run release:packages` | `packages-vYYYY.MMDD.N` | Tests, packs and publishes all four npm packages with provenance                             |

## Credits and rights

The fonts belong to their makers: the Office of the President (Faruma, Reethi), Hassan Hameed, the Thaana Type Foundry, Hussain Niyaz, Zillon, Mohamed Amaan, M.A. Gadir and many others. Each family page and download names its makers and license, and lists exactly what dvfonts changed. Fonts were collected via [raajjefonts](https://raajjefonts.github.io/) and their original sites.

**If you hold rights to a font here** and want it credited differently, relicensed or removed, [open an issue](https://github.com/yashau/dvfonts/issues) or email ibrahim@yashau.com. Removal requests are honoured without argument.

## License

Code is [MIT](LICENSE). Each font keeps its own license and credits.
