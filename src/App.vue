<script setup lang="ts">
import { onMounted } from 'vue'
import { showsModule } from '@/modules/index'
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useStore } from './store'

const store = useStore()

onMounted(async () => {
  try {
    await showsModule.fetchShows()
  } catch (error) {
    console.error('Failed to fetch shows:', error)
  }
})
</script>

<template>
  <div id="app">
    <header class="sticky-header">
      <SearchBar />
    </header>
    <main>
      <LoadingSpinner v-if="store.isLoading" />
      <router-view v-else class="main-component" />
    </main>
  </div>
</template>

<style scoped>
header {
  width: 100%;
  padding: 0.5rem;
}

.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

main {
  width: 100%;
}
</style>
