<template>
  <div>
    <Popover>
        <PopoverTrigger as-child>
          <Button size="icon" variant="ghost">
            <Icon name="lucide:settings" size="1.5rem" class="text-background"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div class="flex flex-col">
            <Label>Color Mode</Label>
            <Select :model-value="userStore.user.preferences.colorTheme" @update:model-value="setColorTheme" :disabled="loading">
              <SelectTrigger>
                <SelectValue>{{ `${userStore.user.preferences.colorTheme.substring(0,1).toUpperCase()}${userStore.user.preferences.colorTheme.substring(1)}` }}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </PopoverContent>
      </Popover>
  </div>
</template>

<script lang="ts" setup>
import type { AcceptableValue } from 'reka-ui';

const loading = ref(false);
const userStore = useUserStore();
const setColorTheme = async(value: AcceptableValue) => {
  loading.value = true;
  await userStore.updateUser({preferences: {
    colorTheme: value as IUser['preferences']['colorTheme']
  }})
  loading.value = false;
}

</script>

<style>

</style>