<template>
  <form @submit="onSubmit">
    <FormField name="firstName" label="First Name" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input placeholder="First Name" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="lastName" label="Last Name" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>Last Name</FormLabel>
        <FormControl>
          <Input placeholder="Last Name" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="phoneNumber" label="Phone Number" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <Input placeholder="Phone Number" v-bind="field" type="tel" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="addressLine1" label="Address Line 1" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>Address Line 1</FormLabel>
        <FormControl>
          <Input placeholder="Address Line 1" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="addressLine2" label="Address Line 2" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>Address Line 2</FormLabel>
        <FormControl>
          <Input placeholder="Address Line 2" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="city" label="City" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>City</FormLabel>
        <FormControl>
          <Input placeholder="City" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="state" label="State" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>State</FormLabel>
        <FormControl>
          <Select placeholder="State" v-bind="field">
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="(state, index) in states" :key="index" :value="state.value">
                {{ state.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="zip" label="Zip" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>Zip</FormLabel>
        <FormControl>
          <Input placeholder="Zip" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" v-if="!loading">Next</Button>
    <Button v-else disabled >
      <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
    </Button> 
    <Button variant="outline" @click.prevent="navigateTo('/register/page_2')">Skip</Button>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { states } from '~/assets/lists/states';
import { toast } from 'vue-sonner';
const loading = ref(false);
const userStore = useUserStore();
const initialValues = {
  firstName: userStore.user.firstName,
  lastName: userStore.user.lastName,
  phoneNumber: userStore.user.phoneNumber,
}
const schema = toTypedSchema(z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().regex(/^[0-9]{5}$/gm, "Zip code must be 5 numerical digits long").optional()
}))
const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: schema,
  initialValues
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  userStore.user.firstName = values.firstName;
  userStore.user.lastName = values.lastName;
  userStore.user.phoneNumber = values.phoneNumber;
  userStore.user.location.address = `${values.addressLine1}${values.addressLine2 ? `, ${values.addressLine2}` : ''}, ${values.city ?? ''}, ${values.state ?? ''} ${values.zip ?? ''}`;
  await userStore.updateUser(userStore.user);
  if (userStore.error) {
    console.log(userStore.error)
    toast.error('An error occurred. Please try again. If this persists please contact an administrator');
    userStore.error = null;
  } else {
    navigateTo('/register/page_2');
  }
  loading.value = false;
});
</script>

<style></style>
