<script>
	import { goto } from '$app/navigation';
	import { colorSpaces } from '$lib/colorSpaces.js';

	let { current = 'hsl', onchange = () => {} } = $props();

	let open = $state(false);

	const entries = Object.entries(colorSpaces);
</script>

<div class="nav-wrapper">
	<button class="current-space" onclick={() => (open = !open)}>
		<span>{colorSpaces[current]?.name ?? current}</span>
	</button>

	<ul class="space-list" class:open>
		{#each entries as [key, space] (key)}
			{#if key !== current}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					class="space-item"
					onclick={() => {
						onchange(key);
						open = false;
					}}
				>
					{space.name}
				</li>
			{/if}
		{/each}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<li class="space-item" onclick={() => goto('/wavelength')}>Wavelength</li>
	</ul>
</div>

<style>
	.nav-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.current-space {
		background: var(--b1o3);
		padding: 4px 10px;
		border-radius: var(--br);
		cursor: pointer;
		user-select: none;
		transition: opacity 0.3s;
	}

	.current-space:hover {
		opacity: 0.8;
	}

	.current-space span {
		font-family: var(--typo1);
		font-size: 0.9rem;
	}

	.space-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		overflow: hidden;
		max-height: 0;
		opacity: 0;
		transition:
			max-height 0.4s ease,
			opacity 0.3s ease;
		pointer-events: none;
	}

	.space-list.open {
		max-height: 300px;
		opacity: 1;
		pointer-events: auto;
	}

	.space-item {
		background: var(--b1o3);
		padding: 4px 10px;
		border-radius: var(--br);
		cursor: pointer;
		user-select: none;
		opacity: 0.8;
		transition: opacity 0.3s;
		font-family: var(--typo1);
		font-size: 0.9rem;
	}

	.space-item:hover {
		opacity: 1;
	}
</style>
