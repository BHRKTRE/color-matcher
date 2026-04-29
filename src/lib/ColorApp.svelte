<script>
	import FullScreenDisplay from '$lib/components/FullScreenDisplay.svelte';
	import ColorDisplay from '$lib/components/ColorDisplay.svelte';
	import CompareColor from '$lib/components/CompareColor.svelte';
	import HexInput from '$lib/components/HexInput.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';
	import GlyphButton from '$lib/components/GlyphButton.svelte';
	import ColorSpaceNav from '$lib/components/ColorSpaceNav.svelte';

	import { hexToChannels, channelsToHex, invertHex, rotateHex } from '$lib/color/convert.js';
	import { getGradients } from '$lib/color/gradient.js';
	import { colorSpaces } from '$lib/colorSpaces.js';
	import { replaceState } from '$app/navigation';
	import { encodeState } from '$lib/url.js';

	const DEFAULT_HEX = '#0f2852';
	const GITHUB = 'https://github.com/LM45PixelPsi/color-matcher';

	let {
		initialColorSpace = 'hsl',
		initialHexColors = [DEFAULT_HEX],
		initialCompareSizes = [32.5, 32.5]
	} = $props();

	// --- State

	let hexColors = $state([...initialHexColors]);
	let colorSpace = $state(initialColorSpace);
	let selectedIndex = $state(0);
	let compareSizes = $state([...initialCompareSizes]);

	let channels = $state([
		hexToChannels(initialHexColors[0] ?? DEFAULT_HEX),
		hexToChannels(initialHexColors[1] ?? '#000000'),
		hexToChannels(initialHexColors[2] ?? '#000000')
	]);

	// --- Sync helpers

	function syncChannelsFromHex(idx) {
		channels[idx] = hexToChannels(hexColors[idx]);
	}

	function syncHexFromChannels(idx) {
		hexColors[idx] = channelsToHex(colorSpace, channels[idx]);
	}

	function changeColorSpace(space) {
		colorSpace = space;
		for (let i = 0; i < hexColors.length; i++) {
			channels[i] = hexToChannels(hexColors[i]);
		}
	}

	// --- Derived

	const gradients = $derived(channels.map((ch) => getGradients(colorSpace, ch)));

	// --- Undo / redo

	function snapshot() {
		return {
			hexColors: [...hexColors],
			colorSpace,
			compareSizes: [...compareSizes]
		};
	}

	let undoStack = $state([snapshot()]);
	let redoStack = $state([]);

	const canUndo = $derived(undoStack.length > 1);
	const canRedo = $derived(redoStack.length > 0);

	function pushHistory() {
		undoStack.push(snapshot());
		redoStack = [];
	}

	function applySnapshot(s) {
		hexColors = [...s.hexColors];
		colorSpace = s.colorSpace;
		compareSizes = [...s.compareSizes];
		for (let i = 0; i < hexColors.length; i++) channels[i] = hexToChannels(hexColors[i]);
	}

	function undo() {
		if (undoStack.length <= 1) return;
		redoStack.push(undoStack.pop());
		applySnapshot(undoStack[undoStack.length - 1]);
	}

	function redo() {
		if (!redoStack.length) return;
		const s = redoStack.pop();
		undoStack.push(s);
		applySnapshot(s);
	}

	function handleKeydown(e) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
			e.preventDefault();
			undo();
		}
		if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
			e.preventDefault();
			redo();
		}
	}

	// --- Color management

	function addColor() {
		if (hexColors.length >= 3) return;
		const newHex = hexColors.length === 1 ? invertHex(hexColors[0]) : rotateHex(hexColors[1], 50);
		const newIdx = hexColors.length;
		hexColors = [...hexColors, newHex];
		channels[newIdx] = hexToChannels(newHex);
		selectedIndex = newIdx;
		pushHistory();
	}

	function removeColor(idx) {
		hexColors = hexColors.filter((_, i) => i !== idx);
		if (selectedIndex >= hexColors.length) selectedIndex = 0;
		pushHistory();
	}

	function resizeUp(idx) {
		const si = idx - 1;
		if (compareSizes[si] < 95) {
			compareSizes[si] += 7.5;
			pushHistory();
		}
	}

	function resizeDown(idx) {
		const si = idx - 1;
		if (compareSizes[si] > 7.5) {
			compareSizes[si] -= 7.5;
			pushHistory();
		}
	}

	function colorLabel(idx) {
		return ['background', 'second color', 'third color'][idx] ?? 'color';
	}

	// --- URL path persistence
	// Skip the first run (happens during hydration before router is ready).
	// Only update the URL when the user actually changes state.

	let initialized = false;

	$effect(() => {
		const snap = {
			colorSpace,
			hexColors: hexColors.map((h) => h),
			compareSizes: compareSizes.map((s) => s)
		};
		if (!initialized) {
			initialized = true;
			return;
		}
		replaceState(encodeState(snap), {});
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Color Matcher — Create and Share Color Combinations</title>
	<meta
		name="description"
		content="Color Matcher is a free web app for creating color palettes. Share your creations through a unique URL. Supports HSL, HSV, CMYK, and RGB."
	/>
	<meta
		name="keywords"
		content="color matcher, color palette, color combinations, color generator, design tool, color harmony, free tool"
	/>
	<meta name="author" content="L" />
	<meta property="og:title" content="Color Matcher — Create and Share Color Combinations" />
	<meta
		property="og:description"
		content="A free and open-source web app for designing and sharing color schemes."
	/>
	<meta property="og:url" content="https://www.color-matcher.app" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Color Matcher" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Color Matcher — Create and Share Color Combinations" />
	<meta
		name="twitter:description"
		content="Create and share color palettes with HSL, HSV, CMYK, and RGB color spaces."
	/>
</svelte:head>

<FullScreenDisplay>
	{#snippet mainContent()}
		<ColorDisplay hex={hexColors[0]} />
		<div class="compare-overlay">
			{#if hexColors.length >= 3}
				<CompareColor hex={hexColors[2]} size={compareSizes[1]} />
			{/if}
			{#if hexColors.length >= 2}
				<CompareColor hex={hexColors[1]} size={compareSizes[0]} />
			{/if}
		</div>
	{/snippet}

	{#snippet topRight()}
		<div class="top-right-btn">
			<GlyphButton
				glyphName="gitHubLogo"
				onClick={() => window.open(GITHUB, '_blank')}
				description="GitHub"
				tooltipLocation="left"
			/>
		</div>
		<div class="top-right-btn">
			<GlyphButton
				glyphName="undo"
				onClick={undo}
				description="Undo"
				tooltipLocation="left"
				buttonHide={!canUndo}
			/>
		</div>
		<div class="top-right-btn">
			<GlyphButton
				glyphName="redo"
				onClick={redo}
				description="Redo"
				tooltipLocation="left"
				buttonHide={!canRedo}
			/>
		</div>
		<ColorSpaceNav current={colorSpace} onchange={changeColorSpace} />
	{/snippet}

	{#snippet controls()}
		{@const si = selectedIndex}
		{@const space = colorSpaces[colorSpace]}
		<div class="controls-inner">
			<!-- Hex inputs — compare colors first, main last -->
			{#if hexColors.length >= 3}
				<HexInput
					bind:hex={hexColors[2]}
					label={colorLabel(2)}
					isSelected={selectedIndex === 2}
					showSelect={true}
					showRemove={true}
					onselect={() => (selectedIndex = 2)}
					onremove={() => removeColor(2)}
					onresizeup={() => resizeUp(2)}
					onresizedown={() => resizeDown(2)}
					onhexchange={() => {
						syncChannelsFromHex(2);
						pushHistory();
					}}
				/>
			{/if}
			{#if hexColors.length >= 2}
				<HexInput
					bind:hex={hexColors[1]}
					label={colorLabel(1)}
					isSelected={selectedIndex === 1}
					showSelect={true}
					showRemove={true}
					onselect={() => (selectedIndex = 1)}
					onremove={() => removeColor(1)}
					onresizeup={() => resizeUp(1)}
					onresizedown={() => resizeDown(1)}
					onhexchange={() => {
						syncChannelsFromHex(1);
						pushHistory();
					}}
				/>
			{/if}
			<HexInput
				bind:hex={hexColors[0]}
				label={colorLabel(0)}
				isSelected={selectedIndex === 0}
				showSelect={hexColors.length > 1}
				showAdd={hexColors.length < 3}
				onselect={() => (selectedIndex = 0)}
				onadd={addColor}
				onhexchange={() => {
					syncChannelsFromHex(0);
					pushHistory();
				}}
			/>

			<!-- Sliders for the selected color -->
			<div class="sliders" style="border: 3px solid {hexColors[si]};">
				{#each space.channels as ch, i}
					<RangeInput
						bind:value={channels[si][colorSpace][space.keys[i]]}
						gradient={gradients[si][i]}
						label={ch}
						min={space.min[i]}
						max={space.max[i]}
						onslide={() => syncHexFromChannels(si)}
						onslideend={pushHistory}
					/>
				{/each}
			</div>
		</div>
	{/snippet}
</FullScreenDisplay>

<style>
	.compare-overlay {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		box-sizing: border-box;
		padding: 12.26%;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}

	.controls-inner {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.sliders {
		display: flex;
		flex-direction: column;
		border-radius: var(--br);
		padding: 20px 20px 30px;
		gap: 23px;
	}
</style>
