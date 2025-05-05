<template>
    <SelectRoot v-model="modelValue" :placeholder :selectOptions v-bind="$attrs">
    <SelectTrigger>
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="option in selectOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </SelectRoot>
</template>

<script setup lang="ts">
const modelValue = defineModel<any>()
const { placeholder, selectOptions } = defineProps<{
    placeholder?: string, 
    selectOptions?: any[]}>()
</script>