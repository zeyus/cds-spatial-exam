<script lang="ts">
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import { pageName } from '$root/lib/stores.js'
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import IconButton, { Icon } from '@smui/icon-button';
    import Select, { Option } from '@smui/select';
    import { page } from '$app/stores';
    import Drawer, {
      Content,
      Header,
      Title as DrawerTitle,
      Subtitle,
    } from '@smui/drawer';
    import {
      goto,
    } from '$app/navigation';
    import List, { Item, Text, Separator, Subheader } from '@smui/list';

    $: menuTitle = $pageName != "" ? `${$pageName}` : PUBLIC_SITE_NAME;
    // List of navigation items
    const navItems = [
      { label: "Home", href: "/", icon: "home" },
      { label: "View", href: "/mapview", icon: "map" },
      { label: "Import", href: "/import", icon: "cloud_upload" },
      { label: "Danger Zone", href: "-", icon: "-" },
      { label: "Reset", href: "/reset", icon: "refresh" },
      { label: "External", href: "-", icon: "-" },
      { label: "GitHub", href: "https://github.com/zeyus/cds-spatial-exam", icon: "code"}
    ];
  
    let maps = [
      { label: "Earthquakes", slug: "earthquakes" },
      { label: "Something Else", slug: "something-else" },
    ];
    let open = false;
  </script>
  
  <Drawer variant="dismissible" bind:open>
    <Header>
      <IconButton class="material-icons with-space-after" on:click={() => (open = false)}>close</IconButton>
      <DrawerTitle href="/">{PUBLIC_SITE_NAME}</DrawerTitle>
      <Subtitle>Visualize your data.</Subtitle>
    </Header>
    <Content>
      <List>
        {#each navItems as item}
          {#if item.href === "-"}
            <Separator />
            <Subheader tag="h6">{item.label}</Subheader>
          {:else}
            <Item
              on:click={() => (open = false)}
              href="{item.href}"
              activated={(item.href === "/" && $page.route.id === "/") || (item.href !== "/" && $page.route.id?.startsWith(item.href))}
            >
              <span class="icon-gap"><Icon class="material-icons">{item.icon}</Icon></span>
              <Text>{item.label}</Text>
            </Item>
          {/if}
        {/each}
      </List>
    </Content>
  </Drawer>
<TopAppBar
  variant="static"
  dense
  color='secondary'
>
  <Row>
    <Section align="start">
      <IconButton class="material-icons" on:click={() => (open = !open)}>menu</IconButton>
    </Section>
    <Section>
      <Title>{menuTitle}</Title>
    </Section>
    {#if $page.route.id?.startsWith("/mapview")}
      <Section align="end" toolbar>
        <Select label="Load Map" on:SMUISelect:change={(e) => goto(`/mapview/${e.detail.value}`)}>
          <Option value={null} />
          {#each maps as map}
            <Option value={map.slug}>{map.label}</Option>
          {/each}
        </Select>
        <IconButton class="material-icons" aria-label="GitHub" href="https://github.com/zeyus/cds-spatial-exam">code</IconButton>
      </Section>
    {/if}
  </Row>
</TopAppBar>
<style>
  .icon-gap {
    margin-right: 0.5rem;
  }
</style>