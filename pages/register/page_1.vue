<template>
  <div class="flex flex-col items-center justify-center">
    <h1>Welcome to Climb with Me!</h1>
    <div>We just need a little information to get you started.</div>
    <FormsRegistrationPage1 />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
})

</script>

<style></style>
