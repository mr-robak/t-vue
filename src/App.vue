<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <div id="app">
    <header>
      <SearchBar />
    </header>
    <main>
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<style scoped>
header {
  width: 100%;
  padding: 0.5rem;
}
</style>
