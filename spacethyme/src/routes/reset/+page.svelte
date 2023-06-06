<script lang="ts">
    import { Spinner } from 'flowbite-svelte';
    import { pageName } from '$root/lib/stores.js';
    export let data;
    pageName.set("Reset Data");
    let done = false;
    data.streamed.imported.then(() => {
        done = true;
    });
</script>


<div class="page-content">
{#if !done}
    <h1>Resetting Data</h1>
    <p>All map demos are being reset to their initial state.</p>
        <div class="text-center"><Spinner size=128 /></div>
{:else}
    <h1>Data Reset!</h1>
    <p>You're good to go. 😄</p>
{/if}

<p>Click <a href="/mapview">here</a> to go back to the map view.</p>
<p>Click <a href="/import">here</a> to import new data.</p>
</div>