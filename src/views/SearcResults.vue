<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchShows } from '@/api'
import BackButton from '@/components/BackButton.vue'
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
      // TODO: handle error
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
    <div v-else-if="results.length">
      <ul>
        <li v-for="(result, idx) in results" :key="idx">
          <p>{{ result.show.name }}</p>
        </li>
      </ul>
    </div>
    <div v-else>No results found.</div>
  </div>
</template>

<style scoped lang="scss">
.search-results {
  padding: 16px;
  margin: 0 1rem auto;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;

  h1 {
    color: var(--color-text-secondary);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
}
</style>
