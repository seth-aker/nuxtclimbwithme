<template>
  <div class="flex flex-col items-center justify-center">
    <Avatar class="w-[50vw] h-[50vw]">
      <AvatarImage class="h-full w-full" :src="userStore.user.profilePicture!" alt="ProilePic" />
      <AvatarFallback class="h-full w-full">
        <Skeleton class="h-full w-full" />
      </AvatarFallback>
    </Avatar>
    <FormsTemplate :fields="formFields" :submit-factory="submitFactory" :loading="loading">
      <template #submitButton="{ onSubmit, loading }">
        <Button v-if="!loading" @click.prevent="onSubmit">Submit</Button>
        <Button v-else disabled>
          <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
        </Button>
        <Button variant="outline" @click.prevent="navigateTo('/register/page_2')">Skip</Button>
      </template>
    </FormsTemplate>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
})
import { z } from 'zod';
import type { FormFieldData, THandleSubmit } from '../../components/forms/FormFieldData';
import Textarea from '~/components/ui/textarea/Textarea.vue';
import { toast } from 'vue-sonner';
import FileInput from '~/components/ui/input/FileInput.vue';
const userStore = useUserStore();
const fiveMbSizeLimit = 5 * 1024 * 1024; // 5MB
const loading = ref(false);
const formFields: FormFieldData[] = [
  {
    name: 'profilePicture',
    label: 'Profile Picture',
    zodSchema: z.instanceof(File)
      .refine((file) => ["image/png", "image/jpeg", "image/jpg",].includes(file.type), 'Invalid file type.')
      .refine((file) => file.size <= fiveMbSizeLimit, "File should not exceed 5MB")
      .optional(),
    component: FileInput
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
const submitFactory = (handleSubmit: THandleSubmit) => {
  return handleSubmit(async (values) => {
    loading.value = true;
    userStore.error = null;
    console.log(values)
    if (values.profilePicture) {
      const formData = new FormData();
      formData.append('profile:image', values.profilePicture)
      await userStore.updateProfilePicture(formData);
      if (userStore.error) {
        toast.error(userStore.error);
      }
    }
    await userStore.updateUser({ bio: values.bio })
    if (userStore.error) {
      toast.error(userStore.error);
    } else {
      navigateTo('/register/page_3')
    }
    loading.value = false
  })
}

interface FileUploadEventTarget extends EventTarget {
  files: File[]
}
</script>
