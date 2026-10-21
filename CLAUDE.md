# CLAUDE.md — color-matcher

A colour combination tool at <https://color-matcher.app>: up to three colours
shown as proportional bars, edited in HSL, HSV, RGB or CMYK, shareable by URL.
SvelteKit 2, Svelte 5 runes, JavaScript. `colord` is the only runtime dependency.

## Commands

- `npm run dev`, `npm run build`
- `npm run lint`: Prettier check then ESLint. No Stylelint
- `npm test`: Playwright (`npm run preview` builds, then `wrangler pages dev`
  serves on 8788) then Vitest. Vitest 2 fails at startup: it runs its own Vite 5,
  and `@sveltejs/vite-plugin-svelte` 7 needs Vite 8
- `npm run deploy`: build, then `wrangler pages deploy`. **Direct upload, no CI,
  no git integration**: pushing to `main` deploys nothing

## Layout

- `src/routes/+page.svelte`: the default palette
- `src/routes/[colorSpace]/[colors]/`: a shared palette. `+page.js` decodes the
  URL with `decodeState` and throws a 404 on anything invalid
- `src/routes/wavelength/`: the 380 to 780 nm visualizer, its own page and not a
  colour space (`url.js` rejects it)
- `src/lib/ColorApp.svelte`: all palette state, undo and redo, the share button
- `src/lib/components/`: `AppShell` (frame, fullscreen, hide controls, global
  tooltip), `HexInput`, `RangeInput`, `ColorSpaceNav`, `Meta`
- `src/lib/color/`: pure conversions over `colord` (`convert.js`), slider
  gradients (`gradient.js`), wavelength to hex (`wavelength.js`)
- `src/lib/colorSpaces.js`: channel names, keys and ranges per space
- `src/lib/url.js`: `encodeState` and `decodeState`, the URL contract

## The URL is the state

`/<space>/<hex>-<hex>-<hex>?s=<size>-<size>`, hex without `#`, one to three
colours, `s` the heights in percent of the second and third bars. There is no
localStorage for the palette. A `$effect` in `ColorApp` calls `replaceState` on
every change and skips its first run, which happens during hydration before the
router is ready. Changing this format breaks every link already shared.

Every palette URL declares `https://color-matcher.app` as its canonical, so only
`/` and `/wavelength` are indexed; `static/sitemap.xml` lists exactly those two.

## Pitfalls

- **The design tokens are not in `src/app.css`.** They live in
  `static/global-style/global.css` (`--b1`, `--b1o3`, `--t1`, `--br`, `--typo1`...),
  linked from `app.html`. `color-mode.js` beside it is loaded by nothing
- `channels` holds all four spaces for each colour; only the active space is
  edited, then converted back to hex. `gradient.js` relies on the CMYK plugin
  that `convert.js` registers, so import `convert.js` first
- Initial props are read through `untrack`: they seed state once, a later prop
  change does not reset the palette
- `tooltip.svelte.js` says `FullScreenDisplay` reads it; that component is now
  `AppShell`
- `isMobile` sniffs the user agent at module load (`mobile.js`) and hides the
  steppers and the fullscreen button
- The domain is written as a literal in `ColorApp.svelte`, `Meta.svelte` and the
  palette route
- The GitHub link points at `LM45PixelPsi/color-matcher`, which redirects; the
  remote is `BHRKTRE/color-matcher`

## Drift from the arma baseline

Not fixed yet, the `adopt` skill covers it: Prettier carries overrides (tabs,
single quotes, width 100); no Stylelint; the icon component is pinned to
`@icoglyphs/svg@0.9.0` in `app.html`; the GitHub icon is a hand-copied path;
`@sveltejs/adapter-auto` is installed and unused; `@eslint/js` is imported by
`eslint.config.js` but not declared; both test files are scaffold placeholders,
so `url.js` and the conversions have no tests.

## Versions

Git tags stop at `v1.1.0` and `CHANGELOG.md` at 1.1.0. Releases 1.2.0 and 1.3.0
exist only as commit messages (`de9530a`, `54d849e`).
