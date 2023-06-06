<script lang="ts">
    // import "@fontsource/material-icons";
    // import "@fontsource/roboto/300.css";
    // import "@fontsource/roboto/400.css";
    // import "@fontsource/roboto/500.css";
    // import "@fontsource/roboto/700.css";
    // import "@fontsource/roboto-mono";
    import Head from "$root/Head.svelte";
    import Nav from "$components/Nav.svelte";
</script>
<Head />
<div class="flexy">
    <div class="page-container">
        <Nav />
        <slot />
    </div>
</div>
