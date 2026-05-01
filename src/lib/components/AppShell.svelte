<script>
	import { tooltip } from '$lib/tooltip.svelte.js';
	import { isMobile } from '$lib/mobile.js';
	import { onDestroy } from 'svelte';

	let { mainContent, controls, topRight } = $props();

	// --- Fullscreen

	let isFullscreen = $state(false);

	function applyFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {});
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	function toggleFullscreen(e) {
		if (e.target.closest('#controlsContainer, #topRightButtonsContainer, #InterfaceToggleButton'))
			return;
		applyFullscreen();
	}

	function onFullscreenChange() {
		isFullscreen = !!document.fullscreenElement;
	}

	// --- Controls visibility

	let controlsHidden = $state(false);
	let interfaceHidden = $state(false);
	let inactivityTimer;

	function startInactivityTimer() {
		clearTimeout(inactivityTimer);
		interfaceHidden = false;
		document.body.style.cursor = 'auto';
		inactivityTimer = setTimeout(() => {
			interfaceHidden = true;
			document.body.style.cursor = 'none';
		}, 3000);
	}

	function toggleControls() {
		controlsHidden = !controlsHidden;
		if (controlsHidden) {
			startInactivityTimer();
		} else {
			clearTimeout(inactivityTimer);
			interfaceHidden = false;
			document.body.style.cursor = 'auto';
		}
	}

	function onMouseMove() {
		if (controlsHidden) startInactivityTimer();
	}

	onDestroy(() => {
		clearTimeout(inactivityTimer);
		if (typeof document !== 'undefined') {
			document.body.style.cursor = 'auto';
		}
	});
</script>

<svelte:document onfullscreenchange={onFullscreenChange} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="mainContainer" onmousemove={onMouseMove} ondblclick={toggleFullscreen}>
	{@render mainContent()}

	<div id="topRightButtonsContainer" class:hidden={interfaceHidden}>
		{#if !isMobile}
			<div class="top-right-btn">
				<button
					onclick={applyFullscreen}
					aria-label={isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'}
				>
					<icoglyph-svg use={isFullscreen ? 'scale-down' : 'fullscreen'}></icoglyph-svg>
					<span class="tooltip">{isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'}</span>
				</button>
			</div>
		{/if}
		{@render topRight()}
	</div>

	<div id="interfaceToggle" class:hidden={interfaceHidden}>
		<button
			onclick={toggleControls}
			aria-label={controlsHidden ? 'Show controls' : 'Hide controls'}
		>
			<icoglyph-svg use={controlsHidden ? 'arrow-up' : 'arrow-down'}></icoglyph-svg>
		</button>
	</div>

	<div id="controlsContainer" class:slideOut={controlsHidden}>
		{@render controls()}

		{#if tooltip.value}
			<span id="tooltip">{tooltip.value}</span>
		{/if}
	</div>
</div>

<style>
	button {
		position: relative;
		border-radius: var(--br);
		height: 100%;
		aspect-ratio: 1/1;
		transition: 0.4s;
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

	#topRightButtonsContainer {
		position: absolute;
		right: 20px;
		top: 20px;
		transition: 0.5s;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 20px;
		z-index: 10;
	}

	#tooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		transition: 0.5s;
		background: var(--b1o3);
		border-radius: var(--br);
		padding: 7px 12px;
		user-select: none;
		color: var(--t1);
		font-family: var(--typo1);
		font-weight: 400;
		font-size: 0.9rem;
		white-space: nowrap;
		pointer-events: none;
		z-index: 10;
	}

	#interfaceToggle {
		transition: 0.5s;
		background: var(--b1o3);
		border-radius: var(--br);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.3rem;
		height: 1.7rem;
		width: 1.7rem;
		bottom: 20px;
		z-index: 10;
	}

	#mainContainer {
		background: #19467a;
		height: 100vh;
		width: 100vw;
		position: relative;
		overflow: hidden;
	}

	#controlsContainer {
		transition:
			transform 0.7s,
			opacity 0.7s;
		background: var(--b1o3);
		border-radius: var(--br);
		width: 80%;
		max-width: 600px;
		position: absolute;
		bottom: 65px;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px 15px;
		z-index: 9;
	}

	#controlsContainer.slideOut {
		transform: translateX(-50%) translateY(calc(100% + 80px));
		opacity: 0;
		pointer-events: none;
	}

	.hidden {
		opacity: 0 !important;
		pointer-events: none;
	}
</style>
