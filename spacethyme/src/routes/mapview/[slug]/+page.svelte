<script lang="ts">
    import { onMount } from "svelte";
    import type { ComponentType } from "svelte";
    import { pageName } from '$root/lib/stores.js';
    import CircularProgress from '@smui/circular-progress';
    import { page } from "$app/stores";
	import type { MapData, MapDataPOI } from "$lib/types.js";
    export let data;

    let slug = $page.params.slug ?? "";
    pageName.set(`Map View: ${slug}`);
    
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
            pageName.set(`Map View: ${meta.name}`);
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
        <CircularProgress
            class="my-four-colors"
            style="height: 128px; width: 128px;"
            indeterminate
            fourColor
        />
    </div>
</div>
{:else}
    <svelte:component this={Geomap} markers={data.streamed.pois} metadata={mapMeta} />
{/if}


