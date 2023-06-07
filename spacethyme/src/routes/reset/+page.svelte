<script lang="ts">
    import { Spinner, P, Heading, Button } from 'flowbite-svelte';
    import { pageName } from '$root/lib/stores.js';
	import { invalidate } from '$app/navigation';
    import { enhance } from '$app/forms';
    
    pageName.set("Reset Data");
    let done = false;
    let started = false;
    // data.streamed.imported.then(() => {
    //     done = true;
    // });
    $: if (done) {
        invalidate('data:foundmaps');
        invalidate('/mapview');
    }
</script>


<div class="page-content">
{#if !done}
    {#if !started}
        <form
        name="newdds"
        method="post"
        use:enhance={() => {
            started = true;
            return async ({ update }) => {
                await update();
                started = false;
                done = true;
            };
        }}
        enctype="multipart/form-data"
        action="/reset?/go"><Button color="alternative" type="submit" class="mt-4">Reset</Button></form>  
    {:else}
        <Heading tag="h3">Resetting Data</Heading>
        <P>All map demos are being reset to their initial state.</P>
        <div class="text-center"><Spinner size=64 /></div>
    {/if}
{:else}
<Heading tag="h3">Data Reset!</Heading>
    <P>You're good to go. 😄</P>
{/if}

<P>Click <a href="/mapview">here</a> to go back to the map view.</P>
<P>Click <a href="/import">here</a> to import new data.</P>
</div>