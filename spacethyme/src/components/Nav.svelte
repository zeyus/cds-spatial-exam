<script lang="ts">
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    // import { pageName } from '$root/lib/stores.js'
    import { DarkMode } from 'flowbite-svelte';
    import { Map, HomeModern, CloudArrowUp, ArrowPath, CodeBracket } from 'svelte-heros-v2';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
    import { sineIn } from 'svelte/easing';
    import { page } from '$app/stores';

    // $: menuTitle = $pageName != "" ? `${$pageName}` : PUBLIC_SITE_NAME;
    // List of navigation items
    const navItems = [
      { label: "Home", href: "/", icon: HomeModern },
      { label: "View", href: "/mapview", icon: Map },
      { label: "Import", href: "/import", icon: CloudArrowUp },
      { label: "Danger Zone", href: "-", icon: "-" },
      { label: "Reset", href: "/reset", icon: ArrowPath },
      { label: "External", href: "-", icon: "-" },
      { label: "GitHub", href: "https://github.com/zeyus/cds-spatial-exam", icon: CodeBracket}
    ];
  
    let maps = [
      { label: "Earthquakes", slug: "earthquakes" },
      { label: "Something Else", slug: "something-else" },
    ];

    let transitionParams = {
      x: -320,
      duration: 200,
      easing: sineIn
    };
  </script>

  <Navbar navClass="'px-2 sm:px-4 py-0 w-full" let:hidden let:toggle>
    <NavBrand href="/">
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        {PUBLIC_SITE_NAME}
      </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
      {#each navItems as item}
        {#if item.href === "-"}
          <!-- <Separator />
          <Subheader tag="h6">{item.label}</Subheader> -->
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
