<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/store'
import ShowCard from './ShowCard.vue'
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue' // Only these two icons will be bundled

// TODO: refactor to be more generic

const props = defineProps<{ genre: string }>()

const store = useStore()

const MappedShows = computed(() => store.showsByGenre(props.genre))

const scrollContainer = ref<HTMLElement | null>(null)
// TODO:  Refactor scroll to scroll by full set of cards
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
    <div v-if="MappedShows.length">
      <div class="cards-container-wrapper">
        <!-- TODO: show scroll buttons only if content overflows  -->
        <div class="scroll-buttons">
          <button class="scroll-button" @click="scrollLeft">
            <PhCaretLeft :size="24" />
          </button>
          <button class="scroll-button" @click="scrollRight">
            <PhCaretRight :size="24" />
          </button>
        </div>
        <div class="cards-container" ref="scrollContainer">
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
</style>
