<script setup lang="ts">
import { computed, ref } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import CardItem from './CardItem.vue'
import {
  PhCaretLeft,
  PhCaretRight,
  PhArrowCircleRight,
} from '@phosphor-icons/vue'
import type { MappedShow } from '@/store/types'
import { clearHTMLTags } from '@/utilities/helpers'

const props = defineProps<{
  genre: string
  shows: MappedShow[]
  navigation?: boolean
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
      <div class="genre-title-wrapper">
        <router-link
          v-if="props.navigation"
          :to="{ name: 'Genre', params: { genre: props.genre } }"
          class="genre-title"
        >
          <h2>{{ props.genre }}</h2>
          <PhArrowCircleRight :size="28" />
        </router-link>
        <h2 v-else>{{ props.genre }}</h2>
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
    <div class="cards-container">
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
                <CardItem
                  :name="item.name"
                  :summary="clearHTMLTags(item.summary)"
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
  padding: 0.5rem 1rem 0.25rem 1rem;
  flex-wrap: nowrap;

  @include phone {
    padding: 0.5rem 0.5rem 0.25rem 0.5rem;
  }
}

.genre-title-wrapper {
  flex: 1;

  h2 {
    margin: 0;
    font-size: 1.75rem;

    @include phone {
      font-size: 1.5rem;
    }
  }
}

.genre-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $color-text-secondary;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-text-primary;
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;

    @include phone {
      font-size: 1.5rem;
    }
  }

  svg {
    margin-top: 0.15rem;
    color: $color-text-primary;
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
  gap: 0.25rem;
  margin-left: 1rem;

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
