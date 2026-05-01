<script>
	import ColorApp from '$lib/ColorApp.svelte';
	import Meta from '$lib/components/Meta.svelte';
	let { data } = $props();
</script>

<Meta canonical="https://color-matcher.app" />
<ColorApp
	initialColorSpace={data.colorSpace}
	initialHexColors={data.hexColors}
	initialCompareSizes={data.compareSizes}
/>
