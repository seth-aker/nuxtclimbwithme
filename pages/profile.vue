<template>
  <div class="w-screen h-screen flex flex-col items-center">
    <div class="bg-primary w-screen flex justify-between items-center">
      <h1 class="w-full self-start font-bold text-xl h-12">Profile</h1>
      <Popover>
        <PopoverTrigger as-child>
          <Button size="icon" variant="ghost">
            <Icon name="lucide:settings" size="1.5rem" class="text-background"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div class="flex flex-col">
            <Label>Color Mode</Label>
            <Select v-model="userStore.user.preferences.colorTheme">
              <SelectTrigger>
                <SelectValue>{{ `${userStore.user.preferences.colorTheme.substring(0,1).toUpperCase()}${userStore.user.preferences.colorTheme.substring(1)}` }}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div class="relative w-[33vw] h-[33vw]">
      <Avatar class="w-[33vw] h-[33vw]">
        <AvatarImage :src="userStore.user.profilePicture!" alt="ProilePic"/>
        <AvatarFallback>{{ `${userStore.user.firstName?.at(0)}${userStore.user.lastName?.at(0)}`  }}</AvatarFallback>
      </Avatar>
      <Button class="absolute bottom-0 right-0" size="icon" variant="outline">
        <Icon name="lucide:edit" size="1rem"/>
      </Button>
    </div>

    <h2 class="text-2xl font-bold p-2">{{ `${userStore.user.firstName} ${userStore.user.lastName}` }}</h2>
    <div class="flex flex-col items-start w-full ">
      <Card class="flex w-full rounded-none bg-accent">
        <div>
          <span class="font-bold">Email: </span><span>{{ userStore.user.email }}</span>
        </div>
        <div>
          <span class="font-bold">Phone Number: </span><span>{{ userStore.user.phoneNumber }}</span>
        </div>
        <div>
          <span class="font-bold">Address: </span><span>{{ userStore.user.location.address }}</span>
        </div>
        <div>
          <span class="font-bold">Bio: </span><span>{{ userStore.user.bio }}</span>
        </div>

      </Card>
    </div>

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

const userStore = useUserStore();
</script>

<style>

</style>