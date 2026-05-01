<script>
	import RangeInput from '$lib/components/RangeInput.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import {
		wavelengthToHex,
		WAVELENGTH_MIN,
		WAVELENGTH_MAX,
		WAVELENGTH_GRADIENT
	} from '$lib/color/wavelength.js';

	let nm = $state(550);
	const hex = $derived(wavelengthToHex(nm));
</script>

<Meta
	title="Wavelength — Color Matcher"
	description="Visualize visible light wavelengths from 380 nm to 780 nm as colours."
	canonical="https://www.color-matcher.app/wavelength"
/>

<div class="layout" style="background: {hex};">
	<a
		class="back-link"
		href="/"
		onclick={(e) => {
			e.preventDefault();
			history.back();
		}}
	>
		<icoglyph-svg use="arrow-left" class="back-arrow"></icoglyph-svg>
		Color Matcher
	</a>

	<div class="controls">
		<RangeInput
			bind:value={nm}
			min={WAVELENGTH_MIN}
			max={WAVELENGTH_MAX}
			label="Wavelength"
			gradient={WAVELENGTH_GRADIENT}
			unit=" nm"
		/>
		<p class="hex-display">{hex}</p>
	</div>
</div>

<style>
	.layout {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 50px;
		box-sizing: border-box;
		transition: background 0.1s;
		position: relative;
	}

	.back-arrow {
		display: block;
		width: 1em;
		height: 1em;
		flex-shrink: 0;
		--icoglyph-stroke: var(--t1);
		--icoglyph-fill: none;
		--icoglyph-stroke-linecap: round;
		--icoglyph-stroke-linejoin: round;
		--icoglyph-stroke-width: 0.6rem;
	}

	.back-link {
		position: absolute;
		top: 20px;
		left: 20px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--t1);
		font-family: var(--typo1);
		font-size: 0.9rem;
		background: var(--b1o3);
		padding: 6px 12px;
		border-radius: var(--br);
		transition: opacity 0.2s;
	}

	.back-link:hover {
		opacity: 0.8;
	}

	.controls {
		background: var(--b1o3);
		border-radius: var(--br);
		padding: 20px 20px 30px;
		width: 80%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.hex-display {
		text-align: center;
		font-family: var(--typo1);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		user-select: all;
	}
</style>
