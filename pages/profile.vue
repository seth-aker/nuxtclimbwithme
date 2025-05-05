<template>
  <div class="w-screen h-screen flex flex-col items-center">
    <Sheet>
      <div class="bg-primary w-screen flex justify-between items-center">
        <h1 class="w-full self-start font-bold text-xl h-12">Profile</h1>
        <ProfileSettingsMenu />
      </div>
      <div class="relative w-[33vw] h-[33vw]">
        <Avatar class="w-[33vw] h-[33vw]">
          <AvatarImage :src="userStore.user.profilePicture!" alt="ProilePic"/>
          <AvatarFallback>{{ `${userStore.user.firstName?.at(0)}${userStore.user.lastName?.at(0)}`  }}</AvatarFallback>
        </Avatar>
        <SheetTrigger as-child @click="sheetNameOpen = 'page2'">
          <Button class="absolute bottom-0 right-0" size="icon" variant="outline">
            <Icon name="lucide:edit" size="1rem"/>
          </Button>
        </SheetTrigger>
      </div>

      <h2 class="text-2xl font-bold p-2">{{ `${userStore.user.firstName} ${userStore.user.lastName}` }}</h2>
      <div class="flex flex-col items-start w-full ">
        <Card class="flex w-full rounded-none bg-accent relative pt-0">
          <SheetTrigger as-child @click="sheetNameOpen = 'page1'">
            <Button class="self-end absolute " size="icon" variant="outline">
              <Icon name="lucide:edit" size="1rem"/>
            </Button>
          </SheetTrigger>
          <div class="pt-2">
            <span class="font-bold">Email: </span><span>{{ userStore.user.email }}</span>
          </div>
          <div>
            <span class="font-bold">Phone Number: </span><span>{{ userStore.user.phoneNumber }}</span>
          </div>
          <div>
            <span class="font-bold">Address: </span><span>{{ userStore.user.location?.address }}</span>
          </div>
          <div>
            <span class="font-bold">Bio: </span><span>{{ userStore.user.bio }}</span>
          </div>
        </Card>
      </div>
      <SheetContent side="bottom" class="h-10/12 py-12">
        <FormsRegistrationPage1 v-if="sheetNameOpen === 'page1'" />
        <FormsRegistrationPage2 v-else-if="sheetNameOpen === 'page2'" />
        <FormsRegistrationPage3 v-else-if="sheetNameOpen === 'page3'" />
        <FormsRegistrationPage4 v-else-if="sheetNameOpen === 'page4'" />
        <FormsRegistrationPage5 v-else-if="sheetNameOpen === 'page5'" />
       </SheetContent>
    </Sheet>
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

const sheetNameOpen = ref('');
</script>

<style>

</style>