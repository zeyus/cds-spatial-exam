<script lang="ts">
    import { onMount } from "svelte";
    import { P } from "flowbite-svelte";
    import type { ComponentType } from "svelte";
    import { pageName } from '$root/lib/stores.js'

    pageName.set("🗺️");
    let error = false;
    let Geomap: ComponentType;
    // Geomap component needs to be loaded asynchronously
    // to ensure the window object is available
    onMount(async () => {
        try {
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
    <svelte:component this={Geomap} />
{/if}

