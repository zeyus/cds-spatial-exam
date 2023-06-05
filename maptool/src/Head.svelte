<script lang="ts">
    import { pageName } from '$lib/stores.js'
    import { onMount } from "svelte";
    import { PUBLIC_SITE_NAME } from '$env/static/public';

    const siteTitle = PUBLIC_SITE_NAME;
    let mounted = false;
    $: title = $pageName ? `${$pageName} | ${siteTitle}` : siteTitle;

    onMount(() => {
      mounted = true;
    });

    $: {
      if (mounted) {
        document.title = title;
      }
    }
  </script>
  
  <svelte:head>
    <title>{title}</title>
  </svelte:head>