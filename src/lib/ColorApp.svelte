<script>
	import AppShell from '$lib/components/AppShell.svelte';
	import HexInput from '$lib/components/HexInput.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';
	import ColorSpaceNav from '$lib/components/ColorSpaceNav.svelte';
	import { untrack } from 'svelte';

	import { hexToChannels, channelsToHex, invertHex, rotateHex } from '$lib/color/convert.js';
	import { getGradients } from '$lib/color/gradient.js';
	import { colorSpaces } from '$lib/colorSpaces.js';
	import { replaceState } from '$app/navigation';
	import { encodeState } from '$lib/url.js';

	const DEFAULT_HEX = '#0f2852';
	const GITHUB = 'https://github.com/LM45PixelPsi/color-matcher';
	const GITHUB_SVG =
		'm 50.036289,6.8783688 c -24.269302,0 -43.8886126,19.7640232 -43.8886126,44.2147642 0,19.544762 12.5708166,36.089038 30.0097906,41.944529 2.180337,0.440168 2.978998,-0.951376 2.978998,-2.121904 0,-1.025048 -0.07181,-4.538497 -0.07181,-8.199398 -0.02774,0.172887 -0.02774,-4.212345 0.217398,-6.222097 0.362988,-2.855006 1.526281,-4.83143 2.7616,-5.929163 -9.737408,-1.024939 -19.982408,-4.83132 -19.982408,-21.814887 0,-4.83143 1.742802,-8.784169 4.504402,-11.858436 -0.435673,-1.097843 -1.962063,-5.637217 0.43655,-11.712846 0,0 3.70574,-1.171515 12.061362,4.538496 a 42.196132,42.196132 0 0 1 10.972619,-1.464339 c 3.705741,0 7.483399,0.512963 10.971742,1.464339 8.356609,-5.710011 12.062349,-4.538496 12.062349,-4.538496 2.398613,6.075629 0.871456,10.615003 0.435673,11.712846 2.834286,3.074157 4.505278,7.027006 4.505278,11.858436 0,16.983567 -10.244889,20.716276 -20.055093,21.814887 1.599075,1.390667 2.978998,4.025534 2.978998,8.198411 0,5.929163 -0.07181,10.687798 -0.07181,12.15126 0,1.171515 0.799538,2.563059 2.978998,2.123768 C 81.281289,87.181294 93.852106,70.637895 93.852106,51.093133 93.924024,26.642392 74.232796,6.8783688 50.036289,6.8783688 Z';

	let {
		initialColorSpace = 'hsl',
		initialHexColors = [DEFAULT_HEX],
		initialCompareSizes = [32.5, 32.5]
	} = $props();

	// --- State

	let hexColors = $state(untrack(() => [...initialHexColors]));
	let colorSpace = $state(untrack(() => initialColorSpace));
	let selectedIndex = $state(0);
	let compareSizes = $state(untrack(() => [...initialCompareSizes]));

	let channels = $state(
		untrack(() => [
			hexToChannels(initialHexColors[0] ?? DEFAULT_HEX),
			hexToChannels(initialHexColors[1] ?? '#000000'),
			hexToChannels(initialHexColors[2] ?? '#000000')
		])
	);

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

	// --- Share link

	let copyTimeout;
	let linkCopied = $state(false);
	function shareLink() {
		const url = 'https://color-matcher.app' + encodeState({ colorSpace, hexColors, compareSizes });
		navigator.clipboard.writeText(url);
		linkCopied = true;
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => (linkCopied = false), 1500);
	}

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

	// Skip the first run (happens during hydration before router is ready).
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

<AppShell>
	{#snippet mainContent()}
		<h1 class="sr-only">Color Matcher — Create and Share Color Palettes</h1>
		<div class="color-background" style="background: {hexColors[0]};"></div>
		<div class="compare-overlay">
			{#if hexColors.length >= 3}
				<div
					class="compare-bar"
					style="background: {hexColors[2]}; height: {compareSizes[1]}%;"
				></div>
			{/if}
			{#if hexColors.length >= 2}
				<div
					class="compare-bar"
					style="background: {hexColors[1]}; height: {compareSizes[0]}%;"
				></div>
			{/if}
		</div>
	{/snippet}

	{#snippet topRight()}
		<div class="top-right-btn">
			<button onclick={shareLink} aria-label="Share">
				<icoglyph-svg use={!linkCopied ? 'share' : 'copied'}></icoglyph-svg>
				<span class="tooltip">{!linkCopied ? 'Share' : 'Link copied !'}</span>
			</button>
		</div>
		<div class="top-right-btn">
			<button onclick={() => window.open(GITHUB, '_blank')} aria-label="GitHub">
				<svg viewBox="0 0 100 100">
					<path d={GITHUB_SVG} />
				</svg>
				<span class="tooltip">GitHub</span>
			</button>
		</div>
		<div class="top-right-btn">
			<button onclick={undo} aria-label="Undo" class:btn-hide={!canUndo}>
				<icoglyph-svg use="back"></icoglyph-svg>
				<span class="tooltip">Undo</span>
			</button>
		</div>
		<div class="top-right-btn">
			<button onclick={redo} aria-label="Redo" class:btn-hide={!canRedo}>
				<icoglyph-svg use="forward"></icoglyph-svg>
				<span class="tooltip">Redo</span>
			</button>
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
</AppShell>

<style>
	button {
		position: relative;
		border-radius: var(--br);
		height: 100%;
		aspect-ratio: 1/1;
		transition: 0.4s;
	}

	.btn-hide {
		opacity: 0.5;
		cursor: default;
	}

	button:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}

	.tooltip {
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.5s;
		position: absolute;
		right: calc(100% + 8px);
		top: 50%;
		transform: translateY(-50%);
		background: var(--b1o3);
		color: var(--t1);
		font-family: var(--typo1);
		font-weight: 400;
		font-size: 0.9rem;
		padding: 5px 10px;
		border-radius: var(--br);
		white-space: nowrap;
		pointer-events: none;
		z-index: 11;
		user-select: none;
	}

	.color-background {
		height: 100vh;
		width: 100vw;
		transition: background 0.2s;
	}

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

	.compare-bar {
		border-radius: var(--br);
		width: 100%;
		transition:
			background 0.2s,
			height 0.3s;
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
