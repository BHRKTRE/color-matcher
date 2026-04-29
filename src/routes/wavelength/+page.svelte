<script>
	import {
		wavelengthToHex,
		WAVELENGTH_MIN,
		WAVELENGTH_MAX,
		WAVELENGTH_GRADIENT
	} from '$lib/color/wavelength.js';
	import { isMobile } from '$lib/device.js';

	let nm = $state(550);

	const hex = $derived(wavelengthToHex(nm));

	let hovered = $state(false);

	function increment() {
		if (nm < WAVELENGTH_MAX) nm++;
	}

	function decrement() {
		if (nm > WAVELENGTH_MIN) nm--;
	}
</script>

<svelte:head>
	<title>Wavelength — Color Matcher</title>
	<meta
		name="description"
		content="Visualize visible light wavelengths from 380 nm to 780 nm as colours."
	/>
</svelte:head>

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
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="slider-row"
			onmouseenter={() => (hovered = true)}
			onmouseleave={() => (hovered = false)}
		>
			<div class="header">
				<h5>Wavelength = {nm} nm</h5>
				{#if !isMobile}
					<div class="steppers" class:visible={hovered}>
						<button aria-label="decrement" onclick={decrement}>−</button>
						<button aria-label="increment" onclick={increment}>+</button>
					</div>
				{/if}
			</div>
			<input
				type="range"
				min={WAVELENGTH_MIN}
				max={WAVELENGTH_MAX}
				bind:value={nm}
				tabindex="-1"
				style="--track-bg: {WAVELENGTH_GRADIENT};"
			/>
		</div>

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
		--ig-stroke: var(--t1);
		--ig-fill: none;
		--ig-stroke-linecap: round;
		--ig-stroke-linejoin: round;
		--ig-stroke-width: 0.6rem;
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

	.slider-row {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 18px 2px;
		user-select: none;
		cursor: default;
	}

	h5 {
		font-weight: 600;
	}

	.steppers {
		display: flex;
		align-items: center;
		gap: 4px;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.steppers.visible {
		opacity: 1;
	}

	.steppers button {
		width: 22px;
		height: 22px;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hex-display {
		text-align: center;
		font-family: var(--typo1);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		user-select: all;
	}

	/* Range input */

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		width: 100%;
	}

	input[type='range']::-webkit-slider-runnable-track {
		background: var(--track-bg);
		height: 14px;
		border-radius: 20px;
	}

	input[type='range']::-moz-range-track {
		background: var(--track-bg);
		height: 14px;
		border-radius: 20px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 20px;
		width: 20px;
		background: none;
		border-radius: 100%;
		margin-top: -3px;
		border: 2px solid var(--t1);
	}

	input[type='range']::-moz-range-thumb {
		border: 2px solid var(--t1);
		border-radius: 100%;
		background: none;
		height: 20px;
		width: 20px;
	}
</style>
