<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/store'
import ShowCard from './ShowCard.vue'
import {
  PhCaretLeft,
  PhCaretRight,
  PhArrowCircleRight,
} from '@phosphor-icons/vue'

// TODO:  implement loader that shows skeleton

const props = defineProps<{ genre: string }>()
const store = useStore()
const MappedShows = computed(() => store.showsByGenre(props.genre))
const scrollContainer = ref<HTMLElement | null>(null)
const showScrollButtons = computed(() => {
  if (!scrollContainer.value) return false
  return scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth
})

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
      <div class="genre-title" :class="{ 'is-skeleton': !MappedShows.length }">
        <h2>{{ MappedShows.length ? props.genre : '' }}</h2>
        <PhArrowCircleRight :size="28" v-if="MappedShows.length" />
      </div>
      <div
        v-if="showScrollButtons && MappedShows.length"
        class="scroll-buttons"
      >
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
    <div v-else class="cards-container">
      <ul class="cards-list">
        <li v-for="n in 6" :key="`skeleton-${n}`">
          <ShowCard />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_mixins' as *;

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

  @include phone {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 0.5rem;
  }
}

.genre-title {
  display: flex;
  position: relative;
  align-items: center;
  gap: 0.5rem;

  &.is-skeleton {
    h2 {
      width: 150px;
      height: 2rem;
      background: $color-background;
      border-radius: 4px;
      @include skeleton-loading;
    }
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;

    @include phone {
      font-size: 1.5rem;
    }
  }
}

.scroll-buttons {
  display: flex;
  position: relative;
  gap: 0.25rem;

  @include phone {
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
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

  @include phone {
    padding: 0.5rem 0 0.5rem 0.5rem;
    scroll-padding-left: 0.5rem;
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

    ::v-deep(.card) {
      width: 200px;
      min-width: 200px;

      & .card-wrapper {
        height: 300px;
      }

      @include tablet {
        width: 170px;
        min-width: 170px;

        & .card-wrapper {
          height: 255px;
        }
      }

      @include phone {
        width: 120px;
        min-width: 120px;

        & .card-wrapper {
          height: 180px;
        }
      }
    }
  }

  @include phone {
    gap: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
