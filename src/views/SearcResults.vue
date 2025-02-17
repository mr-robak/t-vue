<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchShows } from '@/api'
import BackButton from '@/components/BackButton.vue'
import ShowCard from '@/components/ShowCard.vue'
import { clearHTMLTags } from '@/utilities/helpers'
import type { SearchResult } from '@/api/types'

const route = useRoute()
const results = ref<SearchResult[]>([])
const loading = ref(false)

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
    <div v-if="loading">Loading...</div>
    <div v-else-if="results.length" class="results-grid">
      <ShowCard
        v-for="result in results"
        :key="result.show.id"
        :name="result.show.name"
        :summary="clearHTMLTags(result.show.summary)"
        :image="result.show.image?.medium"
        :rating="result.show.rating.average"
      />
    </div>
    <div v-else>No results found.</div>
  </div>
</template>

<style scoped lang="scss">
.search-results {
  padding: 1rem;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;

  h1 {
    color: $color-text-secondary;
    font-size: $font-size-xlg;
  }
}

.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
