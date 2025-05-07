<template>
  <div class="w-screen h-screen flex flex-col items-center">
    <Sheet v-model:open="sheetOpen">
      <div class="bg-primary w-screen flex justify-between items-center">
        <h1 class="w-full self-start font-bold text-xl h-12">Profile</h1>
        <ProfileSettingsMenu />
      </div>
      <div class="relative w-[33vw] h-[33vw]">
        <Avatar class="w-[33vw] h-[33vw]">
          <AvatarImage :src="userStore.user.profilePicture!" alt="ProilePic" />
          <AvatarFallback>{{ `${userStore.user.firstName?.at(0)}${userStore.user.lastName?.at(0)}` }}</AvatarFallback>
        </Avatar>
        <SheetTrigger as-child>
          <Button @click="editAvatar" class="absolute bottom-0 right-0" size="icon" variant="outline">
            <Icon name="lucide:edit" size="1rem" />
          </Button>
        </SheetTrigger>
      </div>

      <h2 class="text-2xl font-bold p-2">{{ `${userStore.user.firstName} ${userStore.user.lastName}` }}</h2>
      <div class="flex flex-col items-start w-full ">
        <Card class="flex w-full rounded-none bg-accent relative pt-0">
          <SheetTrigger as-child>
            <Button @click="editUser" class="self-end absolute " size="icon" variant="outline">
              <Icon name="lucide:edit" size="1rem" />
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
        <FormsTemplate class="h-screen overflow-scroll" :fields="formFieldsEditing" :submit-factory="submitFactory"
          :loading="loading"></FormsTemplate>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { FormFieldData, THandleSubmit } from '~/components/forms/FormFieldData';
import FileInput from '~/components/ui/input/FileInput.vue';
import * as z from 'zod';
import { Input } from '~/components/ui/input';
import { states } from '~/assets/lists/states';
import { Select } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
  middleware: 'page-transition'
})

const loading = ref(false);
const sheetOpen = ref(false);
const userStore = useUserStore();
const fiveMbSizeLimit = 5 * 1024 * 1024;

const formFieldsEditing = ref<FormFieldData[]>([]);

const submitFactory = (handleSubmit: THandleSubmit) => {
  return handleSubmit(async (values) => {
    loading.value = true;
    for (const [key, value] of Object.entries(values)) {
      if (key === 'profilePicture') {
        const formData = new FormData();
        formData.append('profile:image', value as any)
        await userStore.updateProfilePicture(formData);
      }
      if (key.includes('address') || key === 'city' || key === 'state' || key === 'zip') {
        userStore.user.location.address = `${values.addressLine1}${values.addressLine2 ? `, ${values.addressLine2}` : ''}, ${values.city ?? ''}, ${values.state ?? ''} ${values.zip ?? ''}`
      }
      else {
        (userStore.user as any)[key] = value
      }
      await userStore.updateUser(userStore.user);
    }
    if (userStore.error) {
      toast.error(userStore.error)
    }
    loading.value = false
    sheetOpen.value = false
  });
};

const editAvatar = () => {
  formFieldsEditing.value = [{
    name: 'profilePicture',
    label: 'Profile Picture',
    zodSchema: z.instanceof(File)
      .refine((file) => ["image/png", "image/jpeg", "image/jpg",].includes(file.type), 'Invalid file type.')
      .refine((file) => file.size <= fiveMbSizeLimit, "File should not exceed 5MB")
      .optional(),
    component: FileInput,
    componentProps: {
      type: 'file'
    }
  }]
  sheetOpen.value = true
}
const editUser = () => {
  formFieldsEditing.value = [
    {
      name: 'firstName',
      label: 'First Name',
      initialValue: userStore.user.firstName,
      zodSchema: z.string(),
      placeholder: 'Your first name...',
      component: Input
    },
    {
      name: 'lastName',
      label: 'Last Name',
      initialValue: userStore.user.lastName,
      zodSchema: z.string(),
      placeholder: 'Your last name...',
      component: Input
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      initialValue: userStore.user.phoneNumber,
      zodSchema: z.string().optional(),
      placeholder: '(###) ###-####',
      component: Input
    },
    {
      name: 'addressLine1',
      label: 'Address Line 1',
      zodSchema: z.string().optional(),
      component: Input
    },
    {
      name: 'adressLine2',
      label: 'Address Line 2',
      placeholder: 'Apt/Unit #',
      component: Input,
      zodSchema: z.string().optional()
    },
    {
      name: 'city',
      label: 'City',
      zodSchema: z.string().optional(),
      component: Input,
    },
    {
      name: 'state',
      label: 'State',
      initialValue: '',
      zodSchema: z.string().optional(),
      placeholder: "State: ",
      component: Select,
      componentProps: {
        selectOptions: states
      }
    },
    {
      name: 'zip',
      label: 'Zip Code',
      placeholder: '#####',
      zodSchema: z.string().regex(/^[0-9]{5}$/gm, "Zip code must be 5 numerical digits long").optional(),
      component: Input
    },
    {
      name: 'bio',
      label: 'Bio',
      placeholder: 'Tell the world about yourself',
      zodSchema: z.string().optional(),
      component: Textarea,
      componentProps: {
        maxlength: '500',
      }
    }
  ]
  sheetOpen.value = true
}
</script>
