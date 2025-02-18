<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
import { searchShows } from '@/api'
import GridList from '@/components/GridList.vue'
import { clearHTMLTags } from '@/utilities/helpers'
import type { SearchResult } from '@/api/types'
import type { MappedShow } from '@/store/types'

const route = useRoute()
const results = ref<SearchResult[]>([])
const loading = ref(false)

const mappedResults = computed(() => {
  return results.value.map((result) => ({
    id: result.show.id,
    name: result.show.name,
    summary: clearHTMLTags(result.show.summary),
    image: result.show.image?.medium,
    rating: result.show.rating.average,
    year: result.show.premiered?.split('-')[0],
  })) as MappedShow[]
})

const executeSearch = async () => {
  const query = (route.query.q as string) || ''
  if (query) {
    loading.value = true
    try {
      results.value = await searchShows(query)
    } catch (err) {
      // TODO: handle errors
      console.error(err)
    } finally {
      loading.value = false
    }
  } else {
    results.value = []
  }
}

onMounted(executeSearch)
watch(() => route.query.q, executeSearch)
</script>

<template>
  <div class="search-results">
    <header>
      <BackButton />
      <h1>Search Results</h1>
    </header>
    <main>
      <div v-if="loading">Loading...</div>
      <GridList v-else-if="results.length" :shows="mappedResults" />
      <div v-else>No results found.</div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.search-results {
  padding: 4.5rem 0 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  position: relative;

  h1 {
    color: $color-text-secondary;
    text-transform: capitalize;
  }
}

main {
  flex: 1;
  overflow: hidden;

  > div {
    padding: 0 1rem;
  }
}
</style>
