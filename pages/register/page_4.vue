<template>
  <div>
    <form>
    <Accordion type="multiple" >
      <AccordionItem v-for="(day, index) in daysOfWeek" :key="index" :value="day">
        <AccordionTrigger>{{ day }}</AccordionTrigger>
        <AccordionContent>
          <FormField :name="day">
            <FormItem>
          <FormField :name="day" type="checkbox" value="Morning" :unchecked-value="false">
            <FormItem>
              <FormControl>
                <Checkbox />
              </FormControl>
              <FormLabel>Morning</FormLabel>
            </FormItem>
          </FormField>
          <FormField :name="`${day}Availability`" type="checkbox" value="Afternoon" v-slot="{ value, handleChange }">
            <FormItem>
              <FormControl>
                <Checkbox :model-value="value" @update:model-value="handleChange"/>
              </FormControl>
              <FormLabel>Afternoon</FormLabel>
            </FormItem>
          </FormField>
          <FormField :name="`${day}Availability`" type="checkbox" value="Evening" v-slot="{ value, handleChange }">
           <FormItem>
            <FormControl>
              <Checkbox :model-value="value" @update:model-value="handleChange"/>
            </FormControl>
            <FormLabel>Evening</FormLabel>
           </FormItem> 
          </FormField>
        </FormItem>
        </FormField>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <FormField name="gearOwned" v-slot="{ componentField }" >
      <FormItem>
        <FormLabel>Gear Owned</FormLabel>
        <FormDescription>List the climbing gear that you own.</FormDescription>
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
      <Button @click.prevent="onSubmit">Submit</Button>
      <Button @click.prevent="navigateTo('/register/page_5')" variant="outline">Skip</Button>
    </div>
    </form>
    <!-- <FormsRegistrationPage4 /> -->
  </div>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';
import * as z from 'zod'
import { daysOfWeek } from '~/assets/lists/daysOfWeek';
definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
})

const loading = ref(false);
const userStore = useUserStore();
const schema = z.object({
  mondayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  tuesdayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  wednesdayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  thursdayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  fridayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  saturdayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  sundayAvailability: z.array(z.enum(["Morning", "Afternoon", "Evening" ])).refine((value) => value.length <= 3),
  gearOwned: z.array(z.string()).optional()
})
const initialValues = {
  mondayAvailability: [],
  tuesdayAvailability: [],
  wednesdayAvailability: [],
  thursdayAvailability: [],
  fridayAvailability: [],
  saturdayAvailability: [],
  sundayAvailability: [], 
  gearOwned: [],
}
const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  await userStore.updateUser({
    availability: {
      monday: values.mondayAvailability,
      tuesday: values.tuesdayAvailability,
      wednesday: values.wednesdayAvailability,
      thursday: values.thursdayAvailability,
      friday: values.fridayAvailability,
      saturday: values.saturdayAvailability,
      sunday: values.sundayAvailability
    },
    gearOwned: values.gearOwned
  })
  if(userStore.error) {
    toast.error("An error occured saving your data. Please try again.", userStore.error) 
    userStore.error = null
  } else {
    navigateTo('/register/page_5')
  }
  loading.value = false
})

</script>