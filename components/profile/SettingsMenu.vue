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
            <Select v-model="userStore.user.preferences.colorTheme" :disabled="loading">
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
const loading = ref(false);
const userStore = useUserStore();
watch(() => userStore.user.preferences.colorTheme, async (value, oldValue) => {
  loading.value = true;
  if(value !== oldValue) {
    await userStore.updateUser(userStore.user)
  }
  loading.value = false
})
</script>

<style>

</style>