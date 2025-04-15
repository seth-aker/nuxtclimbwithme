<template>
  <div class="flex flex-col items-center justify-center">
    <Avatar class="h-1/2 w-1/2">
      <AvatarImage :src="userStore.user.profilePicture!" alt="ProilePic"/>
      <AvatarFallback>{{ `${userStore.user.firstName?.at(0)}${userStore.user.lastName?.at(0)}`  }}</AvatarFallback>
    </Avatar>
    <FormsUserRegistration2 />
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
</script>
