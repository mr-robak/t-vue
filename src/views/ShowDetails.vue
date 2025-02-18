<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowCircleLeft } from '@phosphor-icons/vue'
import { fetchShowDetails } from '@/api'
import { clearHTMLTags } from '@/utilities/helpers'
import type { Show } from '@/api/types'

const route = useRoute()
const router = useRouter()
const show = ref<Show | null>(null)
const error = ref<string | null>(null)

const goBack = () => router.back()

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const data = await fetchShowDetails(id)
    data.summary = clearHTMLTags(data.summary) ?? undefined
    show.value = data
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Failed to fetch show details'
    }
  }
})
</script>

<template>
  <section v-if="show">
    <header class="header">
      <button class="back-button" @click="goBack">
        <PhArrowCircleLeft :size="32" />
      </button>
      <h1>{{ show.name }}</h1>
    </header>
    <main>
      <p>{{ show.summary }}</p>
    </main>
  </section>
  <section v-else>
    <p>Loading...</p>
  </section>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: $color-text-secondary;
}

.back-button {
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
</style>
