<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const props = defineProps<{ genre: string }>()

const store = useStore()

const genreShows = computed(() => store.showsByGenre(props.genre))
</script>

<template>
  <div>
    <h2>{{ props.genre }}</h2>
    <div v-if="genreShows.length">
      <div class="cards-container">
        <ul class="cards-list">
          <li class="card" v-for="show in genreShows" :key="show.id">
            <img v-if="show.image" :src="show.image" :alt="show.name" />
            <div class="card-content">
              <h3>{{ show.name }}</h3>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>No shows available for this genre.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/_variables';

.cards-container {
  overflow-x: auto;
  padding-bottom: 1rem;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.cards-list {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.card {
  border-radius: $card-border-radius;
  background-color: $card-bg-color;
  color: #ffffff;
  flex: 0 0 auto;
  padding: 1rem;
}

.card img {
  max-width: 100%;
  border-radius: $card-border-radius;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
