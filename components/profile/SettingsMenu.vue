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
            <Select v-model="userStore.user.preferences.colorTheme">
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
const userStore = useUserStore();
</script>

<style>

</style>