<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import ShowCard from './ShowCard.vue'
import {
  PhCaretLeft,
  PhCaretRight,
  PhArrowCircleRight,
} from '@phosphor-icons/vue'
import type { MappedShow } from '@/store/types'

const props = defineProps<{
  genre: string
  shows: MappedShow[]
}>()

const scrollContainer = ref<InstanceType<typeof DynamicScroller> | null>(null)

const minItemSize = computed(() => {
  const width = window.innerWidth
  if (width <= 576) return 120 // phone: 576px breakpoint
  if (width <= 768) return 170 // tablet: 768px breakpoint
  return 200 // desktop
})

const MappedShowsWithSize = computed(() =>
  props.shows.map((show) => ({
    ...show,
    size: minItemSize.value,
  })),
)

function handleResize() {
  scrollContainer.value?.$forceUpdate()
}

onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

function scrollLeft() {
  scrollContainer.value?.$el.scrollBy({ left: -600, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.$el.scrollBy({ left: 600, behavior: 'smooth' })
}
</script>

<template>
  <div class="genre-section">
    <div class="genre-header">
      <div
        class="genre-title"
        :class="{ 'is-skeleton': !MappedShowsWithSize.length }"
      >
        <h2>{{ MappedShowsWithSize.length ? props.genre : '' }}</h2>
        <PhArrowCircleRight v-if="MappedShowsWithSize.length" :size="28" />
      </div>
      <div v-if="MappedShowsWithSize.length" class="scroll-buttons">
        <button class="scroll-button" @click="scrollLeft">
          <PhCaretLeft :size="32" />
        </button>
        <button class="scroll-button" @click="scrollRight">
          <PhCaretRight :size="32" />
        </button>
      </div>
    </div>
    <div class="cards-container" v-if="MappedShowsWithSize.length">
      <DynamicScroller
        ref="scrollContainer"
        class="scroller"
        :items="MappedShowsWithSize"
        :min-item-size="minItemSize"
        key-field="id"
        direction="horizontal"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            class="card-item"
          >
            <router-link :to="{ name: 'ShowDetails', params: { id: item.id } }">
              <div class="card-item-wrapper">
                <ShowCard
                  :name="item.name"
                  :summary="item.summary"
                  :image="item.image"
                  :year="item.year"
                  :rating="item.rating"
                />
              </div>
            </router-link>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0 0 1rem;
  flex-wrap: nowrap;

  @include phone {
    padding-left: 0.5rem;
  }
}

.genre-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h2 {
    margin: 0;
    font-size: 1.75rem;

    @include phone {
      font-size: 1.5rem;
    }
  }

  &.is-skeleton {
    h2 {
      width: 150px;
      height: 2rem;
      background-color: $card-bg-color;
      border-radius: 4px;
      @include skeleton-loading;
    }
  }
}

.scroll-buttons {
  display: flex;
  margin-left: 1rem;
  gap: 0.25rem;

  @include phone {
    gap: 0.5rem;
  }
}

.scroll-button {
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

.cards-container {
  position: relative;
  height: 320px;
  width: 100%;
  overflow: visible;

  @include tablet {
    height: 275px;
  }

  @include phone {
    height: 200px;
  }
}

.scroller {
  height: 100%;
  width: 100%;
  padding: 0.5rem 0 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  overflow-x: auto;

  // Override the library item wrapper overflow
  :deep(.vue-recycle-scroller__item-wrapper) {
    display: flex;
    flex-direction: row;
    overflow: visible !important;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;

  @include phone {
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
}

.card-item {
  flex: 0 0 auto;
  padding-right: 1rem;

  @include tablet {
    padding-right: 1rem;
  }

  @include phone {
    padding-right: 0.5rem;
  }
}

:deep(.card-item-wrapper) {
  height: 100%;
  display: flex;
  transition: transform 0.3s ease;
  transform-origin: center center;

  &:hover {
    z-index: 1;
    transform: scale(1.05);
  }
}

:deep(.card) {
  width: 200px;
  min-width: 200px;

  @include tablet {
    width: 170px;
    min-width: 170px;
  }

  @include phone {
    width: 120px;
    min-width: 120px;
  }

  .card-wrapper {
    height: 300px;

    @include tablet {
      height: 255px;
    }

    @include phone {
      height: 180px;
    }
  }
}
</style>
