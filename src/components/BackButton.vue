<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { PhArrowCircleLeft } from '@phosphor-icons/vue'
</script>

<template>
  <router-link to="/" class="back-button">
    <PhArrowCircleLeft :size="32" color="var(--color-text-secondary)" />
  </router-link>
</template>

<style scoped lang="scss">
.back-button {
  display: flex;
  align-items: center;
}
</style>
