<script>
	import '../app.css';
	const baseUrl = import.meta.env.VITE_FRONTEND_URL
</script>

<svelte:head>
	<meta name="title" content="Autoboop">
	<meta name="description" content="Weird site that puts a cat's face under your pointer">
	<meta property="og:type" content="website">
	<meta property="og:url" content={baseUrl}>
	<meta property="og:title" content="Autoboop">
	<meta property="og:description" content="Weird site that puts a cat's face under your pointer">
	<meta property="og:image" content={`${baseUrl}/boop.png`}>
	<meta property="twitter:card" content="summary_large_image">
	<meta property="twitter:url" content={baseUrl}>
	<meta property="twitter:title" content="Autoboop">
	<meta property="twitter:description" content="Weird site that puts a cat's face under your pointer">
	<meta property="twitter:image" content={`${baseUrl}/boop.png`}>
</svelte:head>

<slot />
