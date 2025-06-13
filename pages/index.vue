<template>
   <div class="w-screen h-screen flex flex-col items-center">
      Lat: {{ user.location.geoJSON?.coordinates[1] }}
      Long: {{ user.location.geoJSON?.coordinates[0] }}
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/userStore';

definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
  middleware: 'page-transition'
})
const { user } = useUserStore();
useUpdateUserLocation();
</script>
