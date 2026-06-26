<script>
	import { isMobile } from '$lib/mobile.js';

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		label = '',
		gradient = 'transparent',
		unit = '',
		onslide = () => {},
		onslideend = () => {}
	} = $props();

	let hovered = $state(false);

	function increment() {
		if (value < max) {
			value++;
			onslide();
			onslideend();
		}
	}

	function decrement() {
		if (value > min) {
			value--;
			onslide();
			onslideend();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="range-row" onmouseenter={() => (hovered = true)} onmouseleave={() => (hovered = false)}>
	<div class="header">
		<h5>{label} = {value}{unit}</h5>
		{#if !isMobile}
			<div class="steppers" class:visible={hovered}>
				<button aria-label="decrement {label}" onclick={decrement}>
					<icoglyph-svg use="minus"></icoglyph-svg>
				</button>
				<button aria-label="increment {label}" onclick={increment}>
					<icoglyph-svg use="plus"></icoglyph-svg>
				</button>
			</div>
		{/if}
	</div>

	<input
		type="range"
		{min}
		{max}
		bind:value
		oninput={onslide}
		onchange={onslideend}
		tabindex="-1"
		style="--track-bg: {gradient};"
	/>
</div>

<style>
	.range-row {
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
		gap: 2px;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}

	.steppers.visible {
		opacity: 1;
	}

	.steppers button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		padding: 4px;
	}

	.steppers icoglyph-svg {
		width: 15px;
		height: 15px;
		--icoglyph-stroke-width: 16;
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
