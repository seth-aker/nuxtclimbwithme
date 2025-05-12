<template>
  <div>
    <form>
      <Label class="text-sm font-medium">Availability</Label>
      <div class="text-muted-foreground text-sm">What general days/times are you available?</div>
      <Accordion type="multiple" >    
        <AccordionItem v-for="(day, index) in daysOfWeek" :key="index" :value="day">
          <AccordionTrigger>{{ `${day.substring(0,1).toUpperCase()}${day.substring(1)}` }}</AccordionTrigger>
          <AccordionContent>
            <FormField :name="day">
              <FormItem>
                <FormField :name="day" type="checkbox" value="Morning" :unchecked-value="false" v-slot="{ value, handleChange }">
                  <FormItem class="flex">
                    <FormControl>
                      <Checkbox :model-value="value.includes('Morning')" @update:model-value="handleChange"/>
                    </FormControl>
                    <FormLabel>Morning</FormLabel>
                  </FormItem>
                </FormField>
                <FormField :name="day" type="checkbox" value="Afternoon" :unchecked-value="false" v-slot="{ value, handleChange }">
                  <FormItem class="flex">
                    <FormControl>
                      <Checkbox :model-value="value.includes('Afternoon')" @update:model-value="handleChange"/>
                    </FormControl>
                    <FormLabel>Afternoon</FormLabel>
                  </FormItem>
                </FormField>
                <FormField :name="day" type="checkbox" value="Evening" :unchecked-value="false" v-slot="{ value, handleChange }">
                  <FormItem class="flex">
                    <FormControl>
                      <Checkbox :model-value="value.includes('Evening')" @update:model-value="handleChange"/>
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
  monday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  tuesday:z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  wednesday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  thursday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  friday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  saturday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  sunday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  gearOwned: z.array(z.string()).optional()
})
const initialValues = {
  monday: [] as ('Morning' | 'Afternoon' | 'Evening')[],
  tuesday: [] as ('Morning' | 'Afternoon' | 'Evening')[],
  wednesday: [] as ('Morning' | 'Afternoon' | 'Evening')[],
  thursday: [] as ('Morning' | 'Afternoon' | 'Evening')[],
  friday: [] as ('Morning' | 'Afternoon' | 'Evening')[],
  saturday: [] as ('Morning' | 'Afternoon' | 'Evening')[],
  sunday: [] as ('Morning' | 'Afternoon' | 'Evening')[], 
  gearOwned: [] as string[],
}
const { handleSubmit } = useForm({
  initialValues
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const res = schema.safeParse(values)
  if(res.success){
    await userStore.updateUser({
      availability: {
        monday: res.data.monday,
        tuesday: res.data.tuesday,
        wednesday: res.data.wednesday,
        thursday: res.data.thursday,
        friday: res.data.friday,
        saturday: res.data.saturday,
        sunday: res.data.sunday
      },
      gearOwned: values.gearOwned
    })
  }
  if(userStore.error) {
    toast.error("An error occured saving your data. Please try again.", userStore.error) 
    userStore.error = null
  } else {
    navigateTo('/register/page_5')
  }
  loading.value = false
})

</script>