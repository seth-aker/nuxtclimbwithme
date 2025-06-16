<template>
  <div class="w-screen h-screen flex flex-col items-center">
    <LoadingSpinner v-if="status === 'pending'" />
    <div v-else-if="status === 'success'">
      {{ data?.toString() }}
    </div>
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
const { error, data, status } = await useFetch('/api/users/nearby');


</script>
