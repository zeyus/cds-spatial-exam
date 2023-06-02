<script lang="ts">
    import Head from "../Head.svelte";
    import { onMount } from "svelte";
    import type { ComponentType } from "svelte";

    let Geomap: ComponentType;
    // Geomap component needs to be loaded asynchronously
    // to ensure the window object is available
    onMount(async () => {
        Geomap = (await import("../components/Geomap.svelte")).default;
    });
</script>
<Head />
<svelte:component this={Geomap} />

