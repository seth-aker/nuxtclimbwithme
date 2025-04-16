<template>
  <form @submit="submit" >
    <Card v-for="(field, index) in fields" :key="field.key">
      <CardHeader>
        <Button variant="destructive" @click.prevent="remove(index)">X</Button>
      </CardHeader>
      <CardContent>
         <FormField :name="`availability[${index}].weekdays`" v-slot="{componentField, setValue}">
            <FormItem>
              <FormLabel>Weekdays Available</FormLabel>
              <FormField v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek" type="checkbox" :value="dayOfWeek" :unchecked-value="false" name="dayOptions">
                <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox :model-value="componentField.modelValue.includes(dayOfWeek)" @update:model-value="(value) => {
                    if(value) {
                      componentField.modelValue.push(dayOfWeek)
                    } else {
                      setValue(componentField.modelValue.filter((v: string) => v !== dayOfWeek))
                    }
                    return value
                  }" />
                </FormControl>
                <FormLabel>
                  {{ dayOfWeek }}
                </FormLabel>
              </FormItem>
              </FormField>
            </FormItem>
         </FormField>

        <FormField :name="`availability[${index}].timeOfDay`" v-slot="{ componentField, setValue }">
          <FormItem>
            <FormLabel>Times Available</FormLabel>
            <FormField v-for="option in ['Moring', 'Afternoon', 'Evening']" :key="option" type="checkbox" :value="option" :unchecked-value="false" name="timeOptions">
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox :model-value="componentField.modelValue.includes(option)" @update:model-value="(value) => {
                    if(value) {
                      componentField.modelValue.push(option)
                    } else {
                      setValue(componentField.modelValue.filter((v: string) => v !== option))
                    }
                    return value
                  }" />
                </FormControl>
                <FormLabel>
                  {{ option }}
                </FormLabel>
              </FormItem>
            </FormField>
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>

    </Card>
    <Button @click.prevent="push({weekdays: [], timeOfDay: []})">Add availability</Button>
    <div>
      <Button type="submit" v-if="!loading">Next</Button>
      <Button v-else>
        <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" disabled/>
      </Button> 
    <Button variant="outline" @click.prevent="navigateTo('/register/page_5')">Skip</Button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import { useFieldArray, useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import { daysOfWeek } from '~/assets/lists/daysOfWeek';
const userStore = useUserStore();
const loading = ref(false);

const schema = toTypedSchema(z.array(z.object({
  weekdays: z.array(
        z.enum([
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ])
      ),
  timeOfDay: z
      .array(z.enum(['Morning', 'Afternoon', 'Evening']))
      .optional(),
})))

const { handleSubmit } = useForm({
  validationSchema: schema,

})

const { fields, push, remove } = useFieldArray('availability');

const submit = handleSubmit(async (values) => {
  console.log("Starting")
  loading.value = true;
  console.log(values)
  // userStore.user.availability = values;
  // await userStore.updateUser(userStore.user);
  // if(userStore.error) {
  //   toast.error(userStore.error)
  // } else {
  //   navigateTo('/register/page_5')
  // }
  loading.value = false
})
</script>

<style>

</style>