<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'
</script>

<template>
  <div class="spinner-container">
    <PhCircleNotch class="spinning" :size="100" weight="bold" />
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  color: rgba(58, 150, 212, 0.212);
}

.spinning {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
