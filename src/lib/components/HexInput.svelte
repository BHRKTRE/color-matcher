<script>
	import { isValidHex, randomHex } from '$lib/color/convert.js';
	import { tooltip } from '$lib/tooltip.svelte.js';

	let {
		hex = $bindable('#000000'),
		label = 'color',
		isSelected = false,
		showSelect = true,
		showAdd = false,
		showRemove = false,
		onselect = () => {},
		onadd = () => {},
		onremove = () => {},
		onresizeup = () => {},
		onresizedown = () => {},
		onhexchange = () => {}
	} = $props();

	let copyTimeout;
	let randomToggle = $state(false);

	function handleInput(e) {
		let v = e.target.value;
		if (v !== '' && !v.startsWith('#')) v = '#' + v;
		hex = v;
		if (!isValidHex(hex)) {
			tooltip.set('Invalid hex — this is not a color!');
		} else {
			tooltip.clear();
			onhexchange();
		}
	}

	function handleBlur() {
		if (isValidHex(hex)) tooltip.clear();
	}

	function handleEnter(e) {
		if (e.key === 'Enter') e.target.blur();
	}

	function handleDblClick(e) {
		e.target.select();
	}

	// copy button
	let copied = $state(false);
	function copyHex() {
		navigator.clipboard.writeText(hex);
		tooltip.set(`Hex of ${label} copied!`);
		copied = true;
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => (copied = false), 1500);
	}

	// Random button
	function randomize() {
		hex = randomHex();
		randomToggle = !randomToggle;
		onhexchange();
	}
</script>

<div id="hexDisplay" style="border: 3px solid {isValidHex(hex) ? hex : 'var(--b3)'};">
	<div class="t-container">
		<div class="hex-container">
			{#if showSelect}
				<button onclick={onselect} aria-label={isSelected ? '' : `Select ${label}`}>
					<icoglyph-svg
						use={isSelected ? 'selected' : 'unselected'}
						aria={isSelected ? '' : `Select ${label}`}
					></icoglyph-svg>
				</button>
			{/if}
			<input
				class="HexInputText"
				id="{label}HexInput"
				type="text"
				autocomplete="off"
				spellcheck="false"
				maxlength="7"
				value={hex}
				oninput={handleInput}
				onblur={handleBlur}
				onkeydown={handleEnter}
				ondblclick={handleDblClick}
			/>
		</div>

		<div class="btn-container">
			{#if showRemove}
				<button onclick={onremove} aria-label={`Remove ${label}`}>
					<icoglyph-svg use={'delete'} aria={`Remove ${label}`}></icoglyph-svg>
				</button>

				<button onclick={onresizeup} aria-label={`Increase size of ${label}`}>
					<icoglyph-svg use={'scale-up'} aria={`Increase size of ${label}`}></icoglyph-svg>
				</button>

				<button onclick={onresizedown} aria-label={`Decrease size of ${label}`}>
					<icoglyph-svg use={'scale-down'} aria={`Decrease size of ${label}`}></icoglyph-svg>
				</button>
			{/if}

			{#if showAdd}
				<button onclick={onadd} aria-label="Add a color">
					<icoglyph-svg use={'add'} aria="Add a color"></icoglyph-svg>
				</button>
			{/if}

			<button onclick={copyHex} aria-label={`Copy hex of ${label}`}>
				<icoglyph-svg use={copied ? 'copied' : 'copy'} label={`Copy hex of ${label}`}>
				</icoglyph-svg>
			</button>

			<button onclick={randomize} aria-label={`Randomize ${label}`}>
				<icoglyph-svg use={'random'}></icoglyph-svg>
			</button>
		</div>
	</div>
</div>

<style>
	button {
		border-radius: var(--br);
		height: 100%;
		transition: 0.4s;
		aspect-ratio: 1/1;
	}

	.HexInputText {
		width: 100%;
	}

	.t-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 30px;
	}

	@media screen and (max-width: 430px) {
		.t-container {
			height: 27px;
		}
	}

	.hex-container {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}

	.btn-container {
		display: flex;
		width: 100%;
		justify-content: flex-end;
		gap: 10px;
	}

	#hexDisplay {
		border-radius: var(--br);
		background: var(--b1o3);
		padding: 5px 10px;
	}
</style>
