<script lang="ts">
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import { pageName } from '$root/lib/stores.js'
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import Select, { Option } from '@smui/select';
    import Button, { Group, Label } from '@smui/button';
    import { page } from '$app/stores';

    $: menuTitle = $pageName != "" ? `${$pageName}` : PUBLIC_SITE_NAME;
    // List of navigation items
    const navItems = [
      { label: "View", href: "/mapview" },
      { label: "Import", href: "/import" },
    ];

    console.log($page.route.id)
  
    let fruits = ['Apple', 'Orange', 'Banana', 'Mango'];
  </script>
  

<TopAppBar
  variant="static"
  dense
  color='secondary'
>
  <Row>
    <Section align="start">
      {#if $page.route.id === "/"}
        <IconButton class="material-icons" href="/" color="primary" style="background-color: var(--mdc-theme-primary, #ff3e00); color: #fff;">home</IconButton>
      {:else}
        <IconButton class="material-icons" href="/" color="secondary">home</IconButton>
      {/if}
      <Group>
        {#each navItems as item}
          {#if $page.route.id?.startsWith(item.href)}
            <Button href={item.href} variant="unelevated">
              {item.label}
            </Button>
          {:else}
            <Button href={item.href} variant="unelevated" color="secondary">
              {item.label}
            </Button>
          {/if}
        {/each}
      </Group>
    </Section>
    <Section>
      <Title>{menuTitle}</Title>
    </Section>
    <Section align="end" toolbar>
      <Select label="Load Map">
        {#each fruits as fruit}
          <Option value={fruit}>{fruit}</Option>
        {/each}
      </Select>
      <IconButton class="material-icons" aria-label="GitHub" href="https://github.com/zeyus/cds-spatial-exam">code</IconButton>
    </Section>
  </Row>
</TopAppBar>