<template>
  <form>
    <FormField name="bio" label="Bio"  v-slot="{ field }">
      <FormItem>
        <FormLabel>Bio</FormLabel>
        <FormControl>
          <Textarea placeholder="Tell the world about yourself" v-bind="field" maxlength="500"/>
        </FormControl>
      </FormItem>
      <FormMessage />
    </FormField>
    <FormField name="profilePicture" label="Profile Picture" v-slot="{ field }">
      <FormItem>
        <FormControl>
          <Input type="file" v-bind="field" />
        </FormControl>
      </FormItem>
    </FormField>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
const fileSizeLimit = 5*1024*1024; // 5MB
const schema = toTypedSchema(z.object({
  bio: z.string().optional(),
  profilePicture: z.instanceof(File).refine((file) => ["image/png","image/jpeg","image/jpg",].includes(file.type), 'Invalide image file type').refine((file) => file.size <= fileSizeLimit, "File should not exceed 5MB").optional()
}))

const { handleSubmit } = useForm({
  validationSchema: schema
})

const submit = handleSubmit(async (values) => {
  
})
</script>
