<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "svelte";
    import { pageName } from '$root/lib/stores.js';
    import { Spinner } from 'flowbite-svelte';
    import { page } from "$app/stores";
	import type { MapData, MapDataPOI } from "$lib/types.js";
    export let data;

    let slug = $page.params.slug ?? "";
    pageName.set(`🗺️ ${slug}`);
    
    let Geomap: ComponentType;
    // Geomap component needs to be loaded asynchronously
    // to ensure the window object is available
    onMount(async () => {
        Geomap = (await import("$root/components/Geomap.svelte")).default;
    });
    let metaReady = false;
    let mapMeta: MapData
    // let mapMarkers: MapDataPOI[]

    data.streamed.meta.then((meta) => {
        metaReady = true;
        mapMeta = meta;
        if (meta.name) {
            pageName.set(`🗺️ ${meta.name}`);
        }
    });
    // data.streamed.pois.then((pois) => {
    //     markersReady = true;
    //     mapMarkers = pois;
    // });
    

    
</script>

{#if !metaReady }
<div class="page-content">
    <p>Preparing map data...</p>
    <div style="display: flex; justify-content: center">
        <div class="text-center"><Spinner size=128 /></div>
    </div>
</div>
{:else}
    <svelte:component this={Geomap} markers={data.streamed.pois} metadata={mapMeta} />
{/if}


