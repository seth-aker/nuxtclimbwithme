<template>
  <form>
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
              <Select  v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Pick a discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="discipline in climbingDisciplines" :value="discipline" >
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
        <FormField :name="`disciplines[${index}].yearsExperience`" v-slot="{ componentField }"?>
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <FormControl>
              <Input type="number" v-bind="componentField"/>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-if="(field.value as any).name !== 'Bouldering'" :name="`disciplines[${index}].certified`" v-slot="{ componentField }">
          <FormItem class="flex flex-row">
            <FormControl>
              <Checkbox v-bind="componentField" />
            </FormControl>
            <FormLabel>Belay Certified</FormLabel>
          </FormItem>
        </FormField>
      </Card>
      <Button  @click.prevent="push({name: '', grade: '', yearsExperience: 0, certified: false})" >Add Discipline</Button>

  </form>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import {  useFieldArray, useForm } from 'vee-validate';
import { climbingDisciplines } from '~/assets/lists/climbingDisciplines';

const userStore = useUserStore();
const schema = toTypedSchema(z.array(z.object({
  name: z.enum(['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']),
  grade: z.string().optional(),
  yearsExperience: z.number().optional(),
  certified: z.boolean().default(false)
})))

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: userStore.user.climbingExperience.disciplines
})
const { fields, push, remove } = useFieldArray('disciplines');
</script>

<style>

</style>