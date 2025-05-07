<template>
  <form v-bind="$attrs">
    <FormField v-for="field in fields" :name="field.name" :label="field.label" v-slot="{ componentField }"
      :validate-on-blur="!isFieldDirty">
      <FormItem v-auto-animate>
        <FormLabel>{{ field.label }}</FormLabel>
        <FormControl>
          <component :is="field.component" v-bind="{ ...componentField, ...field.componentProps }"
            :placeholder="field.placeholder">
          </component>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <slot name="submitButton" :onSubmit="onSubmit" :loading="loading">
      <div class="p-4">
        <Button v-if="!loading" @click.prevent="onSubmit">Submit</Button>
        <Button v-else disabled>
          <LoadingSpinner :stroke-width="2" :circumference="40" color="#FFFFFF" />
        </Button>
      </div>
    </slot>
  </form>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import type { FormTemplateProps } from './FormFieldData';
import { useForm } from 'vee-validate';
import * as z from 'zod';

const { fields, submitFactory, loading } = defineProps<FormTemplateProps>()

const schemaObject = Object.fromEntries(fields.map((field) => [field.name, field.zodSchema]));

const initialValues = Object.fromEntries(fields.map((field) => [field.name, field.initialValue]));

const schema = toTypedSchema(z.object(schemaObject))

const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: schema,
  initialValues
})

const onSubmit = submitFactory(handleSubmit);

</script>
