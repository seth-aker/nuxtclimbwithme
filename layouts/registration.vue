<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Progress Bar Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">Registration Progress</h2>
          <span class="text-sm text-muted-foreground">Step {{ currentStep + 1 }} of 5</span>
        </div>
        <Progress :model-value="progressValue" class="w-full" />
      </div>
      
      <!-- Page Content -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Progress } from '~/components/ui/progress'

const route = useRoute()

// Calculate current step and progress based on route
const currentStep = computed(() => {
  const path = route.path
  if (path.includes('page_1')) return 0
  if (path.includes('page_2')) return 1
  if (path.includes('page_3')) return 2
  if (path.includes('page_4')) return 3
  if (path.includes('page_5')) return 4
  return 0
})

const progressValue = computed(() => {
  return currentStep.value * 20 // 20% per step
})
</script>
