<script>
	import GlyphButton from './GlyphButton.svelte';
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

	let copied = $state(false);
	let copiedHex = $state('');
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

	function copyHex() {
		navigator.clipboard.writeText(hex);
		tooltip.set(`Hex of ${label} copied!`);
		copied = true;
		copiedHex = hex;
	}

	$effect(() => {
		if (hex !== copiedHex) copied = false;
	});

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
				<GlyphButton
					glyphName="onSelec"
					inSecondState={!isSelected}
					onClick={onselect}
					description={isSelected ? '' : `Select ${label}`}
					showTooltips={false}
				/>
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
				<GlyphButton
					glyphName="deleteThisOne"
					onClick={onremove}
					showTooltips={false}
					description={`Remove ${label}`}
				/>
				<GlyphButton
					glyphName="incrementSize"
					onClick={onresizeup}
					showTooltips={false}
					description={`Increase size of ${label}`}
				/>
				<GlyphButton
					glyphName="decrementSize"
					onClick={onresizedown}
					showTooltips={false}
					description={`Decrease size of ${label}`}
				/>
			{/if}

			{#if showAdd}
				<GlyphButton
					glyphName="addThisOne"
					onClick={onadd}
					showTooltips={false}
					description="Add a color"
				/>
			{/if}

			<GlyphButton
				glyphName="copyToClipboard"
				inSecondState={copied}
				onClick={copyHex}
				showTooltips={false}
				description={`Copy hex of ${label}`}
			/>
			<GlyphButton
				glyphName="randomize"
				inSecondState={randomToggle}
				onClick={randomize}
				showTooltips={false}
				description={`Randomize ${label}`}
			/>
		</div>
	</div>
</div>

<style>
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
