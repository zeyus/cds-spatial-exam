<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "svelte";
    import { pageName } from '$root/lib/stores.js';
    export let data;
    pageName.set(`Map View: ${data["mapdata"]["meta"]["slug"]}`);
    
    let Geomap: ComponentType;
    // Geomap component needs to be loaded asynchronously
    // to ensure the window object is available
    onMount(async () => {
        Geomap = (await import("$root/components/Geomap.svelte")).default;
    });
    

    
</script>

<svelte:component this={Geomap} markers={data["mapdata"]["pois"]} />
