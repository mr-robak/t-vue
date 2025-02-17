<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchShowDetails } from '@/api'
import { clearHTMLTags } from '@/utilities/helpers'
import BackButton from '@/components/BackButton.vue'
import type { Show } from '@/api/types'

const route = useRoute()
const show = ref<Show | null>(null)
const error = ref<string | null>(null)

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
      <BackButton />
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
</style>
