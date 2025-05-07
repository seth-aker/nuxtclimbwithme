<template>
  <div class="flex flex-col items-center justify-center">
    <Avatar class="w-[50vw] h-[50vw]">
      <AvatarImage class="h-full w-full" :src="userStore.user.profilePicture!" alt="ProilePic" />
      <AvatarFallback class="h-full w-full">
        <Skeleton class="h-full w-full" />
      </AvatarFallback>
    </Avatar>
    <FormsRegistrationPage2 />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
})
const userStore = useUserStore();
</script>
