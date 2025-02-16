<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/store'

const props = defineProps<{ genre: string }>()

const store = useStore()

const genreShows = computed(() => store.showsByGenre(props.genre))

const scrollContainer = ref<HTMLElement | null>(null)

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <h2>{{ props.genre }}</h2>
    <div v-if="genreShows.length">
      <div class="cards-container-wrapper">
        <div class="scroll-buttons">
          <button class="scroll-button" @click="scrollLeft">&lt;</button>
          <button class="scroll-button" @click="scrollRight">&gt;</button>
        </div>
        <div class="cards-container" ref="scrollContainer">
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
    </div>
    <div v-else>
      <p>No shows available for this genre.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cards-container-wrapper {
  position: relative;
  padding-top: 2rem;
}

.scroll-buttons {
  position: absolute;
  top: 0;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  z-index: 1;
}

.scroll-button {
  background-color: $card-bg-color;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
}

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
