<script>
	import ColorApp from '$lib/ColorApp.svelte';
	let { data } = $props();
</script>

<ColorApp
	initialColorSpace={data.colorSpace}
	initialHexColors={data.hexColors}
	initialCompareSizes={data.compareSizes}
/>
