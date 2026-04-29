<script>
	let { hex = '#000000', size = 32.5 } = $props();
</script>

<div class="compare-bar" style="background: {hex}; height: {size}%;"></div>

<style>
	.compare-bar {
		border-radius: var(--br);
		width: 100%;
		transition:
			background 0.2s,
			height 0.3s;
	}
</style>
