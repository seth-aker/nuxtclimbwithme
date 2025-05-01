<template>
   <div class="w-screen h-screen flex flex-col items-center">
    {{ `Lat: ${coords.latitude}` }}
    {{ `Long: ${coords.longitude}` }}
  </div>
</template>

<script lang="ts" setup>
import { useGeolocation } from '@vueuse/core';
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
  middleware: 'page-transition'
})
const {coords, locatedAt, error, pause, resume} = useGeolocation();
const userStore = useUserStore();

watch(locatedAt, async () => {
  if(error.value) {
    userStore.user.location.geoJSON = undefined;
  } else if(coords.value.latitude && coords.value.longitude) {
    if(!userStore.user.location) {
      userStore.user.location = {geoJSON: undefined, locatedAt: locatedAt.value, address: undefined }
    }
    userStore.user.location.geoJSON = {type: "Point", coordinates: [coords.value.longitude, coords.value.latitude]};
    userStore.user.location.locatedAt = locatedAt.value
  }
  await userStore.updateUser({location: userStore.user.location});
}, {once: true})
</script>
