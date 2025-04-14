<template>
  <form @submit="onSubmit">
    <FormField name="firstName" label="First Name" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input placeholder="First Name" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="lastName" label="Last Name" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Last Name</FormLabel>
        <FormControl>
          <Input placeholder="Last Name" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="phoneNumber" label="Phone Number" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <Input placeholder="Phone Number" v-bind="field" type="tel" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="addressLine1" label="Address Line 1" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Address Line 1</FormLabel>
        <FormControl>
          <Input placeholder="Address Line 1" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="addressLine2" label="Address Line 2" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Address Line 2</FormLabel>
        <FormControl>
          <Input placeholder="Address Line 2" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="city" label="City" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>City</FormLabel>
        <FormControl>
          <Input placeholder="City" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="state" label="State" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>State</FormLabel>
        <FormControl>
          <Select placeholder="State" v-bind="field">
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="(state, index) in states" :key="index" :value="state">
                {{ state }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="zip" label="Zip" v-slot="{ field }" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <FormLabel>Zip</FormLabel>
        <FormControl>
          <Input placeholder="Zip" v-bind="field" type="number" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit">Submit</Button>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { states } from '~/assets/lists/states';
import { toast } from 'vue-sonner';

const userStore = useUserStore();

const schema = toTypedSchema(z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
}))
const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: schema
});

const onSubmit = handleSubmit(async (values) => {
  userStore.user.firstName = values.firstName;
  userStore.user.lastName = values.lastName;
  userStore.user.phoneNumber = values.phoneNumber;
  userStore.user.location.address = `${values.addressLine1}${values.addressLine2 ? `, ${values.addressLine2}` : ''}, ${values.city}, ${values.state} ${values.zip}`;
  await userStore.updateUser(userStore.user);
  if (userStore.error) {
    toast.error('An error occurred. Please try again.');
    userStore.error = null;
  } else {
    navigateTo('/register/page_2');
  }
});
</script>

<style></style>
