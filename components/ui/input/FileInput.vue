
<template>
  <Input v-bind="$attrs" type="file" @change="handleFileChange" /> 
</template>

<script lang="ts" setup>
const modelValue = defineModel<File | null>();
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    modelValue.value = target.files[0];
  }
};
</script>
