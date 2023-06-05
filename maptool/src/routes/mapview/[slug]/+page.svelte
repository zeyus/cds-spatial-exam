<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "svelte";
    import { pageName } from '$lib/stores.js';
    export let data;
    pageName.set("Map View");
    
    let Geomap: ComponentType;
    // Geomap component needs to be loaded asynchronously
    // to ensure the window object is available
    onMount(async () => {
        Geomap = (await import("$root/components/Geomap.svelte")).default;
        console.log();
    });
    

    
</script>

<svelte:component this={Geomap} markers={data["props"]["mapData"]} />
