<script setup lang="ts">
import Card from './Card.vue'
import type { MappedShow } from '@/store/types'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  shows: MappedShow[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemHeight = 240 // Approximate height of each card
const buffer = 5 // Number of items to render above/below visible area

const scrollPosition = ref(0)
const viewportHeight = ref(0)
const columnsCount = ref(0)

const updateLayout = () => {
  if (containerRef.value) {
    viewportHeight.value = window.innerHeight // Changed to window height
    const containerWidth = containerRef.value.clientWidth
    const minCardWidth = 160
    const gap = 16
    const padding = 16
    const availableWidth = containerWidth - padding * 2
    columnsCount.value = Math.max(
      1,
      Math.floor(availableWidth / (minCardWidth + gap)),
    )
  }
}

const visibleItems = computed(() => {
  // Calculate total number of rows needed to fill viewport plus buffer
  const totalRows = Math.ceil(props.shows.length / columnsCount.value)

  // Calculate which rows should be visible (including buffer)
  const startRow = Math.max(
    0,
    Math.floor(scrollPosition.value / itemHeight) - buffer,
  )
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollPosition.value + viewportHeight.value) / itemHeight) +
      buffer,
  )

  // Calculate start and end indices for items
  const start = startRow * columnsCount.value
  const end = Math.min(props.shows.length, (endRow + 1) * columnsCount.value)

  return props.shows.slice(start, end)
})

const totalHeight = computed(
  () => Math.ceil(props.shows.length / columnsCount.value) * itemHeight,
)

const handleScroll = () => {
  scrollPosition.value = window.scrollY // Changed to window scroll position
}

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
  window.addEventListener('scroll', handleScroll) // Changed to window scroll
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
  window.removeEventListener('scroll', handleScroll) // Changed to window scroll
})
</script>

<template>
  <div class="grid-wrapper">
    <div
      ref="containerRef"
      class="grid-container"
      :style="{
        height: `${totalHeight}px`,
      }"
    >
      <div
        class="grid-content"
        :style="{
          transform: `translateY(${Math.max(0, Math.floor(scrollPosition / itemHeight) - buffer) * itemHeight}px)`,
        }"
      >
        <router-link
          v-for="show in visibleItems"
          :key="show.id"
          :to="{ name: 'ShowDetails', params: { id: show.id } }"
          class="show-link"
        >
          <Card
            :name="show.name"
            :summary="show.summary"
            :image="show.image"
            :rating="show.rating"
            :year="show.year"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-wrapper {
  // position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
}

.grid-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.grid-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  padding: 0.5rem;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.show-link {
  display: block;
  width: 100%;
  aspect-ratio: 2/3;
  margin-bottom: 1rem;
}

:deep(.card) {
  width: 100%;
  height: 100%;

  .card-wrapper {
    aspect-ratio: 2/3;
    width: 100%;
    height: auto;
  }
}
</style>
