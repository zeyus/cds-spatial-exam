<script lang="ts">
    import { pageName } from '$root/lib/stores.js';
    import { enhance } from '$app/forms';
    import { P, Input, Fileupload, Label, Helper, Heading, Button, Select, Textarea } from 'flowbite-svelte'
    export let data;
	export let form;
    let columns: Object[] = [];
    let creating = false;

    // export let data;
    pageName.set("Import data");
    const authorizedExtensions = ['.csv']; // ['.csv', '.tsv', '.json', '.geojson'];
    const requiredCols = {
        'lat': 'Latitude',
        'lng': 'Longitude',
    }
    
    const optionalCols = {
        label: 'Label',
        description: 'Description (per entry)',
        date: 'Date',
        category: 'Category',
        radius: 'Radius',
        intensity: 'Intensity',
    }
    $: if (data && data.state) {
        if (data.state.csvHeader) {
            data.state.csvHeader.forEach((col: string, i: number) => {
                columns.push({name: col, index: i});
            });
        }

        console.log("data", data);
    }
    // $: if (form && form.body && form.body.csvHeader) {
    //     console.log("form", data);
    //     if (form.body.csvHeader) {
    //         form.body.csvHeader.forEach((col: string, i: number) => {
    //             columns.push({name: col, index: i});
    //         });
    //     }
    //     if (form.body.filename) {
    //         filename = form.body.filename;
    //     }
    //     if (form.body.dsname) {
    //         dsname = form.body.dsname;
    //     }
    //     if (form.body.slug) {
    //         slug = form.body.slug;
    //     }
    // }


</script>
<div class="page-content">
    {#if (columns.length === 0)}
        <Heading class="py-4" tag="h6">Ready to visualize your data?</Heading>
        <form
            name="newdds"
            method="post"
            use:enhance={() => {
                creating = true;
    
                return async ({ update }) => {
                    await update();
                    creating = false;
                };
            }}
            enctype="multipart/form-data"
            action="?/upload">
            {#if form?.error}
                <P color="text-red-700 dark:text-red-500" class="my-5 px-4 error">Error: {form.message}</P>
            {/if}
            <div class='mb-6'>
                <Label for='dsname' class='block mb-2'>Give your dataset a name</Label>
                <Input disabled={creating} id='dsname' name="dsname" value={form?.dsname ?? ''} placeholder="Dataset Name" required />
            </div>
            
            <Label for="dssrc" class="pb-2">Upload file</Label>
            <Fileupload disabled={creating} accept={authorizedExtensions.join(',')} id="dssrc" class="mb-2" name="dssrc" required />
            <Helper>CSV file.</Helper>
            <div class="text-right"><Button type="submit" class="mt-4">Next</Button></div>
        </form>
    {:else}
        <Heading class="py-4" tag="h6">Just a couple more things...</Heading>
        <P class="pb-4">We need to know which columns in your dataset correspond to which data types.</P>
        <form
            name="dsconfig"
            method="post"
            use:enhance={() => {
                creating = true;
    
                return async ({ update }) => {
                    await update();
                    creating = false;
                };
            }}
            action="?/configure">
            {#if form?.error}
                <P color="text-red-700 dark:text-red-500" class="my-5 px-4 error">Error: {form.message}</P>
            {/if}
            <P class="pb-4 text-center" weight="bold">These columns are required</P>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                {#each Object.entries(requiredCols) as [key, value]}
                    <div>
                        <Label for={key} class='block mb-2'>{value}</Label>
                        <Select disabled={creating} id={key} name={key} required>
                            {#each columns as col}
                                <option value={col.index}>{col.name}</option>
                            {/each}
                        </Select>
                    </div>
                {/each}
            </div>
            <P class="py-4 text-center" weight="bold">These columns are optional</P>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                {#each Object.entries(optionalCols) as [key, value]}
                    <div>
                        <Label for={key} class='block mb-2'>{value}</Label>
                        <Select disabled={creating} id={key} name={key}>
                            <option value={-1}>None</option>
                            {#each columns as col}
                                <option value={col.index}>{col.name}</option>
                            {/each}
                        </Select>
                    </div>
                {/each}
            </div>
            <Label for="dsdesc" class="pb-2">Give your dataset a brief description 😊</Label>
            <Textarea disabled={creating} id="dsdesc" name="dsdesc" placeholder="Description" />
            <div class="text-right"><Button type="submit" class="mt-4">Next</Button></div>
        </form>
    {/if}
</div>

