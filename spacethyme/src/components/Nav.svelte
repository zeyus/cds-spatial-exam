<script lang="ts">
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import { pageName } from '$root/lib/stores.js';
    import { onMount } from 'svelte';
    import { DarkMode } from 'flowbite-svelte';
    import { Map as MapIcon, HomeModern, CloudArrowUp, ArrowPath, CodeBracket } from 'svelte-heros-v2';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Span, Badge } from 'flowbite-svelte'
    import { page } from '$app/stores';
  
    import type { PageLoad } from './$types';
	  import type { MapData } from '$root/lib/types';
    let availableMaps: Promise<MapData[]> | MapData[] | undefined;

    export const load = (({ depends }) => {
      depends('data:foundmaps');
    }) satisfies PageLoad;


    onMount(() => {
       availableMaps = fetch('/api/maps', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json());
    });

    const siteNameParts = PUBLIC_SITE_NAME.split(" ");
    let siteNamePrefix = '';
    let siteNameSuffix = '';
    let siteName = PUBLIC_SITE_NAME;
    if (siteNameParts.length === 3) {
      siteNamePrefix = siteNameParts[0];
      siteName = siteNameParts[1];
      siteNameSuffix = siteNameParts[2];
    }
    // $: menuTitle = $pageName != "" ? `${$pageName}` : PUBLIC_SITE_NAME;
    // List of navigation items
    const navItems = [
      { label: "Home", href: "/", icon: HomeModern },
      { label: "View", icon: MapIcon, id: "map-view" },
      { label: "Import", href: "/import", icon: CloudArrowUp },
      // { label: "Danger Zone", href: "-", icon: "-" },
      { label: "Reset", href: "/reset", icon: ArrowPath },
      // { label: "External", href: "-", icon: "-" },
      { label: "GitHub", href: "https://github.com/zeyus/spacethyme", icon: CodeBracket}
    ];
    let defaultMap = { label: "Earthquakes", slug: "earthquakes" };
    let maps = [{ label: "Plain Map 🗺️", slug: "" }];
    $: if (availableMaps !== undefined) {
      if (availableMaps instanceof Promise) {
        availableMaps.then((found) => {
          found.forEach((map: MapData) => {
            maps.push({
              label: map.name,
              slug: map.slug
            });
          });
          if (maps.length ===1) {
            maps.push(defaultMap);
          }
        });
      } else {
        availableMaps.forEach((map: MapData) => {
          maps.push({
            label: map.name,
            slug: map.slug
          });
        });
        console.log(maps);
      }
    }

  </script>

  <Navbar navClass="'px-2 sm:px-4 py-0 w-full" let:hidden let:toggle>
    <NavBrand href="/">
      {siteNamePrefix}
      <Span gradient class="self-center text-xl font-semibold">
        {siteName}
      </Span>
      {siteNameSuffix}
      {#if $pageName !== ""}
      <Badge class="text-xl font-semibold ml-2" >
        <Span class="self-center whitespace-nowrap text-s dark:text-white">
          {$pageName}
        </Span>
      </Badge>
      {/if}
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
      {#each navItems as item}
        {#if item.href === undefined}
          <!-- this is a dropdown for maps -->
          <NavLi
            active={$page.route.id?.startsWith("/mapview")}
            id="{item.id}"
            class="cursor-pointer">
              <span class="whitespace-nowrap">
                <svelte:component this="{item.icon}" size=24 role="button" />
                {item.label}
              </span>
          </NavLi>
          <Dropdown frameClass="z-50" triggeredBy="#{item.id}">
            {#each maps as map}
              <DropdownItem href="/mapview/{map.slug}" active={$page.params.slug === map.slug}>
                {map.label}
              </DropdownItem>
            {/each}
          </Dropdown>

        {:else}
          <NavLi
            href="{item.href}"
            active={(item.href === "/" && $page.route.id === "/") || (item.href !== "/" && $page.route.id?.startsWith(item.href))}
          ><span class="whitespace-nowrap"><svelte:component this="{item.icon}" size=24 role="button" />{item.label}</span>
          </NavLi>
        {/if}
      {/each}
      <DarkMode initialTheme='dark' />
    </NavUl>
  </Navbar>
