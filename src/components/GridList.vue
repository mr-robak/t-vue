<script setup lang="ts">
import Card from './CardItem.vue'
import type { MappedShow } from '@/store/types'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  shows: MappedShow[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemHeight = 240
const buffer = 5

const scrollPosition = ref(0)
const viewportHeight = ref(0)
const columnsCount = ref(0)

const updateLayout = () => {
  if (containerRef.value) {
    viewportHeight.value = window.innerHeight
    const containerWidth = containerRef.value.clientWidth
    const minCardWidth = window.innerWidth <= 576 ? 120 : 160
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

  const start = startRow * columnsCount.value
  const end = Math.min(props.shows.length, (endRow + 1) * columnsCount.value)

  return props.shows.slice(start, end)
})

const totalHeight = computed(
  () => Math.ceil(props.shows.length / columnsCount.value) * itemHeight,
)

const handleScroll = () => {
  scrollPosition.value = window.scrollY
}

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
  window.removeEventListener('scroll', handleScroll)
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
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
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
  padding: 0 1rem;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;

  @include phone {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }
}

.show-link {
  display: block;
  width: 100%;
  aspect-ratio: 2/3;
  margin-bottom: 1rem;

  @include phone {
    margin-bottom: 0.75rem;
  }
}

:deep(.card) {
  width: 100%;
  height: 100%;

  .card-wrapper {
    aspect-ratio: 2/3;
    width: 100%;
    height: auto;

    @include phone {
      min-height: 180px;
    }
  }
}
</style>
