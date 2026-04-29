<script>
	import { glyphsBank } from '$lib/design/glyphs/glyphsBank';

	let { inSecondState = false, glyphName, viewBox = 'viewBox', animeDuration = 600 } = $props();

	const iconMap = {
		copyToClipboard: { base: 'copy', second: 'copied' },
		randomize: { base: 'random', second: 'random' },
		fullscreen: { base: 'fullscreen', second: 'scale-down' },
		showHideFullscreenInterface: { base: 'arrow-down', second: 'arrow-up' },
		onSelec: { base: 'select', second: 'unselect' },
		deleteThisOne: { base: 'delete', second: 'delete' },
		incrementSize: { base: 'scale-up', second: 'scale-up' },
		decrementSize: { base: 'scale-down', second: 'scale-down' },
		addThisOne: { base: 'add', second: 'add' },
		undo: { base: 'back', second: 'back' },
		redo: { base: 'forward', second: 'forward' },
		share: { base: 'share', second: 'saved' }
	};

	const iconName = $derived(
		inSecondState
			? (iconMap[glyphName]?.second ?? glyphName)
			: (iconMap[glyphName]?.base ?? glyphName)
	);

	let iconEl = $state(null);

	$effect(() => {
		if (iconEl) iconEl.animation = { duration: animeDuration };
	});
</script>

{#if glyphName === 'gitHubLogo'}
	<svg viewBox={glyphsBank.settings[viewBox]}>
		<path d={glyphsBank.basicIconForGlyphButton.gitHubLogo.base} />
	</svg>
{:else}
	<icoglyph-svg
		bind:this={iconEl}
		use={iconName}
		style="--ig-stroke: var(--t1); --ig-fill: none; --ig-stroke-linecap: round; --ig-stroke-linejoin: round; --ig-stroke-width: 0.4rem;"
	></icoglyph-svg>
{/if}

<style>
	svg,
	icoglyph-svg {
		opacity: 0.8;
		transition: opacity 0.4s;
		display: block;
		width: 100%;
		height: 100%;
	}

	svg:hover,
	icoglyph-svg:hover {
		opacity: 1;
	}
</style>
