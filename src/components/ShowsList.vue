<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/store'
import ShowCard from './ShowCard.vue'
import {
  PhCaretLeft,
  PhCaretRight,
  PhArrowCircleRight,
} from '@phosphor-icons/vue'

const props = defineProps<{ genre: string }>()
const store = useStore()
const MappedShows = computed(() => store.showsByGenre(props.genre))
const scrollContainer = ref<HTMLElement | null>(null)

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
  <div class="genre-section">
    <div class="genre-header">
      <div class="genre-title">
        <h2>{{ props.genre }}</h2>
        <PhArrowCircleRight :size="32" />
      </div>
      <div class="scroll-buttons">
        <button class="scroll-button" @click="scrollLeft">
          <PhCaretLeft :size="32" />
        </button>
        <button class="scroll-button" @click="scrollRight">
          <PhCaretRight :size="32" />
        </button>
      </div>
    </div>
    <div
      v-if="MappedShows.length"
      class="cards-container"
      ref="scrollContainer"
    >
      <ul class="cards-list">
        <li v-for="show in MappedShows" :key="show.id">
          <ShowCard
            :name="show.name"
            :summary="show.summary"
            :image="show.image"
            :year="show.year"
            :rating="show.rating"
          />
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No shows available for this genre.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.genre-section {
  display: block;
  background: transparent;
}

.genre-header {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
  padding-left: 1rem;
}

.genre-title {
  display: flex;
  position: relative;
  align-items: center;
  gap: 0.5rem;

  h2 {
    margin: 0;
  }
}

.scroll-buttons {
  display: flex;
  position: relative;
  gap: 0.25rem;
}

.scroll-button {
  display: flex;
  position: relative;
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

.cards-container {
  display: block;
  position: relative;
  overflow-x: auto;
  padding: 0.5rem 0 0.5rem 1rem;
  scroll-padding-left: 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.cards-list {
  display: flex;
  position: relative;
  gap: 1rem;
  margin: 0;
  padding: 0 1rem 0 0;
  list-style: none;

  li {
    position: relative;
    z-index: 0;

    &:hover {
      z-index: 1;
    }
  }
}
</style>
