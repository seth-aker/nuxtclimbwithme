<template>
  <div class="w-screen h-screen flex flex-col items-center">
    <LoadingSpinner color="white" :circumference="200" v-if="status === 'pending'" />
    <div v-else-if="status === 'success'">
      <div v-for="(user, index) in data" :key="index">
        {{ user.firstName }}{{ user.lastName }}
      </div>
    </div>
    <div v-else>
      <div>
        {{ error }}
      </div>
      <Button @click="refresh">Press to retry</Button>
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
const { error, data, status, refresh } = await useFetch('/api/users/nearby');



</script>
