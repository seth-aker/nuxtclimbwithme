<template>
  <form @submit="submit">
    <FormField name="profilePicture" label="Profile Picture" :validate-on-change="isFieldDirty('profilePicture')">
      <FormItem>
        <FormControl>
          <Input multiple type="file" @change="(e: FileUploadEvent) => setFieldValue('profilePicture', e.target?.files?.[0])" />
         <!-- <input type="file" multiple  @change="(e: Event) => setFieldValue('profilePicture', e.target?.files?.[0])"/> -->
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="bio" label="Bio"  v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Bio</FormLabel>
        <FormControl>
          <Textarea placeholder="Tell the world about yourself" v-bind="componentField" maxlength="500"/>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" v-if="!loading">Next</Button>
    <Button v-else>
      <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" disabled />
    </Button> 
    <Button variant="outline" @click="navigateTo('/register/page_3')">Skip</Button>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { toast } from 'vue-sonner';
const loading = ref(false);
const userStore = useUserStore();
const fiveMbSizeLimit = 5 * 1024 * 1024; // 5MB
const schema = toTypedSchema(z.object({
  bio: z.string().optional(),
  profilePicture: z.instanceof(File)
    .refine((file) => ["image/png","image/jpeg","image/jpg",].includes(file.type), 'Invalid file type.')
    .refine((file) => file.size <= fiveMbSizeLimit, "File should not exceed 5MB")
    .optional()
}))

const { handleSubmit, setFieldValue, isFieldDirty } = useForm({
  validationSchema: schema,
  initialValues: {
    bio: userStore.user.bio
  }
})

const submit = handleSubmit(async (values) => {
    loading.value = true;
    userStore.error = null;
    userStore.user.bio = values.bio;
    if(values.profilePicture) {
      const formData = new FormData();
      formData.append('profile:image', values.profilePicture)
      await userStore.updateProfilePicture(formData);
      if(userStore.error) {
        toast.error(userStore.error);
      }
    }
    await userStore.updateUser(userStore.user);
    if(userStore.error) {
      toast.error(userStore.error);
    }
    loading.value = false
    navigateTo('/register/page_3')

})

interface FileUploadEventTarget extends EventTarget {
  files: File[]
}
interface FileUploadEvent extends Event {
  target: FileUploadEventTarget 
}
</script>
