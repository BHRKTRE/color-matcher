# Changelog

## [1.1.0] — 2026-04-29

### Architecture

- Migrated fully to **Svelte 5** runes (`$state`, `$props`, `$derived`, `$effect`) — no legacy Svelte 4 syntax remaining
- Removed separate store files: palette state is managed directly in `+page.svelte` via runes
- New dynamic route `/[colorSpace]/[colors]` encodes the full palette in the URL path
- New standalone route `/wavelength` for the wavelength visualizer (previously mixed into the main page)
- Reorganized `src/lib/` into focused modules: `color/convert.js`, `color/gradient.js`, `color/wavelength.js`, `colorSpaces.js`, `url.js`

### Features

- **Undo / Redo**: full history stack for palette changes
- **URL-only persistence**: palette state lives entirely in the URL — no localStorage needed
- **Shareable links**: Base64-encoded JSON hash, copy and share any palette instantly
- **Wavelength Visualizer**: standalone at `/wavelength`, range 380–780 nm with smooth gradient preview
- **Color space navigation**: fly-out menu to switch between HSL, HSV, CMYK, RGB, and Wavelength

### UI

- Replaced animejs button morphing with CSS transitions — simpler, no JS animation dependency
- Switched to **[IcoGlyph](https://icoglyph.com)** SVG web components for all icons
- Always dark mode — no toggle
- Improved responsive layout for mobile (≤ 430 px)

### Bug fixes

- Fixed button tooltip descriptions showing literal `{label}` instead of the actual color label
- Fixed wavelength maximum value (was off by one)
- Fixed duplicate condition in `RangeInput` stepper logic
- Fixed gradient calculation for comparison color bars

### Cleanup

- Removed `animejs` npm dependency (unused after UI refactor)
- ESLint config: ignore Wrangler build artifacts in `.wrangler/`, add Svelte 5 rune globals for `.svelte.js` files
- Prettier formatting pass across all source files

---

## [1.0.0] — 2024-11-05

Initial public release.
