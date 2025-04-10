<template>
  <div class="w-screen h-screen flex justify-center">
    <h1>Friends</h1>
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