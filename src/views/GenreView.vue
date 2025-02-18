<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import GridList from '@/components/GridList.vue'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()
const store = useStore()

const genre = computed(() => route.params.genre as string)
const shows = computed(() => store.showsByGenre(genre.value))
</script>

<template>
  <div class="genre-view">
    <header>
      <BackButton class="back-button" />
      <h1>{{ genre }}</h1>
    </header>
    <main>
      <GridList :shows="shows" />
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
    margin: 0;
    line-height: 1;
  }

  .back-button {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
