<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { showsModule } from '@/modules/index'
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useStore } from './store'

const store = useStore()

const hasContent = computed(() => Object.keys(store.genres).length > 0)
const isInitialLoading = computed(() => store.isLoading && !hasContent.value)

onMounted(() => {
  showsModule.fetchShows()
})
</script>

<template>
  <div id="app">
    <header class="sticky-header">
      <SearchBar />
    </header>
    <main>
      <LoadingSpinner v-if="isInitialLoading" />
      <router-view v-if="hasContent" class="main-component" />
    </main>
  </div>
</template>

<style scoped>
header {
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
