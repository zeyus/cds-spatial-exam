<!-- <script lang="ts">
    import { pageName } from '$root/lib/stores.js'
    import { enhance } from '$app/forms';

    pageName.set("Import data");

    const authorizedExtensions = ['.csv', '.tsv', '.json', '.geojson'];
</script>

   
<form method="post" use:enhance enctype="multipart/form-data">
    <div class="group">
        <label for="file">Upload your file</label>
        <input
        type="file"
        id="file"
        name="fileToUpload"
        accept={authorizedExtensions.join(',')}
        required
        />
    </div>

    <button type="submit">Submit</button>
</form> -->

<script lang="ts">
    import { onMount } from "svelte";
    import { pageName } from '$root/lib/stores.js';
    export let data;
    pageName.set("Import data");
    
    onMount(async () => {
        console.log(data);
    });
</script>