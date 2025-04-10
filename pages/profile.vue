<template>
  <div class="w-screen h-screen flex flex-col items-center">
    <h1>Profile</h1>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
  middleware: 'page-transition'
})
</script>

<style>

</style>