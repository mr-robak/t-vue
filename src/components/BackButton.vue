<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PhArrowCircleLeft } from '@phosphor-icons/vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <button class="back-button" @click="goBack">
    <PhArrowCircleLeft :size="32" color="var(--color-text-secondary)" />
  </button>
</template>

<style scoped lang="scss">
.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>
