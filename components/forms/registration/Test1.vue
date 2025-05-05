<template>
  <FormsTemplate class="w-full" :fields="formFields" :submitFactory="submitFactory" :loading="loading" >
    <template #submitButton="{ onSubmit, loading }">
      <Button v-if="!loading" @click.prevent="onSubmit">Submit</Button>
      <Button v-else disabled>
        <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
      </Button>
      <Button variant="outline" @click.prevent="navigateTo('/register/page_2')">Skip</Button>
    </template>
  </FormsTemplate>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
import * as z from 'zod'
import type { FormFieldData, THandleSubmit } from '../FormFieldData'
import { toast } from 'vue-sonner';
import Input from '~/components/ui/input/Input.vue';
import Select from '~/components/ui/select/Select.vue';
import { states } from '~/assets/lists/states';
const loading = ref(false);
const formFields: FormFieldData[] = [
  {
    name: 'firstName',
    label: 'First Name',
    initialValue: userStore.user.firstName,
    zodSchema: z.string(),
    placeholder: 'Your first name...',
    component: Input
  },
  {
    name: 'lastName',
    label: 'Last Name',
    initialValue: userStore.user.lastName,
    zodSchema: z.string(),
    placeholder: 'Your last name...',
    component: Input
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    initialValue: userStore.user.phoneNumber,
    zodSchema: z.string().optional(),
    placeholder: '(###) ###-####',
    component: Input
  }, 
  {
    name: 'addressLine1',
    label: 'Address Line 1',
    zodSchema: z.string().optional(),
    component: Input
  },
  {
    name: 'adressLine2',
    label: 'Address Line 2',
    placeholder: 'Apt/Unit #',
    component: Input,
    zodSchema: z.string().optional()
  },
  {
    name: 'city',
    label: 'City',
    zodSchema: z.string().optional(),
    component: Input,
  },
  {
    name: 'state',
    label: 'State',
    initialValue: '',
    zodSchema: z.string().optional(),
    placeholder: "State: ",
    component: Select,
    selectOptions: states
  },
  {
    name: 'zip',
    label: 'Zip Code',
    placeholder: '#####',
    zodSchema: z.string().regex(/^[0-9]{5}$/gm, "Zip code must be 5 numerical digits long").optional(),
    component: Input
  }

]

const submitFactory = (handleSubmit: THandleSubmit) => {  
  return handleSubmit(async (values) => {
    loading.value = true
    console.log(values)
    await userStore.updateUser({
      firstName: values.firstName, 
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      location: {
        ...userStore.user.location,
        address: `${values.addressLine1}${values.addressLine2 ? `, ${values.addressLine2}` : ''}, ${values.city ?? ''}, ${values.state ?? ''} ${values.zip ?? ''}`
      }
    })
    if (userStore.error) {
    console.log(userStore.error)
    toast.error('An error occurred. Please try again. If this persists please contact an administrator');
    userStore.error = null;
    } else {
    navigateTo('/register/page_2');
    }
    loading.value = false
  })
}
  

</script>

<style>

</style>