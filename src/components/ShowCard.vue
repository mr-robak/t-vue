<script setup lang="ts">
import type { MappedShow } from '@/store/types'

defineProps<{
  show: MappedShow
}>()
</script>

<template>
  <div class="card">
    <img v-if="show.image" :src="show.image" :alt="show.name" />
    <div class="card-content">
      <h3>{{ show.name }}</h3>
      <p>{{ show.rating }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 200px;
  min-width: 200px;
  border-radius: $card-border-radius;
  background-color: $card-bg-color;
  color: #ffffff;
  flex: 0 0 auto;
  padding: 1rem;
}

.card img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 300px;
  border-radius: $card-border-radius;
  margin-bottom: 0.5rem;
}

.card-content {
  h3 {
    margin: 0.5rem 0;
  }

  p {
    margin: 0;
  }
}
</style>
