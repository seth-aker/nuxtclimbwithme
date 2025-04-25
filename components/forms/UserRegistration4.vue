<template>
  <form @submit.prevent="submit" >
    <FormField v-for="day in daysOfWeek" :name="`availability.${day}`" v-slot="{ componentField, setValue }">
      <FormItem class="flex space-x-3 space-y-2 items-start">
        <FormLabel class="w-16">{{ `${day.charAt(0).toLocaleUpperCase()}${day.substring(1)}: ` }}</FormLabel>
        <FormField  v-for="(option, index) in ['Morning', 'Afternoon', 'Evening']" :key="index" type="checkbox" :value="option" :unchecked-value="false" :name="`availability.${day}`">
          <FormItem class="flex space-x-3 space-y-2 items-start">
            <FormLabel class="font-normal" >{{ option }}:</FormLabel>
            <FormControl>
              <Checkbox :model-value="componentField.modelValue?.includes(option)"  @update:model-value="(value) => {
                if(value) {
                  componentField.modelValue.push(option)
                } else {
                  setValue(componentField.modelValue.filter((v: string) => v !== option))
                }
                return value
              }"  />
            </FormControl>
            
          </FormItem>
        </FormField>
      </FormItem>
    </FormField>
    <FormField name="gearOwned" v-slot="{componentField}">
      <FormItem>
        <FormLabel>Gear Owned</FormLabel>
        <FormDescription>List the types of year that you have. E.g. Cams, 70m rope etc.</FormDescription>
        <FormControl>
          <TagsInput :model-value="componentField.modelValue" @update:model-value="componentField['onUpdate:modelValue']">
            <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item" >
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            
            <TagsInputInput placeholder="Gear..." />
          </TagsInput>
        </FormControl>
      </FormItem>
    </FormField>
    <div>
      <Button type="submit" v-if="!loading">Next</Button>
      <Button v-else disabled>
        <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
      </Button> 
    <Button variant="outline" @click.prevent="navigateTo('/register/page_5')">Skip</Button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import {  useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import { daysOfWeek } from '~/assets/lists/daysOfWeek';
const userStore = useUserStore();
const loading = ref(false);

const schema = toTypedSchema(z.object({
  availability: z.object({
    monday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    tuesday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    wednesday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    thursday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    friday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    saturday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    sunday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  }),
  gearOwned: z.array(z.string()).optional()
}))

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday:[]
    },
    gearOwned: []
  }
})


const submit = handleSubmit(async (values) => {
  loading.value = true;
  console.log(values)
  userStore.user.availability = values.availability;
  userStore.user.gearOwned = values.gearOwned
  await userStore.updateUser(userStore.user);
  if(userStore.error) {
    toast.error(userStore.error)
  } else {
    navigateTo('/register/page_5')
  }
  loading.value = false
})
</script>

<style>

</style>