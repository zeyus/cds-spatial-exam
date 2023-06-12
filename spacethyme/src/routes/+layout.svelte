<script lang="ts">
	import '../app.postcss';
	import type { PageLoad } from './$types';
	import Head from '$components/Head.svelte';
	import Nav from '$components/Nav.svelte';

    export const load = (({ depends }) => {
      depends('data:foundmaps');
    }) satisfies PageLoad;
</script>

<Head />
<Nav />
<slot />
