<script lang="ts">
    import { List, Li, Spinner, A, P, Heading, Button } from 'flowbite-svelte';
    import { pageName } from '$root/lib/stores.js';
	import { invalidate } from '$app/navigation';
    
    pageName.set("Reset Data");
    let done = false;
    let started = false;
    let error = false;
    let message = '';

    const reset = async () => {
        started = true;
        error = false;
        fetch('/api/maps/reset', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async (response) => {
            started = false;
            done = true;
            invalidate('data:foundmaps');
            if (response.status !== 200) {
                error = true;
                message = response.statusText;
                return;
            }
            const resetStatus = await response.json();
            message = resetStatus.message;
            if (resetStatus.error) {
                error = true;
            }
            
        }).catch((err) => {
            invalidate('data:foundmaps');
            started = false;
            done = true;
            error = true;
            message = err.message;
            console.log(err);
        });
        
    }
</script>


<div class="page-content">
{#if !done}
    {#if !started}
        <Heading tag="h3" class="py-4">Reset Data</Heading>
        <P>Clicking the button below will do the following:</P>
        <List tag="ul" class="space-y-1 py-4">
            <Li class="dark:text-white px-4">Delete any custom uploaded map data.</Li>
            <Li class="dark:text-white px-4">Delete any uploaded CSV.</Li>
            <Li class="dark:text-white px-4">Recreate the default Earthquakes map.</Li>
        </List>
        <Button color="primary" type="submit" class="mt-4" on:click={reset}>Reset</Button>
    {:else}
        <Heading tag="h3" class="py-4">Resetting Data</Heading>
        <P>All map demos are being reset to their initial state.</P>
        <div class="text-center"><Spinner size=64 /></div>
    {/if}
{:else}
    {#if error}
        <Heading tag="h3" class="py-4">Error!</Heading>
        <P color="red">{message}</P>
    {:else}
        <Heading tag="h3" class="py-4">Data Reset!</Heading>
        <P>You're good to go. 😄</P>
    {/if}
{/if}

<P class="pt-4">Click <A href="/mapview">here</A> to go back to the map view.</P>
<P>Click <A href="/import">here</A> to import new data.</P>
</div>