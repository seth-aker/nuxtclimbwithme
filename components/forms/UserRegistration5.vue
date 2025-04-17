<template>
  <form>
    <FormField name="interests" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Other Interests</FormLabel>
        <FormDescription>List other interests you have outside of climbing</FormDescription>
        <FormControl>
          <TagsInput :model-value="componentField.modelValue" @update:model-value="componentField['onUpdate:modelValue']">
            <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item" >
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            
            <TagsInputInput placeholder="Interests..." />
          </TagsInput>
        </FormControl>
      </FormItem>
    </FormField>
    
  </form>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import { z } from 'zod';
const userStore = useUserStore();
const loading = ref(false);

const schema = toTypedSchema(z.object({
  intrests: z.array(z.string()).optional(),
  gearOwned: z.array(z.string()).optional()
}))

const { handleSubmit } = useForm({
  validationSchema: schema
})

const submit = handleSubmit(async (values) => {
  loading.value = true;
  userStore.user.interests = values.intrests
  userStore.user.gearOwned = values.gearOwned
  await userStore.updateUser(userStore.user);
  if(userStore.error) {
    toast.error(userStore.error)
  } else {
    navigateTo("/")
  }
  loading.value = false

})
</script>

<style>

</style>