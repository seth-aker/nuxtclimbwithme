<template>
  <div>
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger as-child>
        <Button @click="() => {
          initialValues = {
            name: '',
            grade: '',
            yearsExperience: undefined,
            certified: false
          }
          dialogOpen = true
        }">Add New</Button>
      </DialogTrigger>
      <Card v-for="(discipline, index) in disciplines" :key="index">
        <CardHeader>
          <div class="flex flex-row justify-between items-center">
            <CardTitle>
              {{ discipline.name }}
            </CardTitle>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" size="icon">
                  <Icon name="lucide:ellipsis-vertical" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="flex flex-col">
                <DialogTrigger as-child>
                  <Button variant='outline' size="icon" @click="() => {
                    initialValues = discipline;
                    editingIndex = index
                    dialogOpen = true
                    }">
                    <Icon name="line-md:pencil" />
                  </Button>
                </DialogTrigger>
                
                  <Button variant="destructive" size="icon" @click="() => {
                      disciplines.splice(index, 1);
                    }">
                    <Icon name="line-md:trash" />
                  </Button>
          
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-row" v-if="discipline.grade">
            <Label>Grade: </Label>
            <span>{{ discipline.grade }}</span>
          </div>
          <div class="flex flex-row" v-if="discipline.yearsExperience">
            <Label>Years Experience </Label>
            <span>{{ discipline.yearsExperience }}</span>
          </div>
          <div v-if="discipline.certified" class="flex flex-row">
            <Label>Belay Certified: </Label>
            <Icon name="line-md:confirm-square-filled"></Icon>
          </div>
        </CardContent>
      </Card>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a climbing discipline</DialogTitle>
          <DialogDescription> Describe what kind of climbing you do.</DialogDescription>
        </DialogHeader>
        <FormsTemplate :fields="formFields" :loading="loading" :submit-factory="submitFactory" :initial-values="initialValues"/>
      </DialogContent>
    </Dialog>
    <div>
      <Button @click="saveDisciplines" :disabled="loading">Save</Button>
      <Button @click="navigateTo('/register/page_4')" >Skip for now</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormFieldData, THandleSubmit } from '~/components/forms/FormFieldData';
import * as z from 'zod'
import Select from '~/components/ui/select/Select.vue';
import Input from '~/components/ui/input/Input.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { IClimbingDiscipline } from '~/server/models/User';
import { toast } from 'vue-sonner';
const userStore = useUserStore();
interface IPage3Disciplines extends Omit<IClimbingDiscipline, 'name'> {
  name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine' | '',
 }

definePageMeta({
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
})
const loading = ref(false);
const dialogOpen = ref(false);
const disciplines = ref<IClimbingDiscipline[]>([]);
const editingIndex = ref(-1);
const formFields: FormFieldData[] = [
  {
    name: 'name',
    label: "Climbing Discipline",
    zodSchema: z.enum(['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine'], {message: "You must make a selection in order to submit."}),
    component: Select,
    componentProps: {
      selectOptions: [
        {label: 'Bouldering', value: 'Bouldering'},
        {label: 'Sport', value: 'Sport'},
        {label: 'Top Rope', value: 'Top Rope'},
        {label: 'Trad', value: 'Trad'},
        {label: 'Aid', value: 'Aid'},
        {label: 'Ice', value: 'Ice'},
        {label: 'Alpine', value: 'Alpine'},
      ],
    },
    placeholder: 'Pick a discipline'
  },
  {
    name: 'grade',
    label: 'Difficulty Grade',
    zodSchema: z.string(),
    component: Input,
    placeholder: 'General grade that you climb in this discipline',
  },
  {
    name: 'yearsExperience',
    label: 'Years of Experience',
    zodSchema: z.number().optional(),
    component: Input,
    componentProps: {
      type: 'number'
    },
  },
  {
    name: 'certified',
    label: 'Belay certified?',
    zodSchema: z.boolean().optional(),
    component: Checkbox,
    componentProps: {
      name: 'certified',
      type: 'checkbox',
    },
    formFieldProps: {
      type: 'checkbox',
    },
    formItemProps: {
      class: 'flex flex-row',
    },
  },
]
const initialValues = ref<IPage3Disciplines>({
    name: '',
    grade: '',
    yearsExperience: undefined,
    certified: false,
});

const submitFactory = (handleSubmit: THandleSubmit) => {
  return handleSubmit(async (values) => {
    loading.value = true;
    if(editingIndex.value !== -1) {
      disciplines.value[editingIndex.value] = values
    } else {
      disciplines.value.push(values);
    }
    dialogOpen.value = false;
    loading.value = false
  })
}
const saveDisciplines = async () => {
  loading.value = true;
  await userStore.updateUser({climbingExperience: { disciplines: disciplines.value}})
  if(userStore.error) {
    toast.error("There was an error saving you data. Please try again", userStore.error)
    userStore.error = null;
  } else {
    navigateTo('/register/page_4')
  }
  loading.value = false;
}
</script>