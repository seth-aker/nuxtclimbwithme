<template>
  <div>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon name="lucide:home" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/friends" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon name="lucide:users" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/search" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon name="lucide:map-pinned" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/chat" custom>
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              <Icon name="lucide:send" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuItem>
        <NuxtLink v-slot="{ isActive, href, navigate }" to="/profile" custom>
          <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
            <Icon name="lucide:circle-user" />
          </NavigationMenuLink>
        </NuxtLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </div>
</template>

<script lang="ts" setup>

</script>
