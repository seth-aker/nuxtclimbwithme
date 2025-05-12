<template>
  <div>
    <form @submit="submit">
    <FormField name="interests" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Other Interests</FormLabel>
        <FormDescription>List other interests/hobbies you have outside of climbing</FormDescription>
        <FormControl>
          <TagsInput :model-value="componentField.modelValue" @update:model-value="componentField['onUpdate:modelValue']">
            <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item" >
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            
            <TagsInputInput placeholder="Other interests..." />
          </TagsInput>
        </FormControl>
      </FormItem>
    </FormField>
    <div>
      <Button type="submit" v-if="!loading">Finish</Button>
      <Button v-else disabled>
        <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
      </Button> 
    </div>
  </form>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
})
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import { z } from 'zod';
const userStore = useUserStore();
const loading = ref(false);

const schema = toTypedSchema(z.object({
  intrests: z.array(z.string()).optional(),
}))

const { handleSubmit } = useForm({
  validationSchema: schema
})

const submit = handleSubmit(async (values) => {
  loading.value = true;
  await userStore.updateUser({interests: values.intrests, registrationCompleted: true});
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