<script>
    import { pageName } from '$lib/stores.js'
  
    $: title = $pageName ? `${$pageName} | 🗺️ maptool 🌍` : '🗺️ maptool 🌍'
  
    $: {
      document.title = title
    }
  </script>
  
  <svelte:head>
    <title>{title}</title>
  </svelte:head>