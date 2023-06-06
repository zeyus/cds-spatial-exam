<script lang="ts">
    import { pageName } from '$root/lib/stores.js';
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import { Card, Heading, P } from "flowbite-svelte";

    pageName.set("");
</script>
<div class="page-content">
    <Heading class="p-8" tag="h1">Welcome to {PUBLIC_SITE_NAME}</Heading>

    <P>This is a live demonstration of {PUBLIC_SITE_NAME}.</P>
    <Card class="text-center" size="lg" padding='xl'>
        <Heading class="p-1" tag="h4">Features</Heading>
        <P>You can visualize your data on a map!</P>
    </Card>
</div>