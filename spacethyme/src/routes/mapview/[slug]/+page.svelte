<script lang="ts">
    //import { toNodeReadable } from 'web-streams-node';
    
    import { onMount } from "svelte";
    import type { ComponentType } from "svelte";
    import { pageName } from '$root/lib/stores.js';
    import { Spinner, P } from 'flowbite-svelte';
    import { page } from "$app/stores";
	import type { MapData, MapDataPOI } from "$root/lib/types.js";

    let slug = $page.params.slug ?? "";
    pageName.set(`🗺️ ${slug}`);

    let Geomap: ComponentType;
    let error = false;
    let getPOIs: CallableFunction;
    let metaReady = false;
    let mapMeta: MapData;
    // Geomap component needs to be loaded asynchronously
    // to ensure the window object is available
    onMount(async () => {
        // get map metadata frin API
        fetch(`/api/maps/${slug}/meta`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async (response) => {
            if (response.status !== 200) {
                error = true;
                return;
            }
            mapMeta = await response.json();
            metaReady = true;
        }).catch((err) => {
            error = true;
            console.log(err);
        });
        // get map POIs
        getPOIs = async (callback: CallableFunction, callbackdone: CallableFunction) => {
            (await import('$lib/JSONStream.js')).default;
            // @ts-ignore
            let JSONStream = window.JSONStream;
            fetch(`/api/maps/${slug}/data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(async (response) => {
                if (response.status !== 200) {
                    error = true;
                    return;
                }
                //const nodeReadable = toNodeReadable(response.body);
                const parser = JSONStream.parse('*');
                const reader = response.body?.getReader()

                if (!reader) {
                    error = true;
                    console.log("No reader");
                    return;
                }
                parser.on('data', (data: MapDataPOI) => {
                    callback(data);
                });
                parser.on('end', () => {
                    console.log("end");
                    callbackdone();
                });
                while (true) {
                    
                    const { done, value } = await reader.read();
                    if (done) {
                        parser.end();
                        break;
                    } 
                    console.log("write");
                    parser.write(value);
                }
                
            }).catch((err) => {
                error = true;
                console.log(err);
            });
        }
        try {
            console.log("Loading Geomap");
            Geomap = (await import("$root/components/Geomap.svelte")).default;
        } catch (e) {
            error = true;
        }
    });
</script>
{#if error}
    <div class="page-content">
        <P>No map found.</P>
    </div>
{:else}
    {#if !metaReady }
    <div class="page-content">
        <p>Preparing map data...</p>
        <div style="display: flex; justify-content: center">
            <div class="text-center"><Spinner size=128 /></div>
        </div>
    </div>
    {:else}
        <svelte:component this={Geomap} dataFunc={getPOIs} metadata={mapMeta} />
    {/if}
{/if}

