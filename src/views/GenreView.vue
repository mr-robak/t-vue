<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import Grid from '@/components/Grid.vue'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const store = useStore()

const genre = computed(() => route.params.genre as string)
const shows = computed(() => store.genres[genre.value])
</script>

<template>
  <div class="genre-view">
    <header>
      <BackButton />
      <h1>{{ genre }}</h1>
    </header>
    <main>
      <Grid :shows="shows" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.genre-view {
  padding: 4.5rem 1rem 1rem;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    color: $color-text-secondary;
    text-transform: capitalize;
  }
}

.back-button {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0.25rem;
  color: $color-text-secondary;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-primary;
  }
}
</style>
