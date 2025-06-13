<template>
  <div class="overflow-x-hidden">
    <NuxtLayout>
      <AppNav />
      <NuxtPage class="pb-12" />
      <Toaster />
    </NuxtLayout>
  </div>
</template>

<script setup lang='ts'>
const userStore = useUserStore()
const colorMode = useColorMode()
watchEffect(() => {
  colorMode.preference = userStore.user.preferences.colorTheme
})
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}
.slide-left-enter-from {

  transform: translate(100vw, 0);
}
.slide-left-leave-to {

  transform: translate(-100vw, 0);
}
.slide-right-enter-from {

  transform: translate(-100vw, 0);
}
.slide-right-leave-to {
 
  transform: translate(100vw, 0);
}
</style>