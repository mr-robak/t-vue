<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
import { searchShows } from '@/api'
import Card from '@/components/Card.vue'
import { clearHTMLTags } from '@/utilities/helpers'
import type { SearchResult } from '@/api/types'

const route = useRoute()
const router = useRouter()
const results = ref<SearchResult[]>([])
const loading = ref(false)

const goBack = () => router.back()

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
    <!-- TODO: use GridList component -->
    <div v-else-if="results.length" class="results-grid">
      <router-link
        v-for="result in results"
        :key="result.show.id"
        :to="{ name: 'ShowDetails', params: { id: result.show.id } }"
      >
        <Card
          :key="result.show.id"
          :name="result.show.name"
          :summary="clearHTMLTags(result.show.summary)"
          :image="result.show.image?.medium"
          :rating="result.show.rating.average"
        />
      </router-link>
    </div>
    <div v-else>No results found.</div>
  </div>
</template>

<style scoped lang="scss">
.search-results {
  padding: 4.5rem 1rem 1em 1rem;
}

header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;

  h1 {
    color: $color-text-secondary;
    text-transform: capitalize;
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
  gap: 1rem;

  @include tablet {
    grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
  }

  @include phone {
    grid-template-columns: repeat(auto-fit, minmax(min(120px, 100%), 1fr));
  }
}

:deep(.card) {
  width: 100%;
  min-width: unset;

  @include tablet {
    width: 100%;
    min-width: unset;
  }

  @include phone {
    width: 100%;
    min-width: unset;
  }

  .card-wrapper {
    aspect-ratio: 2/3;
    height: auto;
    width: 100%;

    @include tablet {
      aspect-ratio: 2/3;
      height: auto;
    }

    @include phone {
      aspect-ratio: 2/3;
      height: auto;
    }
  }
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
