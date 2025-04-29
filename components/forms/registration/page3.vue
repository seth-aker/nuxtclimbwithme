<template>
  <form @submit="submit">
    <Card v-for="(field, index) in fields" :key="field.key">
      <CardHeader>
        <Button variant="destructive" @click="remove(index)">X</Button>
      </CardHeader>
      <FormField label="Climbing discipline" :name="`disciplines[${index}].name`" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>
            Climbing discipline
          </FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Pick a discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="discipline in climbingDisciplines" :value="discipline">
                  {{ discipline }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField label="Grade" :name="`disciplines[${index}].grade`" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Grade</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField :name="`disciplines[${index}].yearsExperience`" v-slot="{ componentField }" ?>
        <FormItem>
          <FormLabel>Years of Experience</FormLabel>
          <FormControl>
            <Input type="number" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-if="field.value.name !== 'Bouldering'" type="checkbox" :value="field.value.certified" :unchecked-value="false" :name="`disciplines[${index}].certified`" v-slot="{ componentField, setValue }">
        <FormItem class="flex flex-row">
          <FormControl>
            <Checkbox :model-value="componentField.modelValue" @update:model-value="(value) => setValue(value)" />
          </FormControl>
          <FormLabel>Belay Certified</FormLabel>
        </FormItem>
      </FormField>
      <FormField type="checkbox" :value="field.value.certified" :unchecked-value="false" :name="`disciplines[${index}].openToClimbing`" v-slot="{ componentField, setValue }">
        <FormItem class="flex flex-row">
          <FormLabel>Open to climbing</FormLabel>
          <FormDescription>Check the box if you want to be included other climbers' searches in this discipline</FormDescription>
          <FormControl>
            <Checkbox :model-value="componentField.modelValue" @update:model-value="(value) => setValue(value)" />
          </FormControl>
        </FormItem>
      </FormField>
    </Card>
    <Button @click.prevent="push({ name: '', grade: '', yearsExperience: 0, certified: false , openToClimbing: false})">Add Discipline</Button>
    <div>
      <Button type="submit" v-if="!loading">Next</Button>
      <Button v-else disabled>
        <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
      </Button> 
    <Button variant="outline" @click.prevent="navigateTo('/register/page_4')">Skip</Button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import { useFieldArray, useForm } from 'vee-validate';
import { climbingDisciplines } from '~/assets/lists/climbingDisciplines';
import { toast } from 'vue-sonner';
const loading = ref(false);

const userStore = useUserStore();
const schema = toTypedSchema(z.object({
  disciplines: z.array(z.object({
    name: z.enum(['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']),
    grade: z.string().optional(),
    yearsExperience: z.number().optional(),
    certified: z.boolean().optional(),
    openToClimbing: z.boolean().optional()
}))}))

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: userStore.user.climbingExperience
})
const { fields, push, remove } = useFieldArray<{name: string, grade: string, yearsExperience: number, certified: boolean, openToClimbing: boolean}>('disciplines');

const submit = handleSubmit(async (values) => {
  console.log(values)
  loading.value = true;
  userStore.user.climbingExperience.disciplines = values.disciplines.map((each) => {
    const discipline = {
      name: each.name,
      grade: each.grade,
      yearsExperience: each.yearsExperience,
      certified: each.certified
    }
    return discipline
  });
  userStore.user.preferences.openToClimbingTypes = values.disciplines.filter(each => each.openToClimbing).map((each => {
      const type = {
        name: each.name,
        preferredGrade: each.grade,
        certified: each.certified
      }
      return type
  }))
  await userStore.updateUser(userStore.user);
  if (userStore.error) {
    toast.error(userStore.error);
  } else {
    navigateTo('/register/page_4');
  }
  loading.value = false
})
</script>

<style></style>
