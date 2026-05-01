<script>
	let {
		title = 'Color Matcher — Create and Share Color Combinations',
		description = 'Color Matcher is a free web app for creating color palettes. Share your creations through a unique URL. Supports HSL, HSV, CMYK, and RGB.',
		canonical = 'https://color-matcher.app',
		robots = undefined
	} = $props();

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Color Matcher',
		url: 'https://color-matcher.app',
		description:
			'A free web app for creating and sharing color palettes. Supports HSL, HSV, CMYK, and RGB.',
		applicationCategory: 'DesignApplication',
		operatingSystem: 'Any',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="color matcher, color palette, color combinations, color generator, design tool, color harmony, free tool"
	/>
	<meta name="author" content="L" />
	{#if robots}
		<meta name="robots" content={robots} />
	{/if}
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Color Matcher" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
