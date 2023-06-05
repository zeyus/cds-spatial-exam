<script lang="ts">
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import { pageName } from '$lib/stores.js'
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import Select, { Option } from '@smui/select';

    const prominent = false;
    const dense = true;
    $: menuTitle = $pageName ? `${$pageName}` : PUBLIC_SITE_NAME;
  
    // List of navigation items
    const navItems = [
      { label: PUBLIC_SITE_NAME, href: "/" },
      { label: "Map", href: "/mapview" },
      { label: "Import", href: "/import" },
      { label: "Item 3", href: "#" },
      { label: "Item 4", href: "#" },
      { label: "Item 5", href: "#" },
      { label: "Item 6", href: "#" },
      { label: "Item 7", href: "#" }
    ];
  
    let fruits = ['Apple', 'Orange', 'Banana', 'Mango'];
  </script>
  

  <TopAppBar
      variant="static"
      {prominent}
      {dense}
      color='primary'
    >
      <Row>
        <Section>
          <IconButton class="material-icons">menu</IconButton>
          <Title>{menuTitle}</Title>
          <Select label="Map Example">
            {#each fruits as fruit}
              <Option value={fruit}>{fruit}</Option>
            {/each}
          </Select>
        </Section>
        <Section align="end" toolbar>
          <IconButton class="material-icons" aria-label="GitHub" href="https://github.com/zeyus/cds-spatial-exam"
            >code</IconButton
          >
        </Section>
      </Row>
    </TopAppBar>