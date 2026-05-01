<script>
	let {
		title = 'Color Matcher — Create and Share Color Combinations',
		description = 'Color Matcher is a free web app for creating color palettes. Share your creations through a unique URL. Supports HSL, HSV, CMYK, and RGB.'
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="color matcher, color palette, color combinations, color generator, design tool, color harmony, free tool"
	/>
	<meta name="author" content="L" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://www.color-matcher.app" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Color Matcher" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
