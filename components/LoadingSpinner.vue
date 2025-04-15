<script setup lang="ts">
const props = defineProps<{
  color?: string,
  circumference?: number,
  strokeWidth?: number
}>()

const color = props.color || 'white';
const circumference = props.circumference || 250;
const radius = circumference / (2 * Math.PI);
const strokeWidth = props.strokeWidth || 5;
const halfCircle = radius + strokeWidth;
const diameter = 2 * halfCircle;

</script>
<template>
  <div class="spinner-container rotate">
    <svg :width="diameter" :height="diameter" xmlns="http://www.w3.org/2000/svg">

      <circle cx="50%" cy="50%" :r="radius" :stroke-width="strokeWidth" :stroke="color" fill="transparent"
        :stroke-dasharray="circumference" class="circle"></circle>

    </svg>
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content
}

.rotate {
  transform: rotateX('-90deg');
  animation: loading 1s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.circle {
  animation: stroke-dash 3s ease-in-out infinite;
}

@keyframes stroke-dash {
  0% {
    stroke-dashoffset: v-bind(circumference * 0.9);
  }

  40% {
    stroke-dashoffset: v-bind(circumference * 0.3);
  }

  100% {
    stroke-dashoffset: v-bind(circumference * 0.9);
  }
}
</style>
