<script lang="ts">
    import { pageName } from '$root/lib/stores.js';
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import { Card, Heading, P, Span, List, Li } from "flowbite-svelte";
    import { Check, Beaker, PaintBrush, ExclamationTriangle, ArrowsPointingIn, Photo } from 'svelte-heros-v2';
    import splitSiteName from '$lib/utils';
    pageName.set("");
    const siteNameParts = splitSiteName(PUBLIC_SITE_NAME);
</script>
<div class="page-content">
    <Heading class="py-8 px-0" tag="h1">Welcome to
        {siteNameParts.siteNamePrefix} <Span gradient>{siteNameParts.siteName}</Span> {siteNameParts.siteNameSuffix}</Heading>

    <P class="py-3">This is a live demonstration of {siteNameParts.siteNamePrefix} <Span gradient>{siteNameParts.siteName}</Span> {siteNameParts.siteNameSuffix}.</P>
    <Card class="text-left mt-3" size="lg">
        <Heading class="pb-3 m-0" tag="h4">Current Features</Heading>
        <List class="ml-4 space-y-1">
            <Li icon class="gap-3"><Check color="green" />You can visualize your data on a map</Li>
            <Li icon class="gap-3"><Check color="green" />You can import your data from a CSV file</Li>
            <Li icon class="gap-3"><Check color="green" />You can filter map data by date</Li>
        </List>
    </Card>
    <Card class="text-left mt-6" size="lg">
        <Heading class="pb-3 m-0" tag="h4">Future Features</Heading>
        <List class="ml-0 space-y-1" list="none">
            <Li><Beaker color="aqua" class="inline-block m-3" />Import JSON, GeoJSON, TSV, and more</Li>
            <Li><Beaker color="aqua" class="inline-block m-3" /><span>Customize display using radius/intensity mapping from data:</span>
                <List class="ml-8 space-y-1" list="none">
                    <Li><PaintBrush color="aqua" class="inline-block m-3" />Color</Li>
                    <Li><ArrowsPointingIn color="aqua" class="inline-block m-3" />Size</Li>
                    <Li><Photo color="aqua" class="inline-block m-3" />Shape</Li>
                    <Li><ExclamationTriangle color="aqua" class="inline-block m-3" />Icon</Li>
                </List>
            </Li>
            <Li><Beaker color="aqua" class="inline-block m-3" />Filtering by category</Li>
            <Li><Beaker color="aqua" class="inline-block m-3" />More informative popouts for map markers</Li>
        </List>
    </Card>
</div>