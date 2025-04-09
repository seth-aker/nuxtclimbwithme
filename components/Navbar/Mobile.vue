<template>
    <NavigationMenu class="w-screen max-w-screen">
      <NavigationMenuList class="flex justify-between w-full">
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon size="3rem" name="lucide:home" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/friends" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon size="3rem" name="lucide:users" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/search" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon size="3rem" name="lucide:search" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/messaging" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon size="3rem" name="lucide:send" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/profile" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon size="3rem" name="lucide:circle-user" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  
</template>

<script lang="ts" setup>
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';

</script>
