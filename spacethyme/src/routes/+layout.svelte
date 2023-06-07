<script lang="ts">
	import '../app.postcss';
	import Head from '$root/Head.svelte';
	import Nav from '$components/Nav.svelte';
	export let data;
	const availableMaps = data.props.maps.found;
</script>

<Head />
<Nav availableMaps={availableMaps} />
<slot />
