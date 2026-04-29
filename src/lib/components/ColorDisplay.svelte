<script>
	let { hex = '#000000' } = $props();
</script>

<div id="color-display" style="background: {hex};"></div>

<style>
	#color-display {
		height: 100vh;
		width: 100vw;
		transition: background 0.2s;
	}
</style>
